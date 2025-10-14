import { create } from 'zustand';

/**
 * Zustand store for timer state
 * Manages the timer's running state, elapsed time, and duration settings
 */
interface TimerStore {
  isRunning: boolean;
  elapsedSeconds: number;
  targetDuration: number | null; // null = infinite timer
  
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTargetDuration: (seconds: number | null) => void;
  tick: () => void; // Called every second when running
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  isRunning: false,
  elapsedSeconds: 0,
  targetDuration: null,

  /**
   * Start the timer
   */
  start: () => {
    set({ isRunning: true });
  },

  /**
   * Pause the timer
   */
  pause: () => {
    set({ isRunning: false });
  },

  /**
   * Reset the timer to zero
   */
  reset: () => {
    set({ 
      isRunning: false, 
      elapsedSeconds: 0 
    });
  },

  /**
   * Set the target duration for the timer
   * @param seconds - Target duration in seconds, or null for infinite
   */
  setTargetDuration: (seconds: number | null) => {
    set({ targetDuration: seconds });
  },

  /**
   * Increment the timer by one second
   * Called by the useTimer hook every second when running
   */
  tick: () => {
    const { elapsedSeconds, targetDuration } = get();
    const newElapsed = elapsedSeconds + 1;
    
    // Check if we've reached the target duration
    if (targetDuration !== null && newElapsed >= targetDuration) {
      set({ 
        elapsedSeconds: targetDuration,
        isRunning: false 
      });
      // Timer completed - will trigger notification in useTimer hook
    } else {
      set({ elapsedSeconds: newElapsed });
    }
  },
}));
