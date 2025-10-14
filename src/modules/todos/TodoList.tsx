import { useEffect, useState } from 'react';
import { useTodoStore } from './store';
import { Trash2, Edit2, Check, X } from 'lucide-react';

/**
 * TodoList component
 * Displays all todos with options to complete, edit, or delete them
 */
export function TodoList() {
  const { todos, fetchTodos, toggleComplete, deleteTodo, updateTodo } = useTodoStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * Start editing a todo
   */
  const startEdit = (id: number, title: string, description: string | null) => {
    setEditingId(id);
    setEditTitle(title);
    setEditDescription(description || '');
  };

  /**
   * Save the edited todo
   */
  const saveEdit = () => {
    if (editingId !== null && editTitle.trim()) {
      updateTodo(editingId, editTitle, editDescription);
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  return (
    <div className="space-y-2">
      {todos.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No todos yet. Add one to get started!
        </p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 rounded-lg border ${
              todo.completed ? 'bg-muted/50 border-muted' : 'bg-card border-border'
            }`}
          >
            {editingId === todo.id ? (
              // Edit mode
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Todo title"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Description (optional)"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    todo.completed
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4 text-primary-foreground" />}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      todo.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(todo.id, todo.title, todo.description)}
                    className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
