# Productivity Quest 🎮

A gamified productivity app built with Electron, React, TypeScript, and SQLite. Track your tasks, log activities, earn XP, level up, and maintain daily streaks!

> **🪟 Windows-Friendly!** No Visual Studio or C++ build tools required! Works on Windows, Mac, and Linux with just `npm install`.

## Features ✨

### 1. **To-Do List** ✅
- Create, edit, complete, and delete to-do items
- Add optional descriptions to tasks
- Clean, intuitive checkbox interface
- Persistent storage with SQLite

### 2. **Global Timer** ⏱️
- Start/Pause/Reset timer with visual controls
- Set finite duration or run indefinitely
- Display time in MM:SS format
- System notifications when timer completes
- Save timer sessions as activities

### 3. **Activity Logging** 📊
- Log completed activities with title, category, and time spent
- Automatic time pre-fill from timer
- Categorize activities (Work, Study, Exercise, etc.)
- View complete activity history
- Each activity automatically updates your XP and daily progress

### 4. **Gamification System** 🏆
- **XP System**: Earn 1 XP per minute of focused work
- **Level System**: Level up every 100 XP
- **Progress Tracking**: Visual XP bar showing progress to next level
- **Level Titles**: From "Beginner" to "Legend"
- Real-time updates when logging activities

### 5. **Daily Goals & Streaks** 🔥
- Set custom daily time goals (default: 2 hours)
- Track today's progress with visual progress bar
- **Current Streak**: Consecutive days meeting your goal
- **Longest Streak**: Your best streak record
- **Total Days**: Count of all days you've met your goal
- Automatic streak calculation

### 6. **Calendar View** 📅
- Month-by-month calendar visualization
- Color-coded days:
  - 🟢 **Green**: Goal exceeded (100%+)
  - 🟡 **Yellow**: Goal met (75-99%)
  - 🟠 **Orange**: Partial progress (25-74%)
  - ⚪ **White**: No activity or minimal progress
- Click any day to see detailed activities
- Navigate between months
- Quick overview of time spent per day

## Tech Stack 🛠️

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 28
- **Build Tool**: Vite
- **State Management**: Zustand
- **Database**: SQLite (via sql.js - WebAssembly, no build tools required!)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Project Structure 📁

```
src/
├── modules/
│   ├── activities/         # Activity logging module
│   │   ├── store.ts       # Zustand state management
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── ActivityList.tsx
│   │   └── AddActivityForm.tsx
│   ├── timer/             # Timer module
│   │   ├── store.ts
│   │   ├── Timer.tsx
│   │   └── useTimer.ts    # Timer hook with notifications
│   ├── todos/             # To-do list module
│   │   ├── store.ts
│   │   ├── types.ts
│   │   ├── TodoList.tsx
│   │   └── AddTodoForm.tsx
│   ├── gamification/      # XP and leveling system
│   │   ├── store.ts
│   │   ├── types.ts
│   │   ├── calculations.ts # Pure functions for XP/level logic
│   │   └── GamificationWidget.tsx
│   ├── goals/             # Daily goals and streaks
│   │   ├── store.ts
│   │   ├── types.ts
│   │   ├── calculations.ts # Streak and goal logic
│   │   └── GoalWidget.tsx
│   └── calendar/          # Calendar visualization
│       ├── types.ts
│       ├── calculations.ts # Calendar generation logic
│       └── CalendarView.tsx
├── services/
│   ├── database.ts        # SQLite database layer
│   └── schema.ts          # Drizzle ORM schemas
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   └── Dashboard.tsx      # Main dashboard
├── types/
│   └── electron.d.ts      # Electron API types
├── App.tsx                # Root component
├── main.tsx               # React entry point
└── index.css              # Global styles & Tailwind config
```

