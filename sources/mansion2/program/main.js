O2.createObject('MAIN', {

	posCanvas: null,
	sizeCanvas: null,

	getCursorPosition: function(oScreen, xClient, yClient) {
		if (!MAIN.posCanvas) {
			MAIN.posCanvas = MAIN.getPosition(oScreen);
		}
		var x = MAIN.sizeCanvas.rWidth * (xClient - MAIN.posCanvas.left) | 0, 
		y = MAIN.sizeCanvas.rHeight * (yClient - MAIN.posCanvas.top) | 0;
		return {x: x, y: y};
	},

	run: function() {
		MAIN.screenResize();
		window.addEventListener('resize', MAIN.screenResize);
		window.G = new MANSION.Game();

		var oScreen = document.getElementById(CONFIG.raycaster.canvas);
		if (CONFIG.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
			oScreen.addEventListener('click', function(oEvent) {
				var oScreen = oEvent.target; 
				if (!O876_Raycaster.PointerLock.bEnabled) {
					G.trigger('click', MAIN.getCursorPosition(oScreen, oEvent.clientX, oEvent.clientY));
				} else {
					MAIN.lockPointer(oEvent.target);
				}
			});
			oScreen.addEventListener('mousemove', function(oEvent) {
				var oScreen = oEvent.target; 
				if (!O876_Raycaster.PointerLock.bEnabled) {
					G.trigger('mousemove', MAIN.getCursorPosition(oScreen, oEvent.clientX, oEvent.clientY));
				}
			});
		}
	},

	getPosition: function(oElement) {
		var pos = {
			left: 0,
			top: 0
		};
		if (oElement && oElement.offsetTop !== undefined && oElement.offsetLeft !== undefined) {
			var posParent = MAIN.getPosition(oElement.parentNode);
			pos.left = oElement.offsetLeft + posParent.left,
			pos.top = oElement.offsetTop + posParent.top;
		}
		return pos;
	},

	/**
	 * Entre en mode pointerlock
	 * @param oElement
	 * @returns {Boolean}
	 */
	lockPointer: function(oElement) {
		if (!G.oRaycaster.oCamera || !G.oRaycaster.oCamera.oThinker) {
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
			O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
		}
		return true;
	},


	screenResize: function(oEvent) {
		var nPadding = 24;
		var h = innerHeight;
		var w = innerWidth;
		var r = (h - nPadding) / w;
		var oCanvas = document.getElementById('screen');
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
		MAIN.posCanvas = null;
		MAIN.sizeCanvas = {
			width: w,
			height: h,
			rWidth: cw / wf,
			rHeight: ch / hf
		};
	}
});


window.addEventListener('load', MAIN.run);
