/**
 * ICharacterRepository
 * Repository interface for Character data access
 * Following Clean Architecture - Application layer
 */

export interface CharacterAppearance {
  bodyColor: string;
  eyeStyle: 'normal' | 'happy' | 'cool' | 'sleepy';
  accessory?: string;
}

export interface Character {
  id: string;
  name: string;
  displayName: string;
  level: number;
  experience: number;
  coins: number;
  gems: number;
  stars: number;
  appearance: CharacterAppearance;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterStats {
  totalCharacters: number;
  averageLevel: number;
  totalCoins: number;
  totalGems: number;
}

export interface CreateCharacterData {
  name: string;
  displayName: string;
  appearance?: Partial<CharacterAppearance>;
}

export interface UpdateCharacterData {
  displayName?: string;
  appearance?: Partial<CharacterAppearance>;
}

export interface ICharacterRepository {
  /**
   * Get character by ID
   */
  getById(id: string): Promise<Character | null>;

  /**
   * Get all characters
   */
  getAll(): Promise<Character[]>;

  /**
   * Get character by user ID
   */
  getByUserId(userId: string): Promise<Character | null>;

  /**
   * Create a new character
   */
  create(userId: string, data: CreateCharacterData): Promise<Character>;

  /**
   * Update character
   */
  update(id: string, data: UpdateCharacterData): Promise<Character>;

  /**
   * Add coins to character
   */
  addCoins(id: string, amount: number): Promise<Character>;

  /**
   * Add experience to character
   */
  addExperience(id: string, amount: number): Promise<Character>;

  /**
   * Get statistics
   */
  getStats(): Promise<CharacterStats>;
}
