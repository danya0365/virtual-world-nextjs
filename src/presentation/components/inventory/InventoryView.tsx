'use client';

import { AnimatedButton } from '@/src/presentation/components/common/AnimatedButton';
import { GlassPanel } from '@/src/presentation/components/common/GlassPanel';
import { animated, config, useSpring } from '@react-spring/web';
import {
    Apple,
    Backpack,
    Filter,
    Gem,
    Scroll,
    Shield,
    Sparkles,
    Star,
    Sword,
    X,
} from 'lucide-react';
import { useState } from 'react';

type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type ItemCategory = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest';

interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  stackable: boolean;
  sellPrice: number;
  stats?: { attack?: number; defense?: number; health?: number; speed?: number; luck?: number };
  isEquippable?: boolean;
  equipSlot?: string;
}

interface InventorySlot {
  item: Item;
  quantity: number;
  isEquipped?: boolean;
}

// Mock data
const MOCK_INVENTORY: InventorySlot[] = [
  { item: { id: 'sword-001', name: 'ดาบเหล็ก', description: 'ดาบธรรมดาสำหรับนักผจญภัยมือใหม่', icon: '⚔️', category: 'weapon', rarity: 'common', stackable: false, sellPrice: 50, isEquippable: true, equipSlot: 'weapon', stats: { attack: 10 } }, quantity: 1, isEquipped: true },
  { item: { id: 'sword-002', name: 'ดาบมังกร', description: 'ดาบทรงพลังที่สร้างจากเกล็ดมังกร', icon: '🗡️', category: 'weapon', rarity: 'epic', stackable: false, sellPrice: 500, isEquippable: true, equipSlot: 'weapon', stats: { attack: 50, speed: 5 } }, quantity: 1 },
  { item: { id: 'helmet-001', name: 'หมวกเหล็ก', description: 'หมวกป้องกันพื้นฐาน', icon: '🪖', category: 'armor', rarity: 'common', stackable: false, sellPrice: 30, isEquippable: true, equipSlot: 'head', stats: { defense: 5 } }, quantity: 1 },
  { item: { id: 'crown-001', name: 'มงกุฎราชา', description: 'มงกุฎทองคำที่เปล่งประกาย', icon: '👑', category: 'accessory', rarity: 'legendary', stackable: false, sellPrice: 1000, isEquippable: true, equipSlot: 'head', stats: { luck: 20, health: 50 } }, quantity: 1 },
  { item: { id: 'armor-001', name: 'เกราะหนัง', description: 'เกราะหนังเบาๆ สำหรับนักผจญภัย', icon: '🦺', category: 'armor', rarity: 'common', stackable: false, sellPrice: 40, isEquippable: true, equipSlot: 'body', stats: { defense: 8 } }, quantity: 1, isEquipped: true },
  { item: { id: 'armor-002', name: 'เกราะเพชร', description: 'เกราะที่แข็งแกร่งที่สุด', icon: '💎', category: 'armor', rarity: 'rare', stackable: false, sellPrice: 300, isEquippable: true, equipSlot: 'body', stats: { defense: 25, health: 20 } }, quantity: 1 },
  { item: { id: 'ring-001', name: 'แหวนพลัง', description: 'แหวนที่เพิ่มพลังโจมตี', icon: '💍', category: 'accessory', rarity: 'uncommon', stackable: false, sellPrice: 100, isEquippable: true, equipSlot: 'accessory1', stats: { attack: 5, speed: 3 } }, quantity: 1, isEquipped: true },
  { item: { id: 'potion-001', name: 'ยาฟื้นฟู HP', description: 'ฟื้นฟูพลังชีวิต 100 หน่วย', icon: '🧪', category: 'consumable', rarity: 'common', stackable: true, sellPrice: 10 }, quantity: 15 },
  { item: { id: 'potion-002', name: 'ยาเพิ่มพลัง', description: 'เพิ่มพลังโจมตีชั่วคราว', icon: '⚗️', category: 'consumable', rarity: 'uncommon', stackable: true, sellPrice: 25 }, quantity: 5 },
  { item: { id: 'gem-001', name: 'คริสตัลสีฟ้า', description: 'วัตถุดิบสำหรับคราฟต์', icon: '💠', category: 'material', rarity: 'uncommon', stackable: true, sellPrice: 15 }, quantity: 23 },
  { item: { id: 'gem-002', name: 'อัญมณีมังกร', description: 'อัญมณีหายากจากมังกร', icon: '🔮', category: 'material', rarity: 'epic', stackable: true, sellPrice: 200 }, quantity: 3 },
  { item: { id: 'key-001', name: 'กุญแจลึกลับ', description: 'ใช้เปิดประตูลับในถ้ำคริสตัล', icon: '🗝️', category: 'quest', rarity: 'rare', stackable: false, sellPrice: 0 }, quantity: 1 },
];

