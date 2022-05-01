/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/shoelace.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import './index.css';

// Set the base path to the folder you copied Shoelace's assets to
setBasePath('public/shoelace');

const backBtn = document.querySelector('.back-button') as HTMLButtonElement;
const forwardBtn = document.querySelector(
  '.forward-button'
) as HTMLButtonElement;

backBtn.addEventListener('click', (e: MouseEvent) => {
  console.log('clicked back', e);
});
forwardBtn.addEventListener('click', (e: MouseEvent) => {
  console.log('clicked forward', e);
});
