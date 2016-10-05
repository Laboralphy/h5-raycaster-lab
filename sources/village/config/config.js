O2.createObject('MAIN.CONFIG', {
  game: {
    interval: 40,         /* timer interval (ms)                */
    doomloop: 'interval', /* doomloop type "raf" or "interval"  */
    fullscreen: false,
    fpscontrol: true
  },
  raycaster: {
    canvas: 'screen',
    ghostVision: 0,
    drawMap: false,
    smoothTextures: false,
    zoom: 1
  }
});
