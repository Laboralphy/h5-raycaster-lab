/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
O2.createObject('CONFIG', {
	game: {
    		urlLaby: '../../dynamics/laby/laby.php?g=whiteroom&s=',   /* laby generation request locator */
		namespace: 'WHITEROOM',		/* game namespace */
		interval: 40,			/* timer interval (ms). you should not change this value */
		doomLoop: 'raf',		/* doomloop type "raf" or "interval". "raf" is very cpu intensive but is ok for a game, "interval" is a cool method but with some mouse glitches */
		fullScreen: false, 	/* fullscreen flag. if true, clicking on screen will switch the game to fullscreen mode */
		fpsControl: false, 	/* fps control (mouse + keyboard WASD) flag */
		controlThinker: '',		/* custom control thinker */
	},
	raycaster: {
		canvas: 'canvas', /* id of rendering DOM canvas */
		canvasAutoResize: false, /* if true : will resize the canvas to fit the screen */
		drawMap: false, /* true : will display a mini map for debug purpose */
		smoothTextures: true, /* set to TRUE for old school games */
		vr: false
	}
});
