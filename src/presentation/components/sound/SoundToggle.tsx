'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SoundState {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      isMuted: false,
      volume: 0.7,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'vw-sound-settings',
    }
  )
);

// Sound effect player
export function playSound(soundName: 'click' | 'success' | 'error' | 'notification' | 'coin') {
  const store = useSoundStore.getState();
  if (store.isMuted) return;

  // In a real app, you would play actual audio files here
  // For now, we'll use the Web Audio API to create simple tones
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = store.volume * 0.1;

    const soundConfigs: Record<string, { frequency: number; duration: number; type: OscillatorType }> = {
      click: { frequency: 800, duration: 0.05, type: 'sine' },
      success: { frequency: 600, duration: 0.15, type: 'sine' },
      error: { frequency: 200, duration: 0.2, type: 'square' },
      notification: { frequency: 440, duration: 0.1, type: 'sine' },
      coin: { frequency: 1200, duration: 0.1, type: 'sine' },
    };

    const config = soundConfigs[soundName] || soundConfigs.click;
    oscillator.frequency.value = config.frequency;
    oscillator.type = config.type;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);
  } catch {
    // Audio context not available
  }
}

// Sound Toggle Component
export function SoundToggle() {
  const { isMuted, toggleMute } = useSoundStore();

  const handleToggle = () => {
    toggleMute();
    if (!isMuted) {
      // Play a click sound when unmuting
      playSound('click');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl transition-all
        ${isMuted 
          ? 'bg-red-500/20 text-red-500' 
          : 'hover:bg-[hsl(var(--color-surface))]'
        }`}
      title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}

// Volume Slider Component
export function VolumeSlider() {
  const { volume, setVolume, isMuted } = useSoundStore();

  return (
    <div className="flex items-center gap-3 p-3 glass rounded-xl">
      <SoundToggle />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        disabled={isMuted}
        className="flex-1 h-2 rounded-full appearance-none bg-[hsl(var(--color-surface))]
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-4 
          [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-purple-500 
          [&::-webkit-slider-thumb]:cursor-pointer
          disabled:opacity-50"
      />
      <span className="text-sm font-medium w-8">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
