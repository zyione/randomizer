import { Item } from '@/types/randomizer';
import { getRandomColor } from '@/lib/importers';

const FALLBACK_TRIVIA = [
  { text: "What is the capital of Iceland?", subtitle: "Answer: Reykjavik" },
  { text: "Which planet has the most moons?", subtitle: "Answer: Saturn (146 moons)" },
  { text: "What is the powerhouse of the cell?", subtitle: "Answer: Mitochondria" },
  { text: "Who wrote 'To Kill a Mockingbird'?", subtitle: "Answer: Harper Lee" },
  { text: "What is the smallest prime number?", subtitle: "Answer: 2" },
  { text: "Which element has the chemical symbol 'Au'?", subtitle: "Answer: Gold" },
  { text: "In what year did the Titanic sink?", subtitle: "Answer: 1912" },
  { text: "What is the fastest land animal?", subtitle: "Answer: Cheetah (120 km/h)" },
  { text: "Which ocean is the largest on Earth?", subtitle: "Answer: Pacific Ocean" },
  { text: "Who painted the ceiling of the Sistine Chapel?", subtitle: "Answer: Michelangelo" },
];

function decodeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export async function fetchTrivia(count: number = 10): Promise<Item[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://opentdb.com/api.php?amount=${count}&type=multiple`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.response_code === 0 && Array.isArray(data.results)) {
        return data.results.map((q: { question: string; correct_answer: string; category: string }, idx: number) => ({
          id: `trivia-${Date.now()}-${idx}`,
          text: decodeHtml(q.question),
          subtitle: `Answer: ${decodeHtml(q.correct_answer)} (${decodeHtml(q.category)})`,
          color: getRandomColor(idx),
          category: 'Trivia',
        }));
      }
    }
  } catch {
    // Fallback if offline
  }

  const shuffled = [...FALLBACK_TRIVIA].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((q, idx) => ({
    id: `trivia-fb-${Date.now()}-${idx}`,
    text: q.text,
    subtitle: q.subtitle,
    color: getRandomColor(idx),
    category: 'Trivia',
  }));
}
