/** Entrée sortie clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Memorise les touches clavier enfoncées
 */
O2.createClass('O876_Raycaster.KeyboardDevice', {
	aKeys: null,	// Index inversée Code->Action
	aKeyBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	aAliases: null,
	oHandlers: null,

	__construct: function() {
		this.aKeys = [];
		this.oHandlers = {};
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		for (var i = 0; i < 256; i++) {
			this.aKeys.push(0);	 
		}
		this.aKeyBuffer = [];
	},

	getKey: function(n) {
		return this.aKeys[n];
	},
	
	setAliases: function(a) {
		this.aAliases = a;
	},

	keyAction: function(k, n) {
		this.aKeys[k] = n;
	},
	
	keyBufferPush: function(nKey) {
		if (this.bUseBuffer && nKey && this.aKeyBuffer.length < this.nKeyBufferSize) {
			this.aKeyBuffer.push(nKey);
		}
	},

	eventKeyUp: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		if (nCode in this.aAliases) {
			nCode = this.aAliases[nCode];
		}
		this.keyBufferPush(-nCode);
		this.keyAction(nCode, 2);
		return false;
	},

	eventKeyDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		if (nCode in this.aAliases) {
			nCode = this.aAliases[nCode];
		}
		this.keyBufferPush(nCode);
		this.keyAction(nCode, 1);
		return false;
	},

	/** 
	 * renvoie le code clavier de la première touche enfoncée du buffer FIFO
	 * renvoie 0 si aucune touche n'a été enfoncée
	 * @return int
	 */
	inputKey: function() {
		if (this.aKeyBuffer.length) {
			return this.aKeyBuffer.shift();
		} else {
			return 0;
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
		document.addEventListener(sEvent, p, false);
	},

	/**
	 * Will remove previously added event handler
	 * Will do nothing if handler has not been previously added
	 * @param sEvent DOM event name
	 */
	unplugHandler: function(sEvent) {
		if (sEvent in this.oHandlers) {
			var p = this.oHandlers[sEvent];
			document.removeEventListener(sEvent, p);
			delete this.oHandlers[sEvent];
		}
	},

	plugHandlers: function() {
		this.plugHandler('keyup', this.eventKeyUp);
		this.plugHandler('keydown', this.eventKeyDown);
	},
	
	unplugHandlers: function() {
		this.unplugHandler('keyup');
		this.unplugHandler('keydown');
	}
});

