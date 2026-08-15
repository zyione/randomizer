'use client';

import React, { useState } from 'react';
import { AppSettings, AnimationStyle } from '@/types/randomizer';
import { soundFx } from '@/lib/audio';
import {
  X,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  RotateCcw,
  Play,
} from 'lucide-react';
import { AnimationContainer } from '@/components/animations/AnimationContainer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

const ANIMATION_OPTIONS: { id: AnimationStyle; name: string; desc: string; icon: string }[] = [
  {
    id: 'slot-machine',
    name: 'Slot Machine Reel',
    desc: 'Vertical mechanical blur reel with inertia bounce',
    icon: '🎰',
  },
  {
    id: 'card-flip',
    name: '3D Card Flip & Shuffle',
    desc: '3D perspective card deck with flip-to-reveal',
    icon: '🃏',
  },
  {
    id: 'scramble-decode',
    name: 'Matrix / Glitch Scramble',
    desc: 'Cyberpunk rapid character decryption sequence',
    icon: '💻',
  },
  {
    id: 'particle-burst',
    name: 'Particle Burst & Glow',
    desc: 'HTML5 canvas particle fireworks with neon halo',
    icon: '💥',
  },
  {
    id: 'roulette-strip',
    name: 'Roulette Strip Ticker',
    desc: 'Horizontal ticker strip with center pointer',
    icon: '🎡',
  },
];

const PREVIEW_SAMPLE_ITEMS = [
  { id: 'p1', text: 'Laser Quantum Core', subtitle: 'Rare Tier', color: '#00f2fe' },
  { id: 'p2', text: 'Hyper Neon Reactor', subtitle: 'Legendary', color: '#8b5cf6' },
  { id: 'p3', text: 'Plasma Fusion Drive', subtitle: 'Epic Tier', color: '#ec4899' },
  { id: 'p4', text: 'Orbital Strike Matrix', subtitle: 'Mythic', color: '#10b981' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [previewing, setPreviewing] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<AppSettings>) => {
    const updated = { ...localSettings, ...partial };
    setLocalSettings(updated);
    onSaveSettings(updated);

    if (partial.soundEnabled !== undefined || partial.soundVolume !== undefined) {
      soundFx.setConfig(
        updated.soundEnabled,
        updated.soundVolume
      );
    }
  };

  const handleTriggerPreview = () => {
    if (previewing) return;
    setPreviewing(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Application Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize animation engine, duration, and synthesized sound effects.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Section 1: Animation Style Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Animation Strategy (5 Pluggable Engines)</span>
              </label>
              <button
                type="button"
                onClick={handleTriggerPreview}
                disabled={previewing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{previewing ? 'Previewing...' : 'Test Live Preview'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ANIMATION_OPTIONS.map((opt) => {
                const isSelected = localSettings.animationStyle === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleUpdate({ animationStyle: opt.id })}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl select-none">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{opt.name}</h4>
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Interactive Preview Arena inside Settings */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-wider">
                Live Engine Sandbox:
              </div>
              <AnimationContainer
                style={localSettings.animationStyle}
                items={PREVIEW_SAMPLE_ITEMS}
                winningItem={PREVIEW_SAMPLE_ITEMS[1]}
                duration={localSettings.animationDuration}
                isSpinning={previewing}
                onComplete={() => setPreviewing(false)}
              />
            </div>
          </div>

          {/* Section 2: Duration Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">
                Animation Duration (Speed)
              </label>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {localSettings.animationDuration.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.2}
              value={localSettings.animationDuration}
              onChange={(e) =>
                handleUpdate({ animationDuration: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Fast (1.0s)</span>
              <span>Default (2.2s)</span>
              <span>Dramatic (5.0s)</span>
            </div>
          </div>

          {/* Section 3: Web Audio Sound Controls */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {localSettings.soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-cyan-400" />
                ) : (
                  <VolumeX className="h-5 w-5 text-slate-500" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">Procedural Web Audio FX</h4>
                  <p className="text-[11px] text-slate-400">
                    Clicks, whooshes, and victory fanfares synthesized in real-time
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleUpdate({ soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
              </label>
            </div>

            {localSettings.soundEnabled && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Sound Volume</span>
                  <span>{Math.round(localSettings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={localSettings.soundVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    handleUpdate({ soundVolume: vol });
                    soundFx.playTick(1.2);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
