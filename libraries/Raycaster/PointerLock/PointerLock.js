/**
 * Api de gestion du fullscreen et de la capture de souris
 */

O2.createObject('O876_Raycaster.PointerLock', {
	
	oElement: null,
	oHookInstance: null,
	oHookFunction: null,
	bInitialized: null,
	bLocked: false,
	bEnabled: true,
	
	hasPointerLockFeature: function() {
		return 'pointerLockElement' in document || 'mozPointerLockElement' in document;
	},
	
	init: function() {
		if (!O876_Raycaster.PointerLock.hasPointerLockFeature()) {
			return false;
		}
		if (O876_Raycaster.PointerLock.bInitialized) {
			return true;
		}
		document.addEventListener('pointerlockchange', O876_Raycaster.PointerLock.eventChange, false);
		document.addEventListener('mozpointerlockchange', O876_Raycaster.PointerLock.eventChange, false);
		document.addEventListener('pointerlockerror', O876_Raycaster.PointerLock.eventError, false);
		document.addEventListener('mozpointerlockerror', O876_Raycaster.PointerLock.eventError, false);
		O876_Raycaster.PointerLock.bInitialized = true;
		return true;
	},
	
	/**
	 * Renvoie TRUE si le pointer à été desactivé
	 */
	locked: function() {
		return O876_Raycaster.PointerLock.bLocked;
	},
	
	/**
	 * La fonction Hook doit être écrite de la manière suivante :
	 * myEventFunction: function(xMode, yMove) { ...
	 */
	setHook: function(oFunction, oInstance) {
		O876_Raycaster.PointerLock.oHookInstance = oInstance || window;
		O876_Raycaster.PointerLock.oHookFunction = oFunction;
	},

	requestPointerLock: function(oElement) {
		if (!O876_Raycaster.PointerLock.bEnabled) {
			return;
		}
		if (O876_Raycaster.PointerLock.locked()) {
			return;
		}
		O876_Raycaster.PointerLock.oElement = oElement;
		oElement.requestPointerLock = oElement.requestPointerLock || oElement.mozRequestPointerLockWithKeys || oElement.mozRequestPointerLock;
		oElement.requestPointerLock();
	},
	
	exitPointerLock: function() {
		if (!O876_Raycaster.PointerLock.locked()) {
			return;
		}
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
		document.exitPointerLock();
	},

	eventChange: function(e) {
		var oPointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
		if (oPointerLockElement) {
			document.addEventListener('mousemove', O876_Raycaster.PointerLock.eventMouseMove, false);
			O876_Raycaster.PointerLock.bLocked = true;
		} else {
			document.removeEventListener('mousemove', O876_Raycaster.PointerLock.eventMouseMove, false);
			O876_Raycaster.PointerLock.oElement = null;
			O876_Raycaster.PointerLock.bLocked = false;
		}
	},
	
	eventError: function(e) {
		console.error('PointerLock error', e);
	},
	
	eventMouseMove: function(e) {
		var xMove = e.movementX || e.mozMovementX || 0;
		var yMove = e.movementY || e.mozMovementY || 0;
		var p = O876_Raycaster.PointerLock;
		if (p.oHookFunction) {
			p.oHookFunction.apply(p.oHookInstance, [xMove, yMove]);
		}
	}
});
