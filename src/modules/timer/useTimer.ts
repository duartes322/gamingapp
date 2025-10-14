import { useEffect, useRef } from 'react';
import { useTimerStore } from './store';

/**
 * Custom hook that manages the timer interval
 * Ticks every second when the timer is running
 * Shows notification when timer completes
 */
export function useTimer() {
  const { isRunning, tick, elapsedSeconds, targetDuration } = useTimerStore();
  const previousElapsedRef = useRef(elapsedSeconds);

  useEffect(() => {
    // Check if timer just completed
    if (
      targetDuration !== null &&
      elapsedSeconds === targetDuration &&
      previousElapsedRef.current < targetDuration
    ) {
      // Timer completed - show notification
      if (window.electron) {
        window.electron.showNotification(
          'Timer Complete!',
          `Your ${formatTime(targetDuration)} timer has finished.`
        );
      }
    }
    
    previousElapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds, targetDuration]);

  useEffect(() => {
    if (!isRunning) return;

    // Set up interval to tick every second
    const intervalId = setInterval(() => {
      tick();
    }, 1000);

    // Cleanup interval on unmount or when timer stops
    return () => clearInterval(intervalId);
  }, [isRunning, tick]);
}

/**
 * Format seconds into MM:SS format
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
