/**
 * Configuration file for the raycaster rendering engine
 * You should not modify it, unless you know what you do
 */
O2.createObject('CONFIG', {
	game: {
		namespace: 'Stub',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: true,
		controlThinker: ''
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: true,
		smoothTextures: false,
		vr: false
	}
});
