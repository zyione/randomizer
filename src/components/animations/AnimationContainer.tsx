'use client';

import React from 'react';
import { AnimationStyle, Item } from '@/types/randomizer';
import { SlotMachineAnimation } from './SlotMachineAnimation';
import { CardFlipAnimation } from './CardFlipAnimation';
import { ScrambleTextAnimation } from './ScrambleTextAnimation';
import { ParticleBurstAnimation } from './ParticleBurstAnimation';
import { RouletteStripAnimation } from './RouletteStripAnimation';

interface AnimationContainerProps {
  style: AnimationStyle;
  items: Item[];
  winningItem: Item;
  duration: number;
  isSpinning: boolean;
  onComplete: () => void;
}

export const AnimationContainer: React.FC<AnimationContainerProps> = ({
  style,
  items,
  winningItem,
  duration,
  isSpinning,
  onComplete,
}) => {
  switch (style) {
    case 'slot-machine':
      return (
        <SlotMachineAnimation
          items={items}
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
    case 'card-flip':
      return (
        <CardFlipAnimation
          items={items}
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
    case 'scramble-decode':
      return (
        <ScrambleTextAnimation
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
    case 'particle-burst':
      return (
        <ParticleBurstAnimation
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
    case 'roulette-strip':
      return (
        <RouletteStripAnimation
          items={items}
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
    default:
      return (
        <SlotMachineAnimation
          items={items}
          winningItem={winningItem}
          duration={duration}
          isSpinning={isSpinning}
          onComplete={onComplete}
        />
      );
  }
};
