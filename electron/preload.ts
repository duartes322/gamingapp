import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script - exposes safe APIs to the renderer process
 * This allows our React app to communicate with Electron's main process
 */
contextBridge.exposeInMainWorld('electron', {
  /**
   * Show a system notification
   * @param title - Notification title
   * @param body - Notification body text
   */
  showNotification: (title: string, body: string) => 
    ipcRenderer.invoke('show-notification', title, body),
  
  /**
   * Get the user data directory path
   * Used for storing the SQLite database
   */
  getUserDataPath: () => 
    ipcRenderer.invoke('get-user-data-path'),
});
