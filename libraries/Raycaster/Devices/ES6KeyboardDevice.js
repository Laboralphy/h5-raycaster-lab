/** Entrée sortie clavier - utilise les code ES6
 * O876 Raycaster project
 * @date 2018-02-12
 * @author Raphaël Marandet 
 * Memorise les touches clavier enfoncées
 */
O2.createClass('O876_Raycaster.ES6KeyboardDevice', {
	oKeys: null,	// Index inversée Code->Action
	aKeyBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	aAliases: null,
	oHandlers: null,

	__construct: function() {
		this.oKeys = {};
		this.oHandlers = {};
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		this.aKeyBuffer = [];
	},

    getKey: function(sCode) {
		if (sCode in this.oKeys) {
            return this.oKeys[sCode];
		} else {
			return 0;
		}
    },

    setAliases: function(a) {
		this.aAliases = a;
	},

	keyAction: function(sCode, nVal) {
        this.oKeys[sCode] = nVal;
	},

	keyBufferPush: function(nKey) {
		if (this.bUseBuffer && nKey && this.aKeyBuffer.length < this.nKeyBufferSize) {
			this.aKeyBuffer.push(nKey);
		}
	},

	eventKeyUp: function(oEvent) {
		var sCode = oEvent.key;
		if (sCode in this.aAliases) {
			sCode = this.aAliases[sCode];
		}
		this.keyBufferPush('-' + sCode);
		this.keyAction(sCode, 2);
		return false;
	},

	eventKeyDown: function(oEvent) {
		var sCode = oEvent.key;
		if (sCode in this.aAliases) {
			sCode = this.aAliases[sCode];
		}
		this.keyBufferPush(sCode);
		this.keyAction(sCode, 1);
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

