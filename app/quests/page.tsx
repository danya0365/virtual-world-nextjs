'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { BookOpen, CheckCircle, ChevronRight, Clock, Gift, Map, ScrollText, Sparkles, Swords, Target } from 'lucide-react';
import { useState } from 'react';

// Quest types
type QuestCategory = 'daily' | 'story' | 'side';

interface Quest {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: QuestCategory;
  rewards: { type: 'coins' | 'xp' | 'item'; value: number | string }[];
  progress: number;
  total: number;
  completed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  chapter?: number;
  timeLimit?: string;
}

const DAILY_QUESTS: Quest[] = [
  { id: 1, name: 'นักผจญภัยหน้าใหม่', description: 'เล่นเกมมินิ 3 ครั้ง', icon: '🎮', category: 'daily', rewards: [{ type: 'coins', value: 100 }, { type: 'xp', value: 50 }], progress: 2, total: 3, completed: false, difficulty: 'easy' },
  { id: 2, name: 'สังคมนิยม', description: 'เพิ่มเพื่อนใหม่ 2 คน', icon: '👥', category: 'daily', rewards: [{ type: 'coins', value: 150 }], progress: 2, total: 2, completed: true, difficulty: 'easy' },
  { id: 3, name: 'นักสำรวจ', description: 'เยี่ยมชม 5 สถานที่ในโลก', icon: '🗺️', category: 'daily', rewards: [{ type: 'coins', value: 200 }, { type: 'xp', value: 100 }], progress: 3, total: 5, completed: false, difficulty: 'medium' },
  { id: 4, name: 'แชมป์เกม', description: 'ชนะการต่อสู้ 3 ครั้ง', icon: '⚔️', category: 'daily', rewards: [{ type: 'item', value: 'Mystery Box' }], progress: 1, total: 3, completed: false, difficulty: 'hard' },
];

const STORY_QUESTS: Quest[] = [
  { id: 101, name: 'Chapter 1: จุดเริ่มต้น', description: 'สร้างตัวละครของคุณและเรียนรู้พื้นฐาน', icon: '📖', category: 'story', rewards: [{ type: 'coins', value: 500 }, { type: 'item', value: 'Starter Pack' }], progress: 4, total: 4, completed: true, chapter: 1 },
  { id: 102, name: 'Chapter 2: ออกเดินทาง', description: 'สำรวจเมืองแรกและพบปะ NPC', icon: '🚶', category: 'story', rewards: [{ type: 'coins', value: 750 }, { type: 'xp', value: 300 }], progress: 2, total: 5, completed: false, chapter: 2 },
  { id: 103, name: 'Chapter 3: ความลับในป่า', description: 'ค้นพบความลับที่ซ่อนอยู่ในป่าลึก', icon: '🌲', category: 'story', rewards: [{ type: 'item', value: 'Forest Bow' }, { type: 'xp', value: 500 }], progress: 0, total: 6, completed: false, chapter: 3 },
  { id: 104, name: 'Chapter 4: ตำนานมังกร', description: 'เผชิญหน้ากับมังกรในตำนาน', icon: '🐉', category: 'story', rewards: [{ type: 'item', value: 'Dragon Scale Armor' }, { type: 'coins', value: 2000 }], progress: 0, total: 8, completed: false, chapter: 4 },
];

const SIDE_QUESTS: Quest[] = [
  { id: 201, name: 'ช่วยเหลือชาวบ้าน', description: 'รวบรวมสมุนไพร 10 ชนิดให้หมอหมู่บ้าน', icon: '🌿', category: 'side', rewards: [{ type: 'coins', value: 150 }], progress: 7, total: 10, completed: false },
  { id: 202, name: 'นักล่าสมบัติ', description: 'ค้นหากล่องสมบัติที่ซ่อนอยู่ 5 กล่อง', icon: '💰', category: 'side', rewards: [{ type: 'item', value: 'Treasure Map' }], progress: 2, total: 5, completed: false },
  { id: 203, name: 'เพื่อนสัตว์', description: 'ให้อาหารสัตว์ในฟาร์ม 20 ครั้ง', icon: '🐾', category: 'side', rewards: [{ type: 'item', value: 'Pet Companion' }, { type: 'xp', value: 200 }], progress: 20, total: 20, completed: true },
  { id: 204, name: 'ช่างภาพมือโปร', description: 'ถ่ายรูปสถานที่สวยงาม 10 แห่ง', icon: '📸', category: 'side', rewards: [{ type: 'coins', value: 300 }], progress: 4, total: 10, completed: false },
];

