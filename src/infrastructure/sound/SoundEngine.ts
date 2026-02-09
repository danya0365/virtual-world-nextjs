/**
 * Sound Engine - Core audio engine using Web Audio API
 * Manages audio context, master volume, and audio routing
 */

type AudioContextType = typeof AudioContext;

class SoundEngine {
  private static instance: SoundEngine | null = null;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  /**
   * Initialize audio context - must be called after user interaction
   */
  async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      const AudioContextClass = window.AudioContext || 
        (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext;
      
      this.audioContext = new AudioContextClass();
      
      // Create gain nodes for volume control
      this.masterGain = this.audioContext.createGain();
      this.bgmGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();

      // Connect: BGM/SFX -> Master -> Destination
      this.bgmGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // Set default volumes
      this.masterGain.gain.value = 0.7;
      this.bgmGain.gain.value = 0.5;
      this.sfxGain.gain.value = 0.8;

      this.isInitialized = true;
      console.log('🎵 SoundEngine initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize SoundEngine:', error);
      return false;
    }
  }

  /**
   * Resume audio context if suspended (browser autoplay policy)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  getContext(): AudioContext | null {
    return this.audioContext;
  }

  getBGMGain(): GainNode | null {
    return this.bgmGain;
  }

  getSFXGain(): GainNode | null {
    return this.sfxGain;
  }

  getMasterGain(): GainNode | null {
    return this.masterGain;
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext?.currentTime || 0
      );
    }
  }

  setBGMVolume(volume: number): void {
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext?.currentTime || 0
      );
    }
  }

  setSFXVolume(volume: number): void {
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext?.currentTime || 0
      );
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.audioContext?.state === 'running';
  }

  getCurrentTime(): number {
    return this.audioContext?.currentTime || 0;
  }
}

export const soundEngine = SoundEngine.getInstance();
export default SoundEngine;
