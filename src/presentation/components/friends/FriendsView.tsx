'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Check,
    Clock,
    MessageCircle,
    MoreHorizontal,
    Search,
    Star,
    UserPlus,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';

interface Friend {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'playing';
  currentGame?: string;
  lastSeen?: string;
  isFavorite?: boolean;
}

interface FriendRequest {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  level: number;
  mutualFriends: number;
}

const FRIENDS: Friend[] = [
  { id: '1', name: 'sakura_chan', displayName: 'Sakura', avatar: '🌸', level: 12, status: 'online', isFavorite: true },
  { id: '2', name: 'dragon_master', displayName: 'Dragon', avatar: '🐉', level: 25, status: 'playing', currentGame: 'ถ้ำคริสตัล' },
  { id: '3', name: 'moon_rabbit', displayName: 'Moon', avatar: '🐰', level: 8, status: 'online' },
  { id: '4', name: 'star_gazer', displayName: 'Star', avatar: '⭐', level: 15, status: 'playing', currentGame: 'ป่ามหัศจรรย์', isFavorite: true },
  { id: '5', name: 'ninja_shadow', displayName: 'Ninja', avatar: '🥷', level: 20, status: 'offline', lastSeen: '2 ชม. ที่แล้ว' },
  { id: '6', name: 'crystal_heart', displayName: 'Crystal', avatar: '💎', level: 10, status: 'offline', lastSeen: '1 วัน ที่แล้ว' },
  { id: '7', name: 'fire_phoenix', displayName: 'Phoenix', avatar: '🔥', level: 30, status: 'online', isFavorite: true },
  { id: '8', name: 'ice_queen', displayName: 'Ice', avatar: '❄️', level: 18, status: 'playing', currentGame: 'อาณาจักรน้ำแข็ง' },
];

const FRIEND_REQUESTS: FriendRequest[] = [
  { id: '1', name: 'new_player_01', displayName: 'NewPlayer', avatar: '🌟', level: 3, mutualFriends: 2 },
  { id: '2', name: 'happy_bunny', displayName: 'Bunny', avatar: '🐇', level: 7, mutualFriends: 5 },
];

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  playing: 'bg-blue-500',
};

const statusLabels = {
  online: 'ออนไลน์',
  offline: 'ออฟไลน์',
  playing: 'กำลังเล่น',
};

type Tab = 'friends' | 'requests' | 'find';

export function FriendsView() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'favorite'>('all');

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredFriends = FRIENDS.filter(friend => {
    const matchesSearch = friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'online' 
        ? friend.status !== 'offline'
        : friend.isFavorite;
    return matchesSearch && matchesFilter;
  });

  const onlineFriends = FRIENDS.filter(f => f.status !== 'offline').length;

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">เพื่อน</span>
            <Users className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            {onlineFriends} คนออนไลน์จาก {FRIENDS.length} คน
          </p>
        </div>

        {/* Friend Request Badge */}
        {FRIEND_REQUESTS.length > 0 && (
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[hsl(var(--color-primary))]" />
            <span className="font-semibold">{FRIEND_REQUESTS.length} คำขอเป็นเพื่อน</span>
          </GlassPanel>
        )}
      </animated.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: 'friends', label: 'เพื่อนของฉัน', count: FRIENDS.length },
          { id: 'requests', label: 'คำขอ', count: FRIEND_REQUESTS.length },
          { id: 'find', label: 'ค้นหาเพื่อน' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${activeTab === tab.id
                ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
              }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs
                ${activeTab === tab.id ? 'bg-white/20' : 'bg-[hsl(var(--color-primary)/0.2)]'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'friends' && (
        <FriendsTab 
          friends={filteredFriends}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />
      )}

      {activeTab === 'requests' && (
        <RequestsTab requests={FRIEND_REQUESTS} />
      )}

      {activeTab === 'find' && (
        <FindFriendsTab />
      )}
    </div>
  );
}

