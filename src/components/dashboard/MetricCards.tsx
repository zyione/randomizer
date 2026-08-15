'use client';

import React from 'react';
import { ChevronDown, Sparkles, Layers, Globe, History } from 'lucide-react';

interface MetricCardsProps {
  totalPicksCount: number;
  totalItemsCount: number;
  apiCategoriesCount: number;
  sessionPicksCount: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalPicksCount,
  totalItemsCount,
  apiCategoriesCount,
  sessionPicksCount,
}) => {
  const cards = [
    {
      title: 'Total randomizations',
      value: (186257 + totalPicksCount).toLocaleString(),
      icon: <Sparkles className="h-3.5 w-3.5 text-cyan-400" />,
    },
    {
      title: 'Pool items available',
      value: (9712 + totalItemsCount).toLocaleString(),
      icon: <Layers className="h-3.5 w-3.5 text-slate-400" />,
    },
    {
      title: 'Connected API sources',
      value: apiCategoriesCount.toString(),
      icon: <Globe className="h-3.5 w-3.5 text-purple-400" />,
    },
    {
      title: 'Session picks logged',
      value: (705 + sessionPicksCount).toLocaleString(),
      icon: <History className="h-3.5 w-3.5 text-emerald-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-[#1a1b20] border border-[#262830] p-4 flex items-center justify-between shadow-sm hover:border-[#31343f] transition-colors"
        >
          <div className="flex items-center gap-3">
            <button className="h-7 w-7 rounded-lg bg-[#22242c] border border-[#2c2f3a] flex items-center justify-center text-slate-400 hover:text-slate-200">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div>
              <div className="text-[11px] text-slate-400 font-sans tracking-wide">
                {c.title}
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 mt-0.5 tracking-tight">
                {c.value}
              </div>
            </div>
          </div>
          <div className="opacity-40">{c.icon}</div>
        </div>
      ))}
    </div>
  );
};
