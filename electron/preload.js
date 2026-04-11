
const { contextBridge, ipcRenderer } = require('electron');

/**
 * Electron Preload Script.
 * Securely exposes specific IPC methods to the renderer process (Next.js) 
 * using contextBridge to prevent full Node.js access in the frontend.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Pings the main process to verify the connection.
   */
  ping: () => ipcRenderer.invoke('ping'),
});
