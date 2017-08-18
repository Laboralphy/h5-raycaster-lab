O2.createObject('CONFIG', {
	game: {
		namespace: 'HOTD',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: false,
		controlThinker: 'HOTD.PlayerCamThinker',
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
