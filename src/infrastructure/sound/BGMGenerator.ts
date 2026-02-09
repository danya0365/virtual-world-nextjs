/**
 * BGM Generator - Procedural Background Music Generation
 * Creates looping background music tracks using Web Audio API
 */

import { soundEngine } from './SoundEngine';

// Musical notes in Hz
const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
};

// Chord progressions for different moods
const PROGRESSIONS = {
  peaceful: [
    ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']
  ],
  adventurous: [
    ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']
  ],
  energetic: [
    ['E4', 'G4', 'B4'], ['A3', 'C4', 'E4'], ['D4', 'F4', 'A4'], ['G3', 'B3', 'D4']
  ],
  intense: [
    ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'G3', 'B3'], ['A3', 'C4', 'E4']
  ],
  cheerful: [
    ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']
  ],
  calm: [
    ['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['A3', 'C4', 'E4'], ['G3', 'B3', 'D4']
  ],
  social: [
    ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['D3', 'F3', 'A3']
  ],
};

// Melody patterns (intervals from root)
const MELODIES = {
  peaceful: [0, 2, 4, 2, 0, -1, 0, 2],
  adventurous: [0, 4, 7, 4, 5, 7, 4, 0],
  energetic: [0, 4, 7, 12, 7, 4, 5, 4],
  intense: [0, 3, 7, 10, 7, 3, 5, 7],
  cheerful: [0, 2, 4, 5, 4, 2, 4, 0],
  calm: [0, 4, 7, 4, 2, 0, 2, 4],
  social: [0, 2, 4, 7, 5, 4, 2, 0],
};

export type BGMTrack = 'menu' | 'explore' | 'games' | 'battle' | 'shop' | 'peaceful' | 'social';

interface BGMConfig {
  progression: string[][];
  melody: number[];
  tempo: number;
  waveform: OscillatorType;
  padWaveform: OscillatorType;
  bassWaveform: OscillatorType;
}

const TRACK_CONFIGS: Record<BGMTrack, BGMConfig> = {
  menu: {
    progression: PROGRESSIONS.calm,
    melody: MELODIES.calm,
    tempo: 70,
    waveform: 'sine',
    padWaveform: 'sine',
    bassWaveform: 'sine',
  },
  explore: {
    progression: PROGRESSIONS.adventurous,
    melody: MELODIES.adventurous,
    tempo: 100,
    waveform: 'triangle',
    padWaveform: 'sine',
    bassWaveform: 'triangle',
  },
  games: {
    progression: PROGRESSIONS.energetic,
    melody: MELODIES.energetic,
    tempo: 120,
    waveform: 'square',
    padWaveform: 'sawtooth',
    bassWaveform: 'square',
  },
  battle: {
    progression: PROGRESSIONS.intense,
    melody: MELODIES.intense,
    tempo: 140,
    waveform: 'sawtooth',
    padWaveform: 'square',
    bassWaveform: 'sawtooth',
  },
  shop: {
    progression: PROGRESSIONS.cheerful,
    melody: MELODIES.cheerful,
    tempo: 95,
    waveform: 'triangle',
    padWaveform: 'sine',
    bassWaveform: 'triangle',
  },
  peaceful: {
    progression: PROGRESSIONS.peaceful,
    melody: MELODIES.peaceful,
    tempo: 60,
    waveform: 'sine',
    padWaveform: 'sine',
    bassWaveform: 'sine',
  },
  social: {
    progression: PROGRESSIONS.social,
    melody: MELODIES.social,
    tempo: 85,
    waveform: 'triangle',
    padWaveform: 'sine',
    bassWaveform: 'triangle',
  },
};

class BGMGenerator {
  private currentTrack: BGMTrack | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private loopTimeout: NodeJS.Timeout | null = null;
  private fadeGain: GainNode | null = null;

  /**
   * Start playing a BGM track
   */
  play(track: BGMTrack): void {
    if (this.currentTrack === track && this.isPlaying) return;
    
    // Crossfade if already playing
    if (this.isPlaying) {
      this.crossfadeTo(track);
      return;
    }

    this.currentTrack = track;
    this.startTrack(track);
  }

  /**
   * Stop playing BGM with fade out
   */
  stop(): void {
    if (!this.isPlaying) return;
    
    const ctx = soundEngine.getContext();
    if (ctx && this.fadeGain) {
      this.fadeGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => this.cleanup(), 1000);
    } else {
      this.cleanup();
    }
    
