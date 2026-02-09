'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { Crown, Globe, MessageCircle, Mic, MicOff, Phone, Plus, Settings, Sparkles, UserPlus, Users, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

// Mock data
const FRIENDS_ONLINE = [
  { id: 1, name: 'Alice', avatar: '👧', status: 'online', activity: 'กำลังเล่น Memory Game' },
  { id: 2, name: 'Bob', avatar: '👦', status: 'online', activity: 'อยู่ที่หน้าแรก' },
  { id: 3, name: 'Carol', avatar: '👩', status: 'online', activity: 'กำลังสำรวจโลก' },
  { id: 4, name: 'David', avatar: '👨', status: 'online', activity: 'อยู่ในปาร์ตี้' },
  { id: 5, name: 'Eve', avatar: '👱‍♀️', status: 'away', activity: 'ไม่อยู่ 5 นาที' },
];

const PARTY_MEMBERS = [
  { id: 1, name: 'คุณ', avatar: '🧑', isLeader: true, isMuted: false, isSpeaking: true },
  { id: 2, name: 'Alice', avatar: '👧', isLeader: false, isMuted: false, isSpeaking: false },
  { id: 3, name: 'Bob', avatar: '👦', isLeader: false, isMuted: true, isSpeaking: false },
];

const QUICK_ACTIONS = [
  { id: 'explore', name: 'สำรวจโลก', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
  { id: 'games', name: 'เล่นเกม', icon: '🎮', color: 'from-purple-500 to-pink-500' },
  { id: 'house', name: 'เยี่ยมบ้าน', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { id: 'shop', name: 'ช้อปปิ้ง', icon: '🛍️', color: 'from-orange-500 to-red-500' },
];

export default function PartyPage() {
  const [inParty, setInParty] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-purple-500" />
          ปาร์ตี้
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          เล่นกับเพื่อนด้วยกัน!
        </p>
      </animated.div>

      {inParty ? (
        <>
          {/* Current Party */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                ปาร์ตี้ของคุณ
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
                  {PARTY_MEMBERS.length}/6 คน
                </span>
                <button className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Party Members */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {PARTY_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className={`relative p-4 rounded-2xl text-center transition-all
                    ${member.isSpeaking ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-[hsl(var(--color-background))]' : ''}
                    bg-[hsl(var(--color-surface))]`}
                >
                  {member.isLeader && (
                    <div className="absolute -top-2 -right-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-3xl">
                    {member.avatar}
                  </div>
                  <div className="font-medium mt-2">{member.name}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {member.isMuted ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : member.isSpeaking ? (
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                      </div>
                    ) : (
                      <Mic className="w-4 h-4 text-[hsl(var(--color-text-muted))]" />
                    )}
                  </div>
                </div>
              ))}

              {/* Add Member Slot */}
              {PARTY_MEMBERS.length < 6 && (
                <button className="p-4 rounded-2xl border-2 border-dashed border-[hsl(var(--color-primary)/0.3)] flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-500/5 transition">
                  <UserPlus className="w-8 h-8 text-[hsl(var(--color-text-muted))]" />
                  <span className="text-sm text-[hsl(var(--color-text-muted))]">เชิญเพื่อน</span>
                </button>
              )}
            </div>

            {/* Voice Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'glass'}`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`p-4 rounded-full transition-all ${isDeafened ? 'bg-red-500 text-white' : 'glass'}`}
              >
                {isDeafened ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <button className="p-4 rounded-full glass">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => setInParty(false)}
                className="p-4 rounded-full bg-red-500 text-white"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-bold mb-3">ไปด้วยกัน</h3>
            <div className="grid grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white text-center hover:scale-105 active:scale-95 transition-transform`}
                >
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className="text-xs font-medium">{action.name}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* No Party - Create or Join */
        <div className="glass rounded-3xl p-6 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--color-text-muted))]" />
          <h2 className="text-xl font-bold mb-2">ยังไม่มีปาร์ตี้</h2>
          <p className="text-[hsl(var(--color-text-secondary))] mb-6">
            สร้างปาร์ตี้หรือเข้าร่วมกับเพื่อน
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setInParty(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              สร้างปาร์ตี้
            </button>
            <button className="px-6 py-3 rounded-xl glass font-medium">
              เข้าร่วม
            </button>
          </div>
        </div>
      )}

      {/* Friends Online */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" />
          เพื่อนออนไลน์
        </h3>
        <div className="space-y-3">
          {FRIENDS_ONLINE.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                  {friend.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[hsl(var(--color-background))]
                  ${friend.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{friend.name}</div>
                <div className="text-sm text-[hsl(var(--color-text-secondary))]">
                  {friend.activity}
                </div>
              </div>
              <button className="p-2 rounded-xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
