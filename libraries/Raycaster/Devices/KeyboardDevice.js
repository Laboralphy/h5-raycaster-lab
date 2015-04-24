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

	__construct: function() {
		this.aKeys = [];
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		for (var i = 0; i < 256; i++) {
			this.aKeys.push(0);	 
		}
		this.aKeyBuffer = [];
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
		var oDev = window.__keyboardDevice;
		if (nCode in oDev.aAliases) {
			nCode = oDev.aAliases[nCode];
		}
		oDev.keyBufferPush(-nCode);
		oDev.keyAction(nCode, 2);
		return false;
	},

	eventKeyDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		var oDev = window.__keyboardDevice;
		if (nCode in oDev.aAliases) {
			nCode = oDev.aAliases[nCode];
		}
		oDev.keyBufferPush(nCode);
		oDev.keyAction(nCode, 1);
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

	plugEvents: function() {
		window.__keyboardDevice = this;
		document.onkeyup = this.eventKeyUp;
		document.onkeydown = this.eventKeyDown;
	},
	
	unplugEvents: function() {
		window.__keyboardDevice = null;
		document.onkeyup = undefined;
		document.onkeydown = undefined;
	}

});

