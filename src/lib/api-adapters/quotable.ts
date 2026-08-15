import { Item } from '@/types/randomizer';
import { getRandomColor } from '@/lib/importers';

const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", subtitle: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", subtitle: "John Lennon" },
  { text: "Get busy living or get busy dying.", subtitle: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", subtitle: "Mae West" },
  { text: "In the middle of every difficulty lies opportunity.", subtitle: "Albert Einstein" },
  { text: "Whether you think you can or you think you can't, you're right.", subtitle: "Henry Ford" },
  { text: "Act as if what you do makes a difference. It does.", subtitle: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", subtitle: "Winston Churchill" },
  { text: "Happiness is not something ready made. It comes from your own actions.", subtitle: "Dalai Lama" },
  { text: "It always seems impossible until it's done.", subtitle: "Nelson Mandela" },
];

export async function fetchQuotes(count: number = 10): Promise<Item[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://dummyjson.com/quotes?limit=${count}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.quotes) && data.quotes.length > 0) {
        return data.quotes.map((q: { id: number; quote: string; author: string }, idx: number) => ({
          id: `quote-${q.id || Date.now()}-${idx}`,
          text: `"${q.quote}"`,
          subtitle: `— ${q.author}`,
          color: getRandomColor(idx),
          category: 'Quotes',
        }));
      }
    }
  } catch {
    // Fallback if API offline or rate-limited
  }

  // Use shuffled fallback
  const shuffled = [...FALLBACK_QUOTES].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((q, idx) => ({
    id: `quote-fb-${Date.now()}-${idx}`,
    text: `"${q.text}"`,
    subtitle: `— ${q.subtitle}`,
    color: getRandomColor(idx),
    category: 'Quotes',
  }));
}
