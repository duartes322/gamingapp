/**
 * Types for the Gamification module
 */

export interface GamificationStats {
  totalXp: number;
  level: number;
  xpForCurrentLevel: number; // XP within current level
  xpNeededForNextLevel: number; // XP needed to reach next level
  progressPercentage: number; // % progress to next level
}
