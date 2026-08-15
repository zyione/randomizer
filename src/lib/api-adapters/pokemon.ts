import { Item } from '@/types/randomizer';
import { getRandomColor } from '@/lib/importers';

const FALLBACK_POKEMON = [
  { text: "Pikachu", subtitle: "Electric Type · Gen 1" },
  { text: "Charizard", subtitle: "Fire / Flying Type · Gen 1" },
  { text: "Gengar", subtitle: "Ghost / Poison Type · Gen 1" },
  { text: "Lucario", subtitle: "Fighting / Steel Type · Gen 4" },
  { text: "Greninja", subtitle: "Water / Dark Type · Gen 6" },
  { text: "Eevee", subtitle: "Normal Type · Gen 1" },
  { text: "Mewtwo", subtitle: "Psychic Type · Gen 1" },
  { text: "Rayquaza", subtitle: "Dragon / Flying Type · Gen 3" },
  { text: "Garchomp", subtitle: "Dragon / Ground Type · Gen 4" },
  { text: "Umbreon", subtitle: "Dark Type · Gen 2" },
  { text: "Gardevoir", subtitle: "Psychic / Fairy Type · Gen 3" },
  { text: "Snorlax", subtitle: "Normal Type · Gen 1" },
];

export async function fetchPokemon(count: number = 10): Promise<Item[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Fetch random offset
    const randomOffset = Math.floor(Math.random() * 300);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=${randomOffset}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results.map((p: { name: string; url: string }, idx: number) => {
          const capName = p.name.charAt(0).toUpperCase() + p.name.slice(1);
          const idMatch = p.url.match(/\/pokemon\/(\d+)\//);
          const dexNum = idMatch ? `#${idMatch[1].padStart(3, '0')}` : '';
          return {
            id: `poke-${Date.now()}-${idx}`,
            text: capName,
            subtitle: dexNum ? `National Dex ${dexNum}` : 'Pokemon',
            color: getRandomColor(idx),
            category: 'Pokemon',
          };
        });
      }
    }
  } catch {
    // Fallback if offline
  }

  const shuffled = [...FALLBACK_POKEMON].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((p, idx) => ({
    id: `poke-fb-${Date.now()}-${idx}`,
    text: p.text,
    subtitle: p.subtitle,
    color: getRandomColor(idx),
    category: 'Pokemon',
  }));
}
