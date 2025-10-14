import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Todos table - stores user's to-do items
 */
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Activities table - stores completed activities logged by the user
 * Each activity contributes to XP and daily goals
 */
export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  category: text('category').notNull(), // e.g., "Work", "Study", "Exercise"
  timeSpent: integer('time_spent').notNull(), // in seconds
  date: text('date').notNull(), // ISO date string (YYYY-MM-DD)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

/**
 * Goals table - stores user's goal settings
 * Currently supports a single daily time goal
 */
export const goals = sqliteTable('goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  dailyTimeGoal: integer('daily_time_goal').notNull(), // in seconds
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

/**
 * User stats table - stores gamification data (XP, level)
 */
export const userStats = sqliteTable('user_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  totalXp: integer('total_xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Type exports for use in the app
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
