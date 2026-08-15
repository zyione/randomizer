'use client';

import React, { useState } from 'react';
import { ItemList, Item, ApiCategory } from '@/types/randomizer';
import { API_CATEGORIES } from '@/lib/api-adapters';
import { getRandomColor } from '@/lib/importers';
import {
  X,
  Globe,
  Quote,
  HelpCircle,
  Sparkles,
  Compass,
  Gamepad2,
  Dice6,
  Download,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface ApiCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportItemsToActive: (items: Item[]) => void;
  onCreateListFromApi: (list: ItemList) => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Quote: <Quote className="h-5 w-5" />,
  HelpCircle: <HelpCircle className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Compass: <Compass className="h-5 w-5" />,
  Gamepad2: <Gamepad2 className="h-5 w-5" />,
  Dice6: <Dice6 className="h-5 w-5" />,
};

export const ApiCategoryModal: React.FC<ApiCategoryModalProps> = ({
  isOpen,
  onClose,
  onImportItemsToActive,
  onCreateListFromApi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory>(API_CATEGORIES[0]);
  const [count, setCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState<Item[] | null>(null);

  if (!isOpen) return null;

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const items = await selectedCategory.fetchItems(count);
      setPreviewItems(items);
    } catch {
      alert('Failed to pull from API. Using local fallback items.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppendToActive = () => {
    if (!previewItems || previewItems.length === 0) return;
    onImportItemsToActive(previewItems);
    onClose();
  };

  const handleCreateNew = () => {
    if (!previewItems || previewItems.length === 0) return;
    const newList: ItemList = {
      id: `list-api-${Date.now()}`,
      title: `${selectedCategory.name}`,
      description: `Imported from ${selectedCategory.name} public API`,
      color: getRandomColor(),
      icon: 'Globe',
      items: previewItems,
      isPreset: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onCreateListFromApi(newList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Public API Category Hub</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pull fresh live items from connected public APIs via pluggable adapters.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          {API_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPreviewItems(null);
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/30 shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">
                      {ICONS_MAP[cat.iconName] || <Sparkles className="h-5 w-5" />}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                      {cat.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2.5">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Adapter: <span className="font-mono text-purple-300">Direct CORS</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Count & Fetch Action */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-400">Fetch Count:</span>
            <div className="flex gap-1.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    count === num
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Connecting & Fetching...' : `Fetch ${count} Items from API`}</span>
          </button>
        </div>

        {/* Preview Area */}
        {previewItems && (
          <div className="mt-6 rounded-2xl border border-purple-500/30 bg-slate-950/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Fetched {previewItems.length} items successfully</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live Preview</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-1">
              {previewItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 border border-slate-800"
                >
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color || '#8b5cf6' }}
                  />
                  <span className="text-xs font-medium text-slate-200 truncate">{item.text}</span>
                  {item.subtitle && (
                    <span className="text-[10px] text-slate-400 truncate">
                      ({item.subtitle})
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleAppendToActive}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Append to Active List</span>
              </button>
              <button
                onClick={handleCreateNew}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create New List with Items</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
