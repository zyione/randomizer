import { Item } from '@/types/randomizer';
import { getRandomColor } from '@/lib/importers';

const FALLBACK_ACTIVITIES = [
  { text: "Learn to solve a Rubik's cube", subtitle: "Recreational · 1 person" },
  { text: "Bake homemade chocolate chip cookies", subtitle: "Cooking · 1-2 people" },
  { text: "Take a 30-minute nature walk without your phone", subtitle: "Relaxation · Outdoors" },
  { text: "Start a gratitude journal with 3 entries", subtitle: "Mindfulness · 1 person" },
  { text: "Learn the basics of a new programming language", subtitle: "Education · Tech" },
  { text: "Organize your digital photo library", subtitle: "Productivity · 1 person" },
  { text: "Watch a classic foreign film with subtitles", subtitle: "Entertainment · Movie" },
  { text: "Try a 15-minute guided meditation session", subtitle: "Wellness · Relaxation" },
  { text: "Sketch or paint something on your desk", subtitle: "Creative · Art" },
  { text: "Call or text an old friend you haven't spoken to", subtitle: "Social · Connection" },
];

export async function fetchActivities(count: number = 8): Promise<Item[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Bored API community fork
    const res = await fetch('https://bored-api.appbrewery.com/filter?type=recreational', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const shuffled = data.sort(() => Math.random() - 0.5).slice(0, count);
        return shuffled.map((item: { activity: string; type: string; participants: number }, idx: number) => ({
          id: `activity-${Date.now()}-${idx}`,
          text: item.activity,
          subtitle: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} · ${item.participants} participant${item.participants > 1 ? 's' : ''}`,
          color: getRandomColor(idx),
          category: 'Activities',
        }));
      }
    }
  } catch {
    // Fallback
  }

  const shuffled = [...FALLBACK_ACTIVITIES].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((act, idx) => ({
    id: `act-fb-${Date.now()}-${idx}`,
    text: act.text,
    subtitle: act.subtitle,
    color: getRandomColor(idx),
    category: 'Activities',
  }));
}
