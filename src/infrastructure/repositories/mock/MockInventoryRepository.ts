/**
 * MockInventoryRepository
 * Mock implementation for Inventory
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Equipment,
    EquipSlot,
    IInventoryRepository,
    InventorySlot,
    Item,
    ItemStats,
} from '@/src/application/repositories/IInventoryRepository';

// Mock items database
const MOCK_ITEMS: Record<string, Item> = {
  'sword-001': {
    id: 'sword-001',
    name: 'ดาบเหล็ก',
    description: 'ดาบธรรมดาสำหรับนักผจญภัยมือใหม่',
    icon: '⚔️',
    category: 'weapon',
    rarity: 'common',
    stackable: false,
    maxStack: 1,
    sellPrice: 50,
    isEquippable: true,
    equipSlot: 'weapon',
    stats: { attack: 10 },
  },
  'sword-002': {
    id: 'sword-002',
    name: 'ดาบมังกร',
    description: 'ดาบทรงพลังที่สร้างจากเกล็ดมังกร',
    icon: '🗡️',
    category: 'weapon',
    rarity: 'epic',
    stackable: false,
    maxStack: 1,
    sellPrice: 500,
    isEquippable: true,
    equipSlot: 'weapon',
    stats: { attack: 50, speed: 5 },
  },
  'helmet-001': {
    id: 'helmet-001',
    name: 'หมวกเหล็ก',
    description: 'หมวกป้องกันพื้นฐาน',
    icon: '🪖',
    category: 'armor',
    rarity: 'common',
    stackable: false,
    maxStack: 1,
    sellPrice: 30,
    isEquippable: true,
    equipSlot: 'head',
    stats: { defense: 5 },
  },
  'crown-001': {
    id: 'crown-001',
    name: 'มงกุฎราชา',
    description: 'มงกุฎทองคำที่เปล่งประกาย',
    icon: '👑',
    category: 'accessory',
    rarity: 'legendary',
    stackable: false,
    maxStack: 1,
    sellPrice: 1000,
    isEquippable: true,
    equipSlot: 'head',
    stats: { luck: 20, health: 50 },
  },
  'armor-001': {
    id: 'armor-001',
    name: 'เกราะหนัง',
    description: 'เกราะหนังเบาๆ สำหรับนักผจญภัย',
    icon: '🦺',
    category: 'armor',
    rarity: 'common',
    stackable: false,
    maxStack: 1,
    sellPrice: 40,
    isEquippable: true,
    equipSlot: 'body',
    stats: { defense: 8 },
  },
  'armor-002': {
    id: 'armor-002',
    name: 'เกราะเพชร',
    description: 'เกราะที่แข็งแกร่งที่สุด',
    icon: '💎',
    category: 'armor',
    rarity: 'rare',
    stackable: false,
    maxStack: 1,
    sellPrice: 300,
    isEquippable: true,
    equipSlot: 'body',
    stats: { defense: 25, health: 20 },
  },
  'ring-001': {
    id: 'ring-001',
    name: 'แหวนพลัง',
    description: 'แหวนที่เพิ่มพลังโจมตี',
    icon: '💍',
    category: 'accessory',
    rarity: 'uncommon',
    stackable: false,
    maxStack: 1,
    sellPrice: 100,
    isEquippable: true,
    equipSlot: 'accessory1',
    stats: { attack: 5, speed: 3 },
  },
  'potion-001': {
    id: 'potion-001',
    name: 'ยาฟื้นฟู HP',
    description: 'ฟื้นฟูพลังชีวิต 100 หน่วย',
    icon: '🧪',
    category: 'consumable',
    rarity: 'common',
    stackable: true,
    maxStack: 99,
    sellPrice: 10,
  },
  'potion-002': {
    id: 'potion-002',
    name: 'ยาเพิ่มพลัง',
    description: 'เพิ่มพลังโจมตีชั่วคราว',
    icon: '⚗️',
    category: 'consumable',
    rarity: 'uncommon',
    stackable: true,
    maxStack: 99,
    sellPrice: 25,
  },
  'gem-001': {
    id: 'gem-001',
    name: 'คริสตัลสีฟ้า',
    description: 'วัตถุดิบสำหรับคราฟต์',
    icon: '💠',
    category: 'material',
    rarity: 'uncommon',
    stackable: true,
    maxStack: 999,
    sellPrice: 15,
  },
  'gem-002': {
    id: 'gem-002',
    name: 'อัญมณีมังกร',
    description: 'อัญมณีหายากจากมังกร',
    icon: '🔮',
    category: 'material',
    rarity: 'epic',
    stackable: true,
    maxStack: 99,
    sellPrice: 200,
  },
  'key-001': {
    id: 'key-001',
    name: 'กุญแจลึกลับ',
    description: 'ใช้เปิดประตูลับในถ้ำคริสตัล',
    icon: '🗝️',
    category: 'quest',
    rarity: 'rare',
    stackable: false,
    maxStack: 1,
    sellPrice: 0,
  },
};

// Initial inventory
const INITIAL_INVENTORY: InventorySlot[] = [
  { item: MOCK_ITEMS['sword-001'], quantity: 1, isEquipped: true },
  { item: MOCK_ITEMS['helmet-001'], quantity: 1 },
  { item: MOCK_ITEMS['armor-001'], quantity: 1, isEquipped: true },
  { item: MOCK_ITEMS['potion-001'], quantity: 15 },
  { item: MOCK_ITEMS['potion-002'], quantity: 5 },
  { item: MOCK_ITEMS['gem-001'], quantity: 23 },
  { item: MOCK_ITEMS['gem-002'], quantity: 3 },
  { item: MOCK_ITEMS['ring-001'], quantity: 1, isEquipped: true },
  { item: MOCK_ITEMS['key-001'], quantity: 1 },
];

export class MockInventoryRepository implements IInventoryRepository {
  private inventory: InventorySlot[] = [...INITIAL_INVENTORY];
  private equipment: Equipment = {
    weapon: { item: MOCK_ITEMS['sword-001'], quantity: 1, isEquipped: true },
    body: { item: MOCK_ITEMS['armor-001'], quantity: 1, isEquipped: true },
    accessory1: { item: MOCK_ITEMS['ring-001'], quantity: 1, isEquipped: true },
  };
  private maxCapacity = 50;

  async getInventory(): Promise<InventorySlot[]> {
    await this.delay(100);
    return [...this.inventory];
  }

  async getEquipment(): Promise<Equipment> {
    await this.delay(50);
    return { ...this.equipment };
  }

  async addItem(itemId: string, quantity = 1): Promise<InventorySlot> {
    await this.delay(100);
    
    const item = MOCK_ITEMS[itemId];
    if (!item) throw new Error('Item not found');

    const existingSlot = this.inventory.find(s => s.item.id === itemId);
    
    if (existingSlot && item.stackable) {
      existingSlot.quantity = Math.min(existingSlot.quantity + quantity, item.maxStack);
      return existingSlot;
    } else {
      const newSlot: InventorySlot = { item, quantity: 1 };
      this.inventory.push(newSlot);
      return newSlot;
    }
  }

  async removeItem(itemId: string, quantity = 1): Promise<void> {
    await this.delay(100);
    
    const slotIndex = this.inventory.findIndex(s => s.item.id === itemId);
    if (slotIndex === -1) throw new Error('Item not in inventory');

    const slot = this.inventory[slotIndex];
    slot.quantity -= quantity;
    
    if (slot.quantity <= 0) {
      this.inventory.splice(slotIndex, 1);
    }
  }

  async equipItem(itemId: string, slot: EquipSlot): Promise<Equipment> {
    await this.delay(100);

    const invSlot = this.inventory.find(s => s.item.id === itemId);
    if (!invSlot) throw new Error('Item not in inventory');
    if (!invSlot.item.isEquippable) throw new Error('Item is not equippable');

    // Unequip current item in slot
    if (this.equipment[slot]) {
      this.equipment[slot]!.isEquipped = false;
    }

    // Equip new item
    invSlot.isEquipped = true;
    this.equipment[slot] = invSlot;

    return { ...this.equipment };
  }

  async unequipItem(slot: EquipSlot): Promise<Equipment> {
    await this.delay(100);

    if (this.equipment[slot]) {
      this.equipment[slot]!.isEquipped = false;
      this.equipment[slot] = undefined;
    }

    return { ...this.equipment };
  }

  async getInventoryCapacity(): Promise<{ used: number; max: number }> {
    await this.delay(50);
    return {
      used: this.inventory.length,
      max: this.maxCapacity,
    };
  }

  async getTotalStats(): Promise<ItemStats> {
    await this.delay(50);
    
    const stats: ItemStats = { attack: 0, defense: 0, health: 0, speed: 0, luck: 0 };
    
    Object.values(this.equipment).forEach(slot => {
      if (slot?.item.stats) {
        stats.attack! += slot.item.stats.attack || 0;
        stats.defense! += slot.item.stats.defense || 0;
        stats.health! += slot.item.stats.health || 0;
        stats.speed! += slot.item.stats.speed || 0;
        stats.luck! += slot.item.stats.luck || 0;
      }
    });

    return stats;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockInventoryRepository = new MockInventoryRepository();

// Export items for use in views
export { MOCK_ITEMS };
