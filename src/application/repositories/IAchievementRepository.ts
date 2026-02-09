/**
 * IAchievementRepository
 * Achievements system interface
 * Following Clean Architecture - Application layer
 */

export type AchievementCategory = 'explorer' | 'social' | 'collector' | 'combat' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: string;
  reward: AchievementReward;
  isSecret?: boolean;
}

export interface AchievementReward {
  coins?: number;
  gems?: number;
  experience?: number;
  title?: string;
  item?: string;
}

export interface AchievementStats {
  totalAchievements: number;
  completedAchievements: number;
  totalPoints: number;
  earnedPoints: number;
}

export interface IAchievementRepository {
  getAchievements(): Promise<Achievement[]>;
  getAchievementById(id: string): Promise<Achievement | null>;
  getAchievementsByCategory(category: AchievementCategory): Promise<Achievement[]>;
  getStats(): Promise<AchievementStats>;
  updateProgress(id: string, progress: number): Promise<Achievement>;
  claimReward(id: string): Promise<AchievementReward>;
}
