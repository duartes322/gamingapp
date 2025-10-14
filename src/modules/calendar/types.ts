/**
 * Types for the Calendar module
 */

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  isCurrentMonth: boolean;
  timeSpent: number; // in seconds
  goalStatus: 'none' | 'partial' | 'met' | 'exceeded';
}

export type CalendarDayStatus = 'none' | 'partial' | 'met' | 'exceeded';
