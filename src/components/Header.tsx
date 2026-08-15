'use client';

import React from 'react';
import { AppMode, ItemList } from '@/types/randomizer';
import {
  Sparkles,
  Dices,
  RotateCw,
  List,
  History,
  Sliders,
  Globe,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeList: ItemList;
  lists: ItemList[];
  onSelectList: (id: string) => void;
  onOpenListManager: () => void;
  onOpenApiModal: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  activeList,
  lists,
  onSelectList,
  onOpenListManager,
  onOpenApiModal,
  onOpenHistory,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                RANDOMIZER
              </span>
              <span className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <nav className="hidden md:flex items-center rounded-2xl border border-slate-800 bg-slate-900/90 p-1">
          <button
            onClick={() => onModeChange('single')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              mode === 'single'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Single Pick</span>
          </button>

          <button
            onClick={() => onModeChange('dual')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              mode === 'dual'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="h-3.5 w-3.5" />
            <span>Dual Mode</span>
          </button>

          <button
            onClick={() => onModeChange('wheel')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              mode === 'wheel'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Prize Wheel</span>
          </button>
        </nav>

        {/* Action Controls & Drawers */}
        <div className="flex items-center gap-2">
          {/* Quick List Selector */}
          <div className="relative hidden sm:block">
            <select
              value={activeList.id}
              onChange={(e) => onSelectList(e.target.value)}
              className="appearance-none rounded-xl border border-slate-800 bg-slate-900 pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.items.length})
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-cyan-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {/* API Hub */}
          <button
            onClick={onOpenApiModal}
            title="API Category Hub"
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition-colors"
          >
            <Globe className="h-4 w-4" />
          </button>

          {/* Lists Drawer */}
          <button
            onClick={onOpenListManager}
            title="Manage Lists"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <List className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Lists</span>
          </button>

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            title="History"
            className="relative p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <History className="h-4 w-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Sub-bar */}
      <div className="flex md:hidden items-center justify-center p-2 border-t border-slate-800/80 bg-slate-950/90 gap-2">
        <button
          onClick={() => onModeChange('single')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            mode === 'single'
              ? 'bg-cyan-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          <span>Single</span>
        </button>
        <button
          onClick={() => onModeChange('dual')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            mode === 'dual'
              ? 'bg-purple-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dices className="h-3 w-3" />
          <span>Dual</span>
        </button>
        <button
          onClick={() => onModeChange('wheel')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            mode === 'wheel'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className="h-3 w-3" />
          <span>Wheel</span>
        </button>
      </div>
    </header>
  );
};
