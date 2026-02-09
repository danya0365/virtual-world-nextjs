'use client';

/**
 * Sound Settings Panel - Full audio control UI
 */

import { bgmGenerator, BGMTrack } from '@/src/infrastructure/sound/BGMGenerator';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import {
    AVAILABLE_BGM_TRACKS,
    SceneType,
    useSoundStore
} from '@/src/stores/soundStore';
import { animated, config, useSpring, useTransition } from '@react-spring/web';
import {
    Music,
    Music2,
    RefreshCw,
    Settings,
    Volume2,
    VolumeX,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useSoundContext } from './SoundProvider';

// Scene labels for settings
const SCENE_LABELS: Record<SceneType, { name: string; icon: string }> = {
  home: { name: 'หน้าแรก', icon: '🏠' },
  explore: { name: 'สำรวจ', icon: '🗺️' },
  games: { name: 'เกม', icon: '🎮' },
  friends: { name: 'เพื่อน', icon: '👥' },
  character: { name: 'ตัวละคร', icon: '👤' },
  shop: { name: 'ร้านค้า', icon: '🛒' },
  inventory: { name: 'กระเป๋า', icon: '🎒' },
  chat: { name: 'แชท', icon: '💬' },
  achievements: { name: 'ความสำเร็จ', icon: '🏆' },
  daily: { name: 'รางวัลรายวัน', icon: '🎁' },
  events: { name: 'อีเวนต์', icon: '🎉' },
  quests: { name: 'ภารกิจ', icon: '📜' },
  house: { name: 'บ้าน', icon: '🏡' },
  party: { name: 'ปาร์ตี้', icon: '🎈' },
  leaderboard: { name: 'อันดับ', icon: '📊' },
  trading: { name: 'ตลาด', icon: '💰' },
  guilds: { name: 'กิลด์', icon: '🛡️' },
  map: { name: 'แผนที่', icon: '🌍' },
  vip: { name: 'VIP', icon: '👑' },
  profile: { name: 'โปรไฟล์', icon: '📊' },
  battle: { name: 'ต่อสู้', icon: '⚔️' },
  default: { name: 'ค่าเริ่มต้น', icon: '⚙️' },
};

interface SoundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoundSettings({ isOpen, onClose }: SoundSettingsProps) {
  const { isInitialized, initializeSound } = useSoundContext();
  const [activeTab, setActiveTab] = useState<'volume' | 'scenes'>('volume');

  const {
    masterVolume,
    bgmVolume,
    sfxVolume,
    isMasterMuted,
    isBGMMuted,
    isSFXMuted,
    isBGMEnabled,
    sceneBGMMapping,
    setMasterVolume,
    setBGMVolume,
    setSFXVolume,
    toggleMasterMute,
    toggleBGMMute,
    toggleSFXMute,
    toggleBGM,
    setSceneBGM,
    resetToDefaults,
  } = useSoundStore();

