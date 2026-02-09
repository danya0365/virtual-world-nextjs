'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { AnimatedCard } from '@/src/presentation/components/common/AnimatedCard';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Check,
    Coins, Gem,
    Search,
    ShoppingBag,
    ShoppingCart
} from 'lucide-react';
import { useState } from 'react';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  currency: 'coins' | 'gems';
  category: 'hat' | 'outfit' | 'accessory' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isNew?: boolean;
  isSale?: boolean;
  salePercent?: number;
  owned?: boolean;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: '1', name: 'หมวกมังกร', description: 'หมวกลายมังกรสุดเท่', icon: '🐲', price: 150, currency: 'coins', category: 'hat', rarity: 'epic', isNew: true },
  { id: '2', name: 'ชุดนักรบ', description: 'ชุดเกราะนักรบแห่งแสง', icon: '⚔️', price: 500, currency: 'coins', category: 'outfit', rarity: 'rare' },
  { id: '3', name: 'ปีกทอง', description: 'ปีกทองคำส่องประกาย', icon: '✨', price: 50, currency: 'gems', category: 'accessory', rarity: 'legendary', isSale: true, salePercent: 20 },
  { id: '4', name: 'มงกุฎคริสตัล', description: 'มงกุฎคริสตัลหรูหรา', icon: '👑', price: 100, currency: 'gems', category: 'hat', rarity: 'legendary' },
  { id: '5', name: 'หางปุยนุ่ม', description: 'หางปุยนุ่มน่ากอด', icon: '🐰', price: 80, currency: 'coins', category: 'accessory', rarity: 'common', owned: true },
  { id: '6', name: 'ออร่าไฟ', description: 'เอฟเฟกต์ไฟลุกโชน', icon: '🔥', price: 200, currency: 'coins', category: 'effect', rarity: 'epic' },
  { id: '7', name: 'ชุดเจ้าหญิง', description: 'ชุดเจ้าหญิงสีชมพู', icon: '👗', price: 300, currency: 'coins', category: 'outfit', rarity: 'rare', isNew: true },
  { id: '8', name: 'แว่นกันแดด', description: 'แว่นกันแดดสไตล์เท่', icon: '🕶️', price: 50, currency: 'coins', category: 'accessory', rarity: 'common' },
  { id: '9', name: 'ออร่าหิมะ', description: 'เอฟเฟกต์หิมะโปรยปราย', icon: '❄️', price: 30, currency: 'gems', category: 'effect', rarity: 'epic', isSale: true, salePercent: 50 },
  { id: '10', name: 'หมวกซานต้า', description: 'หมวกซานต้าสีแดง', icon: '🎅', price: 100, currency: 'coins', category: 'hat', rarity: 'rare' },
  { id: '11', name: 'ปีกผีเสื้อ', description: 'ปีกผีเสื้อสีรุ้ง', icon: '🦋', price: 40, currency: 'gems', category: 'accessory', rarity: 'epic' },
  { id: '12', name: 'ชุดนินจา', description: 'ชุดนินจาพราง', icon: '🥷', price: 400, currency: 'coins', category: 'outfit', rarity: 'rare' },
];

const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', icon: '🏠' },
  { id: 'hat', name: 'หมวก', icon: '🎩' },
  { id: 'outfit', name: 'ชุด', icon: '👔' },
  { id: 'accessory', name: 'เครื่องประดับ', icon: '💍' },
  { id: 'effect', name: 'เอฟเฟกต์', icon: '✨' },
];

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityLabels = {
  common: 'ธรรมดา',
  rare: 'หายาก',
  epic: 'ระดับเทพ',
  legendary: 'ตำนาน',
};

