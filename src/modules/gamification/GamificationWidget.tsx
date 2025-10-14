import { useEffect } from 'react';
import { useGamificationStore } from './store';
import { useActivityStore } from '../activities/store';
import { getLevelTitle } from './calculations';
import { Trophy, Zap } from 'lucide-react';

/**
 * GamificationWidget component
 * Displays current level, XP, and progress to next level
 */
export function GamificationWidget() {
  const { stats, fetchStats } = useGamificationStore();
  const activities = useActivityStore(state => state.activities);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh stats when activities change (new activity added)
  useEffect(() => {
    fetchStats();
  }, [activities.length, fetchStats]);

  if (!stats) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Progress
        </h2>
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          <span className="font-bold text-lg">{stats.totalXp} XP</span>
        </div>
      </div>

      {/* Level display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold">Level {stats.level}</span>
          <span className="text-lg text-muted-foreground">
            {getLevelTitle(stats.level)}
          </span>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {stats.xpForCurrentLevel} / {stats.xpNeededForNextLevel} XP
          </span>
          <span className="font-medium text-primary">
            {Math.floor(stats.progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          {stats.xpNeededForNextLevel - stats.xpForCurrentLevel} XP to next level
        </p>
      </div>

      {/* Info text */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          💡 Earn 1 XP for every minute of focused work!
        </p>
      </div>
    </div>
  );
}
