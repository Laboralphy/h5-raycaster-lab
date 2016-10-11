O2.createObject('CONFIG', {
	game: {
		namespace: 'MANSION',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: true,
		controlThinker: 'MANSION.PlayerThinker'
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: false,
		smoothTextures: false,
		vr: false
	}
});