export function ShopView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);

  // Title animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredItems = SHOP_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleCart = (itemId: string) => {
    setCart(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const cartTotal = cart.reduce((acc, itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return acc;
    const price = item.isSale && item.salePercent 
      ? Math.floor(item.price * (1 - item.salePercent / 100))
      : item.price;
    return { 
      coins: acc.coins + (item.currency === 'coins' ? price : 0),
      gems: acc.gems + (item.currency === 'gems' ? price : 0),
    };
  }, { coins: 0, gems: 0 });

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">ร้านค้า</span>
            <ShoppingBag className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            ซื้อไอเท็มและเครื่องประดับสุดเท่
          </p>
        </div>

        {/* Balance */}
        <div className="flex gap-4">
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">163</span>
          </GlassPanel>
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-pink-500" />
            <span className="font-bold">12</span>
          </GlassPanel>
        </div>
      </animated.div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <AnimatedCard variant="gradient" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-[hsl(var(--color-primary))]" />
              <span className="font-semibold">{cart.length} รายการในตะกร้า</span>
              <div className="flex items-center gap-3 ml-4">
                {cartTotal.coins > 0 && (
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span>{cartTotal.coins}</span>
                  </div>
                )}
                {cartTotal.gems > 0 && (
                  <div className="flex items-center gap-1">
                    <Gem className="w-4 h-4 text-pink-500" />
                    <span>{cartTotal.gems}</span>
                  </div>
                )}
              </div>
            </div>
            <AnimatedButton variant="primary" size="sm">
              ชำระเงิน
            </AnimatedButton>
          </div>
        </AnimatedCard>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="ค้นหาไอเท็ม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass border-none outline-none
                     text-[hsl(var(--color-text-primary))] placeholder:text-[hsl(var(--color-text-muted))]
                     focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                transition-all duration-200 flex items-center gap-2
                ${selectedCategory === cat.id
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                  : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <ShopItemCard 
            key={item.id} 
            item={item} 
            delay={index * 50}
            inCart={cart.includes(item.id)}
            onToggleCart={() => toggleCart(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[hsl(var(--color-text-muted))]">ไม่พบไอเท็มที่ค้นหา</p>
        </div>
      )}
    </div>
  );
}

interface ShopItemCardProps {
  item: ShopItem;
  delay: number;
  inCart: boolean;
  onToggleCart: () => void;
}

function ShopItemCard({ item, delay, inCart, onToggleCart }: ShopItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1) translateY(0px)',
    config: config.wobbly,
  });

  const finalPrice = item.isSale && item.salePercent 
    ? Math.floor(item.price * (1 - item.salePercent / 100))
    : item.price;

  return (
    <animated.div
      style={spring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass rounded-2xl overflow-hidden cursor-pointer relative
        ${item.owned ? 'opacity-70' : ''}`}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        {item.isNew && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">
            ใหม่
          </span>
        )}
        {item.isSale && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
            -{item.salePercent}%
          </span>
        )}
        {item.owned && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500 text-white flex items-center gap-1">
            <Check className="w-3 h-3" /> มีแล้ว
          </span>
        )}
      </div>

      {/* Item Image */}
      <div className={`h-28 flex items-center justify-center text-5xl
                      bg-gradient-to-br ${rarityColors[item.rarity]}/20`}>
        {item.icon}
      </div>

      {/* Item Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="font-bold text-sm text-[hsl(var(--color-text-primary))] line-clamp-1">
            {item.name}
          </h3>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium text-white shrink-0
                          bg-gradient-to-r ${rarityColors[item.rarity]}`}>
            {rarityLabels[item.rarity]}
          </span>
        </div>

        <p className="text-xs text-[hsl(var(--color-text-muted))] line-clamp-1 mb-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {item.currency === 'coins' ? (
              <Coins className="w-4 h-4 text-yellow-500" />
            ) : (
              <Gem className="w-4 h-4 text-pink-500" />
            )}
            {item.isSale ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{finalPrice}</span>
                <span className="text-xs line-through text-[hsl(var(--color-text-muted))]">
                  {item.price}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold">{item.price}</span>
            )}
          </div>

          {!item.owned && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleCart(); }}
              className={`p-2 rounded-lg transition-colors duration-200
                ${inCart 
                  ? 'bg-[hsl(var(--color-primary))] text-white' 
                  : 'glass hover:bg-[hsl(var(--color-primary)/0.1)]'
                }`}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </animated.div>
  );
}
