/**
 * Types for the Todos module
 */

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFormData {
  title: string;
  description: string;
}
