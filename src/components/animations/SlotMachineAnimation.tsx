'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';

interface SlotMachineAnimationProps {
  items: Item[];
  winningItem: Item;
  duration: number; // seconds
  isSpinning: boolean;
  onComplete: () => void;
}

export const SlotMachineAnimation: React.FC<SlotMachineAnimationProps> = ({
  items,
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const [tape, setTape] = useState<Item[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 90; // px per slot row

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Generate a long reel tape for smooth blur scrolling
    const repeats = Math.max(12, Math.ceil((duration * 25) / items.length));
    const generated: Item[] = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < items.length; i++) {
        generated.push(items[i]);
      }
    }
    // Append winning item at the exact target landing position
    generated.push(winningItem);
    // Add 2 buffer items below
    generated.push(items[(items.indexOf(winningItem) + 1) % items.length] || items[0]);
    generated.push(items[(items.indexOf(winningItem) + 2) % items.length] || items[0]);

    setTape(generated);
    setOffsetY(0);
  }, [items, winningItem, duration]);

  useEffect(() => {
    if (!isSpinning || tape.length === 0) return;

    soundFx.playWhoosh();

    const startTime = performance.now();
    const durationMs = duration * 1000;
    const targetIndex = tape.length - 3; // Index of winning item
    const targetOffset = targetIndex * itemHeight;

    let lastTickIndex = -1;
    let animationFrameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Custom cubic ease out with slight rebound bounce
      const ease = 1 - Math.pow(1 - progress, 3.5);
      const currentOffset = ease * targetOffset;

      setOffsetY(currentOffset);

      // Trigger mechanical tick sound when passing slot items
      const currentIndex = Math.floor(currentOffset / itemHeight);
      if (currentIndex !== lastTickIndex && currentIndex > 0) {
        lastTickIndex = currentIndex;
        soundFx.playTick(0.8 + (progress * 0.4));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setOffsetY(targetOffset);
        soundFx.playWinFanfare();
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpinning, tape, duration, onComplete]);

  const displayItem = isSpinning ? null : winningItem;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer Slot Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-[0_0_35px_-5px_rgba(0,242,254,0.25)] backdrop-blur-xl">
        {/* Top / Bottom Shadow Mask for 3D depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        {/* Center Target Indicator Bar */}
        <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 h-[92px] rounded-xl border-2 border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
        </div>

        {/* Vertical Reel Window */}
        <div
          ref={containerRef}
          className="relative h-[276px] overflow-hidden rounded-xl"
          style={{ height: `${itemHeight * 3}px` }}
        >
          {isSpinning ? (
            <div
              className="will-change-transform"
              style={{
                transform: `translate3d(0, -${offsetY}px, 0)`,
                marginTop: `${itemHeight}px`,
              }}
            >
              {tape.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex flex-col items-center justify-center text-center px-4"
                  style={{ height: `${itemHeight}px` }}
                >
                  <span className="text-xl font-bold tracking-wide text-slate-200 line-clamp-1 drop-shadow-sm">
                    {item.text}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <span className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 drop-shadow-[0_0_12px_rgba(0,242,254,0.6)]">
                {displayItem?.text || 'Ready to Spin'}
              </span>
              {displayItem?.subtitle && (
                <span className="text-sm font-medium text-cyan-200/80 mt-1.5">
                  {displayItem.subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