## Setup Instructions 🚀

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- **No build tools required!** Works on Windows, Mac, and Linux without Visual Studio or Xcode

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run electron:dev
   ```

   This will:
   - Start the Vite dev server
   - Launch Electron
   - Open DevTools automatically
   - Enable hot reload for React code

4. **Build for production**
   ```bash
   npm run electron:build
   ```

   This creates a distributable Electron app in the `dist` folder.

### First Run

When you first launch the app, it will:
1. Create a SQLite database in browser localStorage
2. Initialize all tables (todos, activities, goals, user_stats)
3. Seed with example data so you can see everything in action
4. Set a default daily goal of 2 hours (120 minutes)

**Note**: The database is stored in your browser's localStorage, so it persists between sessions!

## Usage Guide 📖

### Getting Started

1. **Set Your Daily Goal**
   - Click the settings icon on the "Daily Goal" widget
   - Enter your desired daily time goal in minutes
   - Click "Save"

2. **Start Tracking Time**
   - Use the Timer widget to track your work sessions
   - Optionally set a target duration
   - Click "Start" to begin
   - When done, click the "Save" button to log it as an activity

3. **Log Activities**
   - After stopping the timer, a dialog will appear
   - Fill in the activity title and select a category
   - The time is automatically filled from your timer
   - Click "Save Activity"

4. **Manage To-Dos**
   - Add tasks in the To-Do List section
   - Check them off when complete
   - Edit or delete as needed

5. **Track Your Progress**
   - Watch your XP grow in the "Your Progress" widget
   - See your level increase every 100 XP
   - Monitor your daily goal progress
   - Maintain your streak by meeting your goal each day!

6. **Review Your Calendar**
   - See your activity patterns in the calendar
   - Click on any day to see what you worked on
   - Identify your most productive days

### Understanding XP & Levels

- **1 minute of work = 1 XP**
- **100 XP = 1 level**
- Example: If you log a 45-minute activity, you gain 45 XP

### Level Titles
- Level 1: Beginner
- Levels 2-5: Novice
- Levels 6-10: Apprentice
- Levels 11-20: Adept
- Levels 21-30: Expert
- Levels 31-40: Master
- Levels 41-50: Grandmaster
- Level 51+: Legend

### Streak System

Your streak increases when you meet your daily goal on consecutive days:
- Meeting your goal today: Streak continues
- Missing your goal: Streak resets to 0
- The calendar shows which days you met your goal

## Database Schema 🗄️

### Tables

**todos**
- `id`: Primary key
- `title`: Task title
- `description`: Optional description
- `completed`: Boolean flag
- `created_at`: Timestamp

**activities**
- `id`: Primary key
- `title`: Activity title
- `category`: Category (Work, Study, etc.)
- `time_spent`: Duration in seconds
- `date`: ISO date string (YYYY-MM-DD)
- `created_at`: Timestamp

**goals**
- `id`: Primary key
- `daily_time_goal`: Daily goal in seconds
- `updated_at`: Timestamp

**user_stats**
- `id`: Primary key
- `total_xp`: Total XP accumulated
- `level`: Current level
- `updated_at`: Timestamp

## Customization 🎨

### Changing XP Per Minute

Edit `src/modules/gamification/calculations.ts`:
```typescript
export function calculateXpFromTime(timeInSeconds: number): number {
  return Math.floor(timeInSeconds / 60); // Change 60 to modify XP rate
}
```

### Changing XP Per Level

Edit `src/modules/gamification/calculations.ts`:
```typescript
const XP_PER_LEVEL = 100; // Change this value
```

### Changing Activity Categories

Edit `src/modules/activities/types.ts`:
```typescript
export const ACTIVITY_CATEGORIES = [
  'Work',
  'Study',
  // Add your custom categories here
] as const;
```

### Customizing Goal Thresholds

Edit `src/modules/calendar/calculations.ts` in the `getDayStatus` function to change when days are marked as "met", "exceeded", etc.

## Tips for Beginners 💡

1. **Understanding the Code**
   - Each module is self-contained with its own store, types, and components
   - Database operations are in `src/services/database.ts`
   - All business logic is in `calculations.ts` files (pure functions)
   - UI components are in `.tsx` files

2. **Making Changes**
   - Start with small tweaks (colors, text, XP values)
   - The app hot-reloads, so you'll see changes immediately
   - Check the browser DevTools console for errors

3. **Common Modifications**
   - To change colors: Edit Tailwind classes in components
   - To add features: Create a new module following the existing pattern
   - To modify calculations: Look in `calculations.ts` files

4. **Debugging**
   - Electron DevTools are open by default in dev mode
   - Use `console.log()` to debug
   - Database is in browser localStorage - check Application tab in DevTools

## Troubleshooting 🔧

### Database Issues
- Clear browser localStorage to reset: Open DevTools → Application → Local Storage → Clear
- Or use: `localStorage.removeItem('productivityDb')` in console
- Refresh the app to re-seed data

### Build Issues
- Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- **Windows users**: No Visual Studio required! sql.js works without native compilation

### Electron Not Starting
- Make sure port 5173 is available
- Check for error messages in the terminal
- Try: `npm run dev` first to test Vite alone

## Future Enhancement Ideas 💭

- Dark mode toggle
- Export data to CSV
- Statistics and charts
- Pomodoro timer integration
- Custom themes
- Cloud sync
- Achievement system
- Activity templates

## Contributing 🤝

This is a learning project! Feel free to:
- Add new features
- Improve the UI
- Fix bugs
- Optimize performance

## License 📄

MIT License - feel free to use this project however you like!

---

**Happy Productivity! 🚀**

Remember: Every minute counts toward your next level! ⚡
