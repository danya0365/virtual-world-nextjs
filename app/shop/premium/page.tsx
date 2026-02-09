'use client';

/**
 * Premium Shop Page - Full cosmetics shopping experience
 */

import { CURRENCIES, formatCurrency } from '@/src/domain/entities/Currency';
import {
    getItemsByCategory,
    getNewItems,
    getSaleItems,
    RARITY_CONFIG,
    SHOP_BUNDLES,
    SHOP_CATEGORIES,
    SHOP_ITEMS,
    ShopBundle,
    ShopCategory,
    ShopItem
} from '@/src/domain/entities/Shop';
import { sfxGenerator } from '@/src/infrastructure/sound/SFXGenerator';
import { useInventoryStore } from '@/src/stores/inventoryStore';
import { useWalletStore } from '@/src/stores/walletStore';
import { animated, config, useSpring, useTransition } from '@react-spring/web';
import {
    Check,
    Clock,
    Package,
    Search,
    ShoppingBag,
    ShoppingCart,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function PremiumShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all' | 'new' | 'sale'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<ShopBundle | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const wallet = useWalletStore((state) => state.wallet);
  const spendCurrency = useWalletStore((state) => state.spendCurrency);
  const hasItem = useInventoryStore((state) => state.hasItem);
  const addItem = useInventoryStore((state) => state.addItem);

  // Filter items
  const filteredItems = useMemo(() => {
    let items: ShopItem[] = [];
    
    switch (selectedCategory) {
      case 'all':
        items = SHOP_ITEMS;
        break;
      case 'new':
        items = getNewItems();
        break;
      case 'sale':
        items = getSaleItems();
        break;
      default:
        items = getItemsByCategory(selectedCategory);
    }
    
    if (searchQuery) {
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nameTH.includes(searchQuery)
      );
    }
    
    return items;
  }, [selectedCategory, searchQuery]);

  // Handle purchase
  const handlePurchase = (item: ShopItem) => {
    if (hasItem(item.id)) {
      sfxGenerator.play('error');
      return;
    }
    
    if (!spendCurrency(item.price.currency, item.price.amount, `ซื้อ ${item.nameTH}`)) {
      sfxGenerator.play('error');
      return;
    }
    
    addItem(item.id, 'shop');
    setPurchaseSuccess(true);
    sfxGenerator.play('success');
    
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedItem(null);
    }, 2000);
  };

  // Handle bundle purchase
  const handleBundlePurchase = (bundle: ShopBundle) => {
    // Check if already has any item
    if (bundle.items.some(itemId => hasItem(itemId))) {
      sfxGenerator.play('error');
      return;
    }
    
    if (!spendCurrency(bundle.price.currency, bundle.price.amount, `ซื้อ ${bundle.nameTH}`)) {
      sfxGenerator.play('error');
      return;
    }
    
    bundle.items.forEach(itemId => addItem(itemId, 'shop'));
    setPurchaseSuccess(true);
    sfxGenerator.play('levelup');
    
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedBundle(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🛒 ร้านค้า Premium
          </h1>
          <p className="text-[hsl(var(--color-text-muted))]">
            สกิน ชุด เครื่องประดับ และอื่นๆ อีกมากมาย!
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Featured Bundles */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          🎁 ชุดรวมสุดคุ้ม
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_BUNDLES.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onClick={() => setSelectedBundle(bundle)}
              isOwned={bundle.items.every(itemId => hasItem(itemId))}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryTab
          icon="🔥"
          label="ทั้งหมด"
          isActive={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        />
        <CategoryTab
          icon="🆕"
          label="ใหม่"
          isActive={selectedCategory === 'new'}
          onClick={() => setSelectedCategory('new')}
          badge={getNewItems().length}
        />
        <CategoryTab
          icon="💸"
          label="ลดราคา"
          isActive={selectedCategory === 'sale'}
          onClick={() => setSelectedCategory('sale')}
          badge={getSaleItems().length}
        />
        {SHOP_CATEGORIES.filter(c => c.id !== 'bundles' && c.id !== 'limited').map((cat) => (
          <CategoryTab
            key={cat.id}
            icon={cat.icon}
            label={cat.nameTH}
            isActive={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          />
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
            isOwned={hasItem(item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-[hsl(var(--color-text-muted))]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>ไม่พบสินค้าในหมวดหมู่นี้</p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOwned={hasItem(selectedItem.id)}
          canAfford={wallet[selectedItem.price.currency] >= selectedItem.price.amount}
          onPurchase={() => handlePurchase(selectedItem)}
          onClose={() => setSelectedItem(null)}
          purchaseSuccess={purchaseSuccess}
        />
      )}

      {/* Bundle Detail Modal */}
      {selectedBundle && (
        <BundleDetailModal
          bundle={selectedBundle}
          isOwned={selectedBundle.items.every(itemId => hasItem(itemId))}
          canAfford={wallet[selectedBundle.price.currency] >= selectedBundle.price.amount}
          onPurchase={() => handleBundlePurchase(selectedBundle)}
          onClose={() => setSelectedBundle(null)}
          purchaseSuccess={purchaseSuccess}
        />
      )}
    </div>
  );
}

// Category Tab
function CategoryTab({
  icon,
  label,
  isActive,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'glass hover:bg-[hsl(var(--color-surface))]'
                }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
          {badge}
        </span>
      )}
    </button>
  );
}

// Shop Item Card
function ShopItemCard({
  item,
  onClick,
  isOwned,
}: {
  item: ShopItem;
  onClick: () => void;
  isOwned: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const rarity = RARITY_CONFIG[item.rarity];
  const currency = CURRENCIES[item.price.currency];

  const hoverSpring = useSpring({
    scale: isHovered ? 1.05 : 1,
    y: isHovered ? -8 : 0,
    config: config.wobbly,
  });

  return (
    <animated.div
      style={hoverSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all
                 ${isOwned ? 'opacity-60' : ''}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-10`} />
      
      {/* Content */}
      <div className="relative p-4 glass">
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {item.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
              NEW
            </span>
          )}
          {item.isSale && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              SALE
            </span>
          )}
          {item.isLimited && (
            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
              LIMITED
            </span>
          )}
          {isOwned && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> OWNED
            </span>
          )}
        </div>

        {/* Icon */}
        <div
          className="text-5xl mb-3 text-center"
          style={{ filter: `drop-shadow(0 0 10px ${rarity.color})` }}
        >
          {item.icon}
        </div>

        {/* Info */}
        <h3 className="font-bold text-sm truncate">{item.nameTH}</h3>
        <p
          className="text-xs mb-2"
          style={{ color: rarity.color }}
        >
          {rarity.nameTH}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>{currency.icon}</span>
            <span
              className="font-bold"
              style={{ color: currency.color }}
            >
              {formatCurrency(item.price.amount)}
            </span>
          </div>
          {item.price.originalAmount && (
            <span className="text-xs line-through text-[hsl(var(--color-text-muted))]">
              {formatCurrency(item.price.originalAmount)}
            </span>
          )}
        </div>
      </div>
    </animated.div>
  );
}

// Bundle Card
function BundleCard({
  bundle,
  onClick,
  isOwned,
}: {
  bundle: ShopBundle;
  onClick: () => void;
  isOwned: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currency = CURRENCIES[bundle.price.currency];

  const hoverSpring = useSpring({
    scale: isHovered ? 1.02 : 1,
    y: isHovered ? -4 : 0,
    config: config.wobbly,
  });

  return (
    <animated.div
      style={hoverSpring}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer
                 bg-gradient-to-br from-purple-500/20 to-pink-500/20
                 border-2 border-purple-500/30 ${isOwned ? 'opacity-60' : ''}`}
    >
      {/* Discount Badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500 text-white font-bold text-sm">
        -{bundle.discountPercent}%
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{bundle.icon}</div>
          <div>
            <h3 className="font-bold">{bundle.nameTH}</h3>
            <p className="text-sm text-[hsl(var(--color-text-muted))]">
              {bundle.items.length} ไอเทม
            </p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="flex gap-2 mb-4">
          {bundle.items.slice(0, 3).map((itemId) => {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            if (!item) return null;
            return (
              <div
                key={itemId}
                className="w-10 h-10 rounded-lg glass-subtle flex items-center justify-center text-xl"
                title={item.nameTH}
              >
                {item.icon}
              </div>
            );
          })}
          {bundle.items.length > 3 && (
            <div className="w-10 h-10 rounded-lg glass-subtle flex items-center justify-center text-sm">
              +{bundle.items.length - 3}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currency.icon}</span>
            <span className="text-2xl font-bold" style={{ color: currency.color }}>
              {formatCurrency(bundle.price.amount)}
            </span>
          </div>
          <span className="text-sm line-through text-[hsl(var(--color-text-muted))]">
            {formatCurrency(bundle.price.originalAmount)}
          </span>
        </div>

        {/* Limited Timer */}
        {bundle.endDate && (
          <div className="mt-3 flex items-center gap-1 text-xs text-orange-500">
            <Clock className="w-3 h-3" />
            หมดเขต: {new Date(bundle.endDate).toLocaleDateString('th-TH')}
          </div>
        )}
      </div>
    </animated.div>
  );
}

// Item Detail Modal
function ItemDetailModal({
  item,
  isOwned,
  canAfford,
  onPurchase,
  onClose,
  purchaseSuccess,
}: {
  item: ShopItem;
  isOwned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onClose: () => void;
  purchaseSuccess: boolean;
}) {
  const rarity = RARITY_CONFIG[item.rarity];
  const currency = CURRENCIES[item.price.currency];

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
            {/* Header with gradient */}
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

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Rarity & Category */}
              <div className="flex items-center justify-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${rarity.color}30`, color: rarity.color }}
                >
                  ⭐ {rarity.nameTH}
                </span>
                <span className="px-3 py-1 rounded-full glass-subtle text-sm">
                  {SHOP_CATEGORIES.find(c => c.id === item.category)?.nameTH}
                </span>
              </div>

              {/* Description */}
              <p className="text-center text-[hsl(var(--color-text-muted))]">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex justify-center gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{currency.icon}</span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: currency.color }}
                  >
                    {formatCurrency(item.price.amount)}
                  </span>
                  {item.price.originalAmount && (
                    <span className="text-lg line-through text-[hsl(var(--color-text-muted))]">
                      {formatCurrency(item.price.originalAmount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              {purchaseSuccess ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 text-white font-bold">
                    <Check className="w-6 h-6" />
                    ซื้อสำเร็จ!
                  </div>
                </div>
              ) : isOwned ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-gray-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  มีในคลังแล้ว
                </button>
              ) : (
                <button
                  onClick={onPurchase}
                  disabled={!canAfford}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2
                            ${canAfford
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                              : 'bg-gray-500 text-white cursor-not-allowed opacity-50'
                            }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {canAfford ? 'ซื้อเลย!' : 'ยอดเงินไม่พอ'}
                </button>
              )}
            </div>
          </div>
        </animated.div>
      </>
    ) : null
  );
}

