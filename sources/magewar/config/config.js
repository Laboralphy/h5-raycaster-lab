O2.createObject('CONFIG', {
	game: {
		namespace: 'MW',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: false,
		controlThinker: 'MW.PlayerThinker'
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: false,
		smoothTextures: false,
		vr: false
	}
});
