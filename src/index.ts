import path from 'path';
import { app, session, shell, BrowserWindow } from 'electron';
import type { WebContents } from 'electron';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Runtime environment variables (side-stepping process.env which is fixed at compile time):
import { env as RUNTIME_ENV } from 'process';

// Allow the command line to override settings:
const NPLD_PLAYER_PREFIX = app.commandLine.getSwitchValue("prefix") || RUNTIME_ENV.NPLD_PLAYER_PREFIX || process.env.NPLD_PLAYER_PREFIX;
const NPLD_PLAYER_HOMEPAGE = app.commandLine.getSwitchValue("homepage") || RUNTIME_ENV.NPLD_PLAYER_INITIAL_WEB_ADDRESS || process.env.NPLD_PLAYER_INITIAL_WEB_ADDRESS || NPLD_PLAYER_PREFIX;

// Set other parameters/constants:
const isDev = !app.isPackaged;
const customProtocol = 'npld-viewer';
const customScheme = customProtocol + "://";
let mainWindow: BrowserWindow = null;
let webview: WebContents = null;
let startUrl: string = NPLD_PLAYER_HOMEPAGE;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// Open links in browser with app
// https://www.electronjs.org/docs/v14-x-y/tutorial/launch-app-from-url-in-another-app

if (isDev && process.platform === 'win32') {
  // correctly handle in dev mode in windows
  // per: https://shipshape.io/blog/launch-electron-app-from-browser-custom-protocol/
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(customProtocol, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(customProtocol);
}

const createWindow = (): void => {

  // content session used by the <webview>
  const contentSession = session.fromPartition("content");

  contentSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // Add auth token to every request
    details.requestHeaders[process.env.NPLD_PLAYER_AUTH_TOKEN_NAME] =
      process.env.NPLD_PLAYER_AUTH_TOKEN_VALUE;

    callback({
      requestHeaders: details.requestHeaders,
    });
  });

  // TODO: this is for extra security of the main app, right?
  // should we just set it as <meta> tag in the main index.html instead?
  //
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   // Define content security policy
  //   let csp = [
  //     "default-src 'self'",
  //     "script-src 'self'",
  //     "style-src 'self' 'unsafe-inline'",
  //   ].join(';');

  //   if (isDev) {
  //     csp = [
  //       "default-src 'self' 'unsafe-inline' data:",
  //       // Allow unsafe-eval for Webpack
  //       "script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
  //       "style-src 'self' 'unsafe-inline'",
  //     ].join(';');
  //   }

  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       //'Content-Security-Policy': csp,
  //     },
  //   });
  // });

  // Block downloads
  // TODO show user feedback?
  contentSession.on('will-download', (event, item, webContents) => {
    event.preventDefault();
    console.log(
      `Download Blocked for ${item.getURL()} - (${item.getMimeType()})`
    );
  });

  const allowDevTools = () => {
    return isDev || process.env.NPLD_PLAYER_ALLOW_DEVTOOLS === "true" || process.env.NPLD_PLAYER_ALLOW_DEVTOOLS === "1";
  };

  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false, // show once the renderer process has rendered
    height: 600,
    width: 800,
    webPreferences: {
      webviewTag: true, // Enable <webview>
      devTools: allowDevTools(),
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

  mainWindow.webContents.once('will-attach-webview', (event, webPreferences, params) => {
    if (startUrl) {
      params.src = startUrl;
      startUrl = null;
    }
  });

  mainWindow.webContents.once('did-attach-webview', (event, webContents) => {
    webview = webContents;

    // ANJ: Why was this here?
    //if (startUrl) {
    //  webview.loadURL(startUrl);
    //  startUrl = null;
    //}

    if (allowDevTools()) {
      webContents.openDevTools();
    }

    const isInAppUrl = (url: string) =>
      url.startsWith(NPLD_PLAYER_PREFIX);

    webview.setWindowOpenHandler(({ url }) => {
      if (isInAppUrl(url)) {
        // Load in current webview window
        webview.loadURL(url);
      } else {
        // Open in default browser
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    webview.on('will-navigate', (event, url) => {
      // Open links without prefix in default browser
      if (!isInAppUrl(url)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });
  });

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({
      mode: 'detach',
    });
  }
};

// parse open url and set directly or save for when webview is available
const setOpenUrl = (arg: string) => {
  // Set URL to load from player prefix + custom protocol url
  const url = NPLD_PLAYER_PREFIX + arg.replace(customScheme, '');
  console.log("setOpenUrl: " + url);

  if (webview) {
    webview.loadURL(url);
  } else {
    // webview not yet loaded, save url and open on attach
    startUrl = url;
  }
};

const focusWindow = () => {
  if (!mainWindow) {
    if (!app.isReady()) {
      return;
    }
    createWindow();
  }

  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
};

// Force single application instance in Windows
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow();

    // Handle being passed a URL on startup...
    console.log("Startup with process.argv "+ process.argv);
   
    const urlArg = process.argv.find((arg) => arg.startsWith(customScheme));
    if (process.platform !== 'darwin' && urlArg) setOpenUrl(urlArg);

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  
    app.on('second-instance', (e, argv) => {
      // Handle opening link in running app
      console.log("Got second-instance event. " + argv);

      // per: https://shipshape.io/blog/launch-electron-app-from-browser-custom-protocol/
      if (process.platform !== 'darwin') {
        // Find the arg that is our custom protocol url and store it
        setOpenUrl(argv.find((arg) => arg.startsWith(customScheme)));
      }

      focusWindow();
    });

    app.on('open-url', function (event, arg) {
      event.preventDefault();
      console.log("Got open-url event. " + arg);
      setOpenUrl(arg);

      focusWindow();
    });

    // Quit when all windows are closed
    app.on('window-all-closed', () => {
      // TODO: decide if also want to keep app open on macOS?
      // seems like better to close, unless supporting multiple windows?

      //if (process.platform !== 'darwin') {
        app.quit();
      //} else {
      //  mainWindow = null;
      //  webview = null;
      //}
    });

  });

}
