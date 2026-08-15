import { Item } from '@/types/randomizer';
import { getRandomColor } from '@/lib/importers';

const FALLBACK_ADVICE = [
  { text: "Never let your emotions overpower your intelligence.", subtitle: "Life Wisdom" },
  { text: "Learn to say 'no' without feeling guilty.", subtitle: "Personal Growth" },
  { text: "Don't make permanent decisions on temporary feelings.", subtitle: "Mindfulness" },
  { text: "Be kind to people on your way up, you might meet them on your way down.", subtitle: "Relationships" },
  { text: "Small daily improvements over time lead to stunning results.", subtitle: "Productivity" },
  { text: "Take care of your body. It's the only place you have to live.", subtitle: "Health" },
  { text: "You don't have to attend every argument you are invited to.", subtitle: "Peace of Mind" },
  { text: "Failure is just a lesson in progress.", subtitle: "Resilience" },
];

export async function fetchAdvice(count: number = 8): Promise<Item[]> {
  const items: Item[] = [];
  try {
    // Advice Slip gives 1 advice per request, let's fetch a few in parallel
    const fetchPromises = Array.from({ length: Math.min(count, 5) }).map(async (_, idx) => {
      const res = await fetch(`https://api.adviceslip.com/advice?cb=${Date.now()}_${idx}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.slip && data.slip.advice) {
          return {
            id: `advice-${data.slip.id || Date.now()}-${idx}`,
            text: `"${data.slip.advice}"`,
            subtitle: 'Life Advice',
            color: getRandomColor(idx),
            category: 'Advice',
          } as Item;
        }
      }
      return null;
    });

    const results = await Promise.allSettled(fetchPromises);
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        items.push(r.value);
      }
    }
  } catch {
    // Fallback
  }

  if (items.length >= 3) {
    return items;
  }

  const shuffled = [...FALLBACK_ADVICE].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((a, idx) => ({
    id: `advice-fb-${Date.now()}-${idx}`,
    text: `"${a.text}"`,
    subtitle: a.subtitle,
    color: getRandomColor(idx),
    category: 'Advice',
  }));
}
