/**
 * Premium Shop Domain Types
 * Skins, Outfits, Cosmetics, and other purchasable items
 */

import { CurrencyType } from './Currency';

// =============================================================================
// SHOP ITEM TYPES
// =============================================================================

export type ShopCategory = 
  | 'skins'           // Character skins
  | 'outfits'         // Full outfit sets
  | 'accessories'     // Hats, glasses, wings
  | 'emotes'          // Emote animations
  | 'effects'         // Particle effects, auras
  | 'furniture'       // House decorations
  | 'bundles'         // Multi-item packages
  | 'limited';        // Time-limited items

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface ShopItem {
  id: string;
  name: string;
  nameTH: string;
  description: string;
  category: ShopCategory;
  rarity: ItemRarity;
  icon: string;
  image?: string;
  price: {
    currency: CurrencyType;
    amount: number;
    originalAmount?: number; // For sales
  };
  tags?: string[];
  isNew?: boolean;
  isLimited?: boolean;
  isSale?: boolean;
  saleEndDate?: Date;
  releaseDate?: Date;
  stock?: number; // Limited stock
  soldCount?: number;
  previewModel?: string; // 3D model path
}

// =============================================================================
// SHOP BUNDLE
// =============================================================================

export interface ShopBundle {
  id: string;
  name: string;
  nameTH: string;
  description: string;
  icon: string;
  items: string[]; // Item IDs
  price: {
    currency: CurrencyType;
    amount: number;
    originalAmount: number; // Total if bought separately
  };
  discountPercent: number;
  isLimited?: boolean;
  endDate?: Date;
}

// =============================================================================
// VIP/SUBSCRIPTION
// =============================================================================

export type VIPTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface VIPBenefit {
  id: string;
  name: string;
  nameTH: string;
  description: string;
  icon: string;
  tier: VIPTier;
}

export interface VIPSubscription {
  tier: VIPTier;
  name: string;
  nameTH: string;
  icon: string;
  color: string;
  price: number; // Per month in gems
  benefits: VIPBenefit[];
  bonusGems: number;
  bonusExp: number; // Multiplier
  bonusCoinDrop: number; // Multiplier
  dailyRewards: string[]; // Item IDs
}

// =============================================================================
// BATTLE PASS
// =============================================================================

export interface BattlePassReward {
  level: number;
  freeReward?: {
    type: 'currency' | 'item';
    id?: string;
    amount?: number;
    currencyType?: CurrencyType;
  };
  premiumReward?: {
    type: 'currency' | 'item';
    id?: string;
    amount?: number;
    currencyType?: CurrencyType;
  };
}

export interface BattlePass {
  id: string;
  name: string;
  nameTH: string;
  season: number;
  startDate: Date;
  endDate: Date;
  maxLevel: number;
  premiumPrice: number; // In gems
  rewards: BattlePassReward[];
  featuredReward: string; // Item ID at max level
}

// =============================================================================
// MOCK DATA - SHOP ITEMS
// =============================================================================

