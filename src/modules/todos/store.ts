import { create } from 'zustand';
import { database } from '@/services/database-api';
import type { Todo } from './types';

interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadTodos: () => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export const useTodosStore = create<TodosState>((set) => ({
  todos: [],
  isLoading: false,
  error: null,

  loadTodos: async () => {
    try {
      set({ isLoading: true });
      const todos = await database.getAllTodos();
      set({ todos, error: null, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load todos', isLoading: false });
      console.error('Error loading todos:', error);
    }
  },

  addTodo: async (text: string) => {
    if (!text.trim()) return;
    
    try {
      const newTodo = await database.addTodo(text);
      set((state) => ({
        todos: [...state.todos, newTodo],
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to add todo' });
      console.error('Error adding todo:', error);
    }
  },

  toggleTodo: async (id: number) => {
    try {
      const updatedTodo = await database.toggleTodo(id);
      if (updatedTodo) {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? updatedTodo : todo
          ),
          error: null,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update todo' });
      console.error('Error toggling todo:', error);
    }
  },

  deleteTodo: async (id: number) => {
    try {
      await database.deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to delete todo' });
      console.error('Error deleting todo:', error);
    }
  },
}));
