/**
 * TypeScript definitions for Electron APIs exposed through preload script
 * This provides type safety when using window.electron
 */

export interface ElectronAPI {
  showNotification: (title: string, body: string) => Promise<boolean>;
  getUserDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
