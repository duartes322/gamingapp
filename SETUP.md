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
- Launch Electron window with hot-reload enabled
- Open DevTools automatically

### Production Build

Build the app for production:

```bash
npm run build
```

## Project Structure

```
/workspace
├── electron/                 # Electron main process
│   ├── main.ts              # Main process entry point
│   └── preload.ts           # Preload script
├── src/
│   ├── modules/
│   │   └── todos/           # Todo module
│   │       ├── types.ts     # TypeScript types
│   │       ├── store.ts     # Zustand store
│   │       ├── TodoList.tsx # Main todo list component
│   │       ├── TodoItem.tsx # Individual todo item
│   │       └── AddTodoForm.tsx # Add todo form
│   ├── services/
│   │   ├── schema.ts        # Drizzle ORM schema
│   │   └── database.ts      # Database operations
│   ├── App.tsx              # Root React component
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind CSS imports
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

- The app uses the modular architecture pattern - each feature lives in `src/modules/[feature]/`
- Each module contains its own store, types, and components
- Database operations are abstracted in `src/services/database.ts`
- All future features should follow this same pattern

## Troubleshooting

If you encounter issues:

1. **Database errors**: Delete `database.db` and restart the app
2. **Module not found**: Run `npm install` again
3. **Vite errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. **Electron won't start**: Make sure port 5173 is not in use

## License

MIT
