/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
import '@shoelace-style/shoelace/dist/shoelace.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import './index.css';
import './npld-player';

// Set the base path to the folder you copied Shoelace's assets to
const isLocalFile = window.location.origin === 'file://';
setBasePath(`${isLocalFile ? '.' : window.location.href}/public/shoelace`);
