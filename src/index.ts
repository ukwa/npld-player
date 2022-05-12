import { app, session, BrowserWindow } from 'electron';
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const isDev = !app.isPackaged;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Define content security policy
    let csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
    ].join(';');

    if (isDev) {
      csp = [
        "default-src 'self' 'unsafe-inline' data:",
        // Allow unsafe-eval for Webpack
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
        "style-src 'self' 'unsafe-inline'",
      ].join(';');
    }

    // Block downloads
    // TODO show user feedback?
    session.defaultSession.on('will-download', (event, item, webContents) => {
      event.preventDefault();
    });

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': csp,
      },
    });
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false, // show once the renderer process has rendered
    height: 600,
    width: 800,
    webPreferences: {
      webviewTag: true, // Enable <webview>
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Main window events:
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({
      mode: 'detach',
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
