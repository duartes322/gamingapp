/**
 * Types for the Activities module
 */

export interface Activity {
  id: number;
  title: string;
  category: string;
  timeSpent: number; // in seconds
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: Date;
}

export interface ActivityFormData {
  title: string;
  category: string;
  timeSpent: number;
  date: string;
}

// Predefined activity categories
export const ACTIVITY_CATEGORIES = [
  'Work',
  'Study',
  'Exercise',
  'Reading',
  'Personal Project',
  'Meeting',
  'Other',
] as const;

export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number];
