/* globals Stub, CONFIG, O876_Raycaster, G */
function main() {
	screenResize();
	window.addEventListener('resize', screenResize);
	window.G = new STUB.Game();

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (CONFIG.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	}
}

/**
 * Entre en mode pointerlock
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer(oElement) {
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
}


function screenResize(oEvent) {
	var nPadding = 24;
	var h = window.innerHeight;
	var w = window.innerWidth;
	var r = (h - nPadding) / w;
	var oCanvas = document.getElementById('screen');
	var rBase = oCanvas.height / oCanvas.width; 
	if (r < rBase) { // utiliser height
		h -= nPadding;
		oCanvas.style.height = h.toString() + 'px';
		oCanvas.style.width = (h * oCanvas.width / oCanvas.height | 0).toString() + 'px';
	} else { // utiliser width
		oCanvas.style.width = w.toString() + 'px';
		oCanvas.style.height = (w * oCanvas.height / oCanvas.width | 0).toString() + 'px';
	}
}

window.addEventListener('load', main);
