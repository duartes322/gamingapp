import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { todos, type Todo } from './schema';
import { eq } from 'drizzle-orm';

// Initialize database
// In production, you may want to use app.getPath('userData')
const dbPath = './database.db';

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

// Database operations
export const database = {
  // Get all todos
  getAllTodos: (): Todo[] => {
    return db.select().from(todos).all();
  },

  // Add a new todo
  addTodo: (text: string): Todo => {
    const result = db.insert(todos).values({ text }).returning().get();
    return result;
  },

  // Toggle todo completion
  toggleTodo: (id: number): Todo | undefined => {
    const todo = db.select().from(todos).where(eq(todos.id, id)).get();
    if (!todo) return undefined;

    const result = db
      .update(todos)
      .set({ completed: !todo.completed })
      .where(eq(todos.id, id))
      .returning()
      .get();
    return result;
  },

  // Delete a todo
  deleteTodo: (id: number): void => {
    db.delete(todos).where(eq(todos.id, id)).run();
  },
};
