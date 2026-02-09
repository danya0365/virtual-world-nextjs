'use client';

import { CHARACTER_COLORS } from '@/src/infrastructure/repositories/mock/MockCharacterRepository';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Box,
    ChevronRight,
    Coins,
    Edit,
    Gem,
    Heart,
    Layers,
    Palette,
    Shirt,
    Sparkles,
    Star,
    Trophy,
    User
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy, useState } from 'react';

// Lazy load 3D component to avoid SSR issues
const Character3D = lazy(() => 
  import('@/src/presentation/components/3d/Character3D').then(mod => ({ default: mod.Character3D }))
);

interface CharacterData {
  name: string;
  displayName: string;
  level: number;
  experience: number;
  maxExperience: number;
  coins: number;
  gems: number;
  stars: number;
  bodyColor: string;
  bio: string;
  joinedDate: string;
  achievements: number;
  friends: number;
}

const CHARACTER_DATA: CharacterData = {
  name: 'mike_vw',
  displayName: 'Mike',
  level: 7,
  experience: 650,
  maxExperience: 1000,
  coins: 163,
  gems: 12,
  stars: 3,
  bodyColor: 'white',
  bio: 'นักสำรวจโลกเสมือน ชอบผจญภัยและทำภารกิจ 🌟',
  joinedDate: '2024-01-15',
  achievements: 12,
  friends: 45,
};

const INVENTORY_ITEMS = [
  { id: '1', name: 'หมวกนักสำรวจ', icon: '🎩', rarity: 'rare', accessoryId: 'hat' },
  { id: '2', name: 'ดาบไม้', icon: '⚔️', rarity: 'common', accessoryId: null },
  { id: '3', name: 'มงกุฎทอง', icon: '👑', rarity: 'epic', accessoryId: 'crown' },
  { id: '4', name: 'ปีกนางฟ้า', icon: '🪽', rarity: 'legendary', accessoryId: 'wings' },
  { id: '5', name: 'ดาวเวทมนตร์', icon: '⭐', rarity: 'epic', accessoryId: 'star' },
  { id: '6', name: 'คทาเวทมนตร์', icon: '✨', rarity: 'rare', accessoryId: null },
];

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

type ViewMode = 'css' | '3d';

