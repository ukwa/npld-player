import { ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  const npldPlayer = document.querySelector('npld-player') as Element;

  // Handle opening links from another app/browser
  ipcRenderer.on('open-url-in-webview', (e, url) => {
    npldPlayer.setAttribute('webviewUrl', url);
  });
});