// Bundle Detail Modal
function BundleDetailModal({
  bundle,
  isOwned,
  canAfford,
  onPurchase,
  onClose,
  purchaseSuccess,
}: {
  bundle: ShopBundle;
  isOwned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onClose: () => void;
  purchaseSuccess: boolean;
}) {
  const currency = CURRENCIES[bundle.price.currency];

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
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
        >
          <div className="glass rounded-3xl overflow-hidden m-4">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white font-bold">
                -{bundle.discountPercent}% OFF
              </div>

              <div className="text-center mt-4">
                <div className="text-6xl mb-4">{bundle.icon}</div>
                <h2 className="text-2xl font-bold text-white">{bundle.nameTH}</h2>
                <p className="text-white/80">{bundle.description}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold">รายการในชุด ({bundle.items.length} ไอเทม)</h3>
              <div className="grid grid-cols-2 gap-3">
                {bundle.items.map((itemId) => {
                  const item = SHOP_ITEMS.find(i => i.id === itemId);
                  if (!item) return null;
                  const rarity = RARITY_CONFIG[item.rarity];
                  return (
                    <div key={itemId} className="flex items-center gap-3 p-3 glass-subtle rounded-xl">
                      <div
                        className="text-3xl"
                        style={{ filter: `drop-shadow(0 0 5px ${rarity.color})` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.nameTH}</p>
                        <p className="text-xs" style={{ color: rarity.color }}>
                          {rarity.nameTH}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price */}
              <div className="text-center border-t border-white/10 pt-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">{currency.icon}</span>
                  <span className="text-3xl font-bold" style={{ color: currency.color }}>
                    {formatCurrency(bundle.price.amount)}
                  </span>
                  <span className="text-lg line-through text-[hsl(var(--color-text-muted))]">
                    {formatCurrency(bundle.price.originalAmount)}
                  </span>
                </div>
                <p className="text-sm text-green-500 mt-1">
                  ประหยัด {formatCurrency(bundle.price.originalAmount - bundle.price.amount)} 💎
                </p>
              </div>

              {/* Purchase Button */}
              {purchaseSuccess ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 text-white font-bold">
                    <Check className="w-6 h-6" />
                    ซื้อสำเร็จ!
                  </div>
                </div>
              ) : isOwned ? (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-gray-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  มีในคลังแล้ว
                </button>
              ) : (
                <button
                  onClick={onPurchase}
                  disabled={!canAfford}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2
                            ${canAfford
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                              : 'bg-gray-500 text-white cursor-not-allowed opacity-50'
                            }`}
                >
                  <Package className="w-5 h-5" />
                  {canAfford ? 'ซื้อชุดรวม!' : 'ยอดเงินไม่พอ'}
                </button>
              )}
            </div>
          </div>
        </animated.div>
      </>
    ) : null
  );
}
