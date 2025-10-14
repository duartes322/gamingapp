import { create } from 'zustand';
import type { GamificationStats } from './types';
import { calculateGamificationStats } from './calculations';
import * as db from '../../services/database';

/**
 * Zustand store for gamification state
 * Manages XP, levels, and related stats
 */
interface GamificationStore {
  stats: GamificationStats | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchStats: () => void;
  refreshStats: () => void; // Alias for convenience
}

export const useGamificationStore = create<GamificationStore>((set) => ({
  stats: null,
  loading: false,
  error: null,

  /**
   * Fetch current gamification stats from the database
   */
  fetchStats: () => {
    try {
      const userStats = db.getUserStats();
      
      if (userStats) {
        const stats = calculateGamificationStats(userStats.totalXp);
        set({ stats, error: null });
      } else {
        // Initialize with default stats
        const stats = calculateGamificationStats(0);
        set({ stats, error: null });
      }
    } catch (error) {
      set({ error: 'Failed to fetch stats' });
      console.error('Error fetching gamification stats:', error);
    }
  },

  /**
   * Refresh stats (same as fetchStats, but clearer intent)
   * Call this after adding an activity to update XP display
   */
  refreshStats: () => {
    try {
      const userStats = db.getUserStats();
      
      if (userStats) {
        const stats = calculateGamificationStats(userStats.totalXp);
        set({ stats, error: null });
      }
    } catch (error) {
      set({ error: 'Failed to refresh stats' });
      console.error('Error refreshing gamification stats:', error);
    }
  },
}));
