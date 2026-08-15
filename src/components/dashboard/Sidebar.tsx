'use client';

import React from 'react';
import {
  LayoutDashboard,
  Bell,
  MessageSquare,
  List,
  Sparkles,
  Settings,
  X,
  Globe,
  History,
  ChevronDown,
} from 'lucide-react';
import { AppMode } from '@/types/randomizer';

interface SidebarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onOpenListManager: () => void;
  onOpenApiModal: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  activeListTitle: string;
  listCount: number;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  onModeChange,
  onOpenListManager,
  onOpenApiModal,
  onOpenHistory,
  onOpenSettings,
  activeListTitle,
  listCount,
  historyCount,
}) => {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#16171b] border-r border-[#22242b] flex flex-col justify-between select-none min-h-screen py-4 px-3">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-3 py-1">
          <div className="text-cyan-400 font-mono text-xl font-bold tracking-tighter">
            ✕
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold tracking-wide text-slate-100 font-sans">
              batter<span className="text-cyan-400">X</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" />
          </div>
        </div>

        {/* Primary Nav Menu */}
        <nav className="space-y-1">
          <button
            onClick={() => onModeChange('single')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'single'
                ? 'bg-[#21232a] text-slate-100 border-l-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:bg-[#1c1d23] hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4 text-cyan-400" />
              <span>Dashboard</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">▸</span>
          </button>

          <button
            onClick={onOpenListManager}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-[#1c1d23] hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <List className="h-4 w-4 text-slate-400" />
              <span>Lists & Items</span>
            </div>
            <span className="rounded bg-[#252830] px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
              {listCount}
            </span>
          </button>

          <button
            onClick={onOpenHistory}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-[#1c1d23] hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <History className="h-4 w-4 text-slate-400" />
              <span>Pick History</span>
            </div>
            {historyCount > 0 && (
              <span className="rounded bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 text-[10px] font-mono">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenApiModal}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-[#1c1d23] hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-slate-400" />
              <span>API Categories</span>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono">6 API</span>
          </button>
        </nav>

        {/* Sub-Items List section */}
        <div className="pt-2 border-t border-[#22242b] space-y-1">
          <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Quick Modes
          </div>

          <button
            onClick={() => onModeChange('single')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] transition-colors ${
              mode === 'single' ? 'text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Single Randomize</span>
            {mode === 'single' && <span className="h-1 w-1 rounded-full bg-cyan-400" />}
          </button>

          <button
            onClick={() => onModeChange('dual')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] transition-colors ${
              mode === 'dual' ? 'text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Dual Pick (Combo)</span>
            {mode === 'dual' && <span className="h-1 w-1 rounded-full bg-cyan-400" />}
          </button>

          <button
            onClick={() => onModeChange('wheel')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] transition-colors ${
              mode === 'wheel' ? 'text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Prize Wheel</span>
            {mode === 'wheel' && <span className="h-1 w-1 rounded-full bg-cyan-400" />}
          </button>
        </div>

        {/* Active List Summary Widget */}
        <div className="rounded-lg bg-[#1a1b20] border border-[#262830] p-3 text-xs">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Active List</div>
          <div className="font-semibold text-slate-200 mt-1 truncate">{activeListTitle}</div>
        </div>
      </div>

      {/* Footer / Settings & Collapse */}
      <div className="pt-4 border-t border-[#22242b] space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-[#1c1d23] hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v1.0</span>
        </button>

        <div className="px-3 pt-2 text-[10px] text-slate-600 font-mono flex items-center justify-between">
          <span>Randomizer Pro</span>
          <span className="text-cyan-500/70">● ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
