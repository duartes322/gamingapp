import { Timer } from '../modules/timer/Timer';
import { GamificationWidget } from '../modules/gamification/GamificationWidget';
import { GoalWidget } from '../modules/goals/GoalWidget';
import { CalendarView } from '../modules/calendar/CalendarView';
import { TodoList } from '../modules/todos/TodoList';
import { AddTodoForm } from '../modules/todos/AddTodoForm';
import { ActivityList } from '../modules/activities/ActivityList';
import { AddActivityForm } from '../modules/activities/AddActivityForm';
import { CheckSquare, Clock, Trophy } from 'lucide-react';

/**
 * Dashboard component
 * Main dashboard that brings all modules together
 */
export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Top Row: Stats and Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GamificationWidget />
        <GoalWidget />
        <Timer />
      </div>

      {/* Second Row: Todos and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Todos Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">To-Do List</h2>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <AddTodoForm />
            <div className="mt-6">
              <TodoList />
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Activity Log</h2>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg max-h-[600px] overflow-y-auto">
            <ActivityList />
          </div>
        </div>
      </div>

      {/* Third Row: Calendar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Progress Calendar</h2>
        </div>
        
        <CalendarView />
      </div>

      {/* Activity Save Dialog (modal) */}
      <AddActivityForm />
    </div>
  );
}
