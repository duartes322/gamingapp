# Productivity App - To-Do List MVP Setup

A gamified productivity app built with Electron, React, TypeScript, and SQLite.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode

Start the Electron app in development mode:

```bash
npm run electron:dev
```

This will:
- Start Vite dev server on http://localhost:5173
- Automatically launch Electron window with hot-reload enabled
- Open DevTools automatically

**Note:** The vite-plugin-electron handles starting both the Vite dev server and Electron automatically. Just run the one command and wait a few seconds for the app to launch.

### Production Build

Build the app for production:

```bash
npm run build
```

## Project Structure

```
/workspace
├── electron/                    # Electron main process
│   ├── main.ts                 # Main process + IPC handlers
│   ├── database.ts             # Database operations (main process only)
│   └── preload.ts              # Context bridge for IPC
├── src/
│   ├── modules/
│   │   └── todos/              # Todo module
│   │       ├── types.ts        # TypeScript types
│   │       ├── store.ts        # Zustand store
│   │       ├── TodoList.tsx    # Main todo list component
│   │       ├── TodoItem.tsx    # Individual todo item
│   │       └── AddTodoForm.tsx # Add todo form
│   ├── services/
│   │   └── database-api.ts     # IPC wrapper for renderer
│   ├── global.d.ts             # TypeScript global types
│   ├── App.tsx                 # Root React component
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind CSS imports
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── drizzle.config.ts
```

## Features (MVP)

✅ Add new to-do items
✅ Mark to-dos as complete/incomplete
✅ Delete to-do items
✅ Display list of all to-dos
✅ Persist data to SQLite database
✅ Clean, modern UI with Tailwind CSS

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Desktop Framework**: Electron
- **Build Tool**: Vite

## Database

The app uses SQLite for data persistence. The database file (`database.db`) is created automatically in the project root on first run.

### Schema

**todos** table:
- `id` (INTEGER PRIMARY KEY) - Auto-incrementing ID
- `text` (TEXT NOT NULL) - Todo text content
- `completed` (INTEGER/BOOLEAN) - Completion status
- `created_at` (INTEGER/TIMESTAMP) - Creation timestamp

## Future Features (Not Implemented Yet)

- Time tracker with global timer
- Pomodoro function
- Daily goals and streaks
- Activity logging
- Calendar view
- XP/levels gamification
- Reports and analytics

## Development Notes

- **Process Separation**: Database operations run in the main process, React UI in renderer process
- **IPC Communication**: All database calls use Electron IPC (Inter-Process Communication)
- **Type Safety**: TypeScript types are shared between main and renderer via `global.d.ts`
- **Modular Architecture**: Each feature lives in `src/modules/[feature]/`
- Each module contains its own store, types, and components
- All future features should follow this same pattern

### Adding New Database Operations

1. Add the operation to `electron/database.ts`
2. Add IPC handler in `electron/main.ts`
3. Expose method in `electron/preload.ts`
4. Add TypeScript type to `src/global.d.ts`
5. Use via IPC in renderer components

## Troubleshooting

If you encounter issues:

1. **White screen / ERR_FILE_NOT_FOUND**: 
   - Make sure you're running `npm run electron:dev` (not just `electron .`)
   - Wait a few seconds for the Vite dev server to fully start before Electron launches
   - Check that port 5173 is not in use by another application

2. **Database errors**: Delete `database.db` and restart the app

3. **Module not found**: Run `npm install` again

4. **Vite errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

5. **Electron won't start**: 
   - Make sure port 5173 is not in use
   - Try stopping the process and running again
   - On Windows, close any existing Electron processes in Task Manager

## License

MIT
