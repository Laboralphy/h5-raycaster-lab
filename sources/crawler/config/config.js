var CONFIG = {
  game: {
    interval: 40,         /* timer interval (ms)                */
    doomloop: 'interval', /* doomloop type "raf" or "interval"  */
    cpumonitor: false,     /* use CPU Monitor system             */
    mouse: O876_Raycaster.PointerLock.init()
  },
  raycaster: {
    canvas: 'screen',
    ghostVision: 0,
    smoothTextures: false,
    drawMap: false,
    zoom: 2,
    lowmem: false
  }
};