const CATEGORY_TABS = [
  { id: 'daily' as QuestCategory, name: 'รายวัน', icon: Target, color: 'text-orange-500' },
  { id: 'story' as QuestCategory, name: 'เนื้อเรื่อง', icon: BookOpen, color: 'text-purple-500' },
  { id: 'side' as QuestCategory, name: 'รอง', icon: Map, color: 'text-green-500' },
];

function DifficultyBadge({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) {
  const colors = {
    easy: 'bg-green-500/20 text-green-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    hard: 'bg-red-500/20 text-red-500',
  };
  const labels = { easy: 'ง่าย', medium: 'ปานกลาง', hard: 'ยาก' };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}

function QuestCard({ quest, onClaim }: { quest: Quest; onClaim: (id: number) => void }) {
  const progressPercent = (quest.progress / quest.total) * 100;
  
  return (
    <div
      className={`glass rounded-2xl p-4 transition-all hover:scale-[1.01] 
        ${quest.completed ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{quest.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-[hsl(var(--color-text-primary))]">{quest.name}</h3>
            {quest.difficulty && <DifficultyBadge difficulty={quest.difficulty} />}
            {quest.chapter && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500">
                บทที่ {quest.chapter}
              </span>
            )}
          </div>
          <p className="text-sm text-[hsl(var(--color-text-secondary))] mt-1">{quest.description}</p>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[hsl(var(--color-text-muted))]">ความคืบหน้า</span>
              <span className="font-medium">{quest.progress}/{quest.total}</span>
            </div>
            <div className="h-2 bg-[hsl(var(--color-surface-elevated))] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quest.completed ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Gift className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
            {quest.rewards.map((reward, i) => (
              <span key={i} className="px-2 py-1 bg-[hsl(var(--color-surface))] rounded-lg text-xs font-medium">
                {reward.type === 'coins' && `🪙 ${reward.value}`}
                {reward.type === 'xp' && `⭐ ${reward.value} XP`}
                {reward.type === 'item' && `🎁 ${reward.value}`}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {quest.completed ? (
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          ) : progressPercent === 100 ? (
            <button
              onClick={() => onClaim(quest.id)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              รับรางวัล
            </button>
          ) : (
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:scale-105 active:scale-95 transition-transform flex items-center gap-1">
              ไป <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuestsPage() {
  const [activeCategory, setActiveCategory] = useState<QuestCategory>('daily');
  const [quests, setQuests] = useState({
    daily: DAILY_QUESTS,
    story: STORY_QUESTS,
    side: SIDE_QUESTS,
  });

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const handleClaim = (questId: number) => {
    setQuests(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map(q =>
        q.id === questId ? { ...q, completed: true } : q
      ),
    }));
  };

  const currentQuests = quests[activeCategory];
  const completedCount = currentQuests.filter(q => q.completed).length;
  const totalCount = currentQuests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <ScrollText className="w-8 h-8 text-amber-500" />
          ภารกิจ
          <Swords className="w-8 h-8 text-red-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          ทำภารกิจเพื่อรับรางวัลและเลเวลอัพ!
        </p>
      </animated.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">{completedCount}/{totalCount}</div>
          <div className="text-xs text-[hsl(var(--color-text-muted))]">ภารกิจสำเร็จ</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">2,450</div>
          <div className="text-xs text-[hsl(var(--color-text-muted))]">Coins ที่ได้รับ</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-500">850</div>
          <div className="text-xs text-[hsl(var(--color-text-muted))]">XP ที่ได้รับ</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 p-1 glass rounded-2xl">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))]'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? '' : tab.color}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Reset Timer for Daily */}
      {activeCategory === 'daily' && (
        <div className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--color-text-muted))]">
          <Clock className="w-4 h-4" />
          รีเซ็ตใน 18:42:30
        </div>
      )}

      {/* Quest List */}
      <div className="space-y-4">
        {currentQuests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onClaim={handleClaim} />
        ))}
      </div>

      {/* Claim All Button */}
      {currentQuests.some(q => q.progress >= q.total && !q.completed) && (
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          รับรางวัลทั้งหมด
        </button>
      )}

      {/* Achievement Teaser */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
          🏆
        </div>
        <div className="flex-1">
          <h3 className="font-bold">ความสำเร็จใหม่!</h3>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            ทำภารกิจอีก 3 อันเพื่อปลดล็อค "นักผจญภัยตัวยง"
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
      </div>
    </div>
  );
}
