export type AnimationStyle =
  | 'slot-machine'
  | 'card-flip'
  | 'scramble-decode'
  | 'particle-burst'
  | 'roulette-strip';

export interface Item {
  id: string;
  text: string;
  subtitle?: string;
  weight?: number;
  color?: string;
  category?: string;
}

export interface ItemList {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon: string;
  items: Item[];
  isPreset?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type DualModeType = 'same-list' | 'two-lists';

export type AppMode = 'single' | 'dual' | 'wheel';

export interface HistoryEntry {
  id: string;
  listId: string;
  listTitle: string;
  primaryResult: Item;
  secondaryResult?: Item;
  mode: AppMode;
  animationStyle: AnimationStyle;
  timestamp: number;
}

export interface AppSettings {
  animationStyle: AnimationStyle;
  animationDuration: number; // in seconds (e.g. 2.5)
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  dualModeType: DualModeType;
  secondaryListId: string | null;
  allowRepeats: boolean;
  autoRemovePicked: boolean;
  activeTheme: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badge: string;
  sampleItems: string[];
  fetchItems: (count?: number) => Promise<Item[]>;
}
