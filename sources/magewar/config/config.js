var CONFIG = {
  game: {
    interval: 40,         /* timer interval (ms)                */
    doomloop: 'raf', /* doomloop type "raf" or "interval"  */
    cpumonitor: false,     /* use CPU Monitor system            */
    fullscreen: false,
    sound: true,	/* true = sound / false = no sound */
    controlthinker: 'MW.PlayerThinker'
  },
  raycaster: {
    canvas: 'screen',
    ghostVision: 0,
    drawMap: true,
    smoothTextures: false,
    zoom: 1
  }
};
