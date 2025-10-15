import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import path from 'path';
import { app } from 'electron';

// Schema definition
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type Todo = typeof todos.$inferSelect;

// Initialize database
const dbPath = app.isPackaged 
  ? path.join(process.resourcesPath, 'database.db')
  : path.join(app.getPath('userData'), 'database.db');

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`);

// Database operations (to be called from main process only)
export const databaseOperations = {
  getAllTodos: (): Todo[] => {
    return db.select().from(todos).all();
  },

  addTodo: (text: string): Todo => {
    const result = db.insert(todos).values({ text }).returning().get();
    return result;
  },

  toggleTodo: (id: number): Todo | null => {
    const todo = db.select().from(todos).where(eq(todos.id, id)).get();
    if (!todo) return null;

    const result = db
      .update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, id))
      .returning()
      .get();
    return result;
  },

  deleteTodo: (id: number): void => {
    db.delete(todos).where(eq(todos.id, id)).run();
  },
};
