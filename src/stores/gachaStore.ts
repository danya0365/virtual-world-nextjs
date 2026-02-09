/**
 * Gacha Store - Manages gacha state, pity, and history
 */

import { RarityType } from '@/src/domain/entities/Currency';
import {
    calculateDropRates,
    GachaBanner,
    GachaPullSession,
    GachaResult,
    PityTracker
} from '@/src/domain/entities/Gacha';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GachaState {
  // Pity tracking per banner
  pityTrackers: Record<string, PityTracker>;
  
  // Pull history
  pullHistory: GachaPullSession[];
  
  // Inventory of obtained items
  inventory: Record<string, number>; // itemId -> count
  
  // Actions
  getPityCount: (bannerId: string) => number;
  updatePity: (bannerId: string, gotHighRarity: boolean) => void;
  resetPity: (bannerId: string) => void;
  
  // Pull execution
  executePull: (banner: GachaBanner, count: 1 | 10) => GachaResult[];
  
  // Inventory
  hasItem: (itemId: string) => boolean;
  getItemCount: (itemId: string) => number;
  addToInventory: (itemId: string, count?: number) => void;
  
  // History
  addPullSession: (session: GachaPullSession) => void;
  getRecentPulls: (limit?: number) => GachaPullSession[];
  clearHistory: () => void;
  
  // Stats
  getTotalPulls: () => number;
  getRarityStats: () => Record<RarityType, number>;
}

// Weighted random selection
function weightedRandom(rates: Record<RarityType, number>): RarityType {
  const total = Object.values(rates).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (const [rarity, rate] of Object.entries(rates)) {
    random -= rate;
    if (random <= 0) {
      return rarity as RarityType;
    }
  }
  
  return 'common';
}

// Select random item from pool with given rarity
function selectItem(pool: GachaBanner['pool'], rarity: RarityType, rateUpItems?: string[]) {
  const eligibleItems = pool.filter(item => item.rarity === rarity);
  
  if (eligibleItems.length === 0) {
    // Fallback to any item if no items of that rarity
    return pool[Math.floor(Math.random() * pool.length)];
  }
  
  // Check for rate up
  if (rateUpItems && rateUpItems.length > 0) {
    const rateUpEligible = eligibleItems.filter(item => rateUpItems.includes(item.id));
    if (rateUpEligible.length > 0 && Math.random() < 0.5) {
      return rateUpEligible[Math.floor(Math.random() * rateUpEligible.length)];
    }
  }
  
  return eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
}

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      pityTrackers: {},
      pullHistory: [],
      inventory: {},

      getPityCount: (bannerId) => {
        return get().pityTrackers[bannerId]?.pullCount || 0;
      },

      updatePity: (bannerId, gotHighRarity) => {
        set((state) => {
          const tracker = state.pityTrackers[bannerId] || {
            bannerId,
            pullCount: 0,
            lastHighRarityPull: 0,
            guaranteedRateUp: false,
          };

          if (gotHighRarity) {
            return {
              pityTrackers: {
                ...state.pityTrackers,
                [bannerId]: {
                  ...tracker,
                  pullCount: 0,
                  lastHighRarityPull: tracker.pullCount,
                },
              },
            };
          } else {
            return {
              pityTrackers: {
                ...state.pityTrackers,
                [bannerId]: {
                  ...tracker,
                  pullCount: tracker.pullCount + 1,
                },
              },
            };
          }
        });
      },

      resetPity: (bannerId) => {
        set((state) => ({
          pityTrackers: {
            ...state.pityTrackers,
            [bannerId]: {
              bannerId,
              pullCount: 0,
              lastHighRarityPull: 0,
              guaranteedRateUp: false,
            },
          },
        }));
      },

      executePull: (banner, count) => {
        const results: GachaResult[] = [];
        const state = get();
        let pityCount = state.getPityCount(banner.id);

        for (let i = 0; i < count; i++) {
          pityCount++;
          
          // Check for guaranteed pity
          const isPity = pityCount >= banner.pityThreshold;
          
          // Calculate rates with soft pity
          const rates = calculateDropRates(banner, pityCount);
          
          // Roll rarity
          let rarity: RarityType;
          if (isPity) {
            // Pity hit - guarantee legendary or mythic
            rarity = Math.random() < 0.1 ? 'mythic' : 'legendary';
          } else {
            rarity = weightedRandom(rates);
          }
          
          // Select item
          const item = selectItem(banner.pool, rarity, banner.rateUpItems);
          
          // Check if new
          const isNew = !state.hasItem(item.id);
          
          // Check if rate up
          const isRateUp = banner.rateUpItems?.includes(item.id) || false;
          
          // Check if high rarity (for pity reset)
          const isHighRarity = ['legendary', 'mythic'].includes(rarity);
          
          results.push({
            item,
            isNew,
            isPity,
            isRateUp,
            pullNumber: pityCount,
          });
          
          // Update pity
          if (isHighRarity || isPity) {
            pityCount = 0;
          }
          
          // Add to inventory
          state.addToInventory(item.id);
        }

        // Update pity tracker
        set((state) => ({
          pityTrackers: {
            ...state.pityTrackers,
            [banner.id]: {
              bannerId: banner.id,
              pullCount: pityCount,
              lastHighRarityPull: 0,
              guaranteedRateUp: false,
            },
          },
        }));

        // Add to history
        const session: GachaPullSession = {
          bannerId: banner.id,
          results,
          timestamp: new Date(),
        };
        state.addPullSession(session);

        return results;
      },

      hasItem: (itemId) => {
        return (get().inventory[itemId] || 0) > 0;
      },

      getItemCount: (itemId) => {
        return get().inventory[itemId] || 0;
      },

      addToInventory: (itemId, count = 1) => {
        set((state) => ({
          inventory: {
            ...state.inventory,
            [itemId]: (state.inventory[itemId] || 0) + count,
          },
        }));
      },

      addPullSession: (session) => {
        set((state) => ({
          pullHistory: [session, ...state.pullHistory].slice(0, 50),
        }));
      },

      getRecentPulls: (limit = 10) => {
        return get().pullHistory.slice(0, limit);
      },

      clearHistory: () => {
        set({ pullHistory: [] });
      },

      getTotalPulls: () => {
        return get().pullHistory.reduce(
          (total, session) => total + session.results.length,
          0
        );
      },

      getRarityStats: () => {
        const stats: Record<RarityType, number> = {
          common: 0,
          uncommon: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
          mythic: 0,
        };

        get().pullHistory.forEach((session) => {
          session.results.forEach((result) => {
            stats[result.item.rarity]++;
          });
        });

        return stats;
      },
    }),
    {
      name: 'vw-gacha',
    }
  )
);

export default useGachaStore;
