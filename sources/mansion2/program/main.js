O2.createObject('MAIN', {

	posCanvas: null,
	sizeCanvas: null,

	run: function() {
		MAIN.screenResize();
		window.addEventListener('resize', MAIN.screenResize);
		window.G = new MANSION.Game();

		var oScreen = document.getElementById(CONFIG.raycaster.canvas);
		if (CONFIG.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
			oScreen.addEventListener('click', function(oEvent) {
				var oScreen = oEvent.target; 
				if (!O876_Raycaster.PointerLock.bEnabled) {
					if (!MAIN.posCanvas) {
						MAIN.posCanvas = MAIN.getPosition(oScreen);
					}
						var x = MAIN.sizeCanvas.rWidth * (oEvent.clientX - MAIN.posCanvas.left) | 0, 
						y = MAIN.sizeCanvas.rHeight * (oEvent.clientY - MAIN.posCanvas.top) | 0;
					G.trigger('click', {x: x, y: y});
				} else {
					MAIN.lockPointer(oEvent.target);
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
			wf = h * cw / ch | 0;
		} else { // utiliser width
			wf = w;
			hf = w * ch / cw | 0;
		}
		oCanvas.style.width = wf.toString() + 'px';
		oCanvas.style.height = hf.toString() + 'px';
		MAIN.posCanvas = null;
		MAIN.sizeCanvas = {
			width: w,
			height: h,
			rWidth: cw / wf,
			rHeight: ch / hf
		}
	}
});


window.addEventListener('load', MAIN.run);
