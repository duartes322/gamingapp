import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { databaseOperations } from './database';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

// Set up IPC handlers for database operations
function setupIpcHandlers() {
  ipcMain.handle('db:getAllTodos', () => {
    return databaseOperations.getAllTodos();
  });

  ipcMain.handle('db:addTodo', (_event, text: string) => {
    return databaseOperations.addTodo(text);
  });

  ipcMain.handle('db:toggleTodo', (_event, id: number) => {
    return databaseOperations.toggleTodo(id);
  });

  ipcMain.handle('db:deleteTodo', (_event, id: number) => {
    databaseOperations.deleteTodo(id);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app
  // In development, load from Vite dev server
  // In production, load from built files
  const isDev = !app.isPackaged;
  
  if (isDev) {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
