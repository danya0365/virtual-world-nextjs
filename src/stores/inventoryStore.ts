/**
 * Inventory Store - Manages player's owned items
 */

import { getItemById as getGachaItemById } from '@/src/domain/entities/Gacha';
import { getItemById as getShopItemById } from '@/src/domain/entities/Shop';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InventoryItemSource = 'shop' | 'gacha' | 'reward' | 'gift' | 'event';

export interface InventoryItem {
  id: string;
  itemId: string;
  source: InventoryItemSource;
  acquiredAt: Date;
  isEquipped?: boolean;
  quantity?: number; // For consumables
}

export interface EquippedItems {
  skin?: string;
  outfit?: string;
  accessory?: string[];
  effect?: string;
  pet?: string;
  mount?: string;
}

interface InventoryState {
  items: InventoryItem[];
  equipped: EquippedItems;
  
  // Getters
  hasItem: (itemId: string) => boolean;
  getItem: (itemId: string) => InventoryItem | undefined;
  getItemsBySource: (source: InventoryItemSource) => InventoryItem[];
  getItemsByCategory: (category: string) => InventoryItem[];
  getEquippedItem: (slot: keyof EquippedItems) => string | string[] | undefined;
  
  // Actions
  addItem: (itemId: string, source: InventoryItemSource, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  equipItem: (itemId: string, slot: keyof EquippedItems) => void;
  unequipItem: (slot: keyof EquippedItems, itemId?: string) => void;
  useConsumable: (itemId: string, amount?: number) => boolean;
  
  // Utility
  getTotalItems: () => number;
  getInventoryValue: () => number;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      equipped: {
        accessory: [],
      },

      hasItem: (itemId) => {
        return get().items.some(item => item.itemId === itemId);
      },

      getItem: (itemId) => {
        return get().items.find(item => item.itemId === itemId);
      },

      getItemsBySource: (source) => {
        return get().items.filter(item => item.source === source);
      },

      getItemsByCategory: (category) => {
        return get().items.filter(item => {
          const shopItem = getShopItemById(item.itemId);
          const gachaItem = getGachaItemById(item.itemId);
          return shopItem?.category === category || gachaItem?.category === category;
        });
      },

      getEquippedItem: (slot) => {
        return get().equipped[slot];
      },

      addItem: (itemId, source, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.itemId === itemId);
          
          if (existingItem && existingItem.quantity !== undefined) {
            // Stackable item - increase quantity
            return {
              items: state.items.map(item =>
                item.itemId === itemId
                  ? { ...item, quantity: (item.quantity || 0) + quantity }
                  : item
              ),
            };
          } else if (!existingItem) {
            // New item
            const newItem: InventoryItem = {
              id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              itemId,
              source,
              acquiredAt: new Date(),
              quantity: quantity > 1 ? quantity : undefined,
            };
            return { items: [...state.items, newItem] };
          }
          
          return state;
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.itemId !== itemId),
        }));
      },

      equipItem: (itemId, slot) => {
        set((state) => {
          const newEquipped = { ...state.equipped };
          
          if (slot === 'accessory') {
            // Accessories can be multiple
            const current = newEquipped.accessory || [];
            if (!current.includes(itemId)) {
              newEquipped.accessory = [...current, itemId].slice(-3); // Max 3
            }
          } else {
            newEquipped[slot] = itemId;
          }
          
          // Mark as equipped in items
          const newItems = state.items.map(item =>
            item.itemId === itemId ? { ...item, isEquipped: true } : item
          );
          
          return { equipped: newEquipped, items: newItems };
        });
      },

      unequipItem: (slot, itemId) => {
        set((state) => {
          const newEquipped = { ...state.equipped };
          
          if (slot === 'accessory' && itemId) {
            newEquipped.accessory = (newEquipped.accessory || []).filter(id => id !== itemId);
          } else {
            newEquipped[slot] = undefined;
          }
          
          // Mark as unequipped in items
          const targetItemId = itemId || state.equipped[slot];
          const newItems = state.items.map(item =>
            item.itemId === targetItemId ? { ...item, isEquipped: false } : item
          );
          
          return { equipped: newEquipped, items: newItems };
        });
      },

      useConsumable: (itemId, amount = 1) => {
        const item = get().getItem(itemId);
        if (!item || !item.quantity || item.quantity < amount) {
          return false;
        }
        
        set((state) => {
          const newQuantity = (item.quantity || 0) - amount;
          
          if (newQuantity <= 0) {
            return {
              items: state.items.filter(i => i.itemId !== itemId),
            };
          }
          
          return {
            items: state.items.map(i =>
              i.itemId === itemId ? { ...i, quantity: newQuantity } : i
            ),
          };
        });
        
        return true;
      },

      getTotalItems: () => {
        return get().items.length;
      },

      getInventoryValue: () => {
        return get().items.reduce((total, item) => {
          const shopItem = getShopItemById(item.itemId);
          if (shopItem) {
            return total + shopItem.price.amount;
          }
          return total;
        }, 0);
      },
    }),
    {
      name: 'vw-inventory',
    }
  )
);

export default useInventoryStore;
