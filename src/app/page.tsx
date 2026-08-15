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
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNav } from '@/components/dashboard/TopNav';
import { MetricCards } from '@/components/dashboard/MetricCards';

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
  RotateCw,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { getRandomColor } from '@/lib/importers';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [lists, setLists] = useState<ItemList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [secondaryListId, setSecondaryListId] = useState<string>('');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mode, setMode] = useState<AppMode>('single');
  const [searchQuery, setSearchQuery] = useState('');

  // Single Randomizer States
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningItem, setWinningItem] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);
  const [quickNewItem, setQuickNewItem] = useState('');
  const [lastRandomizedTime, setLastRandomizedTime] = useState('Today, 20:30');

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

  const updateLists = (newLists: ItemList[]) => {
    setLists(newLists);
    saveSavedLists(newLists);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    soundFx.setConfig(newSettings.soundEnabled, newSettings.soundVolume);
  };

  const toggleSound = () => {
    handleSaveSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  // Single Randomize Action
  const triggerSingleRandomize = useCallback(() => {
    if (isSpinning || !activeList || activeList.items.length === 0) return;

    const randomIndex = Math.floor(Math.random() * activeList.items.length);
    const chosen = activeList.items[randomIndex];

    setWinningItem(chosen);
    setIsSpinning(true);
    setCopied(false);
    setLastRandomizedTime(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  }, [isSpinning, activeList]);

  // Spacebar hotkey
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

  const handleSingleComplete = () => {
    setIsSpinning(false);
    if (winningItem && activeList) {
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

      try {
        confetti({
          particleCount: 60,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#2dd4bf', '#8b5cf6', '#ec4899', '#10b981'],
        });
      } catch {}
    }
  };

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

  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    const updatedLists = lists.map((l) =>
      l.id === activeList.id
        ? { ...l, items: l.items.filter((it) => it.id !== itemId), updatedAt: Date.now() }
        : l
    );
    updateLists(updatedLists);
  };

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
    if (confirm('Delete this list?')) {
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

  const totalPoolItems = lists.reduce((acc, l) => acc + l.items.length, 0);

  if (!isClient || !activeList) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#121316] text-cyan-400 font-mono text-xs">
        <Sparkles className="h-5 w-5 animate-spin mr-2" />
        <span>INITIALIZING BATTERX DASHBOARD...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#121316] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left Dark Sidebar */}
      <Sidebar
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setWinningItem(null);
        }}
        onOpenListManager={() => setIsListDrawerOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        activeListTitle={activeList.title}
        listCount={lists.length}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          soundEnabled={settings.soundEnabled}
          onToggleSound={toggleSound}
          activeList={activeList}
          lists={lists}
          onSelectList={(id) => {
            setActiveListId(id);
            saveActiveListId(id);
            setWinningItem(null);
          }}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl w-full mx-auto">
          {/* Sub-Header matching reference image */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22242b] pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                Dashboard
              </h1>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Last randomized: {lastRandomizedTime}</span>
                <span>·</span>
                <span className="text-cyan-400 font-medium">
                  {activeList.title} ({activeList.items.length} items)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerSingleRandomize}
                disabled={isSpinning || activeList.items.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#202229] border border-[#2b2e38] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
              >
                <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Refresh / Pick</span>
              </button>
            </div>
          </div>

          {/* Top 4 KPI Metrics Strip */}
          <MetricCards
            totalPicksCount={history.length}
            totalItemsCount={totalPoolItems}
            apiCategoriesCount={6}
            sessionPicksCount={history.length}
          />

          {/* MODE 1: SINGLE RANDOMIZER */}
          {mode === 'single' && (
            <div className="space-y-6">
              {/* Main Randomize Arena Card */}
              <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#23252d] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">
                      Randomize Arena
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      | Active Engine: {settings.animationStyle}
                    </span>
                  </div>

                  {/* Engine Pill Switchers */}
                  <div className="flex flex-wrap items-center gap-1 bg-[#121316] p-1 rounded-lg border border-[#262830]">
                    {[
                      { id: 'slot-machine', label: 'Slot Reel', icon: '🎰' },
                      { id: 'card-flip', label: '3D Cards', icon: '🃏' },
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
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                          settings.animationStyle === style.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{style.icon}</span>
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Visualizer Arena */}
                <div className="w-full min-h-[300px] flex items-center justify-center my-4">
                  {activeList.items.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-500">
                      No items in this list. Add items below to start!
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

                {/* Trigger Action & Hotkey */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <button
                    onClick={triggerSingleRandomize}
                    disabled={isSpinning || activeList.items.length === 0}
                    className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-80 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 px-8 py-3.5 text-base font-bold text-slate-950 shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(45,212,191,0.5)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
                  >
                    <Sparkles className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'SELECTING ITEM...' : 'RANDOMIZE'}</span>
                    <span className="text-[10px] font-mono opacity-80 bg-slate-950/20 px-2 py-0.5 rounded ml-1">
                      SPACE
                    </span>
                  </button>
                </div>

                {/* Winner Card */}
                {winningItem && !isSpinning && (
                  <div className="mt-6 rounded-xl border border-cyan-400/30 bg-[#14161c] p-5 text-center shadow-[0_0_25px_rgba(45,212,191,0.15)] animate-fade-in max-w-lg mx-auto">
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                      SELECTED WINNER
                    </div>
                    <h3 className="text-2xl font-black text-slate-100">
                      {winningItem.text}
                    </h3>
                    {winningItem.subtitle && (
                      <p className="text-xs text-slate-400 mt-1">
                        {winningItem.subtitle}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyResult(winningItem.text)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
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

              {/* Pool Items Management Card */}
              <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-slate-100">
                      Pool Items in &quot;{activeList.title}&quot;
                    </h4>
                    <span className="text-xs font-mono text-slate-500">
                      ({activeList.items.length} total)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingList(activeList);
                      setIsListModalOpen(true);
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Edit / Bulk Import CSV
                  </button>
                </div>

                {/* Quick Add Form */}
                <form onSubmit={handleQuickAddItem} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={quickNewItem}
                    onChange={(e) => setQuickNewItem(e.target.value)}
                    placeholder="Type an item to quickly add to this list..."
                    className="flex-1 rounded-lg bg-[#111215] border border-[#262830] px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/60"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </form>

                {/* Item Pills */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {activeList.items.map((item) => (
                    <div
                      key={item.id}
                      className="group inline-flex items-center gap-2 rounded-lg bg-[#121316] border border-[#262830] px-3 py-1.5 text-xs text-slate-300 hover:border-slate-600 transition-colors"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: item.color || '#2dd4bf' }}
                      />
                      <span>{item.text}</span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition-opacity ml-1"
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
            <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-6 shadow-sm">
              <DualRandomizer
                lists={lists}
                primaryList={activeList}
                secondaryList={secondaryList}
                onSecondaryListChange={(id) => setSecondaryListId(id)}
                animationStyle={settings.animationStyle}
                animationDuration={settings.animationDuration}
                onDualResult={handleDualResult}
              />
            </div>
          )}

          {/* MODE 3: PRIZE WHEEL */}
          {mode === 'wheel' && (
            <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-6 shadow-sm">
              <PrizeWheel
                items={activeList.items}
                duration={settings.animationDuration + 1.5}
                onWinnerSelected={handleWheelWinner}
              />
            </div>
          )}
        </main>
      </div>

      {/* Persistent Drawers & Modals */}
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
        onClearHistory={() => {
          if (confirm('Clear history?')) {
            clearStoredHistory();
            setHistory([]);
          }
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
