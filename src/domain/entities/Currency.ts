/**
 * Currency System - Domain Types
 * Professional, flexible currency system supporting multiple currencies and rarities
 */

// =============================================================================
// CURRENCY TYPES
// =============================================================================

export type CurrencyType = 'gems' | 'coins' | 'tickets' | 'tokens' | 'crystals';

export interface Currency {
  id: CurrencyType;
  name: string;
  nameTH: string;
  icon: string;
  color: string;
  gradient: string;
  isPremium: boolean; // Can be purchased with real money
  exchangeRate?: number; // Rate to convert to base currency (coins)
}

export const CURRENCIES: Record<CurrencyType, Currency> = {
  gems: {
    id: 'gems',
    name: 'Gems',
    nameTH: 'เพชร',
    icon: '💎',
    color: '#A855F7',
    gradient: 'from-purple-400 to-pink-500',
    isPremium: true,
    exchangeRate: 100, // 1 Gem = 100 Coins
  },
  coins: {
    id: 'coins',
    name: 'Coins',
    nameTH: 'เหรียญ',
    icon: '🪙',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
    isPremium: false,
  },
  tickets: {
    id: 'tickets',
    name: 'Gacha Tickets',
    nameTH: 'ตั๋วสุ่ม',
    icon: '🎟️',
    color: '#EC4899',
    gradient: 'from-pink-400 to-rose-500',
    isPremium: true,
  },
  tokens: {
    id: 'tokens',
    name: 'Event Tokens',
    nameTH: 'โทเค็นอีเวนต์',
    icon: '🎫',
    color: '#06B6D4',
    gradient: 'from-cyan-400 to-blue-500',
    isPremium: false,
  },
  crystals: {
    id: 'crystals',
    name: 'Crystals',
    nameTH: 'คริสตัล',
    icon: '💠',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-indigo-500',
    isPremium: true,
    exchangeRate: 50, // 1 Crystal = 50 Coins
  },
};

// =============================================================================
// RARITY SYSTEM
// =============================================================================

export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface Rarity {
  id: RarityType;
  name: string;
  nameTH: string;
  color: string;
  gradient: string;
  glowColor: string;
  dropRate: number; // Base percentage
  animationType: 'simple' | 'sparkle' | 'burst' | 'rainbow' | 'cosmic';
  soundType: 'pop' | 'chime' | 'fanfare' | 'epic' | 'legendary';
  pityWeight: number; // How much this adds to pity counter
}

export const RARITIES: Record<RarityType, Rarity> = {
  common: {
    id: 'common',
    name: 'Common',
    nameTH: 'ธรรมดา',
    color: '#9CA3AF',
    gradient: 'from-gray-400 to-gray-500',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    dropRate: 55,
    animationType: 'simple',
    soundType: 'pop',
    pityWeight: 1,
  },
  uncommon: {
    id: 'uncommon',
    name: 'Uncommon',
    nameTH: 'ไม่ธรรมดา',
    color: '#22C55E',
    gradient: 'from-green-400 to-emerald-500',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    dropRate: 25,
    animationType: 'sparkle',
    soundType: 'chime',
    pityWeight: 2,
  },
  rare: {
    id: 'rare',
    name: 'Rare',
    nameTH: 'หายาก',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    dropRate: 12,
    animationType: 'sparkle',
    soundType: 'chime',
    pityWeight: 5,
  },
  epic: {
    id: 'epic',
    name: 'Epic',
    nameTH: 'เอพิค',
    color: '#A855F7',
    gradient: 'from-purple-400 to-purple-600',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    dropRate: 5,
    animationType: 'burst',
    soundType: 'fanfare',
    pityWeight: 10,
  },
  legendary: {
    id: 'legendary',
    name: 'Legendary',
    nameTH: 'ตำนาน',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    dropRate: 2.5,
    animationType: 'rainbow',
    soundType: 'epic',
    pityWeight: 25,
  },
  mythic: {
    id: 'mythic',
    name: 'Mythic',
    nameTH: 'เทพปกรณัม',
    color: '#EC4899',
    gradient: 'from-pink-400 via-purple-500 to-indigo-500',
    glowColor: 'rgba(236, 72, 153, 0.8)',
    dropRate: 0.5,
    animationType: 'cosmic',
    soundType: 'legendary',
    pityWeight: 50,
  },
};

