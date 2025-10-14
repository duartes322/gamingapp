/**
 * Types for the Goals module
 */

export interface DailyGoal {
  dailyTimeGoal: number; // in seconds
}

export interface GoalProgress {
  date: string;
  timeSpent: number; // in seconds
  goalMet: boolean;
  percentage: number; // % of goal achieved
}

export interface StreakInfo {
  currentStreak: number; // consecutive days with goal met
  longestStreak: number;
  totalDaysWithGoal: number;
}
