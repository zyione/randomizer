'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export const CategoryGauge: React.FC = () => {
  const categories = [
    { name: 'DINNER & FOOD', percent: 42, color: '#2dd4bf' },
    { name: 'DECISION MAKER', percent: 24, color: '#94a3b8' },
    { name: 'MOVIE NIGHT', percent: 15, color: '#64748b' },
    { name: 'TRIVIA & QUIZ', percent: 11, color: '#475569' },
    { name: 'TECH STACKS', percent: 8, color: '#334155' },
  ];

  return (
    <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-4 flex flex-col justify-between shadow-sm h-full">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300">Picks by category</span>
        </div>
        <MoreVertical className="h-3.5 w-3.5 text-slate-500 cursor-pointer" />
      </div>

      <div className="flex items-center justify-between gap-4 my-auto">
        {/* Radial Ring Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#262830"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Cyan Glowing Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#2dd4bf"
              strokeWidth="6"
              strokeDasharray="238.76"
              strokeDashoffset={238.76 * (1 - 0.42)}
              strokeLinecap="round"
              fill="transparent"
              className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-slate-100 tracking-tight">
              42%
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              DINNER
            </span>
          </div>
        </div>

        {/* Category Legend List */}
        <div className="flex-1 space-y-1.5 text-[11px]">
          {categories.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-slate-400 font-medium truncate max-w-[90px]">
                  {c.name}
                </span>
              </div>
              <span className="font-mono text-slate-200 text-[10px]">{c.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
