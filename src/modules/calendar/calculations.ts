import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  getDate
} from 'date-fns';
import type { CalendarDay, CalendarDayStatus } from './types';
import * as db from '../../services/database';

/**
 * Determine the status of a day based on time spent vs goal
 * @param timeSpent - Time spent in seconds
 * @param dailyGoal - Daily goal in seconds
 * @returns Status category
 */
export function getDayStatus(timeSpent: number, dailyGoal: number): CalendarDayStatus {
  if (timeSpent === 0) return 'none';
  
  const percentage = (timeSpent / dailyGoal) * 100;
  
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 75) return 'met';
  if (percentage >= 25) return 'partial';
  return 'none';
}

/**
 * Get color class for a day based on its status
 * @param status - Day status
 * @param isCurrentMonth - Whether the day is in the current month
 * @returns Tailwind CSS classes for styling
 */
export function getDayColorClass(status: CalendarDayStatus, isCurrentMonth: boolean): string {
  if (!isCurrentMonth) {
    return 'bg-muted/30 text-muted-foreground/50';
  }

  switch (status) {
    case 'exceeded':
      return 'bg-green-500 text-white hover:bg-green-600';
    case 'met':
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    case 'partial':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'none':
    default:
      return 'bg-card border border-border hover:bg-accent/10';
  }
}

/**
 * Generate calendar data for a given month
 * @param year - Year
 * @param month - Month (0-11)
 * @param dailyGoal - Daily goal in seconds
 * @returns Array of calendar day data
 */
export function generateCalendarMonth(
  year: number,
  month: number,
  dailyGoal: number
): CalendarDay[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  
  // Get the start and end of the calendar grid (including days from adjacent months)
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days in the calendar grid
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Create calendar day data
  const calendarDays: CalendarDay[] = allDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const timeSpent = db.getTotalTimeForDate(dateStr);
    const goalStatus = getDayStatus(timeSpent, dailyGoal);
    
    return {
      date: dateStr,
      dayOfMonth: getDate(day),
      isCurrentMonth: isSameMonth(day, monthStart),
      timeSpent,
      goalStatus,
    };
  });
  
  return calendarDays;
}
