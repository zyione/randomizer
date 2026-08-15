'use client';

import React from 'react';
import { MoreVertical } from 'lucide-react';

export const ActivityChart: React.FC = () => {
  return (
    <div className="w-full mt-4 pt-4 border-t border-[#23252d]">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Activity Curve</span>
          <span className="text-[10px] text-slate-500 font-mono">| Real-time Velocity</span>
        </div>
        <MoreVertical className="h-3.5 w-3.5 text-slate-500 cursor-pointer" />
      </div>

      {/* SVG Smooth Wave Chart matching reference image */}
      <div className="relative h-28 w-full overflow-hidden">
        <svg
          viewBox="0 0 500 120"
          className="w-full h-full preserve-3d"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#1f2129" strokeDasharray="3 3" />
          <line x1="0" y1="65" x2="500" y2="65" stroke="#1f2129" strokeDasharray="3 3" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#1f2129" strokeDasharray="3 3" />

          {/* Gradient Area Fill */}
          <path
            d="M 0,110 Q 30,105 60,95 T 120,85 T 180,60 T 230,20 T 270,30 T 320,60 T 370,75 T 440,95 L 500,110 L 500,120 L 0,120 Z"
            fill="url(#waveGradient)"
          />

          {/* Smooth Glowing Line */}
          <path
            d="M 0,110 Q 30,105 60,95 T 120,85 T 180,60 T 230,20 T 270,30 T 320,60 T 370,75 T 440,95 L 500,110"
            stroke="#2dd4bf"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Peak Tooltip & Highlight Point */}
          <circle cx="230" cy="20" r="4.5" fill="#ffffff" stroke="#2dd4bf" strokeWidth="2.5" />
          <rect x="208" y="4" width="44" height="13" rx="3" fill="#111215" stroke="#2dd4bf" strokeWidth="0.8" />
          <text x="230" y="13" fill="#2dd4bf" fontSize="8" fontFamily="monospace" textAnchor="middle">
            2514 EXEC
          </text>
        </svg>

        {/* X Axis labels */}
        <div className="flex justify-between text-[9px] font-mono text-slate-600 px-1 mt-0.5">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
};