export const SHOP_ITEMS: ShopItem[] = [
  // Skins
  {
    id: 'skin_dragon_warrior',
    name: 'Dragon Warrior',
    nameTH: 'นักรบมังกร',
    description: 'สกินชุดเกราะมังกรที่ทรงพลัง',
    category: 'skins',
    rarity: 'legendary',
    icon: '🐉',
    price: { currency: 'gems', amount: 2400 },
    isNew: true,
  },
  {
    id: 'skin_celestial_mage',
    name: 'Celestial Mage',
    nameTH: 'จอมเวทสวรรค์',
    description: 'สกินจอมเวทแห่งดวงดาว',
    category: 'skins',
    rarity: 'epic',
    icon: '✨',
    price: { currency: 'gems', amount: 1600 },
    tags: ['ยอดนิยม'],
  },
  {
    id: 'skin_shadow_ninja',
    name: 'Shadow Ninja',
    nameTH: 'นินจาเงา',
    description: 'สกินนินจาแห่งความมืด',
    category: 'skins',
    rarity: 'epic',
    icon: '🥷',
    price: { currency: 'gems', amount: 1400, originalAmount: 1800 },
    isSale: true,
  },
  {
    id: 'skin_ocean_guardian',
    name: 'Ocean Guardian',
    nameTH: 'ผู้พิทักษ์มหาสมุทร',
    description: 'สกินแห่งท้องทะเล',
    category: 'skins',
    rarity: 'rare',
    icon: '🌊',
    price: { currency: 'gems', amount: 800 },
  },
  
  // Outfits
  {
    id: 'outfit_sakura',
    name: 'Sakura Festival',
    nameTH: 'เทศกาลซากุระ',
    description: 'ชุดกิโมโนลายดอกซากุระ',
    category: 'outfits',
    rarity: 'epic',
    icon: '🌸',
    price: { currency: 'gems', amount: 1200 },
    isLimited: true,
    saleEndDate: new Date('2026-03-15'),
  },
  {
    id: 'outfit_winter',
    name: 'Winter Wonderland',
    nameTH: 'ดินแดนหิมะ',
    description: 'ชุดกันหนาวน่ารักๆ',
    category: 'outfits',
    rarity: 'rare',
    icon: '❄️',
    price: { currency: 'gems', amount: 900 },
  },
  {
    id: 'outfit_beach',
    name: 'Beach Party',
    nameTH: 'ปาร์ตี้ริมหาด',
    description: 'ชุดว่ายน้ำสุดเซ็กซี่',
    category: 'outfits',
    rarity: 'uncommon',
    icon: '🏖️',
    price: { currency: 'coins', amount: 15000 },
  },
  {
    id: 'outfit_casual',
    name: 'Casual Style',
    nameTH: 'สไตล์ลำลอง',
    description: 'ชุดใส่สบายๆ ประจำวัน',
    category: 'outfits',
    rarity: 'common',
    icon: '👕',
    price: { currency: 'coins', amount: 5000 },
  },
  
  // Accessories
  {
    id: 'acc_angel_wings',
    name: 'Angel Wings',
    nameTH: 'ปีกนางฟ้า',
    description: 'ปีกสีขาวบริสุทธิ์',
    category: 'accessories',
    rarity: 'legendary',
    icon: '👼',
    price: { currency: 'gems', amount: 3200 },
  },
  {
    id: 'acc_demon_horns',
    name: 'Demon Horns',
    nameTH: 'เขาปีศาจ',
    description: 'เขาสีดำทรงพลัง',
    category: 'accessories',
    rarity: 'epic',
    icon: '😈',
    price: { currency: 'gems', amount: 1000 },
  },
  {
    id: 'acc_cat_ears',
    name: 'Cat Ears',
    nameTH: 'หูแมว',
    description: 'หูแมวน่ารักๆ',
    category: 'accessories',
    rarity: 'rare',
    icon: '🐱',
    price: { currency: 'gems', amount: 600 },
    tags: ['ยอดนิยม'],
  },
  {
    id: 'acc_cool_glasses',
    name: 'Cool Glasses',
    nameTH: 'แว่นเท่ๆ',
    description: 'แว่นกันแดดสุดคูล',
    category: 'accessories',
    rarity: 'uncommon',
    icon: '😎',
    price: { currency: 'coins', amount: 8000 },
  },
  
  // Emotes
  {
    id: 'emote_dance_party',
    name: 'Dance Party',
    nameTH: 'เต้นรำปาร์ตี้',
    description: 'ท่าเต้นสุดมันส์',
    category: 'emotes',
    rarity: 'epic',
    icon: '💃',
    price: { currency: 'gems', amount: 800 },
    isNew: true,
  },
  {
    id: 'emote_cute_wave',
    name: 'Cute Wave',
    nameTH: 'โบกมือน่ารัก',
    description: 'โบกมือทักทาย',
    category: 'emotes',
    rarity: 'rare',
    icon: '👋',
    price: { currency: 'gems', amount: 400 },
  },
  {
    id: 'emote_victory',
    name: 'Victory Pose',
    nameTH: 'ท่าชัยชนะ',
    description: 'ท่าโพสฉลองชัยชนะ',
    category: 'emotes',
    rarity: 'uncommon',
    icon: '✌️',
    price: { currency: 'coins', amount: 5000 },
  },
  
  // Effects
  {
    id: 'effect_rainbow_aura',
    name: 'Rainbow Aura',
    nameTH: 'ออร่าสายรุ้ง',
    description: 'ออร่าเรืองแสง 7 สี',
    category: 'effects',
    rarity: 'legendary',
    icon: '🌈',
    price: { currency: 'gems', amount: 2800 },
  },
  {
    id: 'effect_fire_trail',
    name: 'Fire Trail',
    nameTH: 'ร่องรอยเพลิง',
    description: 'เดินมีเปลวไฟตาม',
    category: 'effects',
    rarity: 'epic',
    icon: '🔥',
    price: { currency: 'gems', amount: 1400 },
  },
  {
    id: 'effect_sparkles',
    name: 'Sparkle Effect',
    nameTH: 'ประกายระยิบระยับ',
    description: 'มีประกายตามตัว',
    category: 'effects',
    rarity: 'rare',
    icon: '✨',
    price: { currency: 'coins', amount: 12000 },
  },
  
  // Furniture
  {
    id: 'furn_royal_throne',
    name: 'Royal Throne',
    nameTH: 'บัลลังก์ราชา',
    description: 'บัลลังก์ทองคำอลังการ',
    category: 'furniture',
    rarity: 'legendary',
    icon: '👑',
    price: { currency: 'gems', amount: 3500 },
  },
  {
    id: 'furn_crystal_lamp',
    name: 'Crystal Lamp',
    nameTH: 'โคมไฟคริสตัล',
    description: 'โคมไฟเรืองแสง',
    category: 'furniture',
    rarity: 'epic',
    icon: '💎',
    price: { currency: 'gems', amount: 1100 },
  },
  {
    id: 'furn_cozy_bed',
    name: 'Cozy Bed',
    nameTH: 'เตียงนุ่มนิ่ม',
    description: 'เตียงนอนสบาย',
    category: 'furniture',
    rarity: 'rare',
    icon: '🛏️',
    price: { currency: 'coins', amount: 10000 },
  },
];

