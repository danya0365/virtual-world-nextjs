'use client';

import { CHARACTER_COLORS } from '@/src/infrastructure/repositories/mock/MockCharacterRepository';
import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { animated, config, useSpring } from '@react-spring/web';
import {
    ChevronRight,
    Coins,
    Edit,
    Gem,
    Heart,
    Palette,
    Shirt,
    Sparkles,
    Star,
    Trophy,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
  { id: '1', name: 'หมวกนักสำรวจ', icon: '🎩', rarity: 'rare' },
  { id: '2', name: 'ดาบไม้', icon: '⚔️', rarity: 'common' },
  { id: '3', name: 'โล่มังกร', icon: '🛡️', rarity: 'epic' },
  { id: '4', name: 'พายุลม', icon: '🌪️', rarity: 'legendary' },
  { id: '5', name: 'ปีกนางฟ้า', icon: '🪽', rarity: 'epic' },
  { id: '6', name: 'คทาเวทมนตร์', icon: '✨', rarity: 'rare' },
];

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

export function CharacterView() {
  const [character, setCharacter] = useState(CHARACTER_DATA);
  const [selectedColor, setSelectedColor] = useState(character.bodyColor);
  const [isCharacterRotating, setIsCharacterRotating] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  // Character rotation animation
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

        <Link href="/character/create">
          <AnimatedButton variant="primary" icon={<Edit className="w-4 h-4" />}>
            แก้ไขโปรไฟล์
          </AnimatedButton>
        </Link>
      </animated.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Character Preview */}
        <div className="lg:col-span-5">
          <AnimatedCard delay={100} variant="gradient" className="h-full min-h-[450px] p-6">
            <div className="h-full flex flex-col items-center justify-center">
              {/* 3D Character Preview */}
              <div className="relative mb-4">
                <animated.div 
                  style={characterSpring}
                  className="relative w-48 h-56"
                >
                  {/* Character Body */}
                  <div 
                    className="relative w-full h-full"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(100, 100, 200, 0.3))',
                    }}
                  >
                    {/* Head */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 rounded-3xl shadow-lg"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    >
                      <div className="absolute top-12 left-6 w-3 h-3 rounded-full bg-gray-800" />
                      <div className="absolute top-12 right-6 w-3 h-3 rounded-full bg-gray-800" />
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gray-600" />
                    </div>

                    {/* Body */}
                    <div 
                      className="absolute top-24 left-1/2 -translate-x-1/2 w-24 h-28 rounded-3xl shadow-lg"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    />

                    {/* Arms */}
                    <div 
                      className="absolute top-28 left-2 w-4 h-16 rounded-full shadow-md"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    />
                    <div 
                      className="absolute top-28 right-2 w-4 h-16 rounded-full shadow-md"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    />

                    {/* Legs */}
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-[130%] w-6 h-12 rounded-xl shadow-md"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    />
                    <div 
                      className="absolute bottom-0 left-1/2 translate-x-[30%] w-6 h-12 rounded-xl shadow-md"
                      style={{
                        background: CHARACTER_COLORS.find(c => c.id === selectedColor)?.color || '#e8e8f0',
                      }}
                    />
                  </div>

                  {/* Sparkles */}
                  <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-yellow-400 animate-pulse" />
                </animated.div>
              </div>

              {/* Rotation Controls */}
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

              {/* Color Selection */}
              <div className="flex items-center gap-4">
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

          {/* Inventory */}
          <AnimatedCard delay={700} variant="glass" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[hsl(var(--color-text-primary))] flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                กระเป๋าไอเท็ม
              </h3>
              <Link href="/inventory" className="text-sm text-[hsl(var(--color-primary))] flex items-center gap-1 hover:underline">
                ดูทั้งหมด <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {INVENTORY_ITEMS.map((item) => (
                <div 
                  key={item.id}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center
                            bg-gradient-to-br ${rarityColors[item.rarity as keyof typeof rarityColors]}/20
                            border border-white/10 hover:scale-105 transition-transform cursor-pointer`}
                  title={item.name}
                >
                  <span className="text-2xl">{item.icon}</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
