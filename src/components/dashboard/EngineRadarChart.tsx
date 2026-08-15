'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export const EngineRadarChart: React.FC = () => {
  return (
    <div className="rounded-xl bg-[#1a1b20] border border-[#262830] p-4 flex flex-col justify-between shadow-sm h-full">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-300">Engine distribution</span>
        </div>
        <MoreVertical className="h-3.5 w-3.5 text-slate-500 cursor-pointer" />
      </div>

      {/* Radar SVG Area */}
      <div className="relative w-full h-40 flex items-center justify-center my-auto">
        <svg viewBox="0 0 200 200" className="w-40 h-40">
          {/* Radar Circles */}
          <circle cx="100" cy="100" r="75" stroke="#252731" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="#252731" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="25" stroke="#252731" strokeWidth="1" fill="none" />

          {/* Crosshair Axes */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="#252731" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#252731" strokeWidth="1" />

          {/* Organic Teal Polygon Shape */}
          <path
            d="M 100,42 Q 125,70 145,100 Q 120,130 100,150 Q 75,130 55,100 Q 75,70 100,42 Z"
            fill="rgba(45,212,191,0.18)"
            stroke="#2dd4bf"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]"
          />

          {/* Center Point & Label */}
          <circle cx="100" cy="100" r="3" fill="#2dd4bf" />
          <rect x="86" y="92" width="28" height="15" rx="3" fill="#111215" stroke="#2dd4bf" strokeWidth="0.8" />
          <text x="100" y="103" fill="#2dd4bf" fontSize="8" fontFamily="monospace" textAnchor="middle">
            57%
          </text>
        </svg>

        {/* Labels at the 4 cardinal positions */}
        <span className="absolute top-1 text-[8px] font-mono text-slate-400">SLOT REEL</span>
        <span className="absolute bottom-1 text-[8px] font-mono text-slate-400">PARTICLES</span>
        <span className="absolute left-2 text-[8px] font-mono text-slate-400">CARDS</span>
        <span className="absolute right-2 text-[8px] font-mono text-slate-400">ROULETTE</span>
      </div>
    </div>
  );
};
