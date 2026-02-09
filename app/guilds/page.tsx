'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ChevronRight, Crown, MessageCircle, Plus, Search, Settings, Shield, Sparkles, Star, Swords, Trophy, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

// Mock data
const MY_GUILD = {
  id: 1,
  name: 'Dragon Warriors',
  tag: 'DRG',
  icon: '🐲',
  level: 15,
  members: 48,
  maxMembers: 50,
  rank: 5,
  exp: 7500,
  expNext: 10000,
  description: 'กิลด์สำหรับนักรบมังกร! เราชนะทุกสมรภูมิ 🔥',
  perks: ['XP Boost +10%', 'Guild Shop', 'Private Chat'],
};

const GUILD_MEMBERS = [
  { id: 1, name: 'DragonMaster', avatar: '🐉', role: 'leader', online: true, contribution: 15000 },
  { id: 2, name: 'FlameKnight', avatar: '🔥', role: 'officer', online: true, contribution: 8500 },
  { id: 3, name: 'IceQueen', avatar: '❄️', role: 'officer', online: false, contribution: 7200 },
  { id: 4, name: 'ShadowBlade', avatar: '🗡️', role: 'member', online: true, contribution: 5000 },
  { id: 5, name: 'MysticMage', avatar: '🧙', role: 'member', online: false, contribution: 4500 },
];

const BROWSE_GUILDS = [
  { id: 2, name: 'Sky Knights', tag: 'SKY', icon: '⚔️', level: 20, members: 50, rank: 1, isRecruiting: true },
  { id: 3, name: 'Shadow Legion', tag: 'SHD', icon: '🌙', level: 18, members: 45, rank: 2, isRecruiting: true },
  { id: 4, name: 'Phoenix Rising', tag: 'PHX', icon: '🔥', level: 16, members: 38, rank: 3, isRecruiting: false },
  { id: 5, name: 'Ocean Guardians', tag: 'OCN', icon: '🌊', level: 14, members: 42, rank: 4, isRecruiting: true },
];

const GUILD_ACTIVITIES = [
  { id: 1, type: 'join', user: 'NewPlayer', time: '5 นาทีก่อน' },
  { id: 2, type: 'achievement', user: 'FlameKnight', achievement: 'Dragon Slayer', time: '1 ชม. ก่อน' },
  { id: 3, type: 'donation', user: 'IceQueen', amount: 500, time: '2 ชม. ก่อน' },
];

type Tab = 'my-guild' | 'browse' | 'create';

export default function GuildsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('my-guild');
  const [hasGuild] = useState(true);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const expProgress = (MY_GUILD.exp / MY_GUILD.expNext) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          กิลด์
          <Swords className="w-8 h-8 text-red-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          รวมพลังกับเพื่อน พิชิตทุกความท้าทาย!
        </p>
      </animated.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl">
        {[
          { id: 'my-guild', label: 'กิลด์ของฉัน', icon: Shield },
          { id: 'browse', label: 'ค้นหา', icon: Search },
          { id: 'create', label: 'สร้าง', icon: Plus },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))]'
                }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* My Guild Tab */}
      {activeTab === 'my-guild' && hasGuild && (
        <>
          {/* Guild Header Card */}
          <div className="glass rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl">
                  {MY_GUILD.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{MY_GUILD.name}</h2>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-sm">[{MY_GUILD.tag}]</span>
                  </div>
                  <p className="opacity-80 mt-1 text-sm">{MY_GUILD.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" /> อันดับ #{MY_GUILD.rank}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {MY_GUILD.members}/{MY_GUILD.maxMembers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" /> Lv.{MY_GUILD.level}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* EXP Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Guild EXP</span>
                  <span>{MY_GUILD.exp.toLocaleString()}/{MY_GUILD.expNext.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Guild Perks */}
            <div className="p-4 flex gap-2 overflow-x-auto">
              {MY_GUILD.perks.map((perk, i) => (
                <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" /> {perk}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <button className="glass rounded-2xl p-4 text-center hover:scale-105 transition-transform">
              <MessageCircle className="w-6 h-6 mx-auto text-blue-500" />
              <div className="text-xs mt-1">แชท</div>
            </button>
            <button className="glass rounded-2xl p-4 text-center hover:scale-105 transition-transform">
              <Swords className="w-6 h-6 mx-auto text-red-500" />
              <div className="text-xs mt-1">สงคราม</div>
            </button>
            <button className="glass rounded-2xl p-4 text-center hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 mx-auto text-yellow-500" />
              <div className="text-xs mt-1">อีเวนต์</div>
            </button>
            <button className="glass rounded-2xl p-4 text-center hover:scale-105 transition-transform">
              <UserPlus className="w-6 h-6 mx-auto text-green-500" />
              <div className="text-xs mt-1">เชิญ</div>
            </button>
          </div>

          {/* Members */}
          <div className="glass rounded-3xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                สมาชิก
              </h3>
              <span className="text-sm text-[hsl(var(--color-text-muted))]">
                {MY_GUILD.members} คน
              </span>
            </div>

            <div className="space-y-2">
              {GUILD_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-lg">
                      {member.avatar}
                    </div>
                    {member.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[hsl(var(--color-background))]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {member.name}
                      {member.role === 'leader' && <Crown className="w-4 h-4 text-yellow-500" />}
                      {member.role === 'officer' && <Shield className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="text-xs text-[hsl(var(--color-text-muted))]">
                      บริจาค: {member.contribution.toLocaleString()} 🪙
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass rounded-3xl p-4">
            <h3 className="font-bold mb-3">กิจกรรมล่าสุด</h3>
            <div className="space-y-3">
              {GUILD_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-surface))] flex items-center justify-center">
                    {activity.type === 'join' && '🎉'}
                    {activity.type === 'achievement' && '🏆'}
                    {activity.type === 'donation' && '💰'}
                  </div>
                  <div className="flex-1">
                    {activity.type === 'join' && <span><strong>{activity.user}</strong> เข้าร่วมกิลด์</span>}
                    {activity.type === 'achievement' && <span><strong>{activity.user}</strong> ได้รับ {activity.achievement}</span>}
                    {activity.type === 'donation' && <span><strong>{activity.user}</strong> บริจาค {activity.amount} 🪙</span>}
                  </div>
                  <span className="text-[hsl(var(--color-text-muted))]">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
            <input
              type="text"
              placeholder="ค้นหากิลด์..."
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-4">
            {BROWSE_GUILDS.map((guild) => (
              <div key={guild.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                  {guild.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{guild.name}</span>
                    <span className="text-xs text-[hsl(var(--color-text-muted))]">[{guild.tag}]</span>
                    {guild.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="text-sm text-[hsl(var(--color-text-muted))] flex items-center gap-3">
                    <span>Lv.{guild.level}</span>
                    <span>{guild.members} สมาชิก</span>
                    <span>อันดับ #{guild.rank}</span>
                  </div>
                </div>
                {guild.isRecruiting ? (
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium">
                    สมัคร
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-gray-500/20 text-gray-500 text-sm">เต็ม</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Plus className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-bold mb-2">สร้างกิลด์ของคุณ</h2>
          <p className="text-[hsl(var(--color-text-secondary))] mb-6">
            รวบรวมเพื่อนและพิชิตทุกสมรภูมิ!
          </p>
          <div className="text-sm text-[hsl(var(--color-text-muted))] mb-4">
            ค่าสร้างกิลด์: 🪙 1,000
          </div>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform">
            สร้างกิลด์
          </button>
        </div>
      )}
    </div>
  );
}
