import { create } from 'zustand';
import type { Todo } from './types';
import * as db from '../../services/database';

/**
 * Zustand store for managing todos
 * Handles all todo-related state and operations
 */
interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTodos: () => void;
  addTodo: (title: string, description?: string) => void;
  updateTodo: (id: number, title: string, description?: string) => void;
  deleteTodo: (id: number) => void;
  toggleComplete: (id: number) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  /**
   * Fetch all todos from the database
   */
  fetchTodos: () => {
    try {
      const todos = db.getAllTodos();
      set({ todos, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch todos' });
      console.error('Error fetching todos:', error);
    }
  },

  /**
   * Add a new todo item
   */
  addTodo: (title: string, description?: string) => {
    try {
      db.addTodo({ 
        title, 
        description: description || null,
        completed: false,
      });
      get().fetchTodos(); // Refresh the list
    } catch (error) {
      set({ error: 'Failed to add todo' });
      console.error('Error adding todo:', error);
    }
  },

  /**
   * Update an existing todo
   */
  updateTodo: (id: number, title: string, description?: string) => {
    try {
      db.updateTodo(id, { 
        title, 
        description: description || null,
      });
      get().fetchTodos(); // Refresh the list
    } catch (error) {
      set({ error: 'Failed to update todo' });
      console.error('Error updating todo:', error);
    }
  },

  /**
   * Delete a todo item
   */
  deleteTodo: (id: number) => {
    try {
      db.deleteTodo(id);
      get().fetchTodos(); // Refresh the list
    } catch (error) {
      set({ error: 'Failed to delete todo' });
      console.error('Error deleting todo:', error);
    }
  },

  /**
   * Toggle the completion status of a todo
   */
  toggleComplete: (id: number) => {
    try {
      const todo = get().todos.find(t => t.id === id);
      if (todo) {
        db.toggleTodoComplete(id, !todo.completed);
        get().fetchTodos(); // Refresh the list
      }
    } catch (error) {
      set({ error: 'Failed to toggle todo' });
      console.error('Error toggling todo:', error);
    }
  },
}));
