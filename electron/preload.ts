import { contextBridge, ipcRenderer } from 'electron';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getAllTodos: (): Promise<Todo[]> => ipcRenderer.invoke('db:getAllTodos'),
  addTodo: (text: string): Promise<Todo> => ipcRenderer.invoke('db:addTodo', text),
  toggleTodo: (id: number): Promise<Todo | null> => ipcRenderer.invoke('db:toggleTodo', id),
  deleteTodo: (id: number): Promise<void> => ipcRenderer.invoke('db:deleteTodo', id),
});
