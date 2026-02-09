/**
 * SFX Generator - Sound Effects using Web Audio API
 * Creates various UI and game sound effects procedurally
 */

import { soundEngine } from './SoundEngine';

export type SFXType = 
  // UI Sounds
  | 'click' | 'hover' | 'open' | 'close' | 'toggle' | 'slide'
  // Success Sounds
  | 'success' | 'levelup' | 'achievement' | 'reward' | 'unlock'
  // Error Sounds
  | 'error' | 'denied' | 'fail'
  // Game Sounds
  | 'coin' | 'countdown' | 'start' | 'win' | 'lose' | 'combo'
  // Notification Sounds
  | 'notification' | 'message' | 'alert'
  // Combat Sounds
  | 'attack' | 'hit' | 'heal' | 'block' | 'critical';

interface SFXConfig {
  frequencies: number[];
  durations: number[];
  waveform: OscillatorType;
  envelope: 'sharp' | 'soft' | 'pluck' | 'sustained';
  volume: number;
  delay?: number;
}

const SFX_CONFIGS: Record<SFXType, SFXConfig> = {
  // UI Sounds
  click: {
    frequencies: [800, 1000],
    durations: [0.03, 0.02],
    waveform: 'sine',
    envelope: 'sharp',
    volume: 0.3,
  },
  hover: {
    frequencies: [600],
    durations: [0.05],
    waveform: 'sine',
    envelope: 'soft',
    volume: 0.1,
  },
  open: {
    frequencies: [400, 600, 800],
    durations: [0.05, 0.05, 0.08],
    waveform: 'triangle',
    envelope: 'soft',
    volume: 0.25,
  },
  close: {
    frequencies: [800, 600, 400],
    durations: [0.05, 0.05, 0.08],
    waveform: 'triangle',
    envelope: 'soft',
    volume: 0.25,
  },
  toggle: {
    frequencies: [500, 700],
    durations: [0.04, 0.06],
    waveform: 'square',
    envelope: 'sharp',
    volume: 0.2,
  },
  slide: {
    frequencies: [300, 400, 500, 600],
    durations: [0.05, 0.05, 0.05, 0.05],
    waveform: 'sine',
    envelope: 'soft',
    volume: 0.15,
  },

  // Success Sounds
  success: {
    frequencies: [523, 659, 784],
    durations: [0.1, 0.1, 0.2],
    waveform: 'triangle',
    envelope: 'pluck',
    volume: 0.4,
  },
  levelup: {
    frequencies: [523, 659, 784, 1047],
    durations: [0.1, 0.1, 0.15, 0.3],
    waveform: 'square',
    envelope: 'pluck',
    volume: 0.5,
  },
  achievement: {
    frequencies: [392, 523, 659, 784, 1047],
    durations: [0.08, 0.08, 0.1, 0.12, 0.4],
    waveform: 'triangle',
    envelope: 'pluck',
    volume: 0.5,
  },
  reward: {
    frequencies: [660, 880, 1100, 1320],
    durations: [0.05, 0.05, 0.05, 0.15],
    waveform: 'sine',
    envelope: 'soft',
    volume: 0.4,
  },
  unlock: {
    frequencies: [400, 500, 600, 800, 1000],
    durations: [0.04, 0.04, 0.06, 0.08, 0.15],
    waveform: 'triangle',
    envelope: 'pluck',
    volume: 0.45,
  },

  // Error Sounds
  error: {
    frequencies: [200, 150],
    durations: [0.15, 0.2],
    waveform: 'sawtooth',
    envelope: 'sharp',
    volume: 0.35,
  },
  denied: {
    frequencies: [300, 200, 150],
    durations: [0.1, 0.1, 0.15],
    waveform: 'square',
    envelope: 'sharp',
    volume: 0.3,
  },
  fail: {
    frequencies: [400, 300, 200, 100],
    durations: [0.1, 0.1, 0.15, 0.25],
    waveform: 'sawtooth',
    envelope: 'sustained',
    volume: 0.35,
  },

  // Game Sounds
  coin: {
    frequencies: [1200, 1400, 1800],
    durations: [0.04, 0.04, 0.1],
    waveform: 'sine',
    envelope: 'sharp',
    volume: 0.35,
  },
  countdown: {
    frequencies: [800],
    durations: [0.15],
    waveform: 'square',
    envelope: 'pluck',
    volume: 0.4,
  },
  start: {
    frequencies: [400, 600, 800, 1000, 1200],
    durations: [0.08, 0.08, 0.08, 0.1, 0.2],
    waveform: 'triangle',
    envelope: 'pluck',
    volume: 0.5,
  },
  win: {
    frequencies: [523, 659, 784, 880, 1047, 1175, 1319],
    durations: [0.08, 0.08, 0.08, 0.1, 0.12, 0.15, 0.4],
    waveform: 'square',
    envelope: 'pluck',
    volume: 0.55,
  },
  lose: {
    frequencies: [400, 350, 300, 250, 200, 150],
    durations: [0.12, 0.12, 0.12, 0.15, 0.18, 0.35],
    waveform: 'sawtooth',
    envelope: 'sustained',
    volume: 0.4,
  },
  combo: {
    frequencies: [800, 1000, 1200, 1400],
    durations: [0.03, 0.03, 0.04, 0.08],
    waveform: 'sine',
    envelope: 'sharp',
    volume: 0.35,
  },

  // Notification Sounds
  notification: {
    frequencies: [880, 1100],
    durations: [0.1, 0.15],
    waveform: 'sine',
    envelope: 'soft',
    volume: 0.35,
  },
  message: {
    frequencies: [660, 880],
    durations: [0.08, 0.12],
    waveform: 'triangle',
    envelope: 'soft',
    volume: 0.3,
  },
  alert: {
    frequencies: [800, 600, 800, 600],
    durations: [0.1, 0.1, 0.1, 0.1],
    waveform: 'square',
    envelope: 'sharp',
    volume: 0.45,
    delay: 0.05,
  },

  // Combat Sounds
  attack: {
    frequencies: [150, 100, 80],
    durations: [0.05, 0.08, 0.12],
    waveform: 'sawtooth',
    envelope: 'sharp',
    volume: 0.5,
  },
  hit: {
    frequencies: [200, 120, 80],
    durations: [0.03, 0.05, 0.1],
    waveform: 'square',
    envelope: 'sharp',
    volume: 0.45,
  },
  heal: {
    frequencies: [440, 554, 659, 880],
    durations: [0.08, 0.08, 0.1, 0.2],
    waveform: 'sine',
    envelope: 'soft',
    volume: 0.4,
  },
  block: {
    frequencies: [300, 400, 500],
    durations: [0.02, 0.03, 0.05],
    waveform: 'square',
    envelope: 'sharp',
    volume: 0.4,
  },
  critical: {
    frequencies: [200, 400, 600, 800, 1000],
    durations: [0.03, 0.04, 0.05, 0.06, 0.15],
    waveform: 'sawtooth',
    envelope: 'pluck',
    volume: 0.55,
  },
};

