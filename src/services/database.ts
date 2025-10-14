import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { format } from 'date-fns';

// Types for our database entities
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: number; // SQLite uses 0/1 for boolean
  createdAt: number;
}

export interface Activity {
  id: number;
  title: string;
  category: string;
  timeSpent: number;
  date: string;
  createdAt: number;
}

export interface Goal {
  id: number;
  dailyTimeGoal: number;
  updatedAt: number;
}

export interface UserStats {
  id: number;
  totalXp: number;
  level: number;
  updatedAt: number;
}

// Global database instance
let db: SqlJsDatabase | null = null;

/**
 * Initialize the SQL.js database
 * This must be called before any database operations
 */
export async function initDatabase() {
  try {
    // Initialize SQL.js
    const SQL = await initSqlJs({
      // Load sql-wasm.wasm from CDN
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem('productivityDb');
    if (savedDb) {
      // Load from base64 string
      const uint8Array = Uint8Array.from(atob(savedDb), c => c.charCodeAt(0));
      db = new SQL.Database(uint8Array);
      console.log('Loaded existing database from storage');
    } else {
      // Create new database
      db = new SQL.Database();
      console.log('Created new database');
    }

    // Create tables
    createTables();
    
    console.log('Database initialized');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Save database to localStorage
 * Call this after any write operation
 */
function saveDatabase() {
  if (!db) return;
  
  try {
    // Export database to Uint8Array
    const data = db.export();
    // Convert to base64 string for localStorage
    const base64 = btoa(String.fromCharCode(...data));
    localStorage.setItem('productivityDb', base64);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

/**
 * Create database tables if they don't exist
 */
function createTables() {
  if (!db) throw new Error('Database not initialized');

  // Create todos table
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);

  // Create activities table
  db.run(`
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
  db.run(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_time_goal INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  // Create user_stats table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      updated_at INTEGER NOT NULL
    )
  `);
}

/**
 * Get the database instance
 */
function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ==================== TODOS ====================

/**
 * Get all todos, ordered by creation date (newest first)
 */
export function getAllTodos(): Todo[] {
  const database = getDb();
  const result = database.exec('SELECT * FROM todos ORDER BY created_at DESC');
  
  if (result.length === 0) return [];
  
  const todos: Todo[] = [];
  const columns = result[0].columns;
  const values = result[0].values;
  
  values.forEach(row => {
    const todo: any = {};
    columns.forEach((col, i) => {
      // Convert snake_case to camelCase
      const key = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      todo[key] = row[i];
    });
    todos.push(todo as Todo);
  });
  
  return todos;
}

/**
 * Add a new todo item
 */
export function addTodo(todo: { title: string; description?: string | null; completed: boolean }) {
  const database = getDb();
  const createdAt = Date.now();
  
  database.run(
    'INSERT INTO todos (title, description, completed, created_at) VALUES (?, ?, ?, ?)',
    [todo.title, todo.description || null, todo.completed ? 1 : 0, createdAt]
  );
  
  saveDatabase();
  return database.exec('SELECT last_insert_rowid()')[0].values[0][0] as number;
}

/**
 * Update a todo item
 */
export function updateTodo(id: number, updates: { title?: string; description?: string | null }) {
  const database = getDb();
  const sets: string[] = [];
  const values: any[] = [];
  
  if (updates.title !== undefined) {
    sets.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    sets.push('description = ?');
    values.push(updates.description);
  }
  
  if (sets.length === 0) return;
  
  values.push(id);
  database.run(`UPDATE todos SET ${sets.join(', ')} WHERE id = ?`, values);
  saveDatabase();
}

/**
 * Delete a todo item
 */
export function deleteTodo(id: number) {
  const database = getDb();
  database.run('DELETE FROM todos WHERE id = ?', [id]);
  saveDatabase();
}

/**
 * Toggle todo completion status
 */
export function toggleTodoComplete(id: number, completed: boolean) {
  const database = getDb();
  database.run('UPDATE todos SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
  saveDatabase();
}

// ==================== ACTIVITIES ====================

/**
 * Get all activities, ordered by date (newest first)
 */
export function getAllActivities(): Activity[] {
  const database = getDb();
  const result = database.exec('SELECT * FROM activities ORDER BY date DESC, created_at DESC');
  
  if (result.length === 0) return [];
  
  const activities: Activity[] = [];
  const columns = result[0].columns;
  const values = result[0].values;
  
  values.forEach(row => {
    const activity: any = {};
    columns.forEach((col, i) => {
      const key = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      activity[key] = row[i];
    });
    activities.push(activity as Activity);
  });
  
  return activities;
}

/**
 * Get activities for a specific date
 */
export function getActivitiesByDate(date: string): Activity[] {
  const database = getDb();
  const result = database.exec('SELECT * FROM activities WHERE date = ?', [date]);
  
  if (result.length === 0) return [];
  
  const activities: Activity[] = [];
  const columns = result[0].columns;
  const values = result[0].values;
  
  values.forEach(row => {
    const activity: any = {};
    columns.forEach((col, i) => {
      const key = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      activity[key] = row[i];
    });
    activities.push(activity as Activity);
  });
  
  return activities;
}

/**
 * Add a new activity
 * This will also update XP and level
 */
export function addActivity(activity: { title: string; category: string; timeSpent: number; date: string }) {
  const database = getDb();
  const createdAt = Date.now();
  
  database.run(
    'INSERT INTO activities (title, category, time_spent, date, created_at) VALUES (?, ?, ?, ?, ?)',
    [activity.title, activity.category, activity.timeSpent, activity.date, createdAt]
  );
  
  // Update XP (1 minute = 1 XP)
  const xpGained = Math.floor(activity.timeSpent / 60);
  updateXp(xpGained);
  
  saveDatabase();
  return database.exec('SELECT last_insert_rowid()')[0].values[0][0] as number;
}

/**
 * Delete an activity
 */
export function deleteActivity(id: number) {
  const database = getDb();
  database.run('DELETE FROM activities WHERE id = ?', [id]);
  saveDatabase();
}

/**
 * Get total time spent for a specific date (in seconds)
 */
export function getTotalTimeForDate(date: string): number {
  const database = getDb();
  const result = database.exec(
    'SELECT COALESCE(SUM(time_spent), 0) as total FROM activities WHERE date = ?',
    [date]
  );
  
  if (result.length === 0) return 0;
  return result[0].values[0][0] as number;
}

/**
 * Get all unique dates that have activities
 */
export function getAllActivityDates(): string[] {
  const database = getDb();
  const result = database.exec('SELECT DISTINCT date FROM activities ORDER BY date');
  
  if (result.length === 0) return [];
  return result[0].values.map(row => row[0] as string);
}

// ==================== GOALS ====================

/**
 * Get current goal settings
 */
export function getGoal(): Goal | null {
  const database = getDb();
  const result = database.exec('SELECT * FROM goals LIMIT 1');
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  const goal: any = {};
  
  columns.forEach((col, i) => {
    const key = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    goal[key] = row[i];
  });
  
  return goal as Goal;
}

/**
 * Set or update the daily time goal
 */
export function setDailyGoal(dailyTimeGoal: number) {
  const database = getDb();
  const existing = getGoal();
  const updatedAt = Date.now();
  
  if (existing) {
    database.run(
      'UPDATE goals SET daily_time_goal = ?, updated_at = ? WHERE id = ?',
      [dailyTimeGoal, updatedAt, existing.id]
    );
  } else {
    database.run(
      'INSERT INTO goals (daily_time_goal, updated_at) VALUES (?, ?)',
      [dailyTimeGoal, updatedAt]
    );
  }
  
  saveDatabase();
}

// ==================== USER STATS (XP & LEVEL) ====================

/**
 * Get current user stats (XP and level)
 */
export function getUserStats(): UserStats | null {
  const database = getDb();
  const result = database.exec('SELECT * FROM user_stats LIMIT 1');
  
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const columns = result[0].columns;
  const row = result[0].values[0];
  const stats: any = {};
  
  columns.forEach((col, i) => {
    const key = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    stats[key] = row[i];
  });
  
  return stats as UserStats;
}

/**
 * Update XP and recalculate level
 * Level = floor(totalXp / 100) + 1
 */
export function updateXp(xpToAdd: number) {
  const database = getDb();
  const stats = getUserStats();
  const updatedAt = Date.now();
  
  if (stats) {
    const newTotalXp = stats.totalXp + xpToAdd;
    const newLevel = Math.floor(newTotalXp / 100) + 1;
    
    database.run(
      'UPDATE user_stats SET total_xp = ?, level = ?, updated_at = ? WHERE id = ?',
      [newTotalXp, newLevel, updatedAt, stats.id]
    );
  } else {
    const newLevel = Math.floor(xpToAdd / 100) + 1;
    database.run(
      'INSERT INTO user_stats (total_xp, level, updated_at) VALUES (?, ?, ?)',
      [xpToAdd, newLevel, updatedAt]
    );
  }
  
  saveDatabase();
}

/**
 * Reset user stats (useful for testing)
 */
export function resetUserStats() {
  const database = getDb();
  const stats = getUserStats();
  const updatedAt = Date.now();
  
  if (stats) {
    database.run(
      'UPDATE user_stats SET total_xp = 0, level = 1, updated_at = ? WHERE id = ?',
      [updatedAt, stats.id]
    );
    saveDatabase();
  }
}

// ==================== SEED DATA ====================

/**
 * Populate database with example data
 */
export function seedDatabase() {
  // Check if already seeded
  const existingActivities = getAllActivities();
  if (existingActivities.length > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database with example data...');

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

  console.log('Database seeded successfully');
}
