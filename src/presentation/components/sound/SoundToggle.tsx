'use client';

/**
 * Sound Toggle - Quick mute button for header
 */

import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { useSoundStore } from '@/src/stores/soundStore';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useSoundContext } from './SoundProvider';
import SoundSettings from './SoundSettings';

export function SoundToggle() {
  const { isInitialized, initializeSound } = useSoundContext();
  const { isMasterMuted, toggleMasterMute, isBGMEnabled } = useSoundStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleClick = () => {
    if (!isInitialized) {
      initializeSound();
      return;
    }
    toggleMasterMute();
    if (isMasterMuted) {
      sfxGenerator.play('toggle');
    }
  };

  const handleOpenSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings(true);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Quick Mute Toggle */}
        <button
          onClick={handleClick}
          className={`p-2 rounded-xl transition-all
            ${isMasterMuted || !isInitialized
              ? 'bg-red-500/20 text-red-500' 
              : 'hover:bg-[hsl(var(--color-surface))]'
            }`}
          title={isMasterMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
        >
          {isMasterMuted || !isInitialized ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={handleOpenSettings}
          className={`p-2 rounded-xl transition-all hover:bg-[hsl(var(--color-surface))]
            ${isBGMEnabled ? 'text-purple-500' : ''}`}
          title="ตั้งค่าเสียง"
        >
          <Music className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      <SoundSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}

// Compact version for mobile
export function SoundToggleCompact() {
  const { isInitialized, initializeSound } = useSoundContext();
  const { isMasterMuted, toggleMasterMute } = useSoundStore();

  const handleClick = () => {
    if (!isInitialized) {
      initializeSound();
      return;
    }
    toggleMasterMute();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-xl transition-all
        ${isMasterMuted || !isInitialized
          ? 'bg-red-500/20 text-red-500' 
          : 'hover:bg-[hsl(var(--color-surface))]'
        }`}
      title={isMasterMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {isMasterMuted || !isInitialized ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}

export default SoundToggle;