    this.isPlaying = false;
    this.currentTrack = null;
  }

  /**
   * Crossfade to a new track
   */
  private crossfadeTo(newTrack: BGMTrack): void {
    const ctx = soundEngine.getContext();
    if (!ctx || !this.fadeGain) return;

    // Fade out current
    this.fadeGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    
    setTimeout(() => {
      this.cleanup();
      this.currentTrack = newTrack;
      this.startTrack(newTrack);
    }, 500);
  }

  /**
   * Start a track with loop
   */
  private startTrack(track: BGMTrack): void {
    const ctx = soundEngine.getContext();
    const bgmGain = soundEngine.getBGMGain();
    if (!ctx || !bgmGain) return;

    this.isPlaying = true;
    const config = TRACK_CONFIGS[track];

    // Create fade gain for this track
    this.fadeGain = ctx.createGain();
    this.fadeGain.gain.value = 0;
    this.fadeGain.connect(bgmGain);

    // Fade in
    this.fadeGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);

    // Start the music loop
    this.playLoop(config);
  }

  /**
   * Play one loop of the track
   */
  private playLoop(config: BGMConfig): void {
    const ctx = soundEngine.getContext();
    if (!ctx || !this.fadeGain || !this.isPlaying) return;

    const beatDuration = 60 / config.tempo;
    const barDuration = beatDuration * 4;
    let time = ctx.currentTime;

    // Play each bar (chord progression)
    config.progression.forEach((chord, barIndex) => {
      const barStart = time + (barIndex * barDuration);
      
      // Play pad (sustained chord)
      this.playPad(chord, barStart, barDuration * 0.95, config.padWaveform);
      
      // Play bass (root note)
      this.playBass(chord[0], barStart, barDuration, config.bassWaveform);
      
      // Play melody notes
      const melodyPerBar = 2;
      for (let i = 0; i < melodyPerBar; i++) {
        const noteIndex = (barIndex * melodyPerBar + i) % config.melody.length;
        const interval = config.melody[noteIndex];
        const rootFreq = NOTES[chord[0]] || 261.63;
        const melodyFreq = rootFreq * Math.pow(2, interval / 12);
        const noteStart = barStart + (i * beatDuration * 2);
        this.playMelodyNote(melodyFreq, noteStart, beatDuration * 1.5, config.waveform);
      }
    });

    // Schedule next loop
    const loopDuration = barDuration * config.progression.length;
    this.loopTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.playLoop(config);
      }
    }, loopDuration * 1000);
  }

  /**
   * Play a sustained pad chord
   */
  private playPad(notes: string[], startTime: number, duration: number, waveform: OscillatorType): void {
    const ctx = soundEngine.getContext();
    if (!ctx || !this.fadeGain) return;

    notes.forEach((note) => {
      const freq = NOTES[note];
      if (!freq) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.05, startTime + duration * 0.5);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.connect(gain);
      gain.connect(this.fadeGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });
  }

  /**
   * Play a bass note
   */
  private playBass(note: string, startTime: number, duration: number, waveform: OscillatorType): void {
    const ctx = soundEngine.getContext();
    if (!ctx || !this.fadeGain) return;

    const freq = NOTES[note];
    if (!freq) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.value = freq / 2; // One octave lower

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.1, startTime + duration * 0.3);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * Play a melody note
   */
  private playMelodyNote(freq: number, startTime: number, duration: number, waveform: OscillatorType): void {
    const ctx = soundEngine.getContext();
    if (!ctx || !this.fadeGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.value = freq;

    // ADSR envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02); // Attack
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1); // Decay
    gain.gain.linearRampToValueAtTime(0.1, startTime + duration * 0.7); // Sustain
    gain.gain.linearRampToValueAtTime(0, startTime + duration); // Release

    osc.connect(gain);
    gain.connect(this.fadeGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * Cleanup all oscillators and nodes
   */
  private cleanup(): void {
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }

    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch { /* ignore */ }
      try { osc.disconnect(); } catch { /* ignore */ }
    });

    this.gainNodes.forEach(gain => {
      try { gain.disconnect(); } catch { /* ignore */ }
    });

    if (this.fadeGain) {
      try { this.fadeGain.disconnect(); } catch { /* ignore */ }
      this.fadeGain = null;
    }

    this.oscillators = [];
    this.gainNodes = [];
  }

  getCurrentTrack(): BGMTrack | null {
    return this.currentTrack;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const bgmGenerator = new BGMGenerator();
export default BGMGenerator;
