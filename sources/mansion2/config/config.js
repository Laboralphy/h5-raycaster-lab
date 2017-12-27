O2.createObject('CONFIG', {
	game: {
		namespace: 'MANSION',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: true,
		controlThinker: 'MANSION.PlayerThinker',
		mute: false
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: false,
		smoothTextures: false,
		vr: false
	}
});
