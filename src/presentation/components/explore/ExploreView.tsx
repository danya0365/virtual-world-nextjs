'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring, useTrail } from '@react-spring/web';
import { Globe, Lock, MapPin, Play, Sparkles, Star, Users } from 'lucide-react';
import { useState } from 'react';

interface WorldZone {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
  isLocked: boolean;
  requiredLevel: number;
  rewards: {
    coins: number;
    exp: number;
  };
}

const WORLD_ZONES: WorldZone[] = [
  {
    id: 'green-meadow',
    name: 'ทุ่งหญ้าเขียวขจี',
    description: 'โลกแห่งการเริ่มต้น สำหรับผู้เล่นใหม่',
    image: '🌿',
    difficulty: 'easy',
    players: 234,
    isLocked: false,
    requiredLevel: 1,
    rewards: { coins: 50, exp: 100 },
  },
  {
    id: 'crystal-cave',
    name: 'ถ้ำคริสตัล',
    description: 'สำรวจถ้ำลึกลับเต็มไปด้วยคริสตัลวิเศษ',
    image: '💎',
    difficulty: 'easy',
    players: 156,
    isLocked: false,
    requiredLevel: 3,
    rewards: { coins: 80, exp: 150 },
  },
  {
    id: 'mystic-forest',
    name: 'ป่ามหัศจรรย์',
    description: 'ป่าเวทมนตร์ เต็มไปด้วยสิ่งมีชีวิตลึกลับ',
    image: '🌲',
    difficulty: 'medium',
    players: 89,
    isLocked: false,
    requiredLevel: 5,
    rewards: { coins: 120, exp: 200 },
  },
  {
    id: 'sky-island',
    name: 'เกาะลอยฟ้า',
    description: 'เกาะลอยอยู่กลางท้องฟ้า วิวสวยมาก',
    image: '☁️',
    difficulty: 'medium',
    players: 67,
    isLocked: false,
    requiredLevel: 7,
    rewards: { coins: 150, exp: 250 },
  },
  {
    id: 'volcano-land',
    name: 'ดินแดนภูเขาไฟ',
    description: 'ดินแดนร้อนระอุ ท้าทายความกล้า',
    image: '🌋',
    difficulty: 'hard',
    players: 45,
    isLocked: true,
    requiredLevel: 10,
    rewards: { coins: 200, exp: 350 },
  },
  {
    id: 'ice-kingdom',
    name: 'อาณาจักรน้ำแข็ง',
    description: 'อาณาจักรหิมะที่หนาวเหน็บ',
    image: '❄️',
    difficulty: 'hard',
    players: 32,
    isLocked: true,
    requiredLevel: 15,
    rewards: { coins: 300, exp: 500 },
  },
];

const difficultyColors = {
  easy: 'from-green-400 to-emerald-500',
  medium: 'from-yellow-400 to-orange-500',
  hard: 'from-red-400 to-pink-500',
};

const difficultyLabels = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