// =============================================================================
// MOCK DATA - BUNDLES
// =============================================================================

export const SHOP_BUNDLES: ShopBundle[] = [
  {
    id: 'bundle_dragon_set',
    name: 'Dragon Master Set',
    nameTH: 'เซ็ตจ้าวมังกร',
    description: 'ชุดเต็มของนักรบมังกร',
    icon: '🐲',
    items: ['skin_dragon_warrior', 'effect_fire_trail', 'acc_demon_horns'],
    price: {
      currency: 'gems',
      amount: 4500,
      originalAmount: 6200,
    },
    discountPercent: 27,
    isLimited: true,
    endDate: new Date('2026-02-28'),
  },
  {
    id: 'bundle_celestial',
    name: 'Celestial Pack',
    nameTH: 'แพ็คสวรรค์',
    description: 'ชุดของผู้พิทักษ์สวรรค์',
    icon: '✨',
    items: ['skin_celestial_mage', 'acc_angel_wings', 'effect_rainbow_aura'],
    price: {
      currency: 'gems',
      amount: 5800,
      originalAmount: 8400,
    },
    discountPercent: 31,
  },
  {
    id: 'bundle_starter',
    name: 'Starter Pack',
    nameTH: 'แพ็คเริ่มต้น',
    description: 'แพ็คสำหรับผู้เล่นใหม่',
    icon: '🎁',
    items: ['outfit_casual', 'emote_cute_wave', 'acc_cool_glasses'],
    price: {
      currency: 'gems',
      amount: 500,
      originalAmount: 1200,
    },
    discountPercent: 58,
  },
];

// =============================================================================
// MOCK DATA - VIP SUBSCRIPTIONS
// =============================================================================

