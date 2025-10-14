import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { todos, activities, goals, userStats } from './schema';
import type { NewTodo, NewActivity, NewGoal, NewUserStats } from './schema';
import { eq, desc, sql } from 'drizzle-orm';
import { format } from 'date-fns';

// Initialize SQLite database
const sqlite = new Database('productivity.db');
const db = drizzle(sqlite);

/**
 * Initialize database tables
 * Creates tables if they don't exist
 */
export function initDatabase() {
  // Create todos table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);

  // Create activities table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      time_spent INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  // Create goals table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_time_goal INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create user_stats table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    )
  `);

  console.log('Database initialized');
}

// ==================== TODOS ====================

/**
 * Get all todos, ordered by creation date (newest first)
 */
export function getAllTodos() {
  return db.select().from(todos).orderBy(desc(todos.createdAt)).all();
}

/**
 * Add a new todo item
 */
export function addTodo(todo: Omit<NewTodo, 'createdAt'>) {
  const result = db.insert(todos).values({
    ...todo,
    createdAt: new Date(),
  }).run();
  return result.lastInsertRowid;
}

/**
 * Update a todo item
 */
export function updateTodo(id: number, updates: Partial<NewTodo>) {
  return db.update(todos).set(updates).where(eq(todos.id, id)).run();
}

/**
 * Delete a todo item
 */
export function deleteTodo(id: number) {
  return db.delete(todos).where(eq(todos.id, id)).run();
}

/**
 * Toggle todo completion status
 */
export function toggleTodoComplete(id: number, completed: boolean) {
  return db.update(todos).set({ completed }).where(eq(todos.id, id)).run();
}

// ==================== ACTIVITIES ====================

/**
 * Get all activities, ordered by date (newest first)
 */
export function getAllActivities() {
  return db.select().from(activities).orderBy(desc(activities.date), desc(activities.createdAt)).all();
}

/**
 * Get activities for a specific date
 */
export function getActivitiesByDate(date: string) {
  return db.select().from(activities).where(eq(activities.date, date)).all();
}

/**
 * Add a new activity
 * This will also update XP and level
 */
export function addActivity(activity: Omit<NewActivity, 'createdAt'>) {
  const result = db.insert(activities).values({
    ...activity,
    createdAt: new Date(),
  }).run();

  // Update XP (1 minute = 1 XP)
  const xpGained = Math.floor(activity.timeSpent / 60);
  updateXp(xpGained);

  return result.lastInsertRowid;
}

/**
 * Delete an activity
 */
export function deleteActivity(id: number) {
  return db.delete(activities).where(eq(activities.id, id)).run();
}

/**
 * Get total time spent for a specific date (in seconds)
 */
export function getTotalTimeForDate(date: string): number {
  const result = db.select({
    total: sql<number>`COALESCE(SUM(${activities.timeSpent}), 0)`,
  }).from(activities).where(eq(activities.date, date)).get();
  
  return result?.total || 0;
}

/**
 * Get all unique dates that have activities
 */
export function getAllActivityDates(): string[] {
  const result = db.select({
    date: activities.date,
  }).from(activities).groupBy(activities.date).all();
  
  return result.map(r => r.date);
}

// ==================== GOALS ====================

/**
 * Get current goal settings
 * Returns the first (and only) goal record
 */
export function getGoal() {
  return db.select().from(goals).limit(1).get();
}

/**
 * Set or update the daily time goal
 */
export function setDailyGoal(dailyTimeGoal: number) {
  const existing = getGoal();
  
  if (existing) {
    return db.update(goals).set({
      dailyTimeGoal,
      updatedAt: new Date(),
    }).where(eq(goals.id, existing.id)).run();
  } else {
    return db.insert(goals).values({
      dailyTimeGoal,
      updatedAt: new Date(),
    }).run();
  }
}

// ==================== USER STATS (XP & LEVEL) ====================

/**
 * Get current user stats (XP and level)
 */
export function getUserStats() {
  return db.select().from(userStats).limit(1).get();
}

/**
 * Update XP and recalculate level
 * Level = floor(totalXp / 100)
 */
export function updateXp(xpToAdd: number) {
  const stats = getUserStats();
  
  if (stats) {
    const newTotalXp = stats.totalXp + xpToAdd;
    const newLevel = Math.floor(newTotalXp / 100) + 1; // Level starts at 1
    
    return db.update(userStats).set({
      totalXp: newTotalXp,
      level: newLevel,
      updatedAt: new Date(),
    }).where(eq(userStats.id, stats.id)).run();
  } else {
    // Initialize stats
    const newLevel = Math.floor(xpToAdd / 100) + 1;
    return db.insert(userStats).values({
      totalXp: xpToAdd,
      level: newLevel,
      updatedAt: new Date(),
    }).run();
  }
}

/**
 * Reset user stats (useful for testing)
 */
export function resetUserStats() {
  const stats = getUserStats();
  if (stats) {
    return db.update(userStats).set({
      totalXp: 0,
      level: 1,
      updatedAt: new Date(),
    }).where(eq(userStats.id, stats.id)).run();
  }
}

// ==================== SEED DATA ====================

/**
 * Populate database with example data
 * This helps you see the app in action immediately
 */
export function seedDatabase() {
  // Check if already seeded
  const existingActivities = getAllActivities();
  if (existingActivities.length > 0) {
    console.log('Database already seeded');
    return;
  }

  // Add sample todos
  addTodo({ title: 'Complete project proposal', description: 'Write and submit the Q1 project proposal', completed: false });
  addTodo({ title: 'Review pull requests', description: '', completed: false });
  addTodo({ title: 'Update documentation', description: 'Add API documentation for new endpoints', completed: false });
  addTodo({ title: 'Team standup meeting', description: 'Daily sync at 10 AM', completed: true });
  addTodo({ title: 'Fix login bug', description: 'Users report issue with 2FA', completed: true });

  // Add sample activities (past 10 days)
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');

    // Add 2-4 activities per day
    const numActivities = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numActivities; j++) {
      const categories = ['Work', 'Study', 'Exercise', 'Reading', 'Personal Project'];
      const titles = [
        'Coding session',
        'Learning TypeScript',
        'Workout',
        'Read technical article',
        'Side project development',
        'Code review',
        'Meeting',
        'Documentation writing',
      ];
      
      // Random time between 15 and 120 minutes
      const timeInSeconds = (Math.floor(Math.random() * 105) + 15) * 60;
      
      addActivity({
        title: titles[Math.floor(Math.random() * titles.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        timeSpent: timeInSeconds,
        date: dateStr,
      });
    }
  }

  // Set default goal (2 hours = 7200 seconds)
  setDailyGoal(7200);

  console.log('Database seeded with example data');
}
