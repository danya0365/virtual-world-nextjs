'use client';

/**
 * Enhanced Inventory View - View and manage owned items
 * Supports both shop items and gacha items
 */

import { GACHA_ITEMS, GachaItem } from '@/src/domain/entities/Gacha';
import {
    ItemRarity,
    RARITY_CONFIG,
    SHOP_ITEMS,
    ShopItem
} from '@/src/domain/entities/Shop';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { EquippedItems, useInventoryStore } from '@/src/stores/inventoryStore';
import { animated, config, useSpring, useTransition } from '@react-spring/web';
import {
    Box,
    Check,
    ChevronRight,
    Grid,
    List,
    Search,
    Shirt,
    Sparkles,
    User,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';

type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | 'skins' | 'outfits' | 'accessories' | 'emotes' | 'effects' | 'furniture' | 'pets' | 'characters';

export function EnhancedInventoryView() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopItem | GachaItem | null>(null);

  const items = useInventoryStore((state) => state.items);
  const equipped = useInventoryStore((state) => state.equipped);
  const equipItem = useInventoryStore((state) => state.equipItem);
  const unequipItem = useInventoryStore((state) => state.unequipItem);

  // Get full item data for inventory items
  const inventoryWithData = useMemo(() => {
    return items.map((invItem) => {
      const shopItem = SHOP_ITEMS.find(i => i.id === invItem.itemId);
      const gachaItem = GACHA_ITEMS.find(i => i.id === invItem.itemId);
      const itemData = shopItem || gachaItem;
      
      return {
        ...invItem,
        data: itemData,
      };
    }).filter(item => item.data !== undefined);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    let result = inventoryWithData;
    
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.data?.category === categoryFilter);
    }
    
    if (searchQuery) {
      result = result.filter(
        item =>
          item.data?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.data?.nameTH.includes(searchQuery)
      );
    }
    
    return result;
  }, [inventoryWithData, categoryFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const byRarity: Record<ItemRarity, number> = {
      common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0,
    };
    
    inventoryWithData.forEach(item => {
      if (item.data) {
        byRarity[item.data.rarity as ItemRarity]++;
      }
    });
    
    return {
      total: inventoryWithData.length,
      byRarity,
    };
  }, [inventoryWithData]);

  const handleEquip = (itemId: string, category: string) => {
    const slot = getCategorySlot(category);
    if (slot) {
      equipItem(itemId, slot);
      sfxGenerator.play('success');
    }
  };

  const handleUnequip = (slot: keyof EquippedItems, itemId?: string) => {
    unequipItem(slot, itemId);
    sfxGenerator.play('click');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            📦 คลังไอเทม
          </h1>
          <p className="text-[hsl(var(--color-text-muted))]">
            จัดการไอเทมและอุปกรณ์ของคุณ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--color-text-muted))]" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex glass rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : ''}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : ''}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Character Preview & Equipped */}
        <div className="lg:col-span-1 space-y-4">
          {/* Character Preview */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              ตัวละครของคุณ
            </h3>
            
            <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <div className="text-8xl">🧑‍💻</div>
            </div>

            {/* Equipped Items */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[hsl(var(--color-text-muted))]">สวมใส่อยู่</h4>
              
              <EquippedSlot
                label="สกิน"
                icon="🎭"
                itemId={equipped.skin}
                onUnequip={() => handleUnequip('skin')}
              />
              <EquippedSlot
                label="ชุด"
                icon="👗"
                itemId={equipped.outfit}
                onUnequip={() => handleUnequip('outfit')}
              />
              <EquippedSlot
                label="เอฟเฟกต์"
                icon="✨"
                itemId={equipped.effect}
                onUnequip={() => handleUnequip('effect')}
              />
              <EquippedSlot
                label="สัตว์เลี้ยง"
                icon="🐾"
                itemId={equipped.pet}
                onUnequip={() => handleUnequip('pet')}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              สถิติคลัง
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[hsl(var(--color-text-muted))]">ทั้งหมด</span>
                <span className="font-bold">{stats.total}</span>
              </div>
              
              {Object.entries(stats.byRarity)
                .filter(([, count]) => count > 0)
                .sort(([a], [b]) => 
                  ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(a) -
                  ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(b)
                )
                .map(([rarity, count]) => (
                  <div key={rarity} className="flex justify-between items-center">
                    <span style={{ color: RARITY_CONFIG[rarity as ItemRarity].color }}>
                      {RARITY_CONFIG[rarity as ItemRarity].nameTH}
                    </span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', name: 'ทั้งหมด', icon: '📦' },
              { id: 'skins', name: 'สกิน', icon: '🎭' },
              { id: 'outfits', name: 'ชุด', icon: '👗' },
              { id: 'accessories', name: 'เครื่องประดับ', icon: '👑' },
              { id: 'emotes', name: 'ท่าทาง', icon: '💃' },
              { id: 'effects', name: 'เอฟเฟกต์', icon: '✨' },
              { id: 'pets', name: 'สัตว์เลี้ยง', icon: '🐾' },
              { id: 'characters', name: 'ตัวละคร', icon: '🧑‍🎤' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition
                          ${categoryFilter === cat.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'glass hover:bg-[hsl(var(--color-surface))]'
                          }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
              : 'space-y-2'
            }>
              {filteredItems.map((item) => {
                if (!item.data) return null;
                
                return viewMode === 'grid' ? (
                  <InventoryItemCard
                    key={item.id}
                    item={item.data}
                    isEquipped={item.isEquipped}
                    quantity={item.quantity}
                    onClick={() => setSelectedItem(item.data!)}
                  />
                ) : (
                  <InventoryItemRow
                    key={item.id}
                    item={item.data}
                    isEquipped={item.isEquipped}
                    quantity={item.quantity}
                    source={item.source}
                    onClick={() => setSelectedItem(item.data!)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <Box className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--color-text-muted))] opacity-50" />
              <h3 className="text-xl font-bold mb-2">คลังว่างเปล่า</h3>
              <p className="text-[hsl(var(--color-text-muted))] mb-4">
                ยังไม่มีไอเทมในหมวดหมู่นี้
              </p>
              <a
                href="/shop/premium"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90"
              >
                <Shirt className="w-5 h-5" />
                ไปซื้อที่ร้านค้า
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          equipped={equipped}
          onEquip={handleEquip}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// Equipped Slot
function EquippedSlot({
  label,
  icon,
  itemId,
  onUnequip,
}: {
  label: string;
  icon: string;
  itemId?: string | string[];
  onUnequip: () => void;
}) {
  const item = typeof itemId === 'string'
    ? SHOP_ITEMS.find(i => i.id === itemId) || GACHA_ITEMS.find(i => i.id === itemId)
    : null;

  return (
    <div className="flex items-center justify-between p-2 glass-subtle rounded-xl">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      {item ? (
        <div className="flex items-center gap-2">
          <span className="text-lg">{item.icon}</span>
          <button
            onClick={onUnequip}
            className="p-1 rounded-lg hover:bg-red-500/20 transition"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ) : (
        <span className="text-xs text-[hsl(var(--color-text-muted))]">ว่าง</span>
      )}
    </div>
  );
}

// Inventory Item Card (Grid View)
function InventoryItemCard({
  item,
  isEquipped,
  quantity,
  onClick,
}: {
  item: ShopItem | GachaItem;
  isEquipped?: boolean;
  quantity?: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const rarity = RARITY_CONFIG[item.rarity as ItemRarity] || RARITY_CONFIG.common;

  const hoverSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    y: isHovered ? -4 : 0,
    config: config.wobbly,
  });

  return (
    <animated.div
      style={hoverSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer glass"
    >
      {/* Rarity gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-10`} />

      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {isEquipped && (
          <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
            EQUIPPED
          </span>
        )}
        {quantity && quantity > 1 && (
          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
            x{quantity}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative p-4 text-center">
        <div
          className="text-5xl mb-2"
          style={{ filter: `drop-shadow(0 0 10px ${rarity.color})` }}
        >
          {item.icon}
        </div>
        <h3 className="font-bold text-sm truncate">{item.nameTH}</h3>
        <p className="text-xs" style={{ color: rarity.color }}>
          {rarity.nameTH}
        </p>
      </div>
    </animated.div>
  );
}

// Inventory Item Row (List View)
function InventoryItemRow({
  item,
  isEquipped,
  quantity,
  source,
  onClick,
}: {
  item: ShopItem | GachaItem;
  isEquipped?: boolean;
  quantity?: number;
  source: string;
  onClick: () => void;
}) {
  const rarity = RARITY_CONFIG[item.rarity as ItemRarity] || RARITY_CONFIG.common;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 glass rounded-xl cursor-pointer hover:bg-[hsl(var(--color-surface))] transition"
    >
      <div
        className="text-4xl"
        style={{ filter: `drop-shadow(0 0 8px ${rarity.color})` }}
      >
        {item.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold truncate">{item.nameTH}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: rarity.color }}>
            {rarity.nameTH}
          </span>
          <span className="text-xs text-[hsl(var(--color-text-muted))]">•</span>
          <span className="text-xs text-[hsl(var(--color-text-muted))] capitalize">
            {source}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEquipped && (
          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
            สวมใส่
          </span>
        )}
        {quantity && quantity > 1 && (
          <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs font-medium">
            x{quantity}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-muted))]" />
      </div>
    </div>
  );
}

// Item Detail Modal
function ItemDetailModal({
  item,
  equipped,
  onEquip,
  onClose,
}: {
  item: ShopItem | GachaItem;
  equipped: EquippedItems;
  onEquip: (itemId: string, category: string) => void;
  onClose: () => void;
}) {
  const rarity = RARITY_CONFIG[item.rarity as ItemRarity] || RARITY_CONFIG.common;
  const slot = getCategorySlot(item.category);
  const isEquipped = slot && (
    equipped[slot] === item.id ||
    (slot === 'accessory' && equipped.accessory?.includes(item.id))
  );

  const transitions = useTransition(true, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: config.stiff,
  });

  return transitions((style, show) =>
    show ? (
      <>
        <animated.div
          style={{ opacity: style.opacity }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <animated.div
          style={style}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
        >
          <div className="glass rounded-3xl overflow-hidden m-4">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-br ${rarity.gradient} relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div
                  className="text-8xl mb-4"
                  style={{ filter: `drop-shadow(0 0 20px ${rarity.color})` }}
                >
                  {item.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{item.nameTH}</h2>
                <p className="text-white/80">{item.name}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Rarity */}
              <div className="text-center">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${rarity.color}30`, color: rarity.color }}
                >
                  ⭐ {rarity.nameTH}
                </span>
              </div>

              {/* Description */}
              <p className="text-center text-[hsl(var(--color-text-muted))]">
                {item.description}
              </p>

              {/* Actions */}
              {slot && (
                <button
                  onClick={() => {
                    onEquip(item.id, item.category);
                    onClose();
                  }}
                  disabled={isEquipped}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2
                            ${isEquipped
                              ? 'bg-gray-500 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                            }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-5 h-5" />
                      สวมใส่อยู่แล้ว
                    </>
                  ) : (
                    <>
                      <Shirt className="w-5 h-5" />
                      สวมใส่
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </animated.div>
      </>
    ) : null
  );
}

// Helper to get equipment slot from category
function getCategorySlot(category: string): keyof EquippedItems | null {
  const mapping: Record<string, keyof EquippedItems> = {
    skins: 'skin',
    skin: 'skin',
    outfits: 'outfit',
    outfit: 'outfit',
    accessories: 'accessory',
    accessory: 'accessory',
    effects: 'effect',
    effect: 'effect',
    pets: 'pet',
    pet: 'pet',
    mounts: 'mount',
    mount: 'mount',
  };
  
  return mapping[category] || null;
}

export default EnhancedInventoryView;
