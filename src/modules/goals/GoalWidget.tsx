import { useEffect, useState } from 'react';
import { useGoalStore } from './store';
import { useActivityStore } from '../activities/store';
import { calculateDayProgress } from './calculations';
import { format } from 'date-fns';
import { Target, Flame, Settings } from 'lucide-react';
import { formatTime } from '../timer/useTimer';

/**
 * GoalWidget component
 * Displays daily goal, today's progress, and current streak
 */
export function GoalWidget() {
  const { dailyGoal, streak, fetchGoal, setGoal, refreshStreak } = useGoalStore();
  const activities = useActivityStore(state => state.activities);
  
  const [showSettings, setShowSettings] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // Fetch goal on mount
  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  // Refresh streak when activities change
  useEffect(() => {
    refreshStreak();
  }, [activities.length, refreshStreak]);

  // Calculate today's progress
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayProgress = dailyGoal 
    ? calculateDayProgress(today, dailyGoal)
    : null;

  /**
   * Handle goal update
   */
  const handleUpdateGoal = () => {
    const minutes = parseInt(goalInput);
    if (minutes > 0) {
      setGoal(minutes);
      setShowSettings(false);
      setGoalInput('');
    }
  };

  if (!dailyGoal || !streak || !todayProgress) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Daily Goal
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-secondary rounded-md"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <label className="block text-sm font-medium mb-2">
            Set daily goal (minutes)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder={`Current: ${Math.floor(dailyGoal / 60)} min`}
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
              min="1"
            />
            <button
              onClick={handleUpdateGoal}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Today's Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Today's Progress</span>
          <span className="text-sm font-medium">
            {formatTime(todayProgress.timeSpent)} / {formatTime(dailyGoal)}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              todayProgress.goalMet
                ? 'bg-green-500'
                : todayProgress.percentage >= 75
                ? 'bg-yellow-500'
                : 'bg-primary'
            }`}
            style={{ width: `${Math.min(todayProgress.percentage, 100)}%` }}
          />
        </div>
        
        <p className="text-xs text-center mt-2">
          {todayProgress.goalMet ? (
            <span className="text-green-600 font-medium">
              🎉 Goal reached! Keep it up!
            </span>
          ) : (
            <span className="text-muted-foreground">
              {formatTime(dailyGoal - todayProgress.timeSpent)} remaining
            </span>
          )}
        </p>
      </div>

      {/* Streak Information */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Current Streak</span>
          </div>
          <span className="text-2xl font-bold text-orange-500">
            {streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-muted-foreground mb-1">Longest Streak</div>
            <div className="text-lg font-semibold">{streak.longestStreak}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-muted-foreground mb-1">Total Days</div>
            <div className="text-lg font-semibold">{streak.totalDaysWithGoal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