export const VIP_SUBSCRIPTIONS: Record<VIPTier, VIPSubscription> = {
  bronze: {
    tier: 'bronze',
    name: 'Bronze VIP',
    nameTH: 'VIP บรอนซ์',
    icon: '🥉',
    color: '#CD7F32',
    price: 300,
    bonusGems: 50,
    bonusExp: 1.2,
    bonusCoinDrop: 1.1,
    benefits: [],
    dailyRewards: [],
  },
  silver: {
    tier: 'silver',
    name: 'Silver VIP',
    nameTH: 'VIP เงิน',
    icon: '🥈',
    color: '#C0C0C0',
    price: 600,
    bonusGems: 150,
    bonusExp: 1.5,
    bonusCoinDrop: 1.2,
    benefits: [],
    dailyRewards: [],
  },
  gold: {
    tier: 'gold',
    name: 'Gold VIP',
    nameTH: 'VIP ทอง',
    icon: '🥇',
    color: '#FFD700',
    price: 1200,
    bonusGems: 400,
    bonusExp: 2.0,
    bonusCoinDrop: 1.5,
    benefits: [],
    dailyRewards: [],
  },
  platinum: {
    tier: 'platinum',
    name: 'Platinum VIP',
    nameTH: 'VIP แพลตินัม',
    icon: '💎',
    color: '#E5E4E2',
    price: 2500,
    bonusGems: 1000,
    bonusExp: 2.5,
    bonusCoinDrop: 2.0,
    benefits: [],
    dailyRewards: [],
  },
  diamond: {
    tier: 'diamond',
    name: 'Diamond VIP',
    nameTH: 'VIP เพชร',
    icon: '💠',
    color: '#B9F2FF',
    price: 5000,
    bonusGems: 2500,
    bonusExp: 3.0,
    bonusCoinDrop: 2.5,
    benefits: [],
    dailyRewards: [],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find(item => item.id === id);
}

export function getItemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.category === category);
}

export function getBundleById(id: string): ShopBundle | undefined {
  return SHOP_BUNDLES.find(bundle => bundle.id === id);
}

export function getActiveItems(): ShopItem[] {
  const now = new Date();
  return SHOP_ITEMS.filter(item => {
    if (item.saleEndDate && item.saleEndDate < now) return false;
    return true;
  });
}

export function getNewItems(): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.isNew);
}

export function getSaleItems(): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.isSale);
}

export function getLimitedItems(): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.isLimited);
}

export const SHOP_CATEGORIES: { id: ShopCategory; name: string; nameTH: string; icon: string }[] = [
  { id: 'skins', name: 'Skins', nameTH: 'สกิน', icon: '🎭' },
  { id: 'outfits', name: 'Outfits', nameTH: 'ชุด', icon: '👗' },
  { id: 'accessories', name: 'Accessories', nameTH: 'เครื่องประดับ', icon: '👑' },
  { id: 'emotes', name: 'Emotes', nameTH: 'ท่าทาง', icon: '💃' },
  { id: 'effects', name: 'Effects', nameTH: 'เอฟเฟกต์', icon: '✨' },
  { id: 'furniture', name: 'Furniture', nameTH: 'เฟอร์นิเจอร์', icon: '🏠' },
  { id: 'bundles', name: 'Bundles', nameTH: 'ชุดรวม', icon: '🎁' },
  { id: 'limited', name: 'Limited', nameTH: 'จำกัดเวลา', icon: '⏰' },
];

export const RARITY_CONFIG: Record<ItemRarity, { color: string; gradient: string; nameTH: string }> = {
  common: { color: '#9CA3AF', gradient: 'from-gray-400 to-gray-500', nameTH: 'ธรรมดา' },
  uncommon: { color: '#22C55E', gradient: 'from-green-400 to-green-600', nameTH: 'ไม่ธรรมดา' },
  rare: { color: '#3B82F6', gradient: 'from-blue-400 to-blue-600', nameTH: 'หายาก' },
  epic: { color: '#A855F7', gradient: 'from-purple-400 to-purple-600', nameTH: 'เอพิค' },
  legendary: { color: '#F59E0B', gradient: 'from-yellow-400 to-orange-500', nameTH: 'ตำนาน' },
  mythic: { color: '#EC4899', gradient: 'from-pink-400 to-rose-600', nameTH: 'เทพปกรณัม' },
};
