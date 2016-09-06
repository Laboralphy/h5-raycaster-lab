/**
 * This is the "main" function. The first function being run.
 * Will instanciate the main Game object.
 */
function main() {
	screenResize();
	window.addEventListener('resize', screenResize);
	var sNamespace = CONFIG.game.namespace;
	window.G = new window[sNamespace].Game();

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (CONFIG.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	} else {
		throw new Error('could not initialize PointerLock system');
	}
}

/**
 * Enters pointerlock mode. The mouse cursor is frozen while inside the given DOM Element 
 * The function will return true if the operation is successful.
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer(oElement) {
	var fs = O876_Raycaster.FullScreen;
	var pl = O876_Raycaster.PointerLock;
	if (!G.oRaycaster.oCamera || !G.oRaycaster.oCamera.oThinker) {
		return false;
	}
	if (pl.locked()) {
		return false;
	}
	if (CONFIG.game.fullscreen) {
		fs.changeEvent = function() {
			if (fs.isFullScreen()) {
				pl.requestPointerLock(oElement);
				pl.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
			}
		};
		fs.enter(oElement);
	} else {
		pl.requestPointerLock(oElement);
		pl.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
	}
	return true;
}

/**
 * Re-computes canvas metrics on resize events 
 */
function screenResize(oEvent) {
	var nPadding = 24;
	var h = innerHeight;
	var w = innerWidth;
	var r = (h - nPadding) / w;
	var oCanvas = document.getElementById('screen');
	var rBase = oCanvas.height / oCanvas.width; 
	if (r < rBase) { // utiliser height
		h -= nPadding;
		oCanvas.style.width = '';
		oCanvas.style.height = h.toString() + 'px';
	} else { // utiliser width
		oCanvas.style.width = w.toString() + 'px';
		oCanvas.style.height = '';
	}
}

window.addEventListener('load', main);
