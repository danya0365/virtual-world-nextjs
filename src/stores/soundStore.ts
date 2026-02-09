/**
 * Sound Store - Zustand store for sound settings
 * Manages volume, mute states, and scene-to-BGM mapping
 */

import { BGMTrack } from '@/src/infrastructure/sound/BGMGenerator';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Scene types based on routes
type SceneType = 
  | 'home' | 'explore' | 'games' | 'friends' | 'character'
  | 'shop' | 'inventory' | 'chat' | 'achievements' | 'daily'
  | 'events' | 'quests' | 'house' | 'party' | 'leaderboard'
  | 'trading' | 'guilds' | 'map' | 'vip' | 'profile' | 'battle' | 'default';

// Default scene to BGM mapping
const DEFAULT_SCENE_BGM: Record<SceneType, BGMTrack> = {
  home: 'menu',
  explore: 'explore',
  games: 'games',
  friends: 'social',
  character: 'peaceful',
  shop: 'shop',
  inventory: 'peaceful',
  chat: 'social',
  achievements: 'peaceful',
  daily: 'cheerful' as BGMTrack,
  events: 'explore',
  quests: 'adventurous' as BGMTrack,
  house: 'peaceful',
  party: 'social',
  leaderboard: 'games',
  trading: 'shop',
  guilds: 'social',
  map: 'explore',
  vip: 'shop',
  profile: 'peaceful',
  battle: 'battle',
  default: 'menu',
};

interface SoundState {
  // Volume settings (0-1)
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;

  // Mute states
  isMasterMuted: boolean;
  isBGMMuted: boolean;
  isSFXMuted: boolean;

  // BGM settings
  isBGMEnabled: boolean;
  currentScene: SceneType;
  sceneBGMMapping: Record<SceneType, BGMTrack>;

  // Actions
  setMasterVolume: (volume: number) => void;
  setBGMVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  toggleMasterMute: () => void;
  toggleBGMMute: () => void;
  toggleSFXMute: () => void;
  toggleBGM: () => void;
  setCurrentScene: (scene: SceneType) => void;
  setSceneBGM: (scene: SceneType, bgm: BGMTrack) => void;
  resetToDefaults: () => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      // Initial values
      masterVolume: 0.7,
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      isMasterMuted: false,
      isBGMMuted: false,
      isSFXMuted: false,
      isBGMEnabled: true,
      currentScene: 'home',
      sceneBGMMapping: { ...DEFAULT_SCENE_BGM },

      // Volume setters
      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
      setBGMVolume: (volume) => set({ bgmVolume: Math.max(0, Math.min(1, volume)) }),
      setSFXVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),

      // Mute toggles
      toggleMasterMute: () => set((state) => ({ isMasterMuted: !state.isMasterMuted })),
      toggleBGMMute: () => set((state) => ({ isBGMMuted: !state.isBGMMuted })),
      toggleSFXMute: () => set((state) => ({ isSFXMuted: !state.isSFXMuted })),
      toggleBGM: () => set((state) => ({ isBGMEnabled: !state.isBGMEnabled })),

      // Scene management
      setCurrentScene: (scene) => set({ currentScene: scene }),
      setSceneBGM: (scene, bgm) => set((state) => ({
        sceneBGMMapping: { ...state.sceneBGMMapping, [scene]: bgm }
      })),

      // Reset
      resetToDefaults: () => set({
        masterVolume: 0.7,
        bgmVolume: 0.5,
        sfxVolume: 0.8,
        isMasterMuted: false,
        isBGMMuted: false,
        isSFXMuted: false,
        isBGMEnabled: true,
        sceneBGMMapping: { ...DEFAULT_SCENE_BGM },
      }),
    }),
    {
      name: 'vw-sound-settings',
    }
  )
);

// Helper to get BGM for current route
export function getBGMForRoute(pathname: string): BGMTrack {
  const store = useSoundStore.getState();
  
  // Map pathname to scene
  const sceneMap: Record<string, SceneType> = {
    '/': 'home',
    '/explore': 'explore',
    '/games': 'games',
    '/friends': 'friends',
    '/character': 'character',
    '/shop': 'shop',
    '/inventory': 'inventory',
    '/chat': 'chat',
    '/achievements': 'achievements',
    '/daily': 'daily',
    '/events': 'events',
    '/quests': 'quests',
    '/house': 'house',
    '/party': 'party',
    '/leaderboard': 'leaderboard',
    '/trading': 'trading',
    '/guilds': 'guilds',
    '/map': 'map',
    '/vip': 'vip',
    '/profile': 'profile',
  };

  // Check for game routes
  if (pathname.startsWith('/games/battle')) {
    return store.sceneBGMMapping.battle;
  }
  if (pathname.startsWith('/games/')) {
    return store.sceneBGMMapping.games;
  }

  const scene = sceneMap[pathname] || 'default';
  return store.sceneBGMMapping[scene] || 'menu';
}

// Available BGM tracks for selection
export const AVAILABLE_BGM_TRACKS: { value: BGMTrack; label: string; icon: string }[] = [
  { value: 'menu', label: 'เมนูหลัก', icon: '🏠' },
  { value: 'explore', label: 'ผจญภัย', icon: '🗺️' },
  { value: 'games', label: 'เกม', icon: '🎮' },
  { value: 'battle', label: 'ต่อสู้', icon: '⚔️' },
  { value: 'shop', label: 'ร้านค้า', icon: '🛒' },
  { value: 'peaceful', label: 'สงบ', icon: '🌸' },
  { value: 'social', label: 'สังคม', icon: '👥' },
];

export { DEFAULT_SCENE_BGM };
export type { SceneType };

