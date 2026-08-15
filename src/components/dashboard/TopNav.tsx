'use client';

import React from 'react';
import { Search, Bell, Volume2, VolumeX, User, Sparkles } from 'lucide-react';
import { ItemList } from '@/types/randomizer';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeList: ItemList;
  lists: ItemList[];
  onSelectList: (id: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
  activeList,
  lists,
  onSelectList,
}) => {
  return (
    <header className="h-14 border-b border-[#22242b] bg-[#16171b] px-6 flex items-center justify-between gap-4 select-none">
      {/* Search Input Bar */}
      <div className="relative w-full max-w-xs sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items, lists, or tags..."
          className="w-full rounded-lg bg-[#111215] border border-[#22242b] pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/60 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active List Dropdown */}
        <select
          value={activeList.id}
          onChange={(e) => onSelectList(e.target.value)}
          className="rounded-lg bg-[#111215] border border-[#22242b] px-3 py-1.5 text-xs font-medium text-slate-300 outline-none focus:border-cyan-500/60 cursor-pointer hidden md:block"
        >
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title} ({l.items.length})
            </option>
          ))}
        </select>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Procedural Audio' : 'Enable Audio FX'}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#202229] transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-cyan-400" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative p-2 text-slate-400 hover:text-slate-200 cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f2fe]" />
        </div>

        {/* User / Workspace Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#22242b]">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center">
            <div className="h-full w-full bg-[#16171b] rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
              Z
            </div>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Zyione</div>
            <div className="text-[10px] text-slate-500 leading-tight font-mono">Randomizer Pro</div>
          </div>
        </div>
      </div>
    </header>
  );
};
