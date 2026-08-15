'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';

interface RouletteStripAnimationProps {
  items: Item[];
  winningItem: Item;
  duration: number; // in seconds
  isSpinning: boolean;
  onComplete: () => void;
}

export const RouletteStripAnimation: React.FC<RouletteStripAnimationProps> = ({
  items,
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [tape, setTape] = useState<Item[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = 160; // width of each card in strip in px

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Generate repeated items for long horizontal strip
    const repeats = Math.max(12, Math.ceil((duration * 25) / items.length));
    const generated: Item[] = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < items.length; i++) {
        generated.push(items[i]);
      }
    }
    // Append winning item at target position
    generated.push(winningItem);
    // Add 4 buffer items
    generated.push(items[(items.indexOf(winningItem) + 1) % items.length] || items[0]);
    generated.push(items[(items.indexOf(winningItem) + 2) % items.length] || items[0]);
    generated.push(items[(items.indexOf(winningItem) + 3) % items.length] || items[0]);

    setTape(generated);
    setOffsetX(0);
  }, [items, winningItem, duration]);

  useEffect(() => {
    if (!isSpinning || tape.length === 0) return;

    soundFx.playWhoosh();

    const startTime = performance.now();
    const durationMs = duration * 1000;
    const targetIndex = tape.length - 4;
    // Align target item precisely in the center of the container
    const containerWidth = containerRef.current?.offsetWidth || 500;
    const targetOffset = targetIndex * itemWidth - containerWidth / 2 + itemWidth / 2;

    let lastTickIndex = -1;
    let animationFrameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Quartic ease out for authentic roulette slowdown
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentOffset = ease * targetOffset;

      setOffsetX(currentOffset);

      // Sound tick on each card passing center
      const currentIndex = Math.floor((currentOffset + containerWidth / 2) / itemWidth);
      if (currentIndex !== lastTickIndex && currentIndex > 0) {
        lastTickIndex = currentIndex;
        soundFx.playTick(1.0 + (progress * 0.3));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setOffsetX(targetOffset);
        soundFx.playWinFanfare();
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpinning, tape, duration, onComplete]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Outer Roulette Chassis */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950/90 p-4 shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)] backdrop-blur-xl">
        {/* Left & Right Depth Shadow Gradient */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent" />

        {/* Center Target Indicator Needle (Top & Bottom) */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 -translate-x-1/2 w-1 bg-amber-400 shadow-[0_0_12px_#f59e0b]">
          {/* Top Arrow Pointer */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-x-[8px] border-x-transparent border-t-[10px] border-t-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />
          {/* Bottom Arrow Pointer */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[8px] border-x-transparent border-b-[10px] border-b-amber-400 drop-shadow-[0_0_8px_#f59e0b]" />
        </div>

        {/* Strip Track */}
        <div
          ref={containerRef}
          className="relative h-32 overflow-hidden rounded-xl bg-slate-900/60"
        >
          <div
            className="flex items-center h-full will-change-transform"
            style={{
              transform: `translate3d(-${offsetX}px, 0, 0)`,
            }}
          >
            {tape.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 flex flex-col items-center justify-center p-3 text-center border-r border-slate-800/80 transition-colors"
                style={{ width: `${itemWidth}px`, height: '100%' }}
              >
                <div
                  className="w-full h-full rounded-xl flex flex-col items-center justify-center p-2.5 border"
                  style={{
                    backgroundColor: `${item.color || '#3b82f6'}12`,
                    borderColor: `${item.color || '#3b82f6'}40`,
                  }}
                >
                  <span className="text-sm font-bold tracking-tight text-slate-100 line-clamp-2">
                    {item.text}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