interface FriendsTabProps {
  friends: Friend[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filter: 'all' | 'online' | 'favorite';
  setFilter: (f: 'all' | 'online' | 'favorite') => void;
}

function FriendsTab({ friends, searchQuery, setSearchQuery, filter, setFilter }: FriendsTabProps) {
  return (
    <>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="ค้นหาเพื่อน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass border-none outline-none
                     text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                     focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'online', 'favorite'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${filter === f
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                  : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'online' ? 'ออนไลน์' : '⭐ โปรด'}
            </button>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend, index) => (
          <FriendCard key={friend.id} friend={friend} delay={index * 50} />
        ))}
      </div>

      {friends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--color-text-muted))]">ไม่พบเพื่อนที่ค้นหา</p>
        </div>
      )}
    </>
  );
}

interface FriendCardProps {
  friend: Friend;
  delay: number;
}

function FriendCard({ friend, delay }: FriendCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    config: config.wobbly,
  });

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassPanel className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500
                          flex items-center justify-center text-2xl shadow-lg">
              {friend.avatar}
            </div>
            {/* Status indicator */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                          ${statusColors[friend.status]}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[hsl(var(--color-text-primary))] truncate">
                {friend.displayName}
              </h3>
              {friend.isFavorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-[hsl(var(--color-text-muted))]">@{friend.name}</p>
            <p className="text-xs text-[hsl(var(--color-text-secondary))] mt-1">
              Level {friend.level}
            </p>
          </div>

          {/* Actions */}
          <button className="p-2 rounded-lg glass hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Status Text */}
        <div className="mt-3 pt-3 border-t border-[hsl(var(--color-primary)/0.1)]">
          {friend.status === 'playing' ? (
            <p className="text-sm text-blue-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              กำลังเล่น: {friend.currentGame}
            </p>
          ) : friend.status === 'offline' ? (
            <p className="text-sm text-[hsl(var(--color-text-muted))] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ออนไลน์ล่าสุด: {friend.lastSeen}
            </p>
          ) : (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              ออนไลน์
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <AnimatedButton variant="glass" size="sm" icon={<MessageCircle className="w-4 h-4" />} fullWidth>
            ส่งข้อความ
          </AnimatedButton>
          {friend.status !== 'offline' && (
            <AnimatedButton variant="primary" size="sm" fullWidth>
              เชิญเล่น
            </AnimatedButton>
          )}
        </div>
      </GlassPanel>
    </animated.div>
  );
}

interface RequestsTabProps {
  requests: FriendRequest[];
}

function RequestsTab({ requests }: RequestsTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request, index) => (
        <AnimatedCard key={request.id} delay={index * 50} variant="glass" className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500
                          flex items-center justify-center text-2xl shadow-lg">
              {request.avatar}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-[hsl(var(--color-text-primary))]">
                {request.displayName}
              </h3>
              <p className="text-xs text-[hsl(var(--color-text-muted))]">@{request.name}</p>
              <p className="text-xs text-[hsl(var(--color-text-secondary))] mt-1">
                Level {request.level} • {request.mutualFriends} เพื่อนร่วมกัน
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <AnimatedButton variant="primary" size="sm" icon={<Check className="w-4 h-4" />} fullWidth>
              ยอมรับ
            </AnimatedButton>
            <AnimatedButton variant="ghost" size="sm" icon={<X className="w-4 h-4" />} fullWidth>
              ปฏิเสธ
            </AnimatedButton>
          </div>
        </AnimatedCard>
      ))}

      {requests.length === 0 && (
        <div className="col-span-full text-center py-12">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--color-text-muted))]" />
          <p className="text-[hsl(var(--color-text-muted))]">ไม่มีคำขอเป็นเพื่อน</p>
        </div>
      )}
    </div>
  );
}

function FindFriendsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อผู้ใช้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass border-none outline-none
                     text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                     focus:ring-2 focus:ring-[hsl(var(--color-primary))] text-center"
          />
        </div>

        <AnimatedButton variant="primary" size="lg" fullWidth icon={<Search className="w-5 h-5" />}>
          ค้นหา
        </AnimatedButton>

        <p className="text-center text-sm text-[hsl(var(--color-text-muted))] mt-4">
          พิมพ์ชื่อผู้ใช้เพื่อค้นหาและเพิ่มเพื่อนใหม่
        </p>
      </div>
    </div>
  );
}
