import { create } from 'zustand';
import { database } from '@/services/database';
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

  loadTodos: () => {
    try {
      const todos = database.getAllTodos();
      set({ todos, error: null });
    } catch (error) {
      set({ error: 'Failed to load todos' });
      console.error('Error loading todos:', error);
    }
  },

  addTodo: (text: string) => {
    if (!text.trim()) return;
    
    try {
      const newTodo = database.addTodo(text);
      set((state) => ({
        todos: [...state.todos, newTodo],
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to add todo' });
      console.error('Error adding todo:', error);
    }
  },

  toggleTodo: (id: number) => {
    try {
      const updatedTodo = database.toggleTodo(id);
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

  deleteTodo: (id: number) => {
    try {
      database.deleteTodo(id);
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
