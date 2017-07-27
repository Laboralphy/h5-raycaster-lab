O2.createObject('CONFIG', {
	game: {
		namespace: 'HOTD',
		interval: 40,
		doomLoop: 'raf',
		fullScreen: false,
		fpsControl: true,
		controlThinker: 'HOTD.PlayerCamThinker',
		mute: true
	},
	raycaster: {
		canvas: 'screen',
		canvasAutoResize: true,
		drawMap: false,
		smoothTextures: false,
		vr: false
	}
});
