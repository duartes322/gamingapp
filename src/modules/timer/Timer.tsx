import { useState } from 'react';
import { useTimerStore } from './store';
import { useTimer, formatTime } from './useTimer';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { useActivityStore } from '../activities/store';

/**
 * Timer component
 * Global timer with start/pause/reset controls
 * Can set a target duration or run indefinitely
 */
export function Timer() {
  const { 
    isRunning, 
    elapsedSeconds, 
    targetDuration, 
    start, 
    pause, 
    reset, 
    setTargetDuration 
  } = useTimerStore();
  
  const { openSaveDialog } = useActivityStore();
  
  const [durationInput, setDurationInput] = useState('');
  const [showDurationInput, setShowDurationInput] = useState(false);

  // Hook to manage timer ticking
  useTimer();

  /**
   * Handle setting a custom duration
   */
  const handleSetDuration = () => {
    const minutes = parseInt(durationInput);
    if (minutes > 0) {
      setTargetDuration(minutes * 60);
      setShowDurationInput(false);
      setDurationInput('');
      reset(); // Reset timer when setting new duration
    }
  };

  /**
   * Clear duration (set to infinite)
   */
  const handleClearDuration = () => {
    setTargetDuration(null);
    setShowDurationInput(false);
  };

  /**
   * Save the current timer as an activity
   */
  const handleSave = () => {
    if (elapsedSeconds > 0) {
      openSaveDialog(elapsedSeconds);
    }
  };

  // Calculate progress percentage for visual indicator
  const progressPercentage = targetDuration 
    ? (elapsedSeconds / targetDuration) * 100 
    : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Timer</h2>

      {/* Timer display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold font-mono mb-2">
          {formatTime(elapsedSeconds)}
        </div>
        {targetDuration && (
          <div className="text-sm text-muted-foreground">
            / {formatTime(targetDuration)}
          </div>
        )}
        
        {/* Progress bar (only shown when duration is set) */}
        {targetDuration && (
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        {!isRunning ? (
          <button
            onClick={start}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 font-medium"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 flex items-center justify-center gap-2 font-medium"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        
        <button
          onClick={reset}
          className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 flex items-center justify-center gap-2"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleSave}
          disabled={elapsedSeconds === 0}
          className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Save as activity"
        >
          <Save className="w-5 h-5" />
        </button>
      </div>

      {/* Duration settings */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Duration</span>
          {targetDuration ? (
            <button
              onClick={handleClearDuration}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear (infinite)
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">Infinite</span>
          )}
        </div>

        {showDurationInput ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              placeholder="Minutes"
              className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
              min="1"
            />
            <button
              onClick={handleSetDuration}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Set
            </button>
            <button
              onClick={() => setShowDurationInput(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDurationInput(true)}
            className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 text-sm"
          >
            {targetDuration ? 'Change duration' : 'Set duration'}
          </button>
        )}
      </div>
    </div>
  );
}
