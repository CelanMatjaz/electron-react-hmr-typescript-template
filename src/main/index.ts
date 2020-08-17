import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow;

const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    backgroundColor: '#3a3a3a',
  });

  if (process.env.USE_DEV_SERVER) {
    mainWindow.loadURL('http://localhost:8080/build/debug/index.html');
  } else {
    mainWindow.loadFile('./index.html');
  }

  if (!process.env.NODE_ENV) {
    mainWindow.webContents.openDevTools({
      mode: 'detach',
    });
  }

  mainWindow.on('close', () => {
    mainWindow = null;
    app.quit();
  });
};

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
