import { ApiCategory, Item } from '@/types/randomizer';
import { fetchQuotes } from './quotable';
import { fetchTrivia } from './trivia';
import { fetchPokemon } from './pokemon';
import { fetchAdvice } from './advice';
import { fetchActivities } from './bored';
import { getRandomColor } from '@/lib/importers';

export const API_CATEGORIES: ApiCategory[] = [
  {
    id: 'quotes',
    name: 'Inspiring Quotes',
    description: 'Iconic philosophical, motivational, and literary quotes with authors.',
    iconName: 'Quote',
    badge: 'Popular',
    sampleItems: ['"Stay hungry, stay foolish."', '"The unexamined life is not worth living."'],
    fetchItems: fetchQuotes,
  },
  {
    id: 'trivia',
    name: 'Trivia & Quiz Questions',
    description: 'Fascinating questions across science, history, pop culture, and geography.',
    iconName: 'HelpCircle',
    badge: 'Educational',
    sampleItems: ['What is the capital of Iceland?', 'Which planet has the most moons?'],
    fetchItems: fetchTrivia,
  },
  {
    id: 'pokemon',
    name: 'Pokémon Generator',
    description: 'Random Pokémon creatures across all generations with types & National Dex IDs.',
    iconName: 'Sparkles',
    badge: 'Gaming',
    sampleItems: ['Pikachu (Electric)', 'Charizard (Fire/Flying)', 'Gengar (Ghost)'],
    fetchItems: fetchPokemon,
  },
  {
    id: 'advice',
    name: 'Life Advice & Wisdom',
    description: 'Thoughtful daily advice, mindful tips, and practical wisdom.',
    iconName: 'Compass',
    badge: 'Mindset',
    sampleItems: ['Never let emotions overpower intelligence', 'Learn to say no gracefully'],
    fetchItems: fetchAdvice,
  },
  {
    id: 'activities',
    name: 'Random Activities & Hobbies',
    description: 'Fun ideas when you are bored: recreational, creative, culinary, and social.',
    iconName: 'Gamepad2',
    badge: 'Fun',
    sampleItems: ['Learn to solve a Rubik\'s cube', 'Bake chocolate chip cookies'],
    fetchItems: fetchActivities,
  },
  {
    id: 'dice-numbers',
    name: 'Dice & Numbers (1-100)',
    description: 'Quick random numeric values, D20 dice rolls, or custom number ranges.',
    iconName: 'Dice6',
    badge: 'Utility',
    sampleItems: ['Dice Roll: 6', 'Lucky Number: 42', 'D20: Critical Hit (20)'],
    fetchItems: async (count: number = 10): Promise<Item[]> => {
      return Array.from({ length: count }).map((_, idx) => {
        const num = Math.floor(Math.random() * 100) + 1;
        return {
          id: `num-${Date.now()}-${idx}`,
          text: `Number: ${num}`,
          subtitle: num % 2 === 0 ? 'Even' : 'Odd',
          color: getRandomColor(idx),
          category: 'Numbers',
        };
      });
    },
  },
];
