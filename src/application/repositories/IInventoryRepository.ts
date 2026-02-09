/**
 * IInventoryRepository
 * Inventory system interface
 * Following Clean Architecture - Application layer
 */

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest';

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  stackable: boolean;
  maxStack: number;
  sellPrice: number;
  stats?: ItemStats;
  isEquippable?: boolean;
  equipSlot?: EquipSlot;
}

export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  speed?: number;
  luck?: number;
}

export type EquipSlot = 'head' | 'body' | 'weapon' | 'accessory1' | 'accessory2';

export interface InventorySlot {
  item: Item;
  quantity: number;
  isEquipped?: boolean;
}

export interface Equipment {
  head?: InventorySlot;
  body?: InventorySlot;
  weapon?: InventorySlot;
  accessory1?: InventorySlot;
  accessory2?: InventorySlot;
}

export interface IInventoryRepository {
  // Inventory
  getInventory(): Promise<InventorySlot[]>;
  getEquipment(): Promise<Equipment>;
  addItem(itemId: string, quantity?: number): Promise<InventorySlot>;
  removeItem(itemId: string, quantity?: number): Promise<void>;
  
  // Equipment
  equipItem(itemId: string, slot: EquipSlot): Promise<Equipment>;
  unequipItem(slot: EquipSlot): Promise<Equipment>;
  
  // Stats
  getInventoryCapacity(): Promise<{ used: number; max: number }>;
  getTotalStats(): Promise<ItemStats>;
}
