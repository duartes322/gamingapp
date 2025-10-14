import type { GamificationStats } from './types';

/**
 * XP required per level
 * Currently: 100 XP per level
 */
const XP_PER_LEVEL = 100;

/**
 * Calculate gamification stats from total XP
 * @param totalXp - Total XP accumulated
 * @returns Detailed stats including level, progress, etc.
 */
export function calculateGamificationStats(totalXp: number): GamificationStats {
  // Level = floor(totalXp / 100) + 1
  // e.g., 0-99 XP = Level 1, 100-199 XP = Level 2, etc.
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  
  // XP within current level
  const xpForCurrentLevel = totalXp % XP_PER_LEVEL;
  
  // XP needed to reach next level
  const xpNeededForNextLevel = XP_PER_LEVEL;
  
  // Progress percentage to next level
  const progressPercentage = (xpForCurrentLevel / xpNeededForNextLevel) * 100;

  return {
    totalXp,
    level,
    xpForCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
}

/**
 * Calculate XP gained from time spent
 * Currently: 1 minute = 1 XP
 * @param timeInSeconds - Time spent in seconds
 * @returns XP gained
 */
export function calculateXpFromTime(timeInSeconds: number): number {
  return Math.floor(timeInSeconds / 60);
}

/**
 * Get level name/title based on level number
 * @param level - Current level
 * @returns Level title
 */
export function getLevelTitle(level: number): string {
  if (level === 1) return 'Beginner';
  if (level >= 2 && level <= 5) return 'Novice';
  if (level >= 6 && level <= 10) return 'Apprentice';
  if (level >= 11 && level <= 20) return 'Adept';
  if (level >= 21 && level <= 30) return 'Expert';
  if (level >= 31 && level <= 40) return 'Master';
  if (level >= 41 && level <= 50) return 'Grandmaster';
  return 'Legend';
}
