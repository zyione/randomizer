'use client';

import React, { useEffect, useState } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';

interface CardFlipAnimationProps {
  items: Item[];
  winningItem: Item;
  duration: number; // in seconds
  isSpinning: boolean;
  onComplete: () => void;
}

export const CardFlipAnimation: React.FC<CardFlipAnimationProps> = ({
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  const [stage, setStage] = useState<'idle' | 'shuffling' | 'flipping' | 'revealed'>('idle');
  const [shuffleIndex, setShuffleIndex] = useState(0);

  useEffect(() => {
    if (!isSpinning) {
      setStage('revealed');
      return;
    }

    setStage('shuffling');
    soundFx.playWhoosh();

    const durationMs = duration * 1000;
    const shuffleDuration = durationMs * 0.65;
    const flipDuration = durationMs * 0.35;

    // Fast cycling cards
    const interval = setInterval(() => {
      setShuffleIndex((prev) => prev + 1);
      soundFx.playCardFlip();
    }, 120);

    const shuffleTimer = setTimeout(() => {
      clearInterval(interval);
      setStage('flipping');
      soundFx.playCardFlip();

      const finishTimer = setTimeout(() => {
        setStage('revealed');
        soundFx.playWinFanfare();
        onComplete();
      }, flipDuration);

      return () => clearTimeout(finishTimer);
    }, shuffleDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(shuffleTimer);
    };
  }, [isSpinning, duration, onComplete]);

  return (
    <div className="relative w-full max-w-sm mx-auto flex items-center justify-center min-h-[300px] perspective-[1000px]">
      {/* 3D Perspective Card Box */}
      <div
        className={`relative w-72 h-80 transition-all duration-700 ease-out transform-style-3d ${
          stage === 'flipping' || stage === 'shuffling'
            ? 'rotate-y-180 scale-95'
            : 'rotate-y-0 scale-100'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform:
            stage === 'shuffling'
              ? `rotateY(${shuffleIndex * 45}deg) scale(0.95)`
              : stage === 'flipping'
              ? 'rotateY(90deg) scale(0.9)'
              : 'rotateY(0deg) scale(1)',
          transition: stage === 'shuffling' ? 'transform 0.12s ease-in-out' : 'transform 0.4s ease-out',
        }}
      >
        {/* Card Face - Winner Front */}
        <div
          className={`absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-between border-2 border-cyan-400/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_30px_rgba(0,242,254,0.3)] backface-hidden`}
        >
          <div className="w-full flex justify-between items-center text-xs font-mono tracking-widest text-cyan-400 uppercase">
            <span>◆ RANDOMIZER</span>
            <span>★ WINNER</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto px-2">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 text-2xl shadow-[0_0_15px_rgba(0,242,254,0.3)] animate-pulse-glow">
              ✦
            </div>
            <h3 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-400 drop-shadow-md line-clamp-3">
              {winningItem?.text || 'Pick a Card'}
            </h3>
            {winningItem?.subtitle && (
              <p className="text-xs font-medium text-slate-400 mt-2 line-clamp-2">
                {winningItem.subtitle}
              </p>
            )}
          </div>

          <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>DECK ID: #RND</span>
            <span>VERIFIED PICK</span>
          </div>
        </div>

        {/* Card Back - Cybernetic Hologram */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-purple-500/40 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="h-20 w-20 rounded-full border-2 border-purple-400/50 flex items-center justify-center bg-purple-500/10 animate-spin" style={{ animationDuration: '3s' }}>
            <span className="text-purple-300 font-mono text-xl font-bold">⟁</span>
          </div>
          <p className="text-xs font-mono tracking-widest text-purple-300 uppercase mt-4">
            Shuffling Deck...
          </p>
        </div>
      </div>
    </div>
  );
};
