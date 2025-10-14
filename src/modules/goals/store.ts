import { create } from 'zustand';
import type { DailyGoal, StreakInfo } from './types';
import { calculateStreak } from './calculations';
import * as db from '../../services/database';

/**
 * Zustand store for goals and streaks
 */
interface GoalStore {
  dailyGoal: number | null; // in seconds
  streak: StreakInfo | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchGoal: () => void;
  setGoal: (goalInMinutes: number) => void;
  refreshStreak: () => void;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  dailyGoal: null,
  streak: null,
  loading: false,
  error: null,

  /**
   * Fetch the current daily goal from the database
   */
  fetchGoal: () => {
    try {
      const goal = db.getGoal();
      const dailyGoal = goal?.dailyTimeGoal || 7200; // Default: 2 hours
      
      // Also calculate streak
      const streak = calculateStreak(dailyGoal);
      
      set({ dailyGoal, streak, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch goal' });
      console.error('Error fetching goal:', error);
    }
  },

  /**
   * Set a new daily goal
   * @param goalInMinutes - Daily goal in minutes
   */
  setGoal: (goalInMinutes: number) => {
    try {
      const goalInSeconds = goalInMinutes * 60;
      db.setDailyGoal(goalInSeconds);
      
      // Refresh goal and streak
      get().fetchGoal();
    } catch (error) {
      set({ error: 'Failed to set goal' });
      console.error('Error setting goal:', error);
    }
  },

  /**
   * Refresh streak calculation
   * Call this after adding a new activity
   */
  refreshStreak: () => {
    try {
      const { dailyGoal } = get();
      if (dailyGoal !== null) {
        const streak = calculateStreak(dailyGoal);
        set({ streak });
      }
    } catch (error) {
      set({ error: 'Failed to refresh streak' });
      console.error('Error refreshing streak:', error);
    }
  },
}));
