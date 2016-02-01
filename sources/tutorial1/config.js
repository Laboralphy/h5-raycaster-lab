/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
var CONFIG = {
	game: {
		interval: 40,			/* timer interval (ms). you should not change this value */
		doomloop: 'raf'			/* doomloop type "raf" (requestAnimationFrame) or "interval"?
									on modern browser, use "raf" for smoother render. */
	},
	raycaster: {
		canvas: 'screen',		/* id of rendering DOM canvas */
		drawMap: false,			/* mini map for debug purpose */
		smoothTextures: false	/* set to TRUE for old school games */
	}
};
