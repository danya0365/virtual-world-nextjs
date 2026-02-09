'use client';

import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Check,
    Compass,
    Gift,
    Lock,
    Sparkles,
    Sword,
    Trophy,
    Users
} from 'lucide-react';
import { useState } from 'react';

type AchievementCategory = 'explorer' | 'social' | 'collector' | 'combat' | 'special';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  reward: { coins?: number; gems?: number; experience?: number; title?: string };
  isSecret?: boolean;
}

// Mock data
const MOCK_ACHIEVEMENTS: Achievement[] = [
  // Explorer
  { id: 'exp-001', name: 'นักสำรวจ', description: 'เข้าเยี่ยมชม 5 โลกที่แตกต่างกัน', icon: '🗺️', category: 'explorer', progress: 3, maxProgress: 5, isCompleted: false, reward: { coins: 100, experience: 50 } },
  { id: 'exp-002', name: 'นักเดินทาง', description: 'เดินทางรวม 10,000 ก้าว', icon: '👣', category: 'explorer', progress: 10000, maxProgress: 10000, isCompleted: true, reward: { coins: 200, title: 'นักเดินทาง' } },
  { id: 'exp-003', name: 'ผู้พิชิตถ้ำ', description: 'สำรวจถ้ำคริสตัลจนครบ', icon: '💎', category: 'explorer', progress: 2, maxProgress: 3, isCompleted: false, reward: { gems: 10, experience: 100 } },
  
  // Social
  { id: 'soc-001', name: 'มิตรภาพแรก', description: 'เพิ่มเพื่อนคนแรก', icon: '🤝', category: 'social', progress: 1, maxProgress: 1, isCompleted: true, reward: { coins: 50 } },
  { id: 'soc-002', name: 'สังคมนิยม', description: 'มีเพื่อน 10 คน', icon: '👥', category: 'social', progress: 8, maxProgress: 10, isCompleted: false, reward: { coins: 200, title: 'สังคมนิยม' } },
  { id: 'soc-003', name: 'ผู้นำกิลด์', description: 'สร้างหรือเข้าร่วมกิลด์', icon: '⚔️', category: 'social', progress: 1, maxProgress: 1, isCompleted: true, reward: { gems: 5 } },
  { id: 'soc-004', name: 'นักแชท', description: 'ส่งข้อความ 100 ครั้ง', icon: '💬', category: 'social', progress: 45, maxProgress: 100, isCompleted: false, reward: { experience: 100 } },

  // Collector
  { id: 'col-001', name: 'นักสะสมมือใหม่', description: 'สะสมไอเท็ม 10 ชิ้น', icon: '📦', category: 'collector', progress: 10, maxProgress: 10, isCompleted: true, reward: { coins: 100 } },
  { id: 'col-002', name: 'คลังสมบัติ', description: 'สะสมเหรียญ 1,000 เหรียญ', icon: '💰', category: 'collector', progress: 163, maxProgress: 1000, isCompleted: false, reward: { gems: 20 } },
  { id: 'col-003', name: 'ตำนานหายาก', description: 'ได้รับไอเท็ม Legendary', icon: '✨', category: 'collector', progress: 0, maxProgress: 1, isCompleted: false, reward: { title: 'ตำนาน', experience: 500 } },

  // Combat
  { id: 'com-001', name: 'ชัยชนะแรก', description: 'ชนะการต่อสู้ครั้งแรก', icon: '🏆', category: 'combat', progress: 1, maxProgress: 1, isCompleted: true, reward: { coins: 50 } },
  { id: 'com-002', name: 'นักรบกล้าหาญ', description: 'ชนะ 50 ครั้ง', icon: '⚔️', category: 'combat', progress: 23, maxProgress: 50, isCompleted: false, reward: { gems: 15, title: 'นักรบ' } },
  { id: 'com-003', name: 'ผู้พิชิตบอส', description: 'เอาชนะบอสตัวแรก', icon: '🐲', category: 'combat', progress: 0, maxProgress: 1, isCompleted: false, reward: { gems: 25, experience: 200 } },

  // Special
  { id: 'spe-001', name: 'ครบรอบ 1 สัปดาห์', description: 'เล่นติดต่อกัน 7 วัน', icon: '📅', category: 'special', progress: 4, maxProgress: 7, isCompleted: false, reward: { gems: 10 } },
  { id: 'spe-002', name: '???', description: 'ความลับ...', icon: '❓', category: 'special', progress: 0, maxProgress: 1, isCompleted: false, isSecret: true, reward: { title: 'ผู้รู้ความลับ' } },
];

