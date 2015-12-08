/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
var CONFIG = {
	game: {
		interval: 40,			/* timer interval (ms). you should not change this value */
		doomloop: 'interval',	/* doomloop type "raf" or "interval". "raf" is very cpu intensive, "interval" is a cool method */
		cpumonitor: false,		/* use CPU Monitor system, don't use it, leave this value at false */
		fullscreen: false, /* fullscreen flag */
		controlthinker: 'MANSION.PlayerThinker',
		fpscontrol: true /* fps control (mouse + keyboard WASD) flag */
	},
	raycaster: {
		canvas: 'screen', /* id of rendering DOM canvas */
		drawMap: false, /* mini map for debug purpose */
		smoothTextures: false, /* set to TRUE for old school games */
		zoom: 1 /* useless. Leave it at 1. possible values are 1, 2, 4. the greater, the uglier, the faster */
	}
};