const rarityColors: Record<ItemRarity, string> = {
  common: 'from-gray-400 to-gray-500',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityBorders: Record<ItemRarity, string> = {
  common: 'border-gray-400',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400',
};

const categoryIcons: Record<ItemCategory, React.ReactNode> = {
  weapon: <Sword className="w-4 h-4" />,
  armor: <Shield className="w-4 h-4" />,
  accessory: <Sparkles className="w-4 h-4" />,
  consumable: <Apple className="w-4 h-4" />,
  material: <Gem className="w-4 h-4" />,
  quest: <Scroll className="w-4 h-4" />,
};

const categoryNames: Record<ItemCategory, string> = {
  weapon: 'อาวุธ',
  armor: 'เกราะ',
  accessory: 'อุปกรณ์เสริม',
  consumable: 'ของใช้',
  material: 'วัตถุดิบ',
  quest: 'ภารกิจ',
};

export function InventoryView() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<InventorySlot | null>(null);

  // Animation
  const titleSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    config: config.gentle,
  });

  const filteredInventory = selectedCategory === 'all'
    ? MOCK_INVENTORY
    : MOCK_INVENTORY.filter(slot => slot.item.category === selectedCategory);

  const totalItems = MOCK_INVENTORY.reduce((sum, slot) => sum + slot.quantity, 0);
  const totalValue = MOCK_INVENTORY.reduce((sum, slot) => sum + (slot.item.sellPrice * slot.quantity), 0);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col gap-6">
      {/* Header */}
      <animated.div style={titleSpring} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
            <span className="text-[hsl(var(--color-text-primary))]">กระเป๋า</span>
            <Backpack className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            {MOCK_INVENTORY.length}/50 ช่อง • {totalItems} ไอเท็ม • มูลค่า {totalValue.toLocaleString()} 💰
          </p>
        </div>

        <div className="flex gap-3">
          <GlassPanel padding="sm" className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[hsl(var(--color-primary))]" />
            <span className="font-medium">จัดเรียง</span>
          </GlassPanel>
        </div>
      </animated.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
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
            {(Object.keys(categoryNames) as ItemCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center gap-2
                  ${selectedCategory === cat
                    ? 'bg-[hsl(var(--color-primary))] text-white shadow-lg'
                    : 'glass text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-primary)/0.1)]'
                  }`}
              >
                {categoryIcons[cat]}
                {categoryNames[cat]}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <GlassPanel className="p-4">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {filteredInventory.map((slot, index) => (
                <ItemSlot
                  key={slot.item.id}
                  slot={slot}
                  isSelected={selectedItem?.item.id === slot.item.id}
                  onClick={() => setSelectedItem(slot)}
                  delay={index * 30}
                />
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 50 - filteredInventory.length) }).slice(0, 20).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-xl border-2 border-dashed border-[hsl(var(--color-primary)/0.2)]
                           bg-[hsl(var(--color-primary)/0.05)]"
                />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Equipment */}
          <GlassPanel className="p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[hsl(var(--color-primary))]" />
              อุปกรณ์ที่สวมใส่
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['head', 'body', 'weapon', 'accessory1', 'accessory2'].map((slot) => {
                const equipped = MOCK_INVENTORY.find(s => s.isEquipped && s.item.equipSlot === slot);
                return (
                  <div
                    key={slot}
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center text-2xl
                      ${equipped 
                        ? `bg-gradient-to-br ${rarityColors[equipped.item.rarity]} ${rarityBorders[equipped.item.rarity]}`
                        : 'border-dashed border-[hsl(var(--color-primary)/0.3)] bg-[hsl(var(--color-primary)/0.1)]'
                      }`}
                    title={equipped?.item.name || slot}
                  >
                    {equipped?.item.icon || '➕'}
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          {/* Stats */}
          <GlassPanel className="p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-[hsl(var(--color-primary))]" />
              สถานะรวม
            </h3>
            <div className="space-y-2">
              {[
                { name: 'โจมตี', value: 15, color: 'text-red-500' },
                { name: 'ป้องกัน', value: 8, color: 'text-blue-500' },
                { name: 'พลังชีวิต', value: 0, color: 'text-green-500' },
                { name: 'ความเร็ว', value: 3, color: 'text-yellow-500' },
                { name: 'โชค', value: 0, color: 'text-purple-500' },
              ].map((stat) => (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--color-text-secondary))]">{stat.name}</span>
                  <span className={`font-bold ${stat.color}`}>+{stat.value}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Item Detail */}
          {selectedItem && (
            <GlassPanel className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                                border-2 bg-gradient-to-br ${rarityColors[selectedItem.item.rarity]}
                                ${rarityBorders[selectedItem.item.rarity]}`}>
                    {selectedItem.item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[hsl(var(--color-text-primary))]">
                      {selectedItem.item.name}
                    </h3>
                    <p className="text-xs text-[hsl(var(--color-text-muted))] capitalize">
                      {categoryNames[selectedItem.item.category]} • {selectedItem.item.rarity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg hover:bg-[hsl(var(--color-primary)/0.1)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-4">
                {selectedItem.item.description}
              </p>

              {selectedItem.item.stats && (
                <div className="space-y-1 mb-4">
                  {Object.entries(selectedItem.item.stats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--color-text-muted))]">{stat}</span>
                      <span className="text-green-500">+{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-[hsl(var(--color-text-muted))] mb-4">
                <span>จำนวน: {selectedItem.quantity}</span>
                <span>ขาย: {selectedItem.item.sellPrice} 💰</span>
              </div>

              <div className="flex gap-2">
                {selectedItem.item.isEquippable && (
                  <AnimatedButton
                    variant={selectedItem.isEquipped ? 'ghost' : 'primary'}
                    size="sm"
                    fullWidth
                  >
                    {selectedItem.isEquipped ? 'ถอด' : 'สวมใส่'}
                  </AnimatedButton>
                )}
                <AnimatedButton variant="ghost" size="sm" fullWidth>
                  ขาย
                </AnimatedButton>
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}

interface ItemSlotProps {
  slot: InventorySlot;
  isSelected: boolean;
  onClick: () => void;
  delay: number;
}

function ItemSlot({ slot, isSelected, onClick, delay }: ItemSlotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: isHovered ? 1.1 : 1 },
    delay,
    config: config.wobbly,
  });

  return (
    <animated.button
      style={spring}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative aspect-square rounded-xl border-2 bg-gradient-to-br
                ${rarityColors[slot.item.rarity]} ${rarityBorders[slot.item.rarity]}
                flex items-center justify-center text-2xl transition-all
                ${isSelected ? 'ring-2 ring-[hsl(var(--color-primary))] ring-offset-2' : ''}
                ${slot.isEquipped ? 'shadow-lg shadow-[hsl(var(--color-primary)/0.3)]' : ''}`}
    >
      {slot.item.icon}
      
      {/* Quantity badge */}
      {slot.quantity > 1 && (
        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-xs px-1 rounded">
          {slot.quantity}
        </span>
      )}

      {/* Equipped indicator */}
      {slot.isEquipped && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full
                       flex items-center justify-center text-white text-xs">
          ✓
        </span>
      )}
    </animated.button>
  );
}
