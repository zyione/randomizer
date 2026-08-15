// Web Audio API Procedural Sound Synthesizer
// Generates realistic mechanical clicks, whooshes, glitch chirps, and victory fanfares locally.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // AudioContext will be lazily initialized on first user gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setConfig(enabled: boolean, volume: number) {
    this.isEnabled = enabled;
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Crisp mechanical tick / click for wheel slices, slot reels, roulette ticks
  public playTick(pitch: number = 1.0) {
    if (!this.isEnabled || this.volume === 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(120 * pitch, now + 0.04);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Filtered whoosh / spin sound for rapid movement
  public playWhoosh() {
    if (!this.isEnabled || this.volume === 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Futuristic digital glitch chirp for scramble decrypt animation
  public playGlitchChirp() {
    if (!this.isEnabled || this.volume === 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      const freqs = [880, 1200, 1500, 750, 950, 1800];
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(randomFreq, now);
      osc.frequency.setValueAtTime(randomFreq * 1.5, now + 0.015);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Card flip / deck shuffle friction sound
  public playCardFlip() {
    if (!this.isEnabled || this.volume === 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // Celebratory winner fanfare chord progression
  public playWinFanfare() {
    if (!this.isEnabled || this.volume === 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Arpeggio notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + index * 0.08;
        const duration = index === notes.length - 1 ? 0.6 : 0.2;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.28 * this.volume, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + duration + 0.05);
      });
    } catch {
      // Ignore audio synthesis errors
    }
  }
}

export const soundFx = new SoundSynthesizer();
