'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ChevronLeft, ChevronRight, Expand, Eye, Heart, Home, Palette, Settings, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';

// Mock data for house
const ROOMS = [
  { id: 'living', name: 'ห้องนั่งเล่น', icon: '🛋️', unlocked: true },
  { id: 'bedroom', name: 'ห้องนอน', icon: '🛏️', unlocked: true },
  { id: 'kitchen', name: 'ห้องครัว', icon: '🍳', unlocked: true },
  { id: 'gaming', name: 'ห้องเกม', icon: '🎮', unlocked: false, price: 500 },
  { id: 'garden', name: 'สวน', icon: '🌻', unlocked: false, price: 1000 },
  { id: 'pool', name: 'สระว่ายน้ำ', icon: '🏊', unlocked: false, price: 2000 },
];

const FURNITURE_CATEGORIES = [
  { id: 'sofa', name: 'โซฟา', icon: '🛋️' },
  { id: 'table', name: 'โต๊ะ', icon: '🪑' },
  { id: 'decoration', name: 'ของตกแต่ง', icon: '🖼️' },
  { id: 'lighting', name: 'ไฟ', icon: '💡' },
  { id: 'plants', name: 'ต้นไม้', icon: '🌿' },
  { id: 'trophy', name: 'รางวัล', icon: '🏆' },
];

const FURNITURE_ITEMS = [
  { id: 1, name: 'โซฟาสีม่วง', icon: '🛋️', category: 'sofa', price: 100, owned: true },
  { id: 2, name: 'โซฟาหนัง', icon: '🛋️', category: 'sofa', price: 250, owned: false },
  { id: 3, name: 'โต๊ะไม้', icon: '🪵', category: 'table', price: 80, owned: true },
  { id: 4, name: 'โต๊ะแก้ว', icon: '🪞', category: 'table', price: 200, owned: false },
  { id: 5, name: 'ภาพวาด', icon: '🖼️', category: 'decoration', price: 50, owned: true },
  { id: 6, name: 'นาฬิกาแขวน', icon: '🕰️', category: 'decoration', price: 120, owned: true },
  { id: 7, name: 'โคมไฟตั้งพื้น', icon: '🪔', category: 'lighting', price: 90, owned: false },
  { id: 8, name: 'กระถางต้นไม้', icon: '🪴', category: 'plants', price: 40, owned: true },
  { id: 9, name: 'ถ้วยรางวัล', icon: '🏆', category: 'trophy', price: 0, owned: true, special: true },
];

const VISITORS = [
  { id: 1, name: 'Alice', avatar: '👧', status: 'ชอบบ้านของคุณมาก!' },
  { id: 2, name: 'Bob', avatar: '👦', status: 'โซฟาสวยจังเลย' },
  { id: 3, name: 'Carol', avatar: '👩', status: 'บ้านหรูมาก!' },
];

const HOUSE_STATS = {
  rating: 4.5,
  visitors: 1234,
  likes: 567,
  level: 8,
};

