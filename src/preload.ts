import dotenv from 'dotenv';

// Read from .env file
dotenv.config();

const { NPLD_PLAYER_INITIAL_WEB_ADDRESS } = process.env;

window.addEventListener('DOMContentLoaded', () => {
  const npldPlayer = document.querySelector('npld-player');

  npldPlayer.setAttribute('url', NPLD_PLAYER_INITIAL_WEB_ADDRESS);
});
