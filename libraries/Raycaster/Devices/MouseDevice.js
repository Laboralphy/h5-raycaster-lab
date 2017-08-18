/** Entrée de la souris
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Mémorise les coordonnée de la souris et les touche enfoncées
 */
O2.createClass('O876_Raycaster.MouseDevice', {
	nButtons: 0,
	aEventBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	nSecurityDelay: 0,
	oElement: null,
	vMouse: null,
	oHandlers: null,
	
	__construct: function() {
		this.aEventBuffer = [];
		this.oHandlers = {};
		this.vMouse = {clientX: 0, clientY: 0};
	},
	
	clearBuffer: function() {
		this.aEventBuffer = [];
	},

	getElementPosition: function() {
		var e = this.oElement;
		var x = e.offsetLeft;
		var y = e.offsetTop;
		while (e.offsetParent) {
			e = e.offsetParent;
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		return {x: x, y: y};
	},

	getMousePosition: function(oEvent) {
		var cx = oEvent.clientX || oEvent.x;
		var cy = oEvent.clientY || oEvent.y;
		var p = this.getElementPosition();
		var x = cx - p.x;
		var y = cy - p.y;
		var e = this.oElement;
		var xReal = x * e.width / e.offsetWidth | 0;
		var yReal = y * e.height / e.offsetHeight | 0;
		return {x: xReal, y: yReal};
	},

	eventMouseUp: function(oEvent) {
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			var p = this.getMousePosition(oEvent);
			this.aEventBuffer.push([0, p.x, p.y, oEvent.button]);
		}
		return false;
	},

	eventMouseDown: function(oEvent) {
		this.nButtons = oEvent.buttons;
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			var p = this.getMousePosition(oEvent);
			this.aEventBuffer.push([1, p.x, p.y, oEvent.button]);
		}
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},

	eventMouseMove: function(oEvent) {
		this.vMouse.x = oEvent.clientX;
		this.vMouse.y = oEvent.clientY;
	},
	
	eventMouseClick: function(oEvent) {
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},

	/**
	 * Renvoie la position du curseur de la souris dans le context du canvas associé
	 * @return {*}
	 */
	getPixelPointer: function() {
		return this.getMousePosition(this.vMouse);
	},
	
	/** 
	 * Renvoie le prochain message souris précédemment empilé
	 * ou renvoie "undefined" s'il n'y a pas de message
	 * un message prend ce format :
	 * [ nUpOrDown, X, Y, Button ]
	 * nUpOrDown vaut 0 quand le bouton de la souris est relaché et vaut 1 quand le bouton est enfoncé
	 * il vaut 3 quand la molette de la souris est roulée vers le haut, et -3 vers le bas 
	 */
	readMouse: function() {
		if (this.nSecurityDelay > 0) {
			--this.nSecurityDelay;
			this.clearBuffer();
			return null;
		} else {
			return this.aEventBuffer.shift();
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
		if (this.bUseBuffer && this.aEventBuffer.length < this.nKeyBufferSize) {
			if (e.wheelDelta) {
				nDelta = oEvent.wheelDelta > 0 ? 3 : -3; 
				this.aEventBuffer.push([nDelta, 0, 0, 3]);
			} else {
				nDelta = oEvent.detail > 0 ? -3 : 3;
				this.aEventBuffer.push([nDelta, 0, 0, 3]);
			}
		}
	},

	/**
	 * Will add event listener and keep track of it for future remove
	 * @param sEvent DOM Event name
	 * @param pHandler event handler function
	 */
	plugHandler: function(sEvent, pHandler) {
		var p = pHandler.bind(this);
		this.oHandlers[sEvent] = p;
		this.oElement.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugHandler: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			this.oElement.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugHandlers: function(oElement) {
		this.oElement = oElement;
		this.plugHandler('mousedown', this.eventMouseDown);
		this.plugHandler('click', this.eventMouseClick);
		this.plugHandler('mouseup', this.eventMouseUp);
		this.plugHandler('mousewheel', this.mouseWheel);
		this.plugHandler('DOMMouseScroll', this.mouseWheel);
		this.plugHandler('mousemove', this.eventMouseMove);
	},
	
	unplugHandlers: function() {
		('mousedown click mouseup mousewheel DOMMouseScroll mousemove').split(' ').forEach(this.unplugHandler.bind(this));
	}
});

