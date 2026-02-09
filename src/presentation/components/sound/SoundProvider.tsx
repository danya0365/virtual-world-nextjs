'use client';

/**
 * Sound Provider - Manages sound initialization and route-based BGM
 */

import { bgmGenerator } from '@/src/infrastructure/sound/BGMGenerator';
import { soundEngine } from '@/src/infrastructure/sound/SoundEngine';
import { getBGMForRoute, useSoundStore } from '@/src/stores/soundStore';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface SoundContextType {
  isInitialized: boolean;
  initializeSound: () => Promise<void>;
}

const SoundContext = createContext<SoundContextType>({
  isInitialized: false,
  initializeSound: async () => {},
});

export function useSoundContext() {
  return useContext(SoundContext);
}

interface SoundProviderProps {
  children: React.ReactNode;
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');

  const {
    masterVolume,
    bgmVolume,
    sfxVolume,
    isMasterMuted,
    isBGMMuted,
    isBGMEnabled,
    setCurrentScene,
  } = useSoundStore();

  // Initialize sound engine on user interaction
  const initializeSound = useCallback(async () => {
    if (isInitialized) return;

    const success = await soundEngine.init();
    if (success) {
      await soundEngine.resume();
      setIsInitialized(true);

      // Apply stored volume settings
      soundEngine.setMasterVolume(isMasterMuted ? 0 : masterVolume);
      soundEngine.setBGMVolume(isBGMMuted ? 0 : bgmVolume);
      soundEngine.setSFXVolume(sfxVolume);

      // Start BGM if enabled
      if (isBGMEnabled && !isBGMMuted && !isMasterMuted) {
        const bgm = getBGMForRoute(pathname);
        bgmGenerator.play(bgm);
      }
    }
  }, [isInitialized, masterVolume, bgmVolume, sfxVolume, isMasterMuted, isBGMMuted, isBGMEnabled, pathname]);

  // Handle route changes - switch BGM
  useEffect(() => {
    if (!isInitialized || !isBGMEnabled || isBGMMuted || isMasterMuted) return;
    if (pathname === lastPathRef.current) return;

    lastPathRef.current = pathname;
    const bgm = getBGMForRoute(pathname);
    bgmGenerator.play(bgm);

    // Update current scene in store
    const sceneMatch = pathname.split('/')[1] || 'home';
    setCurrentScene(sceneMatch as Parameters<typeof setCurrentScene>[0]);
  }, [pathname, isInitialized, isBGMEnabled, isBGMMuted, isMasterMuted, setCurrentScene]);

  // Handle volume changes
  useEffect(() => {
    if (!isInitialized) return;
    soundEngine.setMasterVolume(isMasterMuted ? 0 : masterVolume);
  }, [isInitialized, masterVolume, isMasterMuted]);

  useEffect(() => {
    if (!isInitialized) return;
    soundEngine.setBGMVolume(isBGMMuted ? 0 : bgmVolume);
  }, [isInitialized, bgmVolume, isBGMMuted]);

  useEffect(() => {
    if (!isInitialized) return;
    soundEngine.setSFXVolume(sfxVolume);
  }, [isInitialized, sfxVolume]);

  // Handle BGM enable/disable
  useEffect(() => {
    if (!isInitialized) return;

    if (isBGMEnabled && !isBGMMuted && !isMasterMuted) {
      const bgm = getBGMForRoute(pathname);
      bgmGenerator.play(bgm);
    } else {
      bgmGenerator.stop();
    }
  }, [isInitialized, isBGMEnabled, isBGMMuted, isMasterMuted, pathname]);

  // Add click listener to initialize on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!isInitialized) {
        initializeSound();
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isInitialized, initializeSound]);

  return (
    <SoundContext.Provider value={{ isInitialized, initializeSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export default SoundProvider;
