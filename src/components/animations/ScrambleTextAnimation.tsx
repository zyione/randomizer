'use client';

import React, { useEffect, useState } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';

interface ScrambleTextAnimationProps {
  winningItem: Item;
  duration: number; // in seconds
  isSpinning: boolean;
  onComplete: () => void;
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________010101XYZ';

export const ScrambleTextAnimation: React.FC<ScrambleTextAnimationProps> = ({
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  const targetText = winningItem?.text || 'Ready to Randomize';
  const [displayText, setDisplayText] = useState<string>(targetText);
  const [progressRatio, setProgressRatio] = useState<number>(1);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayText(targetText);
      setProgressRatio(1);
      return;
    }

    const durationMs = duration * 1000;
    const startTime = performance.now();
    let animFrame: number;
    let lastChirp = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setProgressRatio(progress);

      // Sound chirp every ~60ms
      if (now - lastChirp > 60) {
        lastChirp = now;
        soundFx.playGlitchChirp();
      }

      // Compute how many characters are resolved
      const resolvedCount = Math.floor(progress * targetText.length);
      let output = '';

      for (let i = 0; i < targetText.length; i++) {
        if (i < resolvedCount) {
          output += targetText[i];
        } else if (targetText[i] === ' ') {
          output += ' ';
        } else {
          // Random cycling glyph
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(output);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayText(targetText);
        soundFx.playWinFanfare();
        onComplete();
      }
    };

    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isSpinning, targetText, duration, onComplete]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-8 shadow-[0_0_35px_-5px_rgba(16,185,129,0.25)] backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6 text-xs font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold tracking-wider">SYSTEM_DECRYPT_PROTOCOL // v4.2</span>
          </div>
          <span className="text-emerald-400/70">
            {isSpinning ? `DECODING: ${Math.round(progressRatio * 100)}%` : 'STATUS: RESOLVED'}
          </span>
        </div>

        {/* Scramble Display Arena */}
        <div className="min-h-[120px] flex flex-col items-center justify-center text-center">
          <div className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.7)] break-words w-full">
            {displayText}
            {isSpinning && (
              <span className="inline-block w-3 h-6 ml-1 bg-emerald-400 animate-pulse align-middle" />
            )}
          </div>

          {winningItem?.subtitle && !isSpinning && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-mono text-emerald-300">
              <span>❯</span>
              <span>{winningItem.subtitle}</span>
            </div>
          )}
        </div>

        {/* Matrix Progress Bar */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
