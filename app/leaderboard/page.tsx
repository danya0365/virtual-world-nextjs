'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowDown, ArrowUp, Crown, Filter, Gamepad2, Search, Star, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

// Mock data for leaderboards
type LeaderboardCategory = 'overall' | 'games' | 'social' | 'weekly';

const LEADERBOARD_DATA = {
  overall: [
    { rank: 1, name: 'DragonSlayer99', avatar: '🐉', score: 125000, change: 0, country: '🇹🇭' },
    { rank: 2, name: 'PixelQueen', avatar: '👸', score: 118500, change: 2, country: '🇯🇵' },
    { rank: 3, name: 'NightHawk', avatar: '🦅', score: 112300, change: -1, country: '🇺🇸' },
    { rank: 4, name: 'StarGazer', avatar: '⭐', score: 98700, change: 1, country: '🇰🇷' },
    { rank: 5, name: 'MysticWolf', avatar: '🐺', score: 95200, change: -2, country: '🇬🇧' },
    { rank: 6, name: 'ThunderBolt', avatar: '⚡', score: 89100, change: 3, country: '🇹🇭' },
    { rank: 7, name: 'CrystalMage', avatar: '💎', score: 85600, change: 0, country: '🇨🇳' },
    { rank: 8, name: 'ShadowNinja', avatar: '🥷', score: 82400, change: -1, country: '🇹🇭' },
    { rank: 9, name: 'FirePhoenix', avatar: '🔥', score: 79800, change: 2, country: '🇧🇷' },
    { rank: 10, name: 'IceQueen', avatar: '❄️', score: 76500, change: 0, country: '🇷🇺' },
  ],
  games: [
    { rank: 1, name: 'GameMaster', avatar: '🎮', score: 500, change: 0, country: '🇹🇭' },
    { rank: 2, name: 'ProGamer', avatar: '🏆', score: 485, change: 1, country: '🇯🇵' },
    { rank: 3, name: 'AcePlayer', avatar: '🃏', score: 470, change: -1, country: '🇰🇷' },
  ],
  social: [
    { rank: 1, name: 'FriendlyBear', avatar: '🐻', score: 2500, change: 0, country: '🇹🇭' },
    { rank: 2, name: 'SocialBee', avatar: '🐝', score: 2350, change: 2, country: '🇵🇭' },
    { rank: 3, name: 'PartyKing', avatar: '👑', score: 2200, change: -1, country: '🇮🇩' },
  ],
  weekly: [
    { rank: 1, name: 'WeeklyChamp', avatar: '🏅', score: 15000, change: 5, country: '🇹🇭' },
    { rank: 2, name: 'RisingStar', avatar: '🌟', score: 14200, change: 10, country: '🇻🇳' },
    { rank: 3, name: 'NewHero', avatar: '🦸', score: 13800, change: 8, country: '🇹🇭' },
  ],
};

const CURRENT_USER = { rank: 156, score: 12500, name: 'Mike', avatar: '🧑' };

const CATEGORIES = [
  { id: 'overall' as LeaderboardCategory, name: 'ทั้งหมด', icon: Trophy },
  { id: 'games' as LeaderboardCategory, name: 'เกม', icon: Gamepad2 },
  { id: 'social' as LeaderboardCategory, name: 'สังคม', icon: Users },
  { id: 'weekly' as LeaderboardCategory, name: 'สัปดาห์นี้', icon: Star },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-lg font-bold text-[hsl(var(--color-text-muted))]">#{rank}</span>;
}

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) return <span className="text-gray-400">—</span>;
  if (change > 0) return <span className="text-green-500 flex items-center text-sm"><ArrowUp className="w-3 h-3" />{change}</span>;
  return <span className="text-red-500 flex items-center text-sm"><ArrowDown className="w-3 h-3" />{Math.abs(change)}</span>;
}

export default function LeaderboardPage() {
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const data = LEADERBOARD_DATA[category];

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          ลีดเดอร์บอร์ด
          <Crown className="w-8 h-8 text-amber-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          อันดับผู้เล่นทั่วโลก!
        </p>
      </animated.div>

      {/* Your Rank Card */}
      <div className="glass rounded-3xl p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-3xl">
            {CURRENT_USER.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm text-[hsl(var(--color-text-muted))]">อันดับของคุณ</div>
            <div className="text-3xl font-bold">#{CURRENT_USER.rank}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[hsl(var(--color-text-muted))]">คะแนน</div>
            <div className="text-2xl font-bold text-purple-500">{CURRENT_USER.score.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[hsl(var(--color-text-secondary))]">
            อีก 500 คะแนนเพื่ออัพอันดับ
          </span>
          <button className="text-purple-500 font-medium hover:underline">
            ดูวิธีเพิ่มคะแนน →
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 p-1 glass rounded-2xl overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap
                ${isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))]'
                }`}
            >
              <Icon className="w-5 h-5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="ค้นหาผู้เล่น..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass border-none focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <button className="p-3 glass rounded-xl">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-2 h-40">
        {/* 2nd Place */}
        {data[1] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl border-4 border-gray-300">
              {data[1].avatar}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-bold truncate w-20">{data[1].name}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">{data[1].score.toLocaleString()}</div>
            </div>
            <div className="w-20 h-20 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg mt-2 flex items-center justify-center text-3xl">
              🥈
            </div>
          </div>
        )}

        {/* 1st Place */}
        {data[0] && (
          <div className="flex flex-col items-center -mt-8">
            <div className="animate-bounce">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-3xl border-4 border-yellow-400 shadow-lg">
              {data[0].avatar}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-bold truncate w-24">{data[0].name}</div>
              <div className="text-xs text-yellow-500 font-medium">{data[0].score.toLocaleString()}</div>
            </div>
            <div className="w-24 h-28 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg mt-2 flex items-center justify-center text-4xl shadow-lg">
              🥇
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {data[2] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-2xl border-4 border-orange-300">
              {data[2].avatar}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-bold truncate w-20">{data[2].name}</div>
              <div className="text-xs text-[hsl(var(--color-text-muted))]">{data[2].score.toLocaleString()}</div>
            </div>
            <div className="w-20 h-16 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg mt-2 flex items-center justify-center text-3xl">
              🥉
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 text-sm font-bold text-[hsl(var(--color-text-muted))] border-b border-[hsl(var(--color-primary)/0.1)]">
          <div className="col-span-2 text-center">อันดับ</div>
          <div className="col-span-6">ผู้เล่น</div>
          <div className="col-span-2 text-right">คะแนน</div>
          <div className="col-span-2 text-center">เปลี่ยนแปลง</div>
        </div>

        <div className="divide-y divide-[hsl(var(--color-primary)/0.05)]">
          {data.slice(3).map((player, index) => (
            <div 
              key={player.rank} 
              className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-[hsl(var(--color-surface))] transition"
            >
              <div className="col-span-2 text-center">
                <RankBadge rank={player.rank} />
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-lg">
                  {player.avatar}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {player.name}
                    <span>{player.country}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right font-bold">
                {player.score.toLocaleString()}
              </div>
              <div className="col-span-2 flex justify-center">
                <ChangeIndicator change={player.change} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <button className="w-full py-3 glass rounded-2xl font-medium hover:bg-[hsl(var(--color-primary)/0.05)] transition">
        โหลดเพิ่มเติม...
      </button>
    </div>
  );
}
