
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

/**
 * Main Electron process for Octamind AI.
 * Spawns the native window and handles IPC communication with the Next.js frontend.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Octamind AI',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check for development environment
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // In dev mode, we load the Next.js dev server on port 9002
    win.loadURL('http://localhost:9002');
    win.webContents.openDevTools();
  } else {
    // [PRODUCTION PLACEHOLDER]: In a full build, this would load from a custom server
    // instance running on a background port, or point to a local distribution.
    win.loadURL('http://localhost:9002'); 
  }

  win.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Example IPC handler to test the bridge
ipcMain.handle('ping', () => 'Octamind AI Bridge: Online');
