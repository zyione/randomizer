'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';
import confetti from 'canvas-confetti';
import { RotateCw, Sparkles, Copy, Check } from 'lucide-react';

interface PrizeWheelProps {
  items: Item[];
  duration?: number; // in seconds
  onWinnerSelected: (item: Item) => void;
}

const SLICE_COLORS = [
  '#00f2fe',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#14b8a6',
  '#f43f5e',
  '#a855f7',
  '#6366f1',
  '#06b6d4',
  '#d946ef',
];

export const PrizeWheel: React.FC<PrizeWheelProps> = ({
  items,
  duration = 4.0,
  onWinnerSelected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningItem, setWinningItem] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);
  const rotationRef = useRef(0); // in radians
  const animationFrameRef = useRef<number | null>(null);

  const drawWheel = useCallback((currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const totalItems = items.length;

    ctx.clearRect(0, 0, size, size);

    if (totalItems === 0) {
      // Empty wheel placeholder
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();
      ctx.restore();
      return;
    }

    const arcSize = (Math.PI * 2) / totalItems;

    // Draw Outer Glow Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Draw Slices
    for (let i = 0; i < totalItems; i++) {
      const item = items[i];
      const startAngle = currentAngle + i * arcSize;
      const endAngle = startAngle + arcSize;
      const color = item.color || SLICE_COLORS[i % SLICE_COLORS.length];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      // Subtle slice separator border
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.stroke();

      // Draw Slice Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + arcSize / 2);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;

      // Dynamic text sizing based on number of items
      const fontSize = totalItems > 30 ? 10 : totalItems > 20 ? 12 : totalItems > 12 ? 14 : 16;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;

      // Truncate long text
      const maxTextLength = totalItems > 24 ? 14 : 22;
      const label =
        item.text.length > maxTextLength
          ? item.text.substring(0, maxTextLength - 2) + '..'
          : item.text;

      ctx.fillText(label, radius - 20, fontSize / 3);
      ctx.restore();

      ctx.restore();
    }

    // Draw Center Peg / Hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#090d16';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Inner center gem
    ctx.beginPath();
    ctx.arc(center, center, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#00f2fe';
    ctx.fill();
    ctx.restore();
  }, [items]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set high DPI crisp canvas
    const displaySize = 440;
    canvas.width = displaySize * 2;
    canvas.height = displaySize * 2;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(2, 2);

    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinningItem(null);
    setCopied(false);
    soundFx.playWhoosh();

    const totalItems = items.length;
    const arcSize = (Math.PI * 2) / totalItems;

    // Pick random target index
    const targetIndex = Math.floor(Math.random() * totalItems);
    const selected = items[targetIndex];

    // Pointer is located at the TOP (-Math.PI / 2)
    // To land targetIndex slice at top pointer:
    // angle = (3/2 * PI) - (targetIndex + 0.5) * arcSize + (fullSpins * 2 * PI)
    const fullSpins = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    const sliceCenterOffset = (Math.random() * 0.6 + 0.2) * arcSize; // land nicely inside slice
    const targetAngle =
      Math.PI * 1.5 - targetIndex * arcSize - sliceCenterOffset + fullSpins * Math.PI * 2;

    const startAngle = rotationRef.current % (Math.PI * 2);
    const totalRotationNeeded = targetAngle - startAngle;

    const startTime = performance.now();
    const durationMs = duration * 1000;
    let lastSliceTick = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Quintic ease-out for ultra smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 4.5);
      const currentAngle = startAngle + ease * totalRotationNeeded;
      rotationRef.current = currentAngle;

      drawWheel(currentAngle);

      // Trigger mechanical tick sound when slice lines pass the top pointer
      const normalizedAngle = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const currentSlice = Math.floor(
        ((Math.PI * 1.5 - normalizedAngle + Math.PI * 2) % (Math.PI * 2)) / arcSize
      );
      if (currentSlice !== lastSliceTick) {
        lastSliceTick = currentSlice;
        soundFx.playTick(0.9 + progress * 0.4);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWinningItem(selected);
        soundFx.playWinFanfare();
        onWinnerSelected(selected);

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
          });
        } catch {}
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto py-4">
      {/* Wheel Stage */}
      <div className="relative flex items-center justify-center">
        {/* Top Pointer Indicator */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-6 h-8 bg-gradient-to-b from-cyan-400 to-cyan-500 rounded-b-md shadow-[0_0_15px_#00f2fe] border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <div className="w-0 h-0 border-x-[10px] border-x-transparent border-t-[14px] border-t-cyan-500 -mt-1 drop-shadow-[0_0_8px_#00f2fe]" />
        </div>

        {/* Canvas Element */}
        <div className="relative rounded-full p-2 bg-slate-950/80 border border-cyan-500/20 shadow-[0_0_40px_-10px_rgba(0,242,254,0.3)]">
          <canvas
            ref={canvasRef}
            style={{ width: '440px', height: '440px' }}
            className="max-w-[85vw] max-h-[85vw] sm:max-w-[440px] sm:max-h-[440px]"
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full px-4">
        <button
          onClick={spinWheel}
          disabled={isSpinning || items.length === 0}
          className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-72 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 px-8 py-4 text-base font-black tracking-wide text-slate-950 shadow-[0_0_30px_rgba(0,242,254,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
        >
          <RotateCw className={`h-5 w-5 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span>{isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL'}</span>
        </button>

        {/* Winner Announcement Card */}
        {winningItem && !isSpinning && (
          <div className="w-full mt-2 rounded-2xl border border-cyan-400/40 bg-slate-950/90 p-5 text-center shadow-[0_0_30px_rgba(0,242,254,0.3)] backdrop-blur-xl animate-fade-in">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>WHEEL WINNER</span>
            </div>
            <h4 className="text-2xl font-black text-white drop-shadow-md">
              {winningItem.text}
            </h4>
            {winningItem.subtitle && (
              <p className="text-sm font-medium text-slate-400 mt-1">
                {winningItem.subtitle}
              </p>
            )}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => handleCopy(winningItem.text)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
