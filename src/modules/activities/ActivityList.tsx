import { useEffect } from 'react';
import { useActivityStore } from './store';
import { formatTime } from '../timer/useTimer';
import { Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

/**
 * ActivityList component
 * Displays all logged activities with their details
 */
export function ActivityList() {
  const { activities, fetchActivities, deleteActivity } = useActivityStore();

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  /**
   * Format the activity date for display
   */
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  /**
   * Get category color for visual distinction
   */
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Work': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      'Study': 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      'Exercise': 'bg-green-500/10 text-green-700 border-green-500/20',
      'Reading': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      'Personal Project': 'bg-pink-500/10 text-pink-700 border-pink-500/20',
      'Meeting': 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      'Other': 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No activities logged yet. Complete some tasks to see them here!
        </p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(
                      activity.category
                    )}`}
                  >
                    {activity.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(activity.timeSpent)}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(activity.date)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteActivity(activity.id)}
                className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                title="Delete activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
