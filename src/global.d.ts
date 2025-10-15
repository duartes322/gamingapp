export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface ElectronAPI {
  getAllTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: number) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
