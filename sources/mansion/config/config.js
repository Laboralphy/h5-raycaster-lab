O2.createObject('CONFIG', {
  game: {
	namespace: 'MANSION',
    interval: 40,         /* timer interval (ms)                */
    doomloop: 'interval', /* doomloop type "raf" or "interval"  */
    fullscreen: true,
    fpscontrol: true
  },
  raycaster: {
    canvas: 'screen',
    ghostVision: 0,
    drawMap: false,
    smoothTextures: false,
    zoom: 1,
    vr: false
  }
});
