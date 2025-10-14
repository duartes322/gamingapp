import { create } from 'zustand';
import type { Activity } from './types';
import * as db from '../../services/database';
import { format } from 'date-fns';

/**
 * Zustand store for managing activities
 * Handles activity logging and retrieval
 */
interface ActivityStore {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  
  // Save dialog state
  showSaveDialog: boolean;
  pendingTimeSpent: number | null;
  
  // Actions
  fetchActivities: () => void;
  addActivity: (title: string, category: string, timeSpent: number, date?: string) => void;
  deleteActivity: (id: number) => void;
  openSaveDialog: (timeSpent: number) => void;
  closeSaveDialog: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: [],
  loading: false,
  error: null,
  showSaveDialog: false,
  pendingTimeSpent: null,

  /**
   * Fetch all activities from the database
   */
  fetchActivities: () => {
    try {
      const activities = db.getAllActivities();
      set({ activities, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch activities' });
      console.error('Error fetching activities:', error);
    }
  },

  /**
   * Add a new activity
   * This will also update XP and goal progress automatically via database layer
   */
  addActivity: (title: string, category: string, timeSpent: number, date?: string) => {
    try {
      const activityDate = date || format(new Date(), 'yyyy-MM-dd');
      db.addActivity({
        title,
        category,
        timeSpent,
        date: activityDate,
      });
      get().fetchActivities(); // Refresh the list
      
      // Close save dialog if it was open
      set({ showSaveDialog: false, pendingTimeSpent: null });
    } catch (error) {
      set({ error: 'Failed to add activity' });
      console.error('Error adding activity:', error);
    }
  },

  /**
   * Delete an activity
   */
  deleteActivity: (id: number) => {
    try {
      db.deleteActivity(id);
      get().fetchActivities(); // Refresh the list
    } catch (error) {
      set({ error: 'Failed to delete activity' });
      console.error('Error deleting activity:', error);
    }
  },

  /**
   * Open the save activity dialog with pre-filled time
   * Called when user clicks "Save" on the timer
   */
  openSaveDialog: (timeSpent: number) => {
    set({ 
      showSaveDialog: true, 
      pendingTimeSpent: timeSpent 
    });
  },

  /**
   * Close the save activity dialog
   */
  closeSaveDialog: () => {
    set({ 
      showSaveDialog: false, 
      pendingTimeSpent: null 
    });
  },
}));
