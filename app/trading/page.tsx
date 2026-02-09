'use client';

import { animated, config, useSpring } from '@react-spring/web';
import { ArrowLeftRight, Check, Filter, History, Package, Search, ShoppingBag, Tag, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

// Mock data
const MARKETPLACE_ITEMS = [
  { id: 1, name: 'Dragon Scale Armor', icon: '🐉', seller: 'DragonSlayer', price: 2500, rarity: 'legendary', category: 'armor' },
  { id: 2, name: 'Crystal Sword', icon: '⚔️', seller: 'CrystalMage', price: 1500, rarity: 'epic', category: 'weapon' },
  { id: 3, name: 'Golden Wings', icon: '👼', seller: 'AngelKing', price: 5000, rarity: 'legendary', category: 'accessory' },
  { id: 4, name: 'Fire Staff', icon: '🔥', seller: 'FireWizard', price: 800, rarity: 'rare', category: 'weapon' },
  { id: 5, name: 'Shadow Cloak', icon: '🥷', seller: 'Ninja', price: 1200, rarity: 'epic', category: 'armor' },
  { id: 6, name: 'Healing Potion x10', icon: '❤️‍🩹', seller: 'Healer', price: 200, rarity: 'common', category: 'consumable' },
];

const TRADE_REQUESTS = [
  { id: 1, from: 'Alice', avatar: '👧', offering: [{ name: 'Magic Wand', icon: '🪄' }], wanting: [{ name: 'Shield', icon: '🛡️' }], status: 'pending' },
  { id: 2, from: 'Bob', avatar: '👦', offering: [{ name: 'Coins x500', icon: '🪙' }], wanting: [{ name: 'Rare Pet', icon: '🐱' }], status: 'pending' },
];

const MY_LISTINGS = [
  { id: 1, name: 'Enchanted Bow', icon: '🏹', price: 750, views: 45, status: 'active' },
  { id: 2, name: 'Leather Boots', icon: '👢', price: 300, views: 23, status: 'sold' },
];

type Tab = 'marketplace' | 'trades' | 'my-listings' | 'history';

const RARITY_COLORS = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500',
};

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');

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
          <ShoppingBag className="w-8 h-8 text-green-500" />
          ตลาดซื้อขาย
          <ArrowLeftRight className="w-8 h-8 text-blue-500" />
        </h1>
        <p className="text-[hsl(var(--color-text-secondary))] mt-2">
          ซื้อขายและแลกเปลี่ยนไอเทมกับผู้เล่นอื่น!
        </p>
      </animated.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-green-500">🪙 12,500</div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">ยอดขายทั้งหมด</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-purple-500">📦 15</div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">ไอเทมที่ขาย</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-yellow-500">⭐ 4.8</div>
          <div className="text-[10px] text-[hsl(var(--color-text-muted))]">คะแนนผู้ขาย</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl overflow-x-auto">
        {[
          { id: 'marketplace', label: 'ตลาด', icon: ShoppingBag },
          { id: 'trades', label: 'คำขอแลก', icon: ArrowLeftRight },
          { id: 'my-listings', label: 'ของฉัน', icon: Package },
          { id: 'history', label: 'ประวัติ', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-sm
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface))]'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      {activeTab === 'marketplace' && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
            <input
              type="text"
              placeholder="ค้นหาไอเทม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border-none focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <button className="p-3 glass rounded-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MARKETPLACE_ITEMS.map((item) => (
            <div key={item.id} className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
              <div className={`${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS]} p-4 text-center`}>
                <span className="text-4xl">{item.icon}</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[hsl(var(--color-text-muted))]">@{item.seller}</span>
                  <span className="font-bold text-yellow-500 text-sm">🪙 {item.price}</span>
                </div>
                <button className="w-full mt-3 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
                  ซื้อ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="space-y-4">
          {TRADE_REQUESTS.length > 0 ? (
            TRADE_REQUESTS.map((trade) => (
              <div key={trade.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xl">
                    {trade.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{trade.from}</div>
                    <div className="text-xs text-[hsl(var(--color-text-muted))]">ขอแลกเปลี่ยน</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 bg-[hsl(var(--color-surface))] rounded-xl text-center">
                    <div className="text-xs text-[hsl(var(--color-text-muted))] mb-1">เสนอ</div>
                    {trade.offering.map((item, i) => (
                      <div key={i} className="text-2xl">{item.icon}</div>
                    ))}
                  </div>
                  <ArrowLeftRight className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
                  <div className="flex-1 p-3 bg-[hsl(var(--color-surface))] rounded-xl text-center">
                    <div className="text-xs text-[hsl(var(--color-text-muted))] mb-1">ต้องการ</div>
                    {trade.wanting.map((item, i) => (
                      <div key={i} className="text-2xl">{item.icon}</div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" /> ยอมรับ
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-500 font-medium flex items-center justify-center gap-1">
                    <X className="w-4 h-4" /> ปฏิเสธ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--color-text-muted))]" />
              <p className="text-[hsl(var(--color-text-secondary))]">ไม่มีคำขอแลกเปลี่ยน</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-listings' && (
        <div className="space-y-4">
          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-green-500/50 text-green-500 font-medium hover:bg-green-500/5 transition flex items-center justify-center gap-2">
            <Tag className="w-5 h-5" />
            ลงขายไอเทมใหม่
          </button>
          
          {MY_LISTINGS.map((item) => (
            <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div className="flex-1">
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-[hsl(var(--color-text-muted))]">👀 {item.views} views</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-500">🪙 {item.price}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {item.status === 'active' ? 'กำลังขาย' : 'ขายแล้ว'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass rounded-2xl p-8 text-center">
          <History className="w-12 h-12 mx-auto mb-3 text-[hsl(var(--color-text-muted))]" />
          <p className="text-[hsl(var(--color-text-secondary))]">ยังไม่มีประวัติการซื้อขาย</p>
        </div>
      )}

      {/* Hot Items */}
      {activeTab === 'marketplace' && (
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-red-500" />
            ไอเทมยอดฮิต
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {MARKETPLACE_ITEMS.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--color-surface))] rounded-xl whitespace-nowrap">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-yellow-500 font-bold">🪙 {item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
