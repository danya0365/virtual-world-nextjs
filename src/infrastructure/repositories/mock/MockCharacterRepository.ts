/**
 * MockCharacterRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    Character,
    CharacterStats,
    CreateCharacterData,
    ICharacterRepository,
    UpdateCharacterData,
} from '@/src/application/repositories/ICharacterRepository';

// Mock character data
const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char-001',
    name: 'mike',
    displayName: 'Mike',
    level: 7,
    experience: 2150,
    coins: 163,
    gems: 12,
    stars: 3,
    appearance: {
      bodyColor: '#e8e8f0',
      eyeStyle: 'normal',
    },
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-20T14:00:00.000Z',
  },
  {
    id: 'char-002',
    name: 'sakura',
    displayName: 'Sakura',
    level: 12,
    experience: 5400,
    coins: 340,
    gems: 28,
    stars: 4,
    appearance: {
      bodyColor: '#ffc0cb',
      eyeStyle: 'happy',
      accessory: 'bow',
    },
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-21T09:30:00.000Z',
  },
  {
    id: 'char-003',
    name: 'blue_warrior',
    displayName: 'Blue Warrior',
    level: 25,
    experience: 15000,
    coins: 890,
    gems: 75,
    stars: 5,
    appearance: {
      bodyColor: '#4a90d9',
      eyeStyle: 'cool',
      accessory: 'helmet',
    },
    createdAt: '2024-01-05T12:00:00.000Z',
    updatedAt: '2024-01-22T16:45:00.000Z',
  },
];

// Available color options for characters
export const CHARACTER_COLORS = [
  { id: 'white', color: '#e8e8f0', name: 'ขาว' },
  { id: 'pink', color: '#ffc0cb', name: 'ชมพู' },
  { id: 'blue', color: '#87ceeb', name: 'ฟ้า' },
  { id: 'yellow', color: '#fff4a3', name: 'เหลือง' },
  { id: 'orange', color: '#ffb380', name: 'ส้ม' },
  { id: 'purple', color: '#dda0dd', name: 'ม่วง' },
];

export class MockCharacterRepository implements ICharacterRepository {
  private characters: Character[] = [...MOCK_CHARACTERS];

  async getById(id: string): Promise<Character | null> {
    await this.delay(100);
    return this.characters.find((char) => char.id === id) || null;
  }

  async getAll(): Promise<Character[]> {
    await this.delay(100);
    return [...this.characters];
  }

  async getByUserId(userId: string): Promise<Character | null> {
    await this.delay(100);
    // For mock, return first character
    return this.characters[0] || null;
  }

  async create(userId: string, data: CreateCharacterData): Promise<Character> {
    await this.delay(200);

    const newCharacter: Character = {
      id: `char-${Date.now()}`,
      name: data.name,
      displayName: data.displayName,
      level: 1,
      experience: 0,
      coins: 100,
      gems: 5,
      stars: 0,
      appearance: {
        bodyColor: data.appearance?.bodyColor || '#e8e8f0',
        eyeStyle: data.appearance?.eyeStyle || 'normal',
        accessory: data.appearance?.accessory,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.characters.unshift(newCharacter);
    return newCharacter;
  }

  async update(id: string, data: UpdateCharacterData): Promise<Character> {
    await this.delay(200);

    const index = this.characters.findIndex((char) => char.id === id);
    if (index === -1) {
      throw new Error('Character not found');
    }

    const updatedCharacter: Character = {
      ...this.characters[index],
      displayName: data.displayName || this.characters[index].displayName,
      appearance: {
        ...this.characters[index].appearance,
        ...data.appearance,
      },
      updatedAt: new Date().toISOString(),
    };

    this.characters[index] = updatedCharacter;
    return updatedCharacter;
  }

  async addCoins(id: string, amount: number): Promise<Character> {
    await this.delay(100);

    const index = this.characters.findIndex((char) => char.id === id);
    if (index === -1) {
      throw new Error('Character not found');
    }

    this.characters[index].coins += amount;
    this.characters[index].updatedAt = new Date().toISOString();

    return this.characters[index];
  }

  async addExperience(id: string, amount: number): Promise<Character> {
    await this.delay(100);

    const index = this.characters.findIndex((char) => char.id === id);
    if (index === -1) {
      throw new Error('Character not found');
    }

    const character = this.characters[index];
    character.experience += amount;

    // Level up logic (every 1000 exp = 1 level)
    const newLevel = Math.floor(character.experience / 1000) + 1;
    if (newLevel > character.level) {
      character.level = newLevel;
      character.coins += 50; // Bonus coins on level up
    }

    character.updatedAt = new Date().toISOString();
    return character;
  }

  async getStats(): Promise<CharacterStats> {
    await this.delay(100);

    const totalCharacters = this.characters.length;
    const averageLevel =
      this.characters.reduce((sum, char) => sum + char.level, 0) /
      totalCharacters;
    const totalCoins = this.characters.reduce((sum, char) => sum + char.coins, 0);
    const totalGems = this.characters.reduce((sum, char) => sum + char.gems, 0);

    return {
      totalCharacters,
      averageLevel: Math.round(averageLevel * 10) / 10,
      totalCoins,
      totalGems,
    };
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const mockCharacterRepository = new MockCharacterRepository();
