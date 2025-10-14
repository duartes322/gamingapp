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
src/
├── modules/
│   └── todos/              # Todo feature module
│       ├── types.ts        # TypeScript interfaces
│       ├── store.ts        # Zustand store
│       ├── TodoList.tsx    # Main list component
│       ├── TodoItem.tsx    # Individual item
│       └── AddTodoForm.tsx # Add form component
├── services/
│   ├── schema.ts           # Drizzle schema definitions
│   └── database.ts         # Database operations
└── App.tsx                 # Root component
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

This app follows a modular architecture where each feature is self-contained:
- Each module has its own `store.ts`, `types.ts`, and React components
- Database operations are centralized in `src/services/database.ts`
- All future features will follow this same pattern for consistency

## 📄 License

MIT
