import { useState, useEffect } from 'react';
import { useActivityStore } from './store';
import { ACTIVITY_CATEGORIES } from './types';
import { formatTime } from '../timer/useTimer';
import { X } from 'lucide-react';
import { format } from 'date-fns';

/**
 * AddActivityForm component
 * Dialog that appears when user wants to save timer as an activity
 * Can also be used to manually add activities
 */
export function AddActivityForm() {
  const { 
    showSaveDialog, 
    pendingTimeSpent, 
    closeSaveDialog, 
    addActivity 
  } = useActivityStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ACTIVITY_CATEGORIES[0]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Pre-fill time when dialog opens from timer
  useEffect(() => {
    if (pendingTimeSpent !== null) {
      setTimeSpent(pendingTimeSpent);
    }
  }, [pendingTimeSpent]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() && timeSpent > 0) {
      addActivity(title, category, timeSpent, date);
      // Reset form
      setTitle('');
      setCategory(ACTIVITY_CATEGORIES[0]);
      setTimeSpent(0);
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  /**
   * Handle manual time input (in minutes)
   */
  const handleMinutesChange = (minutes: number) => {
    setTimeSpent(minutes * 60);
  };

  if (!showSaveDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Save Activity</h2>
          <button
            onClick={closeSaveDialog}
            className="p-1 hover:bg-secondary rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ACTIVITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Time Spent */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Time Spent
            </label>
            <div className="space-y-2">
              <div className="text-2xl font-mono font-semibold text-center py-2">
                {formatTime(timeSpent)}
              </div>
              <input
                type="number"
                value={Math.floor(timeSpent / 60)}
                onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
                placeholder="Minutes"
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={!title.trim() || timeSpent === 0}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Save Activity
            </button>
            <button
              type="button"
              onClick={closeSaveDialog}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
