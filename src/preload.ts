const NPLD_PLAYER_INITIAL_WEB_ADDRESS =
  process.env.NPLD_PLAYER_INITIAL_WEB_ADDRESS;

window.addEventListener('DOMContentLoaded', () => {
  const npldPlayer = document.querySelector('npld-player');

  npldPlayer.setAttribute('url', NPLD_PLAYER_INITIAL_WEB_ADDRESS);
});
