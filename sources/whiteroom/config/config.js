var CONFIG = {
  game: {
	namespace: 'WHITEROOM',
    interval: 40,         /* timer interval (ms) */
    doomloop: 'raf', /* values : 'interval' | 'raf' */
    urlLaby: '../../dynamics/laby/laby.php?g=whiteroom&s='   /* laby generation request locator */
  },
  raycaster: {
	canvas: 'canvas',
    ghostVision: 0,
    drawMap: false,
    zoom: 2
  }
};
