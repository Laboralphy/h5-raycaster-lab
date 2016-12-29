/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
O2.createObject('CONFIG', {
	game: {
		namespace: 'MAYA',		/* game namespace */
		interval: 40,			/* timer interval (ms). you should not change this value */
		doomLoop: 'raf',		/* doomloop type "raf" or "interval". "raf" is very cpu intensive but is ok for a game, "interval" is a cool method but with some mouse glitches */
		fullScreen: false, 	/* fullscreen flag. if true, clicking on screen will switch the game to fullscreen mode */
		fpsControl: true, 	/* fps control (mouse + keyboard WASD) flag */
		controlThinker: '',		/* custom control thinker */
	},
	raycaster: {
		canvas: 'screen', /* id of rendering DOM canvas */
		canvasAutoResize: true, /* if true : will resize the canvas to fit the screen */
		drawMap: false, /* true : will display a mini map for debug purpose */
		smoothTextures: false, /* set to TRUE for old school games */
		vr: false
	}
});
