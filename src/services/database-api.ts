// Renderer-safe database API that communicates with main process via IPC
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const database = {
  getAllTodos: async (): Promise<Todo[]> => {
    return window.electronAPI.getAllTodos();
  },

  addTodo: async (text: string): Promise<Todo> => {
    return window.electronAPI.addTodo(text);
  },

  toggleTodo: async (id: number): Promise<Todo | null> => {
    return window.electronAPI.toggleTodo(id);
  },

  deleteTodo: async (id: number): Promise<void> => {
    return window.electronAPI.deleteTodo(id);
  },
};
