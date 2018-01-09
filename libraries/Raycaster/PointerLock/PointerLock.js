/**
 * Api de gestion du fullscreen et de la capture de souris
 */

O2.createClass('O876_Raycaster.PointerLock', {
    oElement: null,
    bInitialized: null,
    bLocked: false,
    bEnabled: true,

	__construct: function() {
    	// this event handler maybe set or removed, thus let's bind it
        this.eventMouseMove = this.eventMouseMove.bind(this);
	},

    hasPointerLockFeature: function() {
        return 'pointerLockElement' in document || 'mozPointerLockElement' in document;
    },

    enable: function(oElement) {
        if (!this.bEnabled) {
            this.bEnabled = true;
            if (oElement) {
                this.requestPointerLock(oElement);
            }
        }
    },

    disable: function() {
        if (this.bEnabled) {
            this.bEnabled = false;
            this.exitPointerLock();
        }
    },

    init: function() {
        if (!this.hasPointerLockFeature()) {
            return false;
        }
        if (this.bInitialized) {
            return true;
        }
        document.addEventListener('pointerlockchange', this.eventChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.eventChange.bind(this), false);
        document.addEventListener('pointerlockerror', this.eventError.bind(this), false);
        document.addEventListener('mozpointerlockerror', this.eventError.bind(this), false);
        this.bInitialized = true;
        return true;
    },

    /**
     * Renvoie TRUE si le pointer à été desactivé
     */
    locked: function() {
        return this.bLocked;
    },


    requestPointerLock: function(oElement) {
        var pl = this;
        if (!pl.bEnabled) {
            return;
        }
        if (pl.locked()) {
            return;
        }
        pl.oElement = oElement;
        oElement.requestPointerLock = oElement.requestPointerLock || oElement.mozRequestPointerLockWithKeys || oElement.mozRequestPointerLock;
        oElement.requestPointerLock();
    },

    exitPointerLock: function() {
        if (!this.locked()) {
            return;
        }
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        document.exitPointerLock();
    },

    eventChange: function(e) {
        var oPointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
        if (oPointerLockElement) {
            document.addEventListener('mousemove', this.eventMouseMove, false);
            this.bLocked = true;
            this.trigger('enter');
        } else {
            document.removeEventListener('mousemove', this.eventMouseMove, false);
            this.oElement = null;
            this.bLocked = false;
            this.trigger('exit');
        }
    },

    eventError: function(e) {
        console.error('PointerLock error', e);
    },

    eventMouseMove: function(e) {
        var xMove = e.movementX || e.mozMovementX || 0;
        var yMove = e.movementY || e.mozMovementY || 0;
        this.trigger('mousemove', {
        	x: xMove,
			y: yMove
		});
    }
});

O2.mixin(O876_Raycaster.PointerLock, O876.Mixin.Events);