import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { generateCalendarMonth, getDayColorClass } from './calculations';
import { useGoalStore } from '../goals/store';
import { useActivityStore } from '../activities/store';
import { formatTime } from '../timer/useTimer';
import type { CalendarDay } from './types';

/**
 * CalendarView component
 * Month view calendar showing activity and goal completion status
 */
export function CalendarView() {
  const { dailyGoal, fetchGoal } = useGoalStore();
  const { fetchActivities, activities } = useActivityStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchGoal();
    fetchActivities();
  }, [fetchGoal, fetchActivities]);

  // Generate calendar data
  const calendarDays = dailyGoal
    ? generateCalendarMonth(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dailyGoal
      )
    : [];

  /**
   * Navigate to previous month
   */
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDay(null);
  };

  /**
   * Navigate to next month
   */
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDay(null);
  };

  /**
   * Get activities for the selected day
   */
  const selectedDayActivities = selectedDay
    ? activities.filter(a => a.date === selectedDay.date)
    : [];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Activity Calendar
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-secondary rounded-md"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="font-medium min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-secondary rounded-md"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Goal Exceeded</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Goal Met</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-card border border-border rounded"></div>
          <span>No Activity</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(day)}
            className={`
              aspect-square rounded-lg flex flex-col items-center justify-center
              transition-all duration-200
              ${getDayColorClass(day.goalStatus, day.isCurrentMonth)}
              ${selectedDay?.date === day.date ? 'ring-2 ring-primary' : ''}
            `}
            title={`${day.date}: ${formatTime(day.timeSpent)}`}
          >
            <span className={`text-sm font-medium ${
              day.isCurrentMonth ? '' : 'opacity-50'
            }`}>
              {day.dayOfMonth}
            </span>
            {day.timeSpent > 0 && day.isCurrentMonth && (
              <span className="text-[10px] opacity-75 mt-0.5">
                {Math.floor(day.timeSpent / 60)}m
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold mb-2">
            {format(new Date(selectedDay.date), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Total time: <span className="font-medium text-foreground">
                {formatTime(selectedDay.timeSpent)}
              </span>
              {dailyGoal && selectedDay.timeSpent > 0 && (
                <span className="ml-2">
                  ({Math.floor((selectedDay.timeSpent / dailyGoal) * 100)}% of goal)
                </span>
              )}
            </p>
          </div>

          {selectedDayActivities.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Activities:</p>
              {selectedDayActivities.map(activity => (
                <div
                  key={activity.id}
                  className="text-sm p-2 bg-muted rounded flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium">{activity.title}</span>
                    <span className="text-muted-foreground ml-2">
                      ({activity.category})
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatTime(activity.timeSpent)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No activities logged for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
