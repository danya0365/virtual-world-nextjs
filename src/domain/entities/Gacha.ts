/**
 * Gacha System - Domain Types
 * Professional gacha system with pity, banners, and multiple pool types
 */

import { RarityType } from './Currency';

// =============================================================================
// GACHA ITEM TYPES
// =============================================================================

export type GachaItemCategory = 
  | 'character' 
  | 'skin' 
  | 'pet' 
  | 'mount' 
  | 'weapon' 
  | 'accessory' 
  | 'consumable'
  | 'currency';

export interface GachaItem {
  id: string;
  name: string;
  nameTH: string;
  description: string;
  category: GachaItemCategory;
  rarity: RarityType;
  icon: string;
  image?: string;
  isNew?: boolean;
  isLimited?: boolean;
}

// =============================================================================
// GACHA BANNER TYPES
// =============================================================================

export type BannerType = 'standard' | 'limited' | 'event' | 'beginner' | 'weapon';

export interface GachaBanner {
  id: string;
  name: string;
  nameTH: string;
  description: string;
  type: BannerType;
  image: string;
  featuredItems: string[]; // Item IDs
  pool: GachaItem[];
  cost: {
    currency: 'gems' | 'tickets';
    single: number;
    multi: number; // 10-pull
  };
  rates: Record<RarityType, number>;
  pityThreshold: number; // Guaranteed high rarity after X pulls
  softPityStart?: number; // Increased rates start here
  rateUpItems?: string[]; // Item IDs with boosted rates
  rateUpMultiplier?: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

// =============================================================================
// GACHA RESULT
// =============================================================================

export interface GachaResult {
  item: GachaItem;
  isNew: boolean;
  isPity: boolean;
  isRateUp: boolean;
  pullNumber: number;
}

export interface GachaPullSession {
  bannerId: string;
  results: GachaResult[];
  timestamp: Date;
}

// =============================================================================
// PITY TRACKER
// =============================================================================

export interface PityTracker {
  bannerId: string;
  pullCount: number;
  lastHighRarityPull: number;
  guaranteedRateUp: boolean; // 50/50 lost, next is guaranteed
}

// =============================================================================
// ANIMATION TYPES
// =============================================================================

export type GachaAnimationType = 
  | 'standard'     // Basic reveal
  | 'sparkle'      // Particle effects
  | 'burst'        // Explosive reveal  
  | 'rainbow'      // Rainbow light effects
  | 'cosmic'       // Galaxy/stars animation
  | 'skip';        // No animation

export interface GachaAnimationConfig {
  type: GachaAnimationType;
  duration: number;
  hasScreenShake: boolean;
  hasFlash: boolean;
  particleCount: number;
  soundEffect: string;
}

export const GACHA_ANIMATIONS: Record<RarityType, GachaAnimationConfig> = {
  common: {
    type: 'standard',
    duration: 800,
    hasScreenShake: false,
    hasFlash: false,
    particleCount: 5,
    soundEffect: 'pop',
  },
  uncommon: {
    type: 'sparkle',
    duration: 1000,
    hasScreenShake: false,
    hasFlash: false,
    particleCount: 15,
    soundEffect: 'chime',
  },
  rare: {
    type: 'sparkle',
    duration: 1200,
    hasScreenShake: false,
    hasFlash: true,
    particleCount: 25,
    soundEffect: 'chime',
  },
  epic: {
    type: 'burst',
    duration: 1500,
    hasScreenShake: true,
    hasFlash: true,
    particleCount: 50,
    soundEffect: 'fanfare',
  },
  legendary: {
    type: 'rainbow',
    duration: 2000,
    hasScreenShake: true,
    hasFlash: true,
    particleCount: 100,
    soundEffect: 'epic',
  },
  mythic: {
    type: 'cosmic',
    duration: 2500,
    hasScreenShake: true,
    hasFlash: true,
    particleCount: 200,
    soundEffect: 'legendary',
  },
};

// =============================================================================
// MOCK DATA - GACHA ITEMS
// =============================================================================

export const GACHA_ITEMS: GachaItem[] = [
  // Characters - Mythic
  {
    id: 'char_dragon_lord',
    name: 'Dragon Lord',
    nameTH: 'จ้าวมังกร',
    description: 'ตัวละครระดับตำนาน ครอบครองพลังมังกร',
    category: 'character',
    rarity: 'mythic',
    icon: '🐉',
    isLimited: true,
  },
  // Characters - Legendary
  {
    id: 'char_phoenix_sage',
    name: 'Phoenix Sage',
    nameTH: 'นักปราชญ์ฟีนิกซ์',
    description: 'ผู้ถือพลังแห่งการเกิดใหม่',
    category: 'character',
    rarity: 'legendary',
    icon: '🦅',
  },
  {
    id: 'char_shadow_ninja',
    name: 'Shadow Ninja',
    nameTH: 'นินจาเงา',
    description: 'เคลื่อนไหวในเงามืด โจมตีอย่างรวดเร็ว',
    category: 'character',
    rarity: 'legendary',
    icon: '🥷',
    isNew: true,
  },
  // Characters - Epic
  {
    id: 'char_ice_mage',
    name: 'Ice Mage',
    nameTH: 'จอมเวทน้ำแข็ง',
    description: 'ควบคุมพลังน้ำแข็งได้อย่างเหนือชั้น',
    category: 'character',
    rarity: 'epic',
    icon: '🧙‍♂️',
  },
  {
    id: 'char_thunder_warrior',
    name: 'Thunder Warrior',
    nameTH: 'นักรบสายฟ้า',
    description: 'พลังสายฟ้าอยู่ในมือ',
    category: 'character',
    rarity: 'epic',
    icon: '⚡',
  },
  {
    id: 'char_forest_ranger',
    name: 'Forest Ranger',
    nameTH: 'พรานป่า',
    description: 'ปกป้องป่าและสัตว์ป่า',
    category: 'character',
    rarity: 'epic',
    icon: '🏹',
  },
  // Characters - Rare
  {
    id: 'char_knight',
    name: 'Royal Knight',
    nameTH: 'อัศวินหลวง',
    description: 'อัศวินผู้รักษาความสงบ',
    category: 'character',
    rarity: 'rare',
    icon: '🛡️',
  },
  {
    id: 'char_healer',
    name: 'Sacred Healer',
    nameTH: 'นักบวชศักดิ์สิทธิ์',
    description: 'รักษาพันธมิตรด้วยพลังศักดิ์สิทธิ์',
    category: 'character',
    rarity: 'rare',
    icon: '💚',
  },
  // Pets - Various rarities
  {
    id: 'pet_golden_phoenix',
    name: 'Golden Phoenix',
    nameTH: 'ฟีนิกซ์ทองคำ',
    description: 'สัตว์เลี้ยงในตำนาน',
    category: 'pet',
    rarity: 'legendary',
    icon: '🔥',
    isLimited: true,
  },
  {
    id: 'pet_ice_dragon',
    name: 'Ice Dragon',
    nameTH: 'มังกรน้ำแข็ง',
    description: 'มังกรขนาดเล็กพ่นน้ำแข็ง',
    category: 'pet',
    rarity: 'epic',
    icon: '🐲',
  },
  {
    id: 'pet_spirit_fox',
    name: 'Spirit Fox',
    nameTH: 'จิ้งจอกวิญญาณ',
    description: 'จิ้งจอก 9 หาง',
    category: 'pet',
    rarity: 'epic',
    icon: '🦊',
  },
  {
    id: 'pet_baby_unicorn',
    name: 'Baby Unicorn',
    nameTH: 'ยูนิคอร์นน้อย',
    description: 'น่ารักและมีมนต์ขลัง',
    category: 'pet',
    rarity: 'rare',
    icon: '🦄',
  },
  {
    id: 'pet_cat',
    name: 'Lucky Cat',
    nameTH: 'แมวนำโชค',
    description: 'เพิ่มโอกาสดรอปไอเทม',
    category: 'pet',
    rarity: 'uncommon',
    icon: '🐱',
  },
  {
    id: 'pet_dog',
    name: 'Loyal Dog',
    nameTH: 'สุนัขซื่อสัตย์',
    description: 'เพื่อนคู่ใจ',
    category: 'pet',
    rarity: 'common',
    icon: '🐕',
  },
  // Skins
  {
    id: 'skin_celestial',
    name: 'Celestial Set',
    nameTH: 'ชุดสวรรค์',
    description: 'ชุดแห่งดวงดาว',
    category: 'skin',
    rarity: 'legendary',
    icon: '✨',
  },
  {
    id: 'skin_samurai',
    name: 'Samurai Armor',
    nameTH: 'ชุดเกราะซามูไร',
    description: 'ชุดเกราะนักรบโบราณ',
    category: 'skin',
    rarity: 'epic',
    icon: '⚔️',
  },
  {
    id: 'skin_casual',
    name: 'Casual Outfit',
    nameTH: 'ชุดลำลอง',
    description: 'ชุดใส่สบายๆ',
    category: 'skin',
    rarity: 'rare',
    icon: '👕',
  },
  // Consumables
  {
    id: 'item_exp_potion',
    name: 'EXP Potion',
    nameTH: 'ยาเพิ่มประสบการณ์',
    description: 'เพิ่ม EXP 2 เท่า 1 ชม.',
    category: 'consumable',
    rarity: 'uncommon',
    icon: '🧪',
  },
  {
    id: 'item_gold_boost',
    name: 'Gold Boost',
    nameTH: 'บูสต์เงิน',
    description: 'เพิ่มเงินดรอป 2 เท่า 1 ชม.',
    category: 'consumable',
    rarity: 'uncommon',
    icon: '💰',
  },
  {
    id: 'item_stamina',
    name: 'Stamina Potion',
    nameTH: 'ยาเพิ่มพลังงาน',
    description: 'เติมพลังงาน 50',
    category: 'consumable',
    rarity: 'common',
    icon: '⚡',
  },
  // Currency items
  {
    id: 'currency_coins_small',
    name: 'Coin Pouch',
    nameTH: 'ถุงเหรียญ',
    description: '1,000 เหรียญ',
    category: 'currency',
    rarity: 'common',
    icon: '🪙',
  },
  {
    id: 'currency_coins_medium',
    name: 'Coin Chest',
    nameTH: 'หีบเหรียญ',
    description: '5,000 เหรียญ',
    category: 'currency',
    rarity: 'uncommon',
    icon: '💰',
  },
];

// =============================================================================
// MOCK DATA - GACHA BANNERS
// =============================================================================

export const GACHA_BANNERS: GachaBanner[] = [
  {
    id: 'banner_standard',
    name: 'Standard Banner',
    nameTH: 'แบนเนอร์มาตรฐาน',
    description: 'สุ่มของจากกลุ่มมาตรฐาน',
    type: 'standard',
    image: '/images/banners/standard.png',
    featuredItems: ['char_ice_mage', 'pet_spirit_fox'],
    pool: GACHA_ITEMS.filter(item => !item.isLimited),
    cost: {
      currency: 'gems',
      single: 160,
      multi: 1440, // 10% discount
    },
    rates: {
      common: 45,
      uncommon: 30,
      rare: 15,
      epic: 6,
      legendary: 3.5,
      mythic: 0.5,
    },
    pityThreshold: 90,
    softPityStart: 75,
    isActive: true,
  },
  {
    id: 'banner_limited_dragon',
    name: 'Dragon Lords Banner',
    nameTH: 'แบนเนอร์จ้าวมังกร',
    description: 'โอกาสพิเศษในการได้รับจ้าวมังกร!',
    type: 'limited',
    image: '/images/banners/dragon.png',
    featuredItems: ['char_dragon_lord', 'pet_golden_phoenix'],
    pool: GACHA_ITEMS,
    cost: {
      currency: 'gems',
      single: 160,
      multi: 1440,
    },
    rates: {
      common: 40,
      uncommon: 28,
      rare: 18,
      epic: 8,
      legendary: 5,
      mythic: 1,
    },
    pityThreshold: 80,
    softPityStart: 65,
    rateUpItems: ['char_dragon_lord'],
    rateUpMultiplier: 2,
    endDate: new Date('2026-02-28'),
    isActive: true,
  },
  {
    id: 'banner_beginner',
    name: 'Beginner Banner',
    nameTH: 'แบนเนอร์ผู้เริ่มต้น',
    description: 'สำหรับผู้เล่นใหม่ ลดราคา 50%!',
    type: 'beginner',
    image: '/images/banners/beginner.png',
    featuredItems: ['char_knight', 'char_healer'],
    pool: GACHA_ITEMS.filter(item => 
      ['common', 'uncommon', 'rare', 'epic'].includes(item.rarity)
    ),
    cost: {
      currency: 'gems',
      single: 80, // 50% off
      multi: 720,
    },
    rates: {
      common: 30,
      uncommon: 35,
      rare: 25,
      epic: 10,
      legendary: 0,
      mythic: 0,
    },
    pityThreshold: 50,
    isActive: true,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getItemById(id: string): GachaItem | undefined {
  return GACHA_ITEMS.find(item => item.id === id);
}

export function getBannerById(id: string): GachaBanner | undefined {
  return GACHA_BANNERS.find(banner => banner.id === id);
}

export function getActiveBanners(): GachaBanner[] {
  const now = new Date();
  return GACHA_BANNERS.filter(banner => {
    if (!banner.isActive) return false;
    if (banner.endDate && banner.endDate < now) return false;
    if (banner.startDate && banner.startDate > now) return false;
    return true;
  });
}

export function calculateDropRates(
  banner: GachaBanner, 
  pityCount: number
): Record<RarityType, number> {
  const rates = { ...banner.rates };
  
  // Apply soft pity (increased high rarity rates)
  if (banner.softPityStart && pityCount >= banner.softPityStart) {
    const pityBonus = (pityCount - banner.softPityStart) * 3;
    rates.legendary = Math.min(rates.legendary + pityBonus, 50);
    rates.mythic = Math.min(rates.mythic + pityBonus * 0.2, 10);
    
    // Reduce common/uncommon to compensate
    const totalIncrease = pityBonus * 1.2;
    rates.common = Math.max(rates.common - totalIncrease * 0.7, 10);
    rates.uncommon = Math.max(rates.uncommon - totalIncrease * 0.3, 10);
  }
  
  return rates;
}