export function ExploreView() {
  const [selectedZone, setSelectedZone] = useState<WorldZone | null>(null);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredZones = filter === 'all' 
    ? WORLD_ZONES 
    : WORLD_ZONES.filter(z => z.difficulty === filter);

  // Card trail animation
  const trail = useTrail(filteredZones.length, {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">สำรวจโลก</span>
            <Globe className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            เลือกโลกที่อยากไปผจญภัย
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {(['all', 'easy', 'medium', 'hard'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${filter === f 
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg' 
                  : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              {f === 'all' ? 'ทั้งหมด' : difficultyLabels[f]}
            </button>
          ))}
        </div>
      </animated.div>

      {/* World Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trail.map((style, index) => {
          const zone = filteredZones[index];
          return (
            <animated.div key={zone.id} style={style}>
              <WorldCard 
                zone={zone} 
                onClick={() => setSelectedZone(zone)}
                isSelected={selectedZone?.id === zone.id}
              />
            </animated.div>
          );
        })}
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <ZoneDetails 
          zone={selectedZone} 
          onClose={() => setSelectedZone(null)} 
        />
      )}
    </div>
  );
}

interface WorldCardProps {
  zone: WorldZone;
  onClick: () => void;
  isSelected: boolean;
}

function WorldCard({ zone, onClick, isSelected }: WorldCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0px)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(100, 100, 200, 0.2)' 
      : '0 10px 30px rgba(100, 100, 200, 0.1)',
    config: config.wobbly,
  });

  return (
    <animated.div
      style={spring}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass rounded-2xl overflow-hidden cursor-pointer transition-colors duration-200
        ${isSelected ? 'ring-2 ring-[hsl(var(--color-primary))]' : ''}
        ${zone.isLocked ? 'opacity-70' : ''}`}
    >
      {/* Zone Image */}
      <div className={`h-32 flex items-center justify-center text-6xl
                      bg-gradient-to-br ${difficultyColors[zone.difficulty]}/20`}>
        {zone.image}
        {zone.isLocked && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
        )}
      </div>

      {/* Zone Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-[hsl(var(--color-text-primary))]">
            {zone.name}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white
                          bg-gradient-to-r ${difficultyColors[zone.difficulty]}`}>
            {difficultyLabels[zone.difficulty]}
          </span>
        </div>

        <p className="text-sm text-[hsl(var(--color-text-muted))] mb-3">
          {zone.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-[hsl(var(--color-text-secondary))]">
            <Users className="w-4 h-4" />
            <span>{zone.players}</span>
          </div>

          {zone.isLocked ? (
            <div className="flex items-center gap-1 text-[hsl(var(--color-warning))]">
              <Lock className="w-4 h-4" />
              <span>Level {zone.requiredLevel}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[hsl(var(--color-success))]">
              <Play className="w-4 h-4" />
              <span>เล่นได้</span>
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
}

interface ZoneDetailsProps {
  zone: WorldZone;
  onClose: () => void;
}

function ZoneDetails({ zone, onClose }: ZoneDetailsProps) {
  const spring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <animated.div style={spring}>
      <GlassPanel className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Zone Icon */}
          <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-6xl
                          bg-gradient-to-br ${difficultyColors[zone.difficulty]}/20 shrink-0`}>
            {zone.image}
          </div>

          {/* Zone Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--color-text-primary))]">
                {zone.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white
                              bg-gradient-to-r ${difficultyColors[zone.difficulty]}`}>
                {difficultyLabels[zone.difficulty]}
              </span>
            </div>

            <p className="text-[hsl(var(--color-text-secondary))] mb-4">
              {zone.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="glass-subtle rounded-xl p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-[hsl(var(--color-primary))]" />
                <div className="text-lg font-bold">{zone.players}</div>
                <div className="text-xs text-[hsl(var(--color-text-muted))]">ผู้เล่น</div>
              </div>

              <div className="glass-subtle rounded-xl p-3 text-center">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <div className="text-lg font-bold">+{zone.rewards.coins}</div>
                <div className="text-xs text-[hsl(var(--color-text-muted))]">เหรียญ</div>
              </div>

              <div className="glass-subtle rounded-xl p-3 text-center">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-lg font-bold">+{zone.rewards.exp}</div>
                <div className="text-xs text-[hsl(var(--color-text-muted))]">EXP</div>
              </div>

              <div className="glass-subtle rounded-xl p-3 text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-pink-500" />
                <div className="text-lg font-bold">Lv.{zone.requiredLevel}</div>
                <div className="text-xs text-[hsl(var(--color-text-muted))]">ขั้นต่ำ</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {zone.isLocked ? (
                <AnimatedButton variant="ghost" size="md" disabled>
                  <Lock className="w-4 h-4 mr-2" />
                  ต้องการ Level {zone.requiredLevel}
                </AnimatedButton>
              ) : (
                <AnimatedButton variant="primary" size="lg" icon={<Play className="w-5 h-5" />}>
                  เข้าเล่น
                </AnimatedButton>
              )}
              <AnimatedButton variant="ghost" size="lg" onClick={onClose}>
                ปิด
              </AnimatedButton>
            </div>
          </div>
        </div>
      </GlassPanel>
    </animated.div>
  );
}