export function CharacterView() {
  const [character, setCharacter] = useState(CHARACTER_DATA);
  const [selectedColor, setSelectedColor] = useState(character.bodyColor);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('css');
  const [rotation, setRotation] = useState(0);

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  // Character rotation animation for CSS mode
  const characterSpring = useSpring({
    transform: `rotateY(${rotation}deg)`,
    config: { tension: 100, friction: 20 },
  });

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    setCharacter(prev => ({ ...prev, bodyColor: colorId }));
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -30 : 30));
  };

  const handleAccessoryClick = (accessoryId: string | null) => {
    setSelectedAccessory(prev => prev === accessoryId ? null : accessoryId);
  };

  const getColorValue = () => {
    return CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0';
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">ตัวละครของฉัน</span>
            <User className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            ปรับแต่งและดูสถิติตัวละคร
          </p>
        </div>

        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <GlassPanel padding="none" className="flex rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('css')}
              className={`px-4 py-2 flex items-center gap-2 transition-all duration-200
                ${viewMode === 'css' 
                  ? 'bg-[hsl(var(--color-primary))] text-white' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">CSS</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 flex items-center gap-2 transition-all duration-200
                ${viewMode === '3d' 
                  ? 'bg-[hsl(var(--color-primary))] text-white' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              <Box className="w-4 h-4" />
              <span className="text-sm font-medium">3D</span>
            </button>
          </GlassPanel>

          <Link href="/character/create">
            <AnimatedButton variant="primary" icon={<Edit className="w-4 h-4" />}>
              แก้ไขโปรไฟล์
            </AnimatedButton>
          </Link>
        </div>
      </animated.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Character Preview */}
        <div className="lg:col-span-5">
          <AnimatedCard delay={100} variant="gradient" className="h-full min-h-[450px] p-6">
            <div className="h-full flex flex-col items-center justify-center">
              {viewMode === '3d' ? (
                /* 3D Character Preview */
                <div className="w-full h-[280px] rounded-xl overflow-hidden">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[hsl(var(--color-primary))] border-t-transparent" />
                    </div>
                  }>
                    <Character3D 
                      bodyColor={getColorValue()}
                      eyeStyle="normal"
                      accessory={selectedAccessory}
                      autoRotate={true}
                    />
                  </Suspense>
                </div>
              ) : (
                /* CSS Character Preview */
                <>
                  <div className="relative mb-4">
                    <animated.div 
                      style={characterSpring}
                      className="relative w-48 h-56"
                    >
                      <div 
                        className="relative w-full h-full"
                        style={{
                          filter: 'drop-shadow(0 20px 40px rgba(100, 100, 200, 0.3))',
                        }}
                      >
                        {/* Accessory on top */}
                        {selectedAccessory === 'crown' && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl z-10">👑</div>
                        )}
                        {selectedAccessory === 'hat' && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl z-10">🎩</div>
                        )}
                        {selectedAccessory === 'star' && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl z-10">⭐</div>
                        )}

                        {/* Head */}
                        <div 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-3xl shadow-lg"
                          style={{ background: getColorValue() }}
                        >
                          <div className="absolute top-12 left-6 w-3 h-3 rounded-full bg-gray-800" />
                          <div className="absolute top-12 right-6 w-3 h-3 rounded-full bg-gray-800" />
                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gray-600" />
                        </div>

                        {/* Body */}
                        <div 
                          className="absolute top-24 left-1/2 -translate-x-1/2 w-24 h-28 rounded-3xl shadow-lg"
                          style={{ background: getColorValue() }}
                        />

                        {/* Wings */}
                        {selectedAccessory === 'wings' && (
                          <>
                            <div className="absolute top-20 -left-4 text-4xl opacity-80">🪽</div>
                            <div className="absolute top-20 -right-4 text-4xl opacity-80 scale-x-[-1]">🪽</div>
                          </>
                        )}

                        {/* Arms */}
                        <div 
                          className="absolute top-28 left-2 w-4 h-16 rounded-full shadow-md"
                          style={{ background: getColorValue() }}
                        />
                        <div 
                          className="absolute top-28 right-2 w-4 h-16 rounded-full shadow-md"
                          style={{ background: getColorValue() }}
                        />

                        {/* Legs */}
                        <div 
                          className="absolute bottom-0 left-1/2 -translate-x-[130%] w-6 h-12 rounded-xl shadow-md"
                          style={{ background: getColorValue() }}
                        />
                        <div 
                          className="absolute bottom-0 left-1/2 translate-x-[30%] w-6 h-12 rounded-xl shadow-md"
                          style={{ background: getColorValue() }}
                        />
                      </div>

                      <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-pulse" />
                    </animated.div>
                  </div>

                  {/* Rotation Controls for CSS mode */}
                  <div className="flex gap-4 mb-4">
                    <button 
                      onClick={() => handleRotate('left')}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors"
                    >
                      ◀
                    </button>
                    <button 
                      onClick={() => handleRotate('right')}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </>
              )}

              {/* Color Selection */}
              <div className="flex items-center gap-4 mt-4">
                <Palette className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
                <div className="flex gap-2">
                  {CHARACTER_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200
                        ${selectedColor === color.id 
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-transparent hover:scale-105'
                        }`}
                      style={{ background: color.color }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* 3D Mode Hint */}
              {viewMode === '3d' && (
                <p className="text-xs text-[hsl(var(--color-text-muted))] mt-4 text-center">
                  🖱️ ลาก/หมุน เพื่อดูรอบด้าน | Scroll เพื่อซูม
                </p>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Right - Stats */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Profile Info */}
          <AnimatedCard delay={200} variant="glass" className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 
                            flex items-center justify-center text-2xl shadow-lg">
                {character.displayName[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[hsl(var(--color-text-primary))]">
                  {character.displayName}
                </h2>
                <p className="text-sm text-[hsl(var(--color-text-muted))]">@{character.name}</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))] mt-1">{character.bio}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">Level {character.level}</span>
              </div>
            </div>

            {/* Experience Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[hsl(var(--color-text-muted))]">ประสบการณ์</span>
                <span className="text-[hsl(var(--color-text-secondary))]">
                  {character.experience}/{character.maxExperience}
                </span>
              </div>
              <div className="h-3 bg-[hsl(var(--color-surface))] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(character.experience / character.maxExperience) * 100}%` }}
                />
              </div>
            </div>
          </AnimatedCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnimatedCard delay={300} variant="glass" className="p-4 text-center">
              <Coins className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-xl font-bold">{character.coins}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">เหรียญ</div>
            </AnimatedCard>

            <AnimatedCard delay={400} variant="glass" className="p-4 text-center">
              <Gem className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <div className="text-xl font-bold">{character.gems}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">เพชร</div>
            </AnimatedCard>

            <AnimatedCard delay={500} variant="glass" className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-xl font-bold">{character.achievements}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">รางวัล</div>
            </AnimatedCard>

            <AnimatedCard delay={600} variant="glass" className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-xl font-bold">{character.friends}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">เพื่อน</div>
            </AnimatedCard>
          </div>

          {/* Inventory - Click to equip */}
          <AnimatedCard delay={700} variant="glass" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[hsl(var(--color-text-primary))] flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                กระเป๋าไอเท็ม
                <span className="text-xs text-[hsl(var(--color-text-muted))] font-normal">
                  (คลิกเพื่อสวมใส่)
                </span>
              </h3>
              <Link href="/inventory" className="text-sm text-[hsl(var(--color-primary))] flex items-center gap-1 hover:underline">
                ดูทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {INVENTORY_ITEMS.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => item.accessoryId && handleAccessoryClick(item.accessoryId)}
                  disabled={!item.accessoryId}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center
                            bg-gradient-to-br ${rarityColors[item.rarity as keyof typeof rarityColors]}/20
                            border-2 transition-all cursor-pointer
                            ${selectedAccessory === item.accessoryId 
                              ? 'border-[hsl(var(--color-primary))] scale-105 shadow-lg' 
                              : 'border-white/10 hover:scale-105'
                            }
                            ${!item.accessoryId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={item.name}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {selectedAccessory === item.accessoryId && (
                    <span className="text-[8px] mt-1 text-[hsl(var(--color-primary))]">สวมใส่</span>
                  )}
                </button>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
