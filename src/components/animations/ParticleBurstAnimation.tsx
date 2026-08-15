'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Item } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';

interface ParticleBurstAnimationProps {
  winningItem: Item;
  duration: number; // in seconds
  isSpinning: boolean;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

const PARTICLE_COLORS = ['#00f2fe', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ffffff'];

export const ParticleBurstAnimation: React.FC<ParticleBurstAnimationProps> = ({
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [pulseGlow, setPulseGlow] = useState(false);

  useEffect(() => {
    if (!isSpinning) {
      setRevealed(true);
      return;
    }

    setRevealed(false);
    setPulseGlow(false);
    soundFx.playWhoosh();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const particles: Particle[] = [];

    // Spawn 120 particles
    for (let i = 0; i < 140; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
      });
    }

    const durationMs = duration * 1000;
    const startTime = performance.now();
    let animFrame: number;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // friction
        p.vy *= 0.96;
        p.alpha = Math.max(0, p.alpha - p.decay);

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (progress > 0.5 && !revealed) {
        setRevealed(true);
        setPulseGlow(true);
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(render);
      } else {
        soundFx.playWinFanfare();
        onComplete();
      }
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isSpinning, duration, onComplete, revealed]);

  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[280px] flex items-center justify-center">
      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full z-20"
      />

      {/* Glowing Burst Card */}
      <div
        className={`relative z-10 w-full rounded-2xl border p-8 text-center transition-all duration-700 ${
          pulseGlow
            ? 'border-purple-400 bg-slate-950/90 shadow-[0_0_50px_rgba(139,92,246,0.6)] scale-100'
            : 'border-purple-500/30 bg-slate-950/80 shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-95'
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-2xl">
              💥
            </div>
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 drop-shadow-md">
          {winningItem?.text || 'Charging Energy...'}
        </h3>

        {winningItem?.subtitle && (
          <p className="mt-3 text-sm font-medium text-purple-200/80">
            {winningItem.subtitle}
          </p>
        )}

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
          <span className="h-2 w-2 rounded-full bg-pink-400 animate-ping" />
          <span>SUPERCHARGED SELECTION</span>
        </div>
      </div>
    </div>
  );
};
