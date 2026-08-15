'use client';

import React, { useState } from 'react';
import { HistoryEntry } from '@/types/randomizer';
import {
  X,
  History,
  Trash2,
  Copy,
  Check,
  Sparkles,
  BarChart3,
  Dices,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'timeline' | 'stats'>('timeline');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compute Frequency stats
  const frequencyMap: Record<string, { count: number; listTitle: string; color: string }> = {};
  history.forEach((entry) => {
    const key1 = entry.primaryResult.text;
    frequencyMap[key1] = frequencyMap[key1] || {
      count: 0,
      listTitle: entry.listTitle,
      color: entry.primaryResult.color || '#00f2fe',
    };
    frequencyMap[key1].count += 1;

    if (entry.secondaryResult) {
      const key2 = entry.secondaryResult.text;
      frequencyMap[key2] = frequencyMap[key2] || {
        count: 0,
        listTitle: entry.listTitle,
        color: entry.secondaryResult.color || '#8b5cf6',
      };
      frequencyMap[key2].count += 1;
    }
  });

  const sortedStats = Object.entries(frequencyMap)
    .map(([text, data]) => ({ text, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <History className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pick History & Stats</h3>
                <p className="text-[11px] text-slate-400">
                  {history.length} recent result{history.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Tabs & Clear */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewTab('timeline')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewTab === 'timeline'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewTab('stats')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  viewTab === 'stats'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Frequency Stats
              </button>
            </div>

            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {history.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500">
                <Dices className="h-8 w-8 mx-auto mb-2 opacity-30 text-slate-400" />
                No picks recorded yet. Run a randomization or spin the wheel!
              </div>
            ) : viewTab === 'timeline' ? (
              history.map((entry) => {
                const dateStr = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });
                const copyText = entry.secondaryResult
                  ? `${entry.primaryResult.text} + ${entry.secondaryResult.text}`
                  : entry.primaryResult.text;

                return (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="truncate max-w-[180px]">{entry.listTitle}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-400 capitalize">
                          {entry.mode}
                        </span>
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                          <span className="text-cyan-300">{entry.primaryResult.text}</span>
                          {entry.secondaryResult && (
                            <>
                              <span className="text-slate-500 text-xs">＋</span>
                              <span className="text-purple-300">{entry.secondaryResult.text}</span>
                            </>
                          )}
                        </div>
                        {entry.primaryResult.subtitle && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {entry.primaryResult.subtitle}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(entry.id, copyText)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedId === entry.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Stats View
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span>Most Frequently Picked Items</span>
                </div>
                {sortedStats.map((stat, idx) => {
                  const maxCount = sortedStats[0]?.count || 1;
                  const percent = Math.round((stat.count / maxCount) * 100);
                  return (
                    <div
                      key={stat.text}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-white mb-1.5">
                        <span className="truncate pr-2">{stat.text}</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {stat.count} time{stat.count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