const categoryInfo: Record<AchievementCategory, { name: string; icon: React.ReactNode; color: string }> = {
  explorer: { name: 'นักสำรวจ', icon: <Compass className="w-5 h-5" />, color: 'from-green-400 to-green-600' },
  social: { name: 'สังคม', icon: <Users className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
  collector: { name: 'นักสะสม', icon: <Gift className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500' },
  combat: { name: 'การต่อสู้', icon: <Sword className="w-5 h-5" />, color: 'from-red-400 to-red-600' },
  special: { name: 'พิเศษ', icon: <Sparkles className="w-5 h-5" />, color: 'from-purple-400 to-purple-600' },
};

export function AchievementsView() {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  // Animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredAchievements = selectedCategory === 'all'
    ? MOCK_ACHIEVEMENTS
    : MOCK_ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  const completedCount = MOCK_ACHIEVEMENTS.filter(a => a.isCompleted).length;
  const percentage = Math.round((completedCount / MOCK_ACHIEVEMENTS.length) * 100);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">ความสำเร็จ</span>
            <Trophy className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            {completedCount}/{MOCK_ACHIEVEMENTS.length} สำเร็จ ({percentage}%)
          </p>
        </div>

        {/* Progress Ring */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="hsl(var(--color-primary) / 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="hsl(var(--color-primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[hsl(var(--color-primary))]">{percentage}%</span>
          </div>
        </div>
      </animated.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
            ${selectedCategory === 'all'
              ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
              : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
            }`}
        >
          ทั้งหมด
        </button>
        {(Object.keys(categoryInfo) as AchievementCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${selectedCategory === cat
                ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
              }`}
          >
            {categoryInfo[cat].icon}
            {categoryInfo[cat].name}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <AchievementCard key={achievement.id} achievement={achievement} delay={index * 50} />
        ))}
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  delay: number;
}

function AchievementCard({ achievement, delay }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay,
    config: config.gentle,
  });

  const hoverSpring = useSpring({
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    config: config.wobbly,
  });

  const progressPercentage = Math.round((achievement.progress / achievement.maxProgress) * 100);
  const catInfo = categoryInfo[achievement.category];

  return (
    <animated.div style={{ ...spring, ...hoverSpring }}>
      <GlassPanel
        className={`p-4 cursor-pointer transition-all duration-200
          ${achievement.isCompleted ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' : ''}
          ${achievement.isSecret && !achievement.isCompleted ? 'opacity-60' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                        bg-gradient-to-br ${catInfo.color}
                        ${achievement.isCompleted ? 'shadow-lg' : 'opacity-80'}`}>
            {achievement.isSecret && !achievement.isCompleted ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              achievement.icon
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[hsl(var(--color-text-primary))]">
                {achievement.name}
              </h3>
              {achievement.isCompleted && (
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
            </div>

            <p className="text-sm text-[hsl(var(--color-text-muted))] mb-3">
              {achievement.isSecret && !achievement.isCompleted
                ? 'ปลดล็อคเพื่อเปิดเผยเงื่อนไข'
                : achievement.description}
            </p>

            {/* Progress */}
            {!achievement.isSecret && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[hsl(var(--color-text-muted))] mb-1">
                  <span>{achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-2 bg-[hsl(var(--color-primary)/0.2)] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${catInfo.color} transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="flex flex-wrap gap-2">
              {achievement.reward.coins && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600">
                  💰 {achievement.reward.coins}
                </span>
              )}
              {achievement.reward.gems && (
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-600">
                  💎 {achievement.reward.gems}
                </span>
              )}
              {achievement.reward.experience && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600">
                  ⭐ {achievement.reward.experience} XP
                </span>
              )}
              {achievement.reward.title && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600">
                  🏷️ {achievement.reward.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassPanel>
    </animated.div>
  );
}
