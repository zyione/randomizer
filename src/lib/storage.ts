import { ItemList, AppSettings, HistoryEntry } from '@/types/randomizer';

const STORAGE_KEYS = {
  LISTS: 'randomizer_lists_v1',
  ACTIVE_LIST_ID: 'randomizer_active_list_id_v1',
  SETTINGS: 'randomizer_settings_v1',
  HISTORY: 'randomizer_history_v1',
};

export const DEFAULT_PRESET_LISTS: ItemList[] = [
  {
    id: 'preset-dinner',
    title: 'Dinner Tonight 🍕',
    description: 'What are we eating tonight? Eliminate the endless debate.',
    color: '#f59e0b',
    icon: 'Utensils',
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [
      { id: 'din-1', text: 'Neapolitan Pizza', subtitle: 'Italian · Cheesy comfort', color: '#f59e0b' },
      { id: 'din-2', text: 'Spicy Tonkotsu Ramen', subtitle: 'Japanese · Rich broth & noodles', color: '#ef4444' },
      { id: 'din-3', text: 'Gourmet Smash Burgers', subtitle: 'American · Crispy edges & fries', color: '#f97316' },
      { id: 'din-4', text: 'Fresh Salmon Sushi Roll', subtitle: 'Japanese · Healthy & light', color: '#06b6d4' },
      { id: 'din-5', text: 'Thai Green Curry', subtitle: 'Thai · Coconut & aromatic spices', color: '#10b981' },
      { id: 'din-6', text: 'Tacos Al Pastor', subtitle: 'Mexican · Pineapple & cilantro', color: '#ec4899' },
      { id: 'din-7', text: 'Greek Gyros Platter', subtitle: 'Mediterranean · Tzatziki & pita', color: '#3b82f6' },
      { id: 'din-8', text: 'Korean Fried Chicken', subtitle: 'Korean · Sweet & spicy glaze', color: '#8b5cf6' },
      { id: 'din-9', text: 'Pasta Carbonara', subtitle: 'Italian · Guanciale & pecorino', color: '#eab308' },
      { id: 'din-10', text: 'Crispy Falafel Bowl', subtitle: 'Middle Eastern · Tahini & hummus', color: '#14b8a6' },
    ],
  },
  {
    id: 'preset-decision',
    title: 'Ultimate Decision Maker 🔮',
    description: 'When you are stuck in analysis paralysis.',
    color: '#8b5cf6',
    icon: 'HelpCircle',
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [
      { id: 'dec-1', text: '100% Yes — Do It Now!', subtitle: 'Confidence: High', color: '#10b981' },
      { id: 'dec-2', text: 'Absolutely Not', subtitle: 'Save your energy', color: '#ef4444' },
      { id: 'dec-3', text: 'Sleep On It Tonight', subtitle: 'Decide tomorrow morning', color: '#3b82f6' },
      { id: 'dec-4', text: 'Follow Your First Gut Instinct', subtitle: 'Your intuition knows', color: '#8b5cf6' },
      { id: 'dec-5', text: 'Flip A Coin (Notice what you hope for)', subtitle: 'Psychological hack', color: '#f59e0b' },
      { id: 'dec-6', text: 'Ask A Trusted Friend', subtitle: 'Get outside perspective', color: '#ec4899' },
      { id: 'dec-7', text: 'Yes, But Start Small First', subtitle: 'Minimum viable action', color: '#06b6d4' },
      { id: 'dec-8', text: 'Wait 24 Hours Before Deciding', subtitle: 'Patience test', color: '#6366f1' },
    ],
  },
  {
    id: 'preset-movies',
    title: 'Movie Night Genres 🎬',
    description: 'Pick the cinema vibe for streaming night.',
    color: '#00f2fe',
    icon: 'Film',
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [
      { id: 'mov-1', text: 'Cyberpunk Sci-Fi', subtitle: 'Blade Runner / Matrix vibes', color: '#00f2fe' },
      { id: 'mov-2', text: 'Psychological Thriller', subtitle: 'Plot twists & mind games', color: '#8b5cf6' },
      { id: 'mov-3', text: '90s Nostalgia Comedy', subtitle: 'Classic laughs & feel-good', color: '#f59e0b' },
      { id: 'mov-4', text: 'Whodunnit Murder Mystery', subtitle: 'Knives Out / Poirot style', color: '#10b981' },
      { id: 'mov-5', text: 'Epic Fantasy / Adventure', subtitle: 'World-building & quests', color: '#ec4899' },
      { id: 'mov-6', text: 'Studio Ghibli Animated Gem', subtitle: 'Cozy, lush, & magical', color: '#14b8a6' },
      { id: 'mov-7', text: 'High-Octane Action & Heist', subtitle: 'Fast cars & explosions', color: '#ef4444' },
      { id: 'mov-8', text: 'Gripping True Crime Doc', subtitle: 'Binge-worthy mysteries', color: '#64748b' },
    ],
  },
  {
    id: 'preset-truth-dare',
    title: 'Truth or Dare Party 🔥',
    description: 'Spice up the room with quick party challenges.',
    color: '#ec4899',
    icon: 'Flame',
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [
      { id: 'tod-1', text: 'TRUTH: What is your most embarrassing guilty pleasure?', subtitle: 'Be 100% honest', color: '#06b6d4' },
      { id: 'tod-2', text: 'DARE: Do your best impression of someone in this room!', subtitle: '30 seconds', color: '#ec4899' },
      { id: 'tod-3', text: 'TRUTH: What is the weirdest habit you have when alone?', subtitle: 'No judging', color: '#8b5cf6' },
      { id: 'tod-4', text: 'DARE: Speak in an accent of the group’s choice for 2 rounds', subtitle: 'Stay in character', color: '#f59e0b' },
      { id: 'tod-5', text: 'TRUTH: What is a secret talent nobody knows you have?', subtitle: 'Show & tell', color: '#10b981' },
      { id: 'tod-6', text: 'DARE: Let someone write a funny status update on your social media', subtitle: 'High risk', color: '#ef4444' },
    ],
  },
  {
    id: 'preset-tech-stack',
    title: 'Tech Stack Roulette ⚡',
    description: 'What architecture should your next side project use?',
    color: '#10b981',
    icon: 'Cpu',
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [
      { id: 'tech-1', text: 'Next.js 15 + TypeScript + Tailwind', subtitle: 'Fullstack React standard', color: '#00f2fe' },
      { id: 'tech-2', text: 'Rust + WebAssembly + Canvas', subtitle: 'Ultra high-performance', color: '#f97316' },
      { id: 'tech-3', text: 'Python + FastAPI + HTMX', subtitle: 'Simple, fast, pythonic', color: '#10b981' },
      { id: 'tech-4', text: 'Go + PostgreSQL + Docker', subtitle: 'Rock solid backend microservice', color: '#06b6d4' },
      { id: 'tech-5', text: 'SvelteKit + Supabase + Tailwind', subtitle: 'Reactive & elegant DX', color: '#ff3e00' },
      { id: 'tech-6', text: 'Astro + Vanilla CSS + Islands', subtitle: 'Blazing static content', color: '#8b5cf6' },
    ],
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  animationStyle: 'slot-machine',
  animationDuration: 2.2,
  soundEnabled: true,
  soundVolume: 0.6,
  dualModeType: 'same-list',
  secondaryListId: null,
  allowRepeats: false,
  autoRemovePicked: false,
  activeTheme: 'obsidian-cyan',
};

// Safe storage utilities
export function loadSavedLists(): ItemList[] {
  if (typeof window === 'undefined') return DEFAULT_PRESET_LISTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LISTS);
    if (!raw) {
      saveSavedLists(DEFAULT_PRESET_LISTS);
      return DEFAULT_PRESET_LISTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PRESET_LISTS;
  } catch {
    return DEFAULT_PRESET_LISTS;
  }
}

export function saveSavedLists(lists: ItemList[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save lists to localStorage', e);
  }
}

export function loadActiveListId(): string {
  if (typeof window === 'undefined') return DEFAULT_PRESET_LISTS[0].id;
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_LIST_ID) || DEFAULT_PRESET_LISTS[0].id;
  } catch {
    return DEFAULT_PRESET_LISTS[0].id;
  }
}

export function saveActiveListId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LIST_ID, id);
  } catch {}
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = loadHistory();
    // Keep max 50 recent items
    const updated = [entry, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch {}
}