// =============================================================================
// WALLET & TRANSACTIONS
// =============================================================================

export interface Wallet {
  gems: number;
  coins: number;
  tickets: number;
  tokens: number;
  crystals: number;
}

export type TransactionType = 'purchase' | 'reward' | 'exchange' | 'spend' | 'gift' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  currency: CurrencyType;
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// SHOP PACKAGES
// =============================================================================

export interface CurrencyPackage {
  id: string;
  name: string;
  nameTH: string;
  currency: CurrencyType;
  amount: number;
  bonusAmount: number;
  priceUSD: number;
  priceTHB: number;
  tag?: 'popular' | 'best_value' | 'limited' | 'first_purchase';
  discount?: number;
  icon: string;
}

export const CURRENCY_PACKAGES: CurrencyPackage[] = [
  // Gems packages
  {
    id: 'gems_small',
    name: 'Small Gem Pouch',
    nameTH: 'ถุงเพชรเล็ก',
    currency: 'gems',
    amount: 60,
    bonusAmount: 0,
    priceUSD: 0.99,
    priceTHB: 35,
    icon: '💎',
  },
  {
    id: 'gems_medium',
    name: 'Medium Gem Box',
    nameTH: 'กล่องเพชรกลาง',
    currency: 'gems',
    amount: 300,
    bonusAmount: 30,
    priceUSD: 4.99,
    priceTHB: 169,
    tag: 'popular',
    icon: '💎',
  },
  {
    id: 'gems_large',
    name: 'Large Gem Chest',
    nameTH: 'หีบเพชรใหญ่',
    currency: 'gems',
    amount: 680,
    bonusAmount: 100,
    priceUSD: 9.99,
    priceTHB: 349,
    icon: '💎',
  },
  {
    id: 'gems_mega',
    name: 'Mega Gem Treasury',
    nameTH: 'คลังเพชรมหึมา',
    currency: 'gems',
    amount: 1480,
    bonusAmount: 300,
    priceUSD: 19.99,
    priceTHB: 699,
    tag: 'best_value',
    icon: '💎',
  },
  {
    id: 'gems_royal',
    name: 'Royal Gem Vault',
    nameTH: 'ห้องนิรภัยเพชรหลวง',
    currency: 'gems',
    amount: 3280,
    bonusAmount: 800,
    priceUSD: 49.99,
    priceTHB: 1790,
    icon: '👑',
  },
  {
    id: 'gems_ultimate',
    name: 'Ultimate Gem Fortune',
    nameTH: 'มหาสมบัติเพชร',
    currency: 'gems',
    amount: 6480,
    bonusAmount: 2000,
    priceUSD: 99.99,
    priceTHB: 3490,
    icon: '🏆',
  },
  // Tickets packages
  {
    id: 'tickets_starter',
    name: 'Ticket Bundle',
    nameTH: 'ชุดตั๋ว',
    currency: 'tickets',
    amount: 5,
    bonusAmount: 0,
    priceUSD: 2.99,
    priceTHB: 99,
    icon: '🎟️',
  },
  {
    id: 'tickets_premium',
    name: 'Premium Ticket Pack',
    nameTH: 'แพ็คตั๋วพรีเมียม',
    currency: 'tickets',
    amount: 11,
    bonusAmount: 1,
    priceUSD: 5.99,
    priceTHB: 199,
    tag: 'popular',
    icon: '🎟️',
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export function formatCurrency(amount: number, short = false): string {
  if (short) {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

export function getCurrencyIcon(type: CurrencyType): string {
  return CURRENCIES[type]?.icon || '💰';
}

export function getRarityColor(type: RarityType): string {
  return RARITIES[type]?.color || '#9CA3AF';
}

export function calculateExchange(
  fromCurrency: CurrencyType,
  toCurrency: CurrencyType,
  amount: number
): number {
  const from = CURRENCIES[fromCurrency];
  const to = CURRENCIES[toCurrency];
  
  if (!from || !to) return 0;
  
  // Convert to base (coins) first, then to target
  const fromRate = from.exchangeRate || 1;
  const toRate = to.exchangeRate || 1;
  
  const inCoins = amount * fromRate;
  return Math.floor(inCoins / toRate);
}
