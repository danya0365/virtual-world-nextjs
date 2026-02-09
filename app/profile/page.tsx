'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeft, Award, Calendar, ChartBar, Crown, Flame, Gamepad2, MapPin, Star, Target, Timer, TrendingUp, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const PLAYER_STATS = {
  username: 'PlayerOne',
  avatar: '🦊',
  level: 25,
  exp: 7500,
  maxExp: 10000,
  title: 'นักสำรวจ',
  joinDate: '2024-01-15',
  daysPlayed: 156,
  lastOnline: 'กำลังออนไลน์',
};

const STATS: StatCard[] = [
  { label: 'คะแนนรวม', value: '125,650', icon: <Trophy className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500', trend: 12 },
  { label: 'เกมที่เล่น', value: 234, icon: <Gamepad2 className="w-5 h-5" />, color: 'from-purple-500 to-pink-500', trend: 8 },
  { label: 'ชัยชนะ', value: 89, icon: <Award className="w-5 h-5" />, color: 'from-green-500 to-emerald-500', trend: 15 },
  { label: 'Login Streak', value: '12 วัน', icon: <Flame className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
  { label: 'เพื่อน', value: 47, icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500', trend: 3 },
  { label: 'ความสำเร็จ', value: '23/50', icon: <Star className="w-5 h-5" />, color: 'from-pink-500 to-rose-500' },
];

const ACHIEVEMENTS_RECENT = [
  { id: 1, name: 'นักสำรวจ', icon: '🗺️', date: '2 วันก่อน' },
  { id: 2, name: 'เกมเมอร์มือโปร', icon: '🎮', date: '5 วันก่อน' },
  { id: 3, name: 'มิตรภาพ', icon: '🤝', date: '1 สัปดาห์ก่อน' },
];

const ACTIVITY_CHART = [
  { day: 'จ', value: 45 },
  { day: 'อ', value: 60 },
  { day: 'พ', value: 30 },
  { day: 'พฤ', value: 80 },
  { day: 'ศ', value: 65 },
  { day: 'ส', value: 90 },
  { day: 'อา', value: 70 },
];

const GAME_STATS = [
  { name: 'Puzzle', played: 45, wins: 38, winRate: 84 },
  { name: 'Racing', played: 32, wins: 18, winRate: 56 },
  { name: 'Battle', played: 28, wins: 15, winRate: 54 },
  { name: 'Shooting', played: 56, wins: 42, winRate: 75 },
];

export default function ProfileDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'activity'>('overview');

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring}>
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 glass rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              📊 สถิติของฉัน
            </h1>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              ดูผลงานและความก้าวหน้าของคุณ
            </p>
          </div>
        </div>
      </animated.div>

      {/* Profile Card */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg">
            {PLAYER_STATS.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{PLAYER_STATS.username}</h2>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-500 text-xs rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> VIP
              </span>
            </div>
            <p className="text-sm text-[hsl(var(--color-text-muted))] mb-2">
              {PLAYER_STATS.title} • Level {PLAYER_STATS.level}
            </p>
            {/* EXP Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[hsl(var(--color-surface))] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${(PLAYER_STATS.exp / PLAYER_STATS.maxExp) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[hsl(var(--color-text-muted))]">
                {PLAYER_STATS.exp}/{PLAYER_STATS.maxExp} EXP
              </span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl text-center">
            <Calendar className="w-4 h-4 mx-auto text-blue-500 mb-1" />
            <div className="text-xs text-[hsl(var(--color-text-muted))]">เข้าร่วม</div>
            <div className="text-sm font-bold">{PLAYER_STATS.daysPlayed} วัน</div>
          </div>
          <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl text-center">
            <MapPin className="w-4 h-4 mx-auto text-green-500 mb-1" />
            <div className="text-xs text-[hsl(var(--color-text-muted))]">สถานะ</div>
            <div className="text-sm font-bold text-green-500">{PLAYER_STATS.lastOnline}</div>
          </div>
          <div className="p-3 bg-[hsl(var(--color-surface))] rounded-xl text-center">
            <Flame className="w-4 h-4 mx-auto text-orange-500 mb-1" />
            <div className="text-xs text-[hsl(var(--color-text-muted))]">Streak</div>
            <div className="text-sm font-bold">12 🔥</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'overview', name: 'ภาพรวม', icon: <ChartBar className="w-4 h-4" /> },
          { id: 'games', name: 'สถิติเกม', icon: <Gamepad2 className="w-4 h-4" /> },
          { id: 'activity', name: 'กิจกรรม', icon: <Timer className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'glass'}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STATS.map((stat, index) => (
              <div key={index} className="glass rounded-2xl p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                  {stat.icon}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-[hsl(var(--color-text-muted))]">{stat.label}</div>
                  </div>
                  {stat.trend && (
                    <div className="flex items-center text-green-500 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{stat.trend}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Achievements */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                ความสำเร็จล่าสุด
              </h3>
              <Link href="/achievements" className="text-sm text-purple-500 hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <div className="space-y-3">
              {ACHIEVEMENTS_RECENT.map((ach) => (
                <div key={ach.id} className="flex items-center gap-3 p-3 bg-[hsl(var(--color-surface))] rounded-xl">
                  <div className="text-2xl">{ach.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{ach.name}</div>
                    <div className="text-xs text-[hsl(var(--color-text-muted))]">{ach.date}</div>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'games' && (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            สถิติแต่ละเกม
          </h3>
          <div className="space-y-4">
            {GAME_STATS.map((game, index) => (
              <div key={index} className="p-4 bg-[hsl(var(--color-surface))] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{game.name}</span>
                  <span className="text-sm text-[hsl(var(--color-text-muted))]">
                    {game.wins}/{game.played} ชนะ
                  </span>
                </div>
                <div className="h-3 bg-[hsl(var(--color-background))] rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full ${game.winRate >= 70 ? 'bg-green-500' : game.winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${game.winRate}%` }}
                  />
                </div>
                <div className="text-right text-sm font-bold">
                  {game.winRate}% อัตราชนะ
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ChartBar className="w-5 h-5 text-purple-500" />
            กิจกรรมใน 7 วัน
          </h3>
          {/* Activity Chart */}
          <div className="flex items-end gap-2 h-40">
            {ACTIVITY_CHART.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all"
                  style={{ height: `${day.value}%` }}
                />
                <div className="text-xs text-[hsl(var(--color-text-muted))] mt-2">{day.day}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-[hsl(var(--color-surface))] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[hsl(var(--color-text-muted))]">เวลาเล่นทั้งหมด</span>
              <span className="font-bold">24 ชม. 36 นาที</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
