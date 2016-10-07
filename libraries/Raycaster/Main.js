/**
 * The MAIN object
 */
O2.createObject('MAIN', {
	
	game: null,
	screen: null,
	
	/**
	 * Will start a game
	 */
	run: function() {
		var oConfig = CONFIG;
		MAIN.screen = document.getElementById(oConfig.raycaster.canvas);
		MAIN.screenResize();
		window.addEventListener('resize', MAIN.screenResize);
		var sNamespace = oConfig.game.namespace;
		var P = window[sNamespace];
		MAIN.game = new P.Game();
		MAIN.game.setConfig(oConfig);
		if (oConfig.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
			MAIN.screen.addEventListener('click', function(oEvent) {
				MAIN.lockPointer();
			});
		}
	},
	
	/**
	 * Entre en mode pointerlock
	 * @param oElement
	 * @returns {Boolean}
	 */
	lockPointer: function() {
		var G = MAIN.game;
		var rc = G.oRaycaster;
		var oElement = rc.getScreenCanvas();
		var rcc = rc.oCamera;
		var rcct = rcc.oThinker;
		if (!rcc || !rcct) {
			return false;
		}
		if (O876_Raycaster.PointerLock.locked()) {
			return false;
		}
		if (CONFIG.game.fullscreen) {
			O876_Raycaster.FullScreen.changeEvent = function(e) {
				if (O876_Raycaster.FullScreen.isFullScreen()) {
					O876_Raycaster.PointerLock.requestPointerLock(oElement);
					O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
				}
			};
			O876_Raycaster.FullScreen.enter(oElement);
		} else {
			O876_Raycaster.PointerLock.requestPointerLock(oElement);
			O876_Raycaster.PointerLock.setHook(rcct.readMouseMovement, rcct);
		}
		return true;
	},


	screenResize: function(oEvent) {
		var nPadding = 24;
		var h = innerHeight;
		var w = innerWidth;
		var r = (h - nPadding) / w;
		var oCanvas = MAIN.screen;
		var ch = oCanvas.height;
		var cw = oCanvas.width;
		var rBase = ch / cw; 
		var wf, hf;
		if (r < rBase) { // utiliser height
			h -= nPadding;
			hf = h;
			wf = h * cw / ch;
		} else { // utiliser width
			wf = w;
			hf = w * ch / cw;
		}
		oCanvas.style.width = (wf | 0).toString() + 'px';
		oCanvas.style.height = (hf | 0).toString() + 'px';
	}
});

window.addEventListener('load', function() {
	MAIN.run();
});
