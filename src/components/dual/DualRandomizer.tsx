'use client';

import React, { useState } from 'react';
import { ItemList, Item, AnimationStyle, DualModeType } from '@/types/randomizer';
import { AnimationContainer } from '@/components/animations/AnimationContainer';
import { Sparkles, Dices, Shuffle, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DualRandomizerProps {
  lists: ItemList[];
  primaryList: ItemList;
  secondaryList: ItemList;
  onSecondaryListChange: (listId: string) => void;
  animationStyle: AnimationStyle;
  animationDuration: number;
  onDualResult: (item1: Item, item2: Item, mode: 'dual-single-list' | 'dual-two-lists') => void;
}

export const DualRandomizer: React.FC<DualRandomizerProps> = ({
  lists,
  primaryList,
  secondaryList,
  onSecondaryListChange,
  animationStyle,
  animationDuration,
  onDualResult,
}) => {
  const [dualType, setDualType] = useState<DualModeType>('same-list');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winItem1, setWinItem1] = useState<Item | null>(null);
  const [winItem2, setWinItem2] = useState<Item | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const startDualRandomize = () => {
    if (isSpinning) return;

    if (dualType === 'same-list') {
      if (primaryList.items.length < 2) {
        alert('Please ensure the list has at least 2 items to pick a pair.');
        return;
      }
      // Sample 2 without replacement
      const shuffled = [...primaryList.items].sort(() => Math.random() - 0.5);
      const pick1 = shuffled[0];
      const pick2 = shuffled[1];

      setWinItem1(pick1);
      setWinItem2(pick2);
    } else {
      if (primaryList.items.length === 0 || secondaryList.items.length === 0) {
        alert('Please ensure both lists have at least 1 item.');
        return;
      }
      const pick1 = primaryList.items[Math.floor(Math.random() * primaryList.items.length)];
      const pick2 = secondaryList.items[Math.floor(Math.random() * secondaryList.items.length)];

      setWinItem1(pick1);
      setWinItem2(pick2);
    }

    setCompletedCount(0);
    setIsSpinning(true);
    setCopied(false);
  };

  const handleAnimationComplete = () => {
    setCompletedCount((prev) => {
      const next = prev + 1;
      if (next >= 2) {
        setIsSpinning(false);
        if (winItem1 && winItem2) {
          onDualResult(
            winItem1,
            winItem2,
            dualType === 'same-list' ? 'dual-single-list' : 'dual-two-lists'
          );
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#00f2fe', '#8b5cf6', '#ec4899'],
            });
          } catch {}
        }
      }
      return next;
    });
  };

  const handleCopyBoth = () => {
    if (!winItem1 || !winItem2) return;
    const text = `${winItem1.text} + ${winItem2.text}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const list2Items = dualType === 'same-list' ? primaryList.items : secondaryList.items;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Dual Mode Switcher Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
        <button
          onClick={() => setDualType('same-list')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            dualType === 'same-list'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shuffle className="h-4 w-4" />
          <span>Pick 2 From Same List (No Duplicates)</span>
        </button>

        <button
          onClick={() => setDualType('two-lists')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            dualType === 'two-lists'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dices className="h-4 w-4" />
          <span>Combo Pick: List A + List B</span>
        </button>
      </div>

      {/* Secondary List Selector (if two-lists mode is active) */}
      {dualType === 'two-lists' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/20 px-4 py-2.5">
          <span className="text-xs font-mono text-purple-300">Secondary List B:</span>
          <select
            value={secondaryList.id}
            onChange={(e) => onSecondaryListChange(e.target.value)}
            className="rounded-lg border border-purple-500/40 bg-slate-900 px-3 py-1 text-sm font-medium text-purple-200 outline-none focus:border-purple-400"
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.items.length} items)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Dual Arena: Side-by-Side Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-center">
        {/* Left Arena Box */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-xs font-mono tracking-widest text-cyan-400 uppercase">
            {dualType === 'same-list' ? 'PICK #1 (FROM LIST)' : `LIST A: ${primaryList.title}`}
          </div>
          <div className="w-full">
            <AnimationContainer
              style={animationStyle}
              items={primaryList.items}
              winningItem={winItem1 || primaryList.items[0]}
              duration={animationDuration}
              isSpinning={isSpinning}
              onComplete={handleAnimationComplete}
            />
          </div>
        </div>

        {/* Right Arena Box */}
        <div className="flex flex-col items-center">
          <div className="mb-2 text-xs font-mono tracking-widest text-purple-400 uppercase">
            {dualType === 'same-list' ? 'PICK #2 (DISTINCT)' : `LIST B: ${secondaryList.title}`}
          </div>
          <div className="w-full">
            <AnimationContainer
              style={animationStyle}
              items={list2Items}
              winningItem={winItem2 || list2Items[1] || list2Items[0]}
              duration={animationDuration}
              isSpinning={isSpinning}
              onComplete={handleAnimationComplete}
            />
          </div>
        </div>
      </div>

      {/* Main Dual Trigger Button */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full">
        <button
          onClick={startDualRandomize}
          disabled={isSpinning}
          className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-80 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_35px_rgba(139,92,246,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(139,92,246,0.55)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
        >
          <div className="flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-slate-950 px-8 py-3.5 text-base font-black tracking-wide text-white transition-colors group-hover:bg-transparent group-hover:text-slate-950">
            <Sparkles className="h-5 w-5 text-cyan-400 group-hover:text-slate-950" />
            <span>{isSpinning ? 'GENERATING PAIR...' : 'RANDOMIZE PAIR'}</span>
          </div>
        </button>

        {/* Combined Result Card */}
        {winItem1 && winItem2 && !isSpinning && (
          <div className="w-full max-w-xl mt-2 rounded-2xl border border-purple-500/40 bg-slate-950/90 p-5 text-center shadow-[0_0_30px_rgba(139,92,246,0.25)] backdrop-blur-xl animate-fade-in">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">
              DUAL RESULT COMBINATION
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap text-xl sm:text-2xl font-black text-white">
              <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]">
                {winItem1.text}
              </span>
              <span className="text-slate-500 font-normal">＋</span>
              <span className="text-purple-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                {winItem2.text}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleCopyBoth}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Combo' : 'Copy Combo'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
