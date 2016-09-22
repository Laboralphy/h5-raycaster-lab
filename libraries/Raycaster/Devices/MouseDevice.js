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
	
	oHandlers: null,
	
	__construct: function() {
		this.aEvents = [];
		this.oHandlers = {};
	},
	
	clearBuffer: function() {
		this.aEvents = [];
	},

	eventMouseUp: function(e) {
		var oEvent = window.event ? window.event : e;
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEvents.length < this.nKeyBufferSize) {
			this.aEvents.push([0, oEvent.clientX, oEvent.clientY, oEvent.button]);
		}
		return false;
	},

	eventMouseDown: function(e) {
		var oEvent = window.event ? window.event : e;
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEvents.length < this.nKeyBufferSize) {
			this.aEvents.push([1, oEvent.clientX, oEvent.clientY, oEvent.button]);
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
		var nDelta = 0;
		if (oEvent.wheelDelta) {
			nDelta = oEvent.wheelDelta; 
		} else {
			nDelta = -40 * oEvent.detail;
		}
		if (this.bUseBuffer && this.aEvents.length < this.nKeyBufferSize) {
			if (e.wheelDelta) {
				nDelta = oEvent.wheelDelta > 0 ? 3 : -3; 
				this.aEvents.push([nDelta, 0, 0, 3]);
			} else {
				nDelta = oEvent.detail > 0 ? -3 : 3;
				this.aEvents.push([nDelta, 0, 0, 3]);
			}
		}
	},

	/**
	 * Will add event listener and keep track of it for future remove
	 * @param sEvent DOM Event name
	 * @param pHandler event handler function
	 */
	plugEvent: function(sEvent, pHandler) {
		var p = pHandler.bind(this);
		this.oHandlers[sEvent] = p;
		this.oElement.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugEvent: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			this.oElement.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugEvents: function(oElement) {
		this.oElement = oElement;
		this.plugEvent('mousedown', this.eventMouseDown);
		this.plugEvent('click', this.eventMouseClick);
		this.plugEvent('mouseup', this.eventMouseUp);
		this.plugEvent('mousewheel', this.mouseWheel);
		this.plugEvent('DOMMouseScroll', this.mouseWheel);
	},
	
	unplugEvents: function() {
		('mousedown click mouseup mousewheel DOMMouseScroll').split(' ').forEach(this.unplugEvent.bind(this));
	},
	
	clearEvents: function() {
		this.aEvents = [];
	}
});

