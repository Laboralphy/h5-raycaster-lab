/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
var CONFIG = {
	game: {
		interval: 40,			/* timer interval (ms). you should not change this value */
		doomloop: 'raf',		/* doomloop type "raf" or "interval". "raf" is very cpu intensive, "interval" is a cool method */
		fullscreen: false, 		/* fullscreen flag */
		fpscontrol: true 		/* fps control (mouse + keyboard WASD) flag : if true, the standard FPS control thinker will be used */
		//controlthinker: '',	/* custom control thinker */
	},
	raycaster: {
		canvas: 'screen', /* id of rendering DOM canvas */
		drawMap: false, /* mini map for debug purpose */
		smoothTextures: false, /* set to TRUE for old school games */
	}
};
