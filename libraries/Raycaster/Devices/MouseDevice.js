/** Entrée de la souris
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Mémorise les coordonnée de la souris et les touche enfoncées
 */
O2.createClass('O876_Raycaster.MouseDevice', {
	nButtons: 0,
	aEvents: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	nSecurityDelay: 0,
	oElement: null,
	
	__construct: function() {
		this.aEvents = [];
	},
	
	clearBuffer: function() {
		this.aEvents = [];
	},

	eventMouseUp: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		oDev.nButtons = oEvent.buttons;
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			oDev.aEvents.push([0, oEvent.clientX, oEvent.clientY, oEvent.button]);
		}
		return false;
	},

	eventMouseDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		oDev.nButtons = oEvent.buttons;
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			oDev.aEvents.push([1, oEvent.clientX, oEvent.clientY, oEvent.button]);
		}
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},
	
	eventMouseClick: function(e) {
		var oEvent = window.event ? window.event : e;
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},
	
	
	/** 
	 * Renvoie le prochain message souris précédemment empilé
	 * ou renvoie "undefined" s'il n'y a pas de message
	 * un message prend ce format :
	 * [ nUpOrDown, X, Y, Button ]
	 * nUpOrDown vaut 0 quand le bouton de la souris est relaché et vaut 1 quand le bouton est enfoncé
	 * il vaut 3 quand la molette de la souris est roulée vers le haut, et -3 vers le bas 
	 */
	inputMouse: function() {
		if (this.nSecurityDelay > 0) {
			--this.nSecurityDelay;
			this.clearBuffer();
			return null;
		} else {
			return this.aEvents.shift();
		}
	},
	
	mouseWheel: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		var nDelta = 0;
		if (oEvent.wheelDelta) {
			nDelta = oEvent.wheelDelta; 
		} else {
			nDelta = -40 * oEvent.detail;
		}
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			if (e.wheelDelta) {
				nDelta = oEvent.wheelDelta > 0 ? 3 : -3; 
				oDev.aEvents.push([nDelta, 0, 0, 3]);
			} else {
				nDelta = oEvent.detail > 0 ? -3 : 3;
				oDev.aEvents.push([nDelta, 0, 0, 3]);
			}
		}
	},


	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugEvents: function(oElement) {
		window.__mouseDevice = this;
		oElement.addEventListener('mousedown', this.eventMouseDown, false);
		oElement.addEventListener('click', this.eventMouseClick, false);
		oElement.addEventListener('mouseup', this.eventMouseUp, false);
		oElement.addEventListener('mousewheel', this.mouseWheel, false);
		oElement.addEventListener('DOMMouseScroll', this.mouseWheel, false);
		this.oElement = oElement;
	},
	
	unplugEvents: function() {
		var oElement = this.oElement;
		oElement.removeEventListener('mousedown', this.eventMouseDown, false);
		oElement.removeEventListener('click', this.eventMouseClick, false);
		oElement.removeEventListener('mouseup', this.eventMouseUp, false);
		oElement.removeEventListener('mousewheel', this.mouseWheel, false);
		oElement.removeEventListener('DOMMouseScroll', this.mouseWheel, false);
	},
	
	clearEvents: function() {
		this.aEvents = [];
	}
});

