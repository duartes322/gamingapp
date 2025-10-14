import { format, subDays, parseISO, differenceInDays } from 'date-fns';
import type { GoalProgress, StreakInfo } from './types';
import * as db from '../../services/database';

/**
 * Calculate if a goal was met for a specific date
 * @param date - Date string (YYYY-MM-DD)
 * @param dailyGoal - Daily goal in seconds
 * @returns Progress information for that date
 */
export function calculateDayProgress(date: string, dailyGoal: number): GoalProgress {
  const timeSpent = db.getTotalTimeForDate(date);
  const goalMet = timeSpent >= dailyGoal;
  const percentage = (timeSpent / dailyGoal) * 100;

  return {
    date,
    timeSpent,
    goalMet,
    percentage,
  };
}

/**
 * Calculate current streak and streak statistics
 * A streak continues as long as each consecutive day meets the goal
 * @param dailyGoal - Daily goal in seconds
 * @returns Streak information
 */
export function calculateStreak(dailyGoal: number): StreakInfo {
  const activityDates = db.getAllActivityDates();
  
  if (activityDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysWithGoal: 0,
    };
  }

  // Get progress for each date
  const progressByDate = new Map<string, GoalProgress>();
  activityDates.forEach(date => {
    const progress = calculateDayProgress(date, dailyGoal);
    progressByDate.set(date, progress);
  });

  // Calculate current streak (working backwards from today)
  let currentStreak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  let checkDate = today;
  
  for (let i = 0; i < 365; i++) { // Check up to 365 days back
    const progress = progressByDate.get(checkDate);
    
    if (progress && progress.goalMet) {
      currentStreak++;
    } else if (checkDate !== today) {
      // If we haven't logged anything today yet, that's OK - continue checking
      // But if we logged something and didn't meet goal, streak is broken
      if (progress) {
        break;
      }
    } else {
      // Today: if there's no activity yet, streak continues from yesterday
      // If there is activity but goal not met, streak is broken
      if (progress) {
        break;
      }
    }
    
    checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort dates
  const sortedDates = Array.from(progressByDate.keys()).sort();
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const progress = progressByDate.get(date)!;
    
    if (progress.goalMet) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Count total days with goal met
  const totalDaysWithGoal = Array.from(progressByDate.values())
    .filter(p => p.goalMet)
    .length;

  return {
    currentStreak,
    longestStreak,
    totalDaysWithGoal,
  };
}

/**
 * Get progress for the last N days
 * @param days - Number of days to look back
 * @param dailyGoal - Daily goal in seconds
 * @returns Array of progress data for each day
 */
export function getRecentProgress(days: number, dailyGoal: number): GoalProgress[] {
  const progress: GoalProgress[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    progress.unshift(calculateDayProgress(date, dailyGoal));
  }
  
  return progress;
}
