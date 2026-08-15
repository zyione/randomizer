'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ItemList,
  Item,
  AppMode,
  AppSettings,
  HistoryEntry,
  AnimationStyle,
} from '@/types/randomizer';
import {
  loadSavedLists,
  saveSavedLists,
  loadActiveListId,
  saveActiveListId,
  loadSettings,
  saveSettings,
  loadHistory,
  addHistoryEntry,
  clearHistory as clearStoredHistory,
  DEFAULT_SETTINGS,
} from '@/lib/storage';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { AnimationContainer } from '@/components/animations/AnimationContainer';
import { PrizeWheel } from '@/components/wheel/PrizeWheel';
import { DualRandomizer } from '@/components/dual/DualRandomizer';
import { ListManagerDrawer } from '@/components/list-manager/ListManagerDrawer';
import { ListModal } from '@/components/list-manager/ListModal';
import { ApiCategoryModal } from '@/components/api-modal/ApiCategoryModal';
import { HistoryDrawer } from '@/components/history/HistoryDrawer';
import { SettingsModal } from '@/components/settings/SettingsModal';
import {
  Sparkles,
  Shuffle,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight,
  Flame,
  Layers,
} from 'lucide-react';
import { getRandomColor } from '@/lib/importers';

export default function RandomizerApp() {
  const [isClient, setIsClient] = useState(false);
  const [lists, setLists] = useState<ItemList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [secondaryListId, setSecondaryListId] = useState<string>('');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mode, setMode] = useState<AppMode>('single');

  // Single Randomizer States
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningItem, setWinningItem] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);
  const [quickNewItem, setQuickNewItem] = useState('');

  // Modals & Drawers
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ItemList | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    setIsClient(true);
    const savedLists = loadSavedLists();
    const savedActiveId = loadActiveListId();
    const savedSettings = loadSettings();
    const savedHistory = loadHistory();

    setLists(savedLists);
    setSettings(savedSettings);
    setHistory(savedHistory);

    const validActiveId = savedLists.some((l) => l.id === savedActiveId)
      ? savedActiveId
      : savedLists[0]?.id || '';
    setActiveListId(validActiveId);

    const validSecondaryId =
      savedLists.length > 1
        ? savedLists.find((l) => l.id !== validActiveId)?.id || savedLists[0].id
        : savedLists[0]?.id || '';
    setSecondaryListId(validSecondaryId);

    soundFx.setConfig(savedSettings.soundEnabled, savedSettings.soundVolume);
  }, []);

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];
  const secondaryList =
    lists.find((l) => l.id === secondaryListId) || lists[1] || lists[0];

  // Helper to persist list updates
  const updateLists = (newLists: ItemList[]) => {
    setLists(newLists);
    saveSavedLists(newLists);
  };

  // Helper to persist settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    soundFx.setConfig(newSettings.soundEnabled, newSettings.soundVolume);
  };

  // Quick sound mute toggle
  const toggleSound = () => {
    handleSaveSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  // Single Randomize Action
  const triggerSingleRandomize = useCallback(() => {
    if (isSpinning || !activeList || activeList.items.length === 0) return;

    // Pick random item
    const randomIndex = Math.floor(Math.random() * activeList.items.length);
    const chosen = activeList.items[randomIndex];

    setWinningItem(chosen);
    setIsSpinning(true);
    setCopied(false);
  }, [isSpinning, activeList]);

  // Keyboard shortcut: Spacebar triggers randomize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !isListModalOpen &&
        !isApiModalOpen &&
        !isSettingsModalOpen
      ) {
        e.preventDefault();
        if (mode === 'single') {
          triggerSingleRandomize();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, triggerSingleRandomize, isListModalOpen, isApiModalOpen, isSettingsModalOpen]);

  // Single Randomize Complete Callback
  const handleSingleComplete = () => {
    setIsSpinning(false);
    if (winningItem && activeList) {
      // Record history
      const entry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        listId: activeList.id,
        listTitle: activeList.title,
        primaryResult: winningItem,
        mode: 'single',
        animationStyle: settings.animationStyle,
        timestamp: Date.now(),
      };
      const updatedHistory = addHistoryEntry(entry);
      setHistory(updatedHistory);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#8b5cf6', '#ec4899', '#10b981'],
        });
      } catch {}
    }
  };

  // Wheel Winner Callback
  const handleWheelWinner = (item: Item) => {
    if (!activeList) return;
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      listId: activeList.id,
      listTitle: activeList.title,
      primaryResult: item,
      mode: 'wheel',
      animationStyle: settings.animationStyle,
      timestamp: Date.now(),
    };
    const updatedHistory = addHistoryEntry(entry);
    setHistory(updatedHistory);
  };

  // Dual Result Callback
  const handleDualResult = (
    item1: Item,
    item2: Item,
    dualMode: 'dual-single-list' | 'dual-two-lists'
  ) => {
    if (!activeList) return;
    const entry: HistoryEntry = {
      id: `hist-${Date.now()}`,
      listId: activeList.id,
      listTitle:
        dualMode === 'dual-single-list'
          ? activeList.title
          : `${activeList.title} + ${secondaryList.title}`,
      primaryResult: item1,
      secondaryResult: item2,
      mode: 'dual',
      animationStyle: settings.animationStyle,
      timestamp: Date.now(),
    };
    const updatedHistory = addHistoryEntry(entry);
    setHistory(updatedHistory);
  };

  // Quick Add Item
  const handleQuickAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNewItem.trim() || !activeList) return;

    const newItem: Item = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: quickNewItem.trim(),
      color: getRandomColor(activeList.items.length),
    };

    const updatedLists = lists.map((l) =>
      l.id === activeList.id
        ? { ...l, items: [...l.items, newItem], updatedAt: Date.now() }
        : l
    );
    updateLists(updatedLists);
    setQuickNewItem('');
  };

  // Delete Item from List
  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    const updatedLists = lists.map((l) =>
      l.id === activeList.id
        ? { ...l, items: l.items.filter((it) => it.id !== itemId), updatedAt: Date.now() }
        : l
    );
    updateLists(updatedLists);
  };

  // List Management Handlers
  const handleSaveList = (savedList: ItemList) => {
    const exists = lists.some((l) => l.id === savedList.id);
    const updatedLists = exists
      ? lists.map((l) => (l.id === savedList.id ? savedList : l))
      : [savedList, ...lists];

    updateLists(updatedLists);
    setActiveListId(savedList.id);
    saveActiveListId(savedList.id);
    setEditingList(null);
  };

  const handleDeleteList = (id: string) => {
    if (confirm('Are you sure you want to delete this list?')) {
      const remaining = lists.filter((l) => l.id !== id);
      updateLists(remaining);
      if (activeListId === id && remaining.length > 0) {
        setActiveListId(remaining[0].id);
        saveActiveListId(remaining[0].id);
      }
    }
  };

  const handleCloneList = (targetList: ItemList) => {
    const cloned: ItemList = {
      ...targetList,
      id: `list-clone-${Date.now()}`,
      title: `${targetList.title} (Copy)`,
      isPreset: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    updateLists([cloned, ...lists]);
    setActiveListId(cloned.id);
    saveActiveListId(cloned.id);
  };

  const handleImportItemsToActive = (newItems: Item[]) => {
    if (!activeList) return;
    const updatedLists = lists.map((l) =>
      l.id === activeList.id
        ? { ...l, items: [...l.items, ...newItems], updatedAt: Date.now() }
        : l
    );
    updateLists(updatedLists);
  };

  const handleCreateListFromApi = (newList: ItemList) => {
    updateLists([newList, ...lists]);
    setActiveListId(newList.id);
    saveActiveListId(newList.id);
  };

  const handleCopyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearAllHistory = () => {
    if (confirm('Clear all pick history?')) {
      clearStoredHistory();
      setHistory([]);
    }
  };

  if (!isClient || !activeList) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-cyan-400 font-mono text-sm">
        <Sparkles className="h-6 w-6 animate-spin mr-2" />
        <span>INITIALIZING RANDOMIZER ENGINES...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Header
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setWinningItem(null);
        }}
        activeList={activeList}
        lists={lists}
        onSelectList={(id) => {
          setActiveListId(id);
          saveActiveListId(id);
          setWinningItem(null);
        }}
        onOpenListManager={() => setIsListDrawerOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        {/* Active List Info Banner */}
        <div className="w-full max-w-3xl mb-6 flex items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className="h-3.5 w-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeList.color || '#00f2fe' }}
            />
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {activeList.title}
                {activeList.isPreset && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                    Preset
                  </span>
                )}
              </h1>
              {activeList.description && (
                <p className="text-xs text-slate-400 mt-0.5">{activeList.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsListDrawerOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>{activeList.items.length} items</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MODE 1: SINGLE RANDOMIZER */}
        {mode === 'single' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Animation Quick Switcher Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
              <span className="text-[10px] font-mono text-slate-500 px-2 uppercase tracking-wider hidden sm:inline">
                Engine:
              </span>
              {[
                { id: 'slot-machine', label: 'Slot Machine', icon: '🎰' },
                { id: 'card-flip', label: '3D Card Flip', icon: '🃏' },
                { id: 'scramble-decode', label: 'Matrix Scramble', icon: '💻' },
                { id: 'particle-burst', label: 'Particle Burst', icon: '💥' },
                { id: 'roulette-strip', label: 'Roulette Strip', icon: '🎡' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() =>
                    handleSaveSettings({
                      ...settings,
                      animationStyle: style.id as AnimationStyle,
                    })
                  }
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    settings.animationStyle === style.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{style.icon}</span>
                  <span className="hidden sm:inline">{style.label}</span>
                </button>
              ))}
            </div>

            {/* Visualizer Arena */}
            <div className="w-full min-h-[300px] flex items-center justify-center">
              {activeList.items.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-500">
                  This list has no items. Add items below to begin!
                </div>
              ) : (
                <AnimationContainer
                  style={settings.animationStyle}
                  items={activeList.items}
                  winningItem={winningItem || activeList.items[0]}
                  duration={settings.animationDuration}
                  isSpinning={isSpinning}
                  onComplete={handleSingleComplete}
                />
              )}
            </div>

            {/* Trigger Controls */}
            <div className="mt-8 flex flex-col items-center gap-4 w-full px-4">
              <button
                onClick={triggerSingleRandomize}
                disabled={isSpinning || activeList.items.length === 0}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-80 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 px-8 py-4 text-lg font-black tracking-wider text-slate-950 shadow-[0_0_35px_rgba(0,242,254,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(0,242,254,0.6)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
              >
                <Sparkles
                  className={`h-5 w-5 ${
                    isSpinning
                      ? 'animate-spin'
                      : 'group-hover:rotate-45 transition-transform duration-300'
                  }`}
                />
                <span>{isSpinning ? 'RANDOMIZING...' : 'RANDOMIZE'}</span>
                <span className="hidden sm:inline text-[10px] font-mono font-normal opacity-70 bg-slate-950/20 px-2 py-0.5 rounded ml-1">
                  SPACE
                </span>
              </button>

              {/* Winner Result Card */}
              {winningItem && !isSpinning && (
                <div className="w-full rounded-2xl border border-cyan-400/40 bg-slate-950/90 p-5 text-center shadow-[0_0_30px_rgba(0,242,254,0.25)] backdrop-blur-xl animate-fade-in">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SELECTED RESULT</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                    {winningItem.text}
                  </h3>
                  {winningItem.subtitle && (
                    <p className="text-sm font-medium text-slate-400 mt-1">
                      {winningItem.subtitle}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleCopyResult(winningItem.text)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copied ? 'Copied' : 'Copy Result'}</span>
                    </button>
                    <button
                      onClick={triggerSingleRandomize}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reroll</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick List Item Manager below arena */}
            <div className="w-full mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Items in Active List</h4>
                  <span className="text-xs font-mono text-slate-400">
                    ({activeList.items.length})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingList(activeList);
                    setIsListModalOpen(true);
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Edit / Bulk Import
                </button>
              </div>

              {/* Inline Quick Add Input */}
              <form onSubmit={handleQuickAddItem} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={quickNewItem}
                  onChange={(e) => setQuickNewItem(e.target.value)}
                  placeholder="Type an item to add quickly..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </form>

              {/* Items Tags Pill Grid */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {activeList.items.map((item) => (
                  <div
                    key={item.id}
                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-700 transition-colors"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color || '#00f2fe' }}
                    />
                    <span className="font-medium">{item.text}</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity ml-1"
                      title="Remove item"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: DUAL RANDOMIZER */}
        {mode === 'dual' && (
          <DualRandomizer
            lists={lists}
            primaryList={activeList}
            secondaryList={secondaryList}
            onSecondaryListChange={(id) => setSecondaryListId(id)}
            animationStyle={settings.animationStyle}
            animationDuration={settings.animationDuration}
            onDualResult={handleDualResult}
          />
        )}

        {/* MODE 3: CIRCULAR PRIZE WHEEL */}
        {mode === 'wheel' && (
          <PrizeWheel
            items={activeList.items}
            duration={settings.animationDuration + 1.5}
            onWinnerSelected={handleWheelWinner}
          />
        )}
      </main>

      {/* Persistent Slide-over Drawers & Modals */}
      <ListManagerDrawer
        isOpen={isListDrawerOpen}
        onClose={() => setIsListDrawerOpen(false)}
        lists={lists}
        activeListId={activeListId}
        onSelectList={(id) => {
          setActiveListId(id);
          saveActiveListId(id);
          setWinningItem(null);
        }}
        onCreateNew={() => {
          setEditingList(null);
          setIsListModalOpen(true);
        }}
        onEditList={(list) => {
          setEditingList(list);
          setIsListModalOpen(true);
        }}
        onDeleteList={handleDeleteList}
        onCloneList={handleCloneList}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      <ListModal
        isOpen={isListModalOpen}
        onClose={() => {
          setIsListModalOpen(false);
          setEditingList(null);
        }}
        onSave={handleSaveList}
        initialList={editingList}
      />

      <ApiCategoryModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onImportItemsToActive={handleImportItemsToActive}
        onCreateListFromApi={handleCreateListFromApi}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onClearHistory={handleClearAllHistory}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Randomizer Pro · Local-First Architecture · 5 Pluggable Engines</span>
          <span>Press [SPACE] anywhere to randomize</span>
        </div>
      </footer>
    </div>
  );
}
