function main() {
	screenResize();
	window.addEventListener('resize', screenResize);
	window.G = new Stub.Game();

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	} else {
		document.getElementById('info').innerHTML = 'No PointerLock AP available on this browser';
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
		O876_Raycaster.FullScreen.changeEvent = function() {
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
