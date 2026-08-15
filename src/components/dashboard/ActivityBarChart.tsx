'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export const ActivityBarChart: React.FC = () => {
  const bars = [
    { label: 'JAN', height: 40, active: false },
    { label: 'FEB', height: 60, active: false },
    { label: 'MAR', height: 75, active: false },
    { label: 'APR', height: 95, active: true, value: '2514' },
    { label: 'MAY', height: 65, active: false },
    { label: 'JUN', height: 50, active: false },
    { label: 'JUL', height: 55, active: false },
    { label: 'AUG', height: 35, active: false },
    { label: 'SEP', height: 30, active: false },
    { label: 'OCT', height: 45, active: false },
    { label: 'NOV', height: 50, active: false },
    { label: 'DEC', height: 60, active: false },
  ];

  return (
    <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-4 flex flex-col justify-between shadow-sm h-full">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300">Picks | Timeline</span>
          <span className="text-[10px] text-slate-500 font-mono">2026</span>
        </div>
        <MoreVertical className="h-3.5 w-3.5 text-slate-500 cursor-pointer" />
      </div>

      {/* Bar Chart Area */}
      <div className="flex items-end justify-between gap-1.5 h-36 pt-4 pb-2 border-b border-[#23252d]">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center h-full justify-end group">
            {b.active ? (
              // Active Highlighted Cyan Column
              <div
                className="w-full rounded-t-sm border border-[#2dd4bf] bg-cyan-950/40 relative shadow-[0_0_12px_rgba(45,212,191,0.25)]"
                style={{ height: `${b.height}%` }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300 font-bold">
                  {b.value}
                </span>
              </div>
            ) : (
              // Muted Column
              <div
                className="w-full rounded-t-sm bg-[#2b2d37] hover:bg-[#393c4a] transition-colors"
                style={{ height: `${b.height}%` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between text-[8px] font-mono text-slate-500 pt-2 px-0.5">
        {bars.map((b) => (
          <span key={b.label} className={b.active ? 'text-cyan-400 font-bold' : ''}>
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
};
