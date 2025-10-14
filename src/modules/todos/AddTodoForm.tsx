import { useState } from 'react';
import { useTodoStore } from './store';
import { Plus } from 'lucide-react';

/**
 * AddTodoForm component
 * Form for creating new todo items
 */
export function AddTodoForm() {
  const { addTodo } = useTodoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      addTodo(title, description || undefined);
      // Reset form
      setTitle('');
      setDescription('');
      setShowDescription(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Optional description toggle */}
      {!showDescription ? (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          + Add description
        </button>
      ) : (
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <button
            type="button"
            onClick={() => {
              setShowDescription(false);
              setDescription('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Remove description
          </button>
        </div>
      )}
    </form>
  );
}