  // Animation for panel
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateX(100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: config.stiff,
  });

  // Handle test sound
  const handleTestSound = () => {
    if (!isInitialized) {
      initializeSound();
      return;
    }
    sfxGenerator.play('success');
  };

  // Handle preview BGM
  const handlePreviewBGM = (track: BGMTrack) => {
    if (!isInitialized) {
      initializeSound();
      return;
    }
    bgmGenerator.play(track);
  };

  return transitions((style, show) =>
    show ? (
      <>
        {/* Backdrop */}
        <animated.div
          style={{ opacity: style.opacity }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />

        {/* Panel */}
        <animated.div
          style={style}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md glass z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 glass p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">ตั้งค่าเสียง</h2>
                <p className="text-xs text-[hsl(var(--color-text-muted))]">
                  {isInitialized ? '🔊 เสียงพร้อมใช้งาน' : '🔇 คลิกเพื่อเปิดเสียง'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Initialize Button */}
            {!isInitialized && (
              <button
                onClick={initializeSound}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                คลิกเพื่อเปิดใช้งานเสียง
              </button>
            )}

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('volume')}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition
                  ${activeTab === 'volume' ? 'bg-purple-500 text-white' : 'glass'}`}
              >
                <Volume2 className="w-4 h-4" />
                ระดับเสียง
              </button>
              <button
                onClick={() => setActiveTab('scenes')}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition
                  ${activeTab === 'scenes' ? 'bg-purple-500 text-white' : 'glass'}`}
              >
                <Music className="w-4 h-4" />
                เพลงแต่ละหน้า
              </button>
            </div>

            {/* Volume Tab */}
            {activeTab === 'volume' && (
              <div className="space-y-4">
                {/* Master Volume */}
                <VolumeControl
                  label="ระดับเสียงหลัก"
                  icon={<Volume2 className="w-5 h-5" />}
                  value={masterVolume}
                  onChange={(v) => { setMasterVolume(v); handleTestSound(); }}
                  isMuted={isMasterMuted}
                  onToggleMute={toggleMasterMute}
                  color="from-purple-500 to-pink-500"
                />

                {/* BGM Volume */}
                <VolumeControl
                  label="เพลงประกอบ (BGM)"
                  icon={<Music2 className="w-5 h-5" />}
                  value={bgmVolume}
                  onChange={setBGMVolume}
                  isMuted={isBGMMuted}
                  onToggleMute={toggleBGMMute}
                  color="from-blue-500 to-cyan-500"
                />

                {/* SFX Volume */}
                <VolumeControl
                  label="เสียงเอฟเฟกต์ (SFX)"
                  icon={<Volume2 className="w-5 h-5" />}
                  value={sfxVolume}
                  onChange={(v) => { setSFXVolume(v); handleTestSound(); }}
                  isMuted={isSFXMuted}
                  onToggleMute={toggleSFXMute}
                  color="from-green-500 to-emerald-500"
                />

                {/* BGM Toggle */}
                <div className="p-4 glass rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">เปิดเพลงประกอบ</span>
                    </div>
                    <button
                      onClick={toggleBGM}
                      className={`w-14 h-8 rounded-full transition-all ${
                        isBGMEnabled ? 'bg-purple-500' : 'bg-gray-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          isBGMEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Test Sounds */}
                <div className="p-4 glass rounded-2xl space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    🎵 ทดสอบเสียง
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['click', 'success', 'coin', 'notification', 'levelup', 'error'] as const).map((sfx) => (
                      <button
                        key={sfx}
                        onClick={() => sfxGenerator.play(sfx)}
                        className="py-2 px-3 glass rounded-xl text-sm hover:bg-purple-500/20 transition"
                      >
                        {sfx}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetToDefaults}
                  className="w-full p-3 glass rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  รีเซ็ตเป็นค่าเริ่มต้น
                </button>
              </div>
            )}

            {/* Scenes Tab */}
            {activeTab === 'scenes' && (
              <div className="space-y-3">
                <p className="text-sm text-[hsl(var(--color-text-muted))]">
                  เลือกเพลงประกอบสำหรับแต่ละหน้า
                </p>

                {Object.entries(SCENE_LABELS).map(([scene, { name, icon }]) => (
                  <div key={scene} className="p-4 glass rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <span className="font-medium">{name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={sceneBGMMapping[scene as SceneType]}
                          onChange={(e) => setSceneBGM(scene as SceneType, e.target.value as BGMTrack)}
                          className="px-3 py-2 rounded-xl bg-[hsl(var(--color-surface))] border-none outline-none text-sm"
                        >
                          {AVAILABLE_BGM_TRACKS.map((track) => (
                            <option key={track.value} value={track.value}>
                              {track.icon} {track.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handlePreviewBGM(sceneBGMMapping[scene as SceneType])}
                          className="p-2 rounded-xl bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition"
                          title="ทดสอบ"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </animated.div>
      </>
    ) : null
  );
}

// Volume Control Component
interface VolumeControlProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  color: string;
}

function VolumeControl({ label, icon, value, onChange, isMuted, onToggleMute, color }: VolumeControlProps) {
  const sliderSpring = useSpring({
    width: `${isMuted ? 0 : value * 100}%`,
    config: config.stiff,
  });

  return (
    <div className="p-4 glass rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl transition ${isMuted ? 'bg-red-500/20 text-red-500' : 'hover:bg-[hsl(var(--color-surface))]'}`}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative h-3 bg-[hsl(var(--color-surface))] rounded-full overflow-hidden">
        <animated.div
          style={sliderSpring}
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${color} rounded-full`}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isMuted}
        />
      </div>

      <div className="flex justify-between text-xs text-[hsl(var(--color-text-muted))]">
        <span>0%</span>
        <span className="font-bold">{Math.round(value * 100)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export default SoundSettings;
