'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Brain,
    Crown,
    Gamepad2,
    HelpCircle,
    Play,
    Star,
    Timer,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'puzzle' | 'action' | 'trivia' | 'multiplayer';
  difficulty: 'easy' | 'medium' | 'hard';
  playerCount: string;
  playTime: string;
  highScore?: number;
  isNew?: boolean;
  isLocked?: boolean;
  requiredLevel?: number;
}

const GAMES: Game[] = [
  {
    id: 'memory',
    name: 'จับคู่ความจำ',
    description: 'จับคู่การ์ดที่เหมือนกันให้หมดก่อนเวลาจะหมด',
    icon: '🧠',
    category: 'puzzle',
    difficulty: 'easy',
    playerCount: '1 คน',
    playTime: '2-5 นาที',
    highScore: 1250,
  },
  {
    id: 'puzzle',
    name: 'ต่อจิ๊กซอว์',
    description: 'เรียงภาพให้ถูกต้องภายในเวลาที่กำหนด',
    icon: '🧩',
    category: 'puzzle',
    difficulty: 'medium',
    playerCount: '1 คน',
    playTime: '5-10 นาที',
    isNew: true,
  },
  {
    id: 'racing',
    name: 'แข่งรถ',
    description: 'แข่งรถสุดมันส์! เลือกสนามและรถได้',
    icon: '🏎️',
    category: 'action',
    difficulty: 'medium',
    playerCount: '1 คน',
    playTime: '3-5 นาที',
    isNew: true,
  },
  {
    id: 'battle',
    name: 'Battle Arena',
    description: 'ต่อสู้กับมอนสเตอร์แบบผลัดตา',
    icon: '⚔️',
    category: 'action',
    difficulty: 'hard',
    playerCount: '1 คน',
    playTime: '5-10 นาที',
    isNew: true,
  },
  {
    id: 'shooting',
    name: 'ยิงเป้า',
    description: 'ยิงเป้าให้แม่นที่สุด! หลายโหมดให้เลือก',
    icon: '🎯',
    category: 'action',
    difficulty: 'easy',
    playerCount: '1 คน',
    playTime: '1-3 นาที',
    isNew: true,
  },
  {
    id: 'quiz',
    name: 'ตอบคำถาม',
    description: 'ทดสอบความรู้เกี่ยวกับโลก Virtual World',
    icon: '❓',
    category: 'trivia',
    difficulty: 'medium',
    playerCount: '1 คน',
    playTime: '3-5 นาที',
    highScore: 800,
  },
  {
    id: 'reaction',
    name: 'ปฏิกิริยาสายฟ้า',
    description: 'ทดสอบความเร็วในการตอบสนอง',
    icon: '⚡',
    category: 'action',
    difficulty: 'easy',
    playerCount: '1 คน',
    playTime: '1-2 นาที',
    highScore: 150,
  },
  {
    id: 'word',
    name: 'ทายคำศัพท์',
    description: 'ทายคำจากตัวอักษรที่สุ่มให้',
    icon: '📝',
    category: 'puzzle',
    difficulty: 'hard',
    playerCount: '1 คน',
    playTime: '5-10 นาที',
    isLocked: true,
    requiredLevel: 10,
  },
  {
    id: 'race',
    name: 'แข่งวิ่ง Online',
    description: 'แข่งวิ่งกับเพื่อนในโลกเสมือน',
    icon: '🏃',
    category: 'multiplayer',
    difficulty: 'medium',
    playerCount: '2-4 คน',
    playTime: '3-5 นาที',
  },
];

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-600',
  medium: 'bg-yellow-500/20 text-yellow-600',
  hard: 'bg-red-500/20 text-red-600',
};

const difficultyNames = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

const categoryIcons = {
  puzzle: <Brain className="w-4 h-4" />,
  action: <Zap className="w-4 h-4" />,
  trivia: <HelpCircle className="w-4 h-4" />,
  multiplayer: <Users className="w-4 h-4" />,
};

export function GamesView() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredGames = selectedCategory === 'all'
    ? GAMES
    : GAMES.filter(g => g.category === selectedCategory);

  const handlePlayGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">มินิเกม</span>
            <Gamepad2 className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            เล่นเกมสนุกๆ และรับรางวัล!
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-[hsl(var(--color-text-muted))]">คะแนนรวม</p>
              <p className="font-bold">2,200</p>
            </div>
          </GlassPanel>
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-[hsl(var(--color-text-muted))]">อันดับ</p>
              <p className="font-bold">#42</p>
            </div>
          </GlassPanel>
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
        {[
          { id: 'puzzle', name: 'ปริศนา', icon: categoryIcons.puzzle },
          { id: 'action', name: 'แอคชัน', icon: categoryIcons.action },
          { id: 'trivia', name: 'ความรู้', icon: categoryIcons.trivia },
          { id: 'multiplayer', name: 'หลายคน', icon: categoryIcons.multiplayer },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${selectedCategory === cat.id
                ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
              }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            delay={index * 50}
            onPlay={() => handlePlayGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
  delay: number;
  onPlay: () => void;
}

function GameCard({ game, delay, onPlay }: GameCardProps) {
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

  return (
    <animated.div style={{ ...spring, ...hoverSpring }}>
      <GlassPanel
        className={`p-4 cursor-pointer transition-all duration-200 ${game.isLocked ? 'opacity-60' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500
                        flex items-center justify-center text-4xl shadow-lg relative">
            {game.icon}
            {game.isNew && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                ใหม่
              </span>
            )}
            {game.isLocked && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[hsl(var(--color-text-primary))] mb-1">
              {game.name}
            </h3>
            <p className="text-sm text-[hsl(var(--color-text-muted))] line-clamp-2">
              {game.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[game.difficulty]}`}>
            {difficultyNames[game.difficulty]}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--color-primary)/0.2)] text-[hsl(var(--color-primary))]">
            <Users className="w-3 h-3 inline mr-1" />
            {game.playerCount}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--color-primary)/0.2)] text-[hsl(var(--color-primary))]">
            <Timer className="w-3 h-3 inline mr-1" />
            {game.playTime}
          </span>
        </div>

        {/* High Score & Play */}
        <div className="flex items-center justify-between">
          {game.highScore ? (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-yellow-500" />
              <span className="font-bold">{game.highScore.toLocaleString()}</span>
            </div>
          ) : game.isLocked ? (
            <span className="text-sm text-[hsl(var(--color-text-muted))]">
              ต้องการ Level {game.requiredLevel}
            </span>
          ) : (
            <span className="text-sm text-[hsl(var(--color-text-muted))]">ยังไม่เคยเล่น</span>
          )}

          <AnimatedButton
            variant={game.isLocked ? 'ghost' : 'primary'}
            size="sm"
            icon={<Play className="w-4 h-4" />}
            onClick={onPlay}
            disabled={game.isLocked}
          >
            เล่น
          </AnimatedButton>
        </div>
      </GlassPanel>
    </animated.div>
  );
}