class SFXGenerator {
  /**
   * Play a sound effect
   */
  play(type: SFXType): void {
    const ctx = soundEngine.getContext();
    const sfxGain = soundEngine.getSFXGain();
    if (!ctx || !sfxGain) return;

    const config = SFX_CONFIGS[type];
    if (!config) return;

    let currentTime = ctx.currentTime;

    config.frequencies.forEach((freq, index) => {
      const duration = config.durations[index] || 0.1;
      const delay = config.delay || 0;

      this.playTone(
        ctx,
        sfxGain,
        freq,
        currentTime,
        duration,
        config.waveform,
        config.envelope,
        config.volume
      );

      currentTime += duration + delay;
    });
  }

  /**
   * Play a single tone with envelope
   */
  private playTone(
    ctx: AudioContext,
    destination: AudioNode,
    frequency: number,
    startTime: number,
    duration: number,
    waveform: OscillatorType,
    envelope: 'sharp' | 'soft' | 'pluck' | 'sustained',
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.value = frequency;

    // Apply envelope
    switch (envelope) {
      case 'sharp':
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        break;
      case 'soft':
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.3);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        break;
      case 'pluck':
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(volume * 0.5, startTime + duration * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        break;
      case 'sustained':
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.1);
        gain.gain.setValueAtTime(volume * 0.8, startTime + duration * 0.8);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        break;
    }

    osc.connect(gain);
    gain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  /**
   * Play UI click sound with slight randomization
   */
  playClick(): void {
    this.play('click');
  }

  /**
   * Play coin collection with pitch variation
   */
  playCoin(pitch: number = 1): void {
    const ctx = soundEngine.getContext();
    const sfxGain = soundEngine.getSFXGain();
    if (!ctx || !sfxGain) return;

    const baseFreqs = [1200 * pitch, 1400 * pitch, 1800 * pitch];
    let time = ctx.currentTime;

    baseFreqs.forEach((freq, i) => {
      this.playTone(ctx, sfxGain, freq, time, 0.04 + (i * 0.02), 'sine', 'sharp', 0.35);
      time += 0.04;
    });
  }
}

export const sfxGenerator = new SFXGenerator();
export default SFXGenerator;
