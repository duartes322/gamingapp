# Gamified Productivity App - To-Do List MVP

A desktop productivity application built with Electron, React, TypeScript, and SQLite.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev
```

## ✨ Features (MVP)

- ✅ Add new to-do items with text input
- ✅ Mark to-dos as complete/incomplete with checkboxes
- ✅ Delete to-do items
- ✅ Display list of all to-dos
- ✅ Persist data to SQLite database (survives app restart)
- ✅ Clean, modern UI with Tailwind CSS

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Database**: SQLite with better-sqlite3
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Desktop**: Electron 28
- **Build Tool**: Vite 5

## 📁 Project Structure

```
electron/                       # Main process (Node.js)
├── main.ts                    # Electron app + IPC handlers
├── database.ts                # SQLite database operations
└── preload.ts                 # IPC bridge (secure)

src/                           # Renderer process (React)
├── modules/
│   └── todos/                 # Todo feature module
│       ├── types.ts           # TypeScript interfaces
│       ├── store.ts           # Zustand store
│       ├── TodoList.tsx       # Main list component
│       ├── TodoItem.tsx       # Individual item
│       └── AddTodoForm.tsx    # Add form component
├── services/
│   └── database-api.ts        # IPC wrapper for renderer
├── global.d.ts                # Global TypeScript types
└── App.tsx                    # Root component
```

## 📋 Future Features (Planned)

- ⏱️ Time tracker with global timer
- 🍅 Pomodoro function
- 🎯 Daily goals and streaks
- 📝 Activity logging
- 📅 Calendar view
- 🎮 XP/levels gamification
- 📊 Reports and analytics

## 🛠️ Development

```bash
# Development mode with hot-reload
npm run electron:dev

# Build for production
npm run build

# TypeScript type checking
npx tsc --noEmit

# Database operations
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## 📖 Documentation

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting.

## 🏛️ Architecture

This app uses Electron's multi-process architecture for security and performance:

**Main Process (Node.js)**
- Handles all database operations with SQLite + Drizzle ORM
- Manages IPC (Inter-Process Communication) handlers
- No UI rendering, just business logic

**Renderer Process (Chromium)**
- React app with Zustand state management
- Communicates with main process via IPC
- Sandboxed for security (no direct Node.js access)

**Preload Script**
- Secure bridge between main and renderer
- Exposes only specific IPC methods via `contextBridge`

**Modular Feature Organization**
- Each feature is self-contained in `src/modules/[feature]/`
- Each module has its own `store.ts`, `types.ts`, and React components
- All future features follow this pattern for consistency

## 📄 License

MIT