export default function HousePage() {
  const [currentRoom, setCurrentRoom] = useState('living');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sofa');

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const currentRoomData = ROOMS.find(r => r.id === currentRoom);
  const roomIndex = ROOMS.findIndex(r => r.id === currentRoom);

  const navigateRoom = (direction: 'prev' | 'next') => {
    const unlockedRooms = ROOMS.filter(r => r.unlocked);
    const currentIndex = unlockedRooms.findIndex(r => r.id === currentRoom);
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentRoom(unlockedRooms[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < unlockedRooms.length - 1) {
      setCurrentRoom(unlockedRooms[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <animated.div style={headerSpring}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Home className="w-8 h-8 text-pink-500" />
              บ้านของฉัน
            </h1>
            <p className="text-[hsl(var(--color-text-secondary))] mt-1">
              ตกแต่งบ้านในฝันของคุณ! 🏠
            </p>
          </div>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all
              ${isEditMode 
                ? 'bg-green-500 text-white' 
                : 'glass hover:bg-[hsl(var(--color-primary)/0.1)]'
              }`}
          >
            {isEditMode ? (
              <>
                <Sparkles className="w-4 h-4" />
                บันทึก
              </>
            ) : (
              <>
                <Palette className="w-4 h-4" />
                ตกแต่ง
              </>
            )}
          </button>
        </div>
      </animated.div>

      {/* House Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-yellow-500 flex items-center justify-center gap-1">
            ⭐ {HOUSE_STATS.rating}
          </div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">คะแนน</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-purple-500 flex items-center justify-center gap-1">
            <Eye className="w-4 h-4" /> {HOUSE_STATS.visitors}
          </div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">ผู้เยี่ยมชม</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-red-500 flex items-center justify-center gap-1">
            <Heart className="w-4 h-4" /> {HOUSE_STATS.likes}
          </div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">ถูกใจ</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-green-500">Lv.{HOUSE_STATS.level}</div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">เลเวล</div>
        </div>
      </div>

      {/* Room Preview */}
      <div className="glass rounded-3xl overflow-hidden">
        {/* Room Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--color-primary)/0.1)]">
          <button 
            onClick={() => navigateRoom('prev')}
            className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
            disabled={roomIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-2xl">{currentRoomData?.icon}</span>
            <h2 className="font-bold">{currentRoomData?.name}</h2>
          </div>
          <button 
            onClick={() => navigateRoom('next')}
            className="p-2 rounded-xl hover:bg-[hsl(var(--color-surface))] transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Room View */}
        <div className="relative aspect-video bg-gradient-to-b from-blue-100 to-purple-100 dark:from-slate-800 dark:to-slate-900">
          {/* Placeholder Room Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">{currentRoomData?.icon}</div>
              <p className="text-[hsl(var(--color-text-secondary))]">
                {isEditMode ? 'ลากไอเทมมาวางที่นี่' : 'แตะ "ตกแต่ง" เพื่อเริ่มตกแต่ง'}
              </p>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button className="absolute top-4 right-4 p-2 glass rounded-xl">
            <Expand className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Mode: Furniture Palette */}
        {isEditMode && (
          <div className="p-4 border-t border-[hsl(var(--color-primary)/0.1)]">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {FURNITURE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1
                    ${selectedCategory === cat.id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-[hsl(var(--color-surface))]'
                    }`}
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Furniture Items */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {FURNITURE_ITEMS.filter(f => f.category === selectedCategory).map((item) => (
                <div
                  key={item.id}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105
                    ${item.owned 
                      ? 'bg-[hsl(var(--color-surface))] border-2 border-green-500/50' 
                      : 'bg-[hsl(var(--color-surface))] opacity-60'
                    }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[9px] mt-1 text-center px-1">{item.name}</span>
                  {!item.owned && (
                    <span className="text-[9px] text-yellow-500">🪙 {item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room Selection */}
      <div className="glass rounded-3xl p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" />
          ห้องทั้งหมด
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => room.unlocked && setCurrentRoom(room.id)}
              className={`p-3 rounded-2xl text-center transition-all
                ${room.id === currentRoom ? 'ring-2 ring-purple-500' : ''}
                ${room.unlocked 
                  ? 'bg-[hsl(var(--color-surface))] hover:bg-[hsl(var(--color-primary)/0.1)]' 
                  : 'bg-[hsl(var(--color-surface))] opacity-50'
                }`}
            >
              <div className="text-2xl mb-1">{room.icon}</div>
              <div className="text-xs font-medium">{room.name}</div>
              {!room.unlocked && (
                <div className="text-[10px] text-yellow-500 mt-1">🔒 {room.price}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="glass rounded-3xl p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          ผู้เยี่ยมชมล่าสุด
        </h3>
        <div className="space-y-3">
          {VISITORS.map((visitor) => (
            <div key={visitor.id} className="flex items-center gap-3 p-2 rounded-xl bg-[hsl(var(--color-surface))]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                {visitor.avatar}
              </div>
              <div className="flex-1">
                <div className="font-medium">{visitor.name}</div>
                <div className="text-sm text-[hsl(var(--color-text-secondary))]">
                  "{visitor.status}"
                </div>
              </div>
              <button className="p-2 rounded-xl hover:bg-[hsl(var(--color-primary)/0.1)] transition">
                <Heart className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-2 text-center text-sm text-purple-500 hover:underline">
          ดูทั้งหมด →
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform">
          <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="font-bold">ร้านค้าเฟอร์นิเจอร์</div>
          <div className="text-sm text-[hsl(var(--color-text-secondary))]">ไอเทมใหม่ 50+ ชิ้น</div>
        </button>
        <button className="glass rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform">
          <Settings className="w-8 h-8 mx-auto mb-2 text-gray-500" />
          <div className="font-bold">ตั้งค่าบ้าน</div>
          <div className="text-sm text-[hsl(var(--color-text-secondary))]">ความเป็นส่วนตัว</div>
        </button>
      </div>
    </div>
  );
}
