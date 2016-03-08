/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile
 */
O2.extendClass('O876_Raycaster.KeyboardThinker', O876_Raycaster.Thinker, {
	aCommands : null,
	oBinds: null,
	aKeyBindings: null, // binds keycodes to symbolic events
	aKeyBoundList: null, // keeps a list of bound key
	
	
	bindKey: function(nKey, sEvent) {
		if (this.aKeyBindings === null) {
			this.aKeyBindings = [];
		}
		if (this.aKeyBoundList === null) {
			this.aKeyBoundList = [];
		}
		if (this.aCommands === null) {
			this.aCommands = [];
		}
		this.aKeyBindings[nKey] = [sEvent, 0];
		this.aCommands[sEvent] = false;
		if (this.aKeyBoundList.indexOf(nKey) < 0) {
			this.aKeyBoundList.push(nKey);
		}
	},

	/**
	 * Define keys that will be used to control the mobile on which is applied this Thinker
	 * @param a is an object matching KEY CODES and Event names
	 */
	defineKeys : function(a) {
		var sEvent, i, l;
		for (var sEvent in a) {
			if (Array.isArray(a[sEvent])) {
				l = a[sEvent].length;
				for (i = 0; i < l; ++i) {
					this.bindKey(a[sEvent][i], sEvent);
				}
			} else {
				this.bindKey(a[sEvent], sEvent);
			}
		}
	},
	
	getCommandStatus : function(sEvent) {
		return this.aCommands[sEvent];
	},

	updateKeys : function() {
		var sKey = '', nKey, sProc, pProc, aButton;
		var aKeys = this.aKeys;
		var aCmds = this.aCommands;
		var oKbd = this.oGame.getKeyboardDevice();
		var aKeyData;
		var sEvent;
		var kbl = this.aKeyBoundList;
		var kb = this.aKeyBindings;
		for (var iKey = 0, l = kbl.length; iKey < l; ++iKey) {
			nKey = kbl[iKey];
			aKeyData = kb[nKey];
			sEvent = aKeyData[0];
			sProc = '';
			switch (oKbd.aKeys[nKey]) {
				case 1: // down
					if (aKeyData[1] === 0) {
						sProc = sEvent + '.down';
						aCmds[sEvent] = true;
						aKeyData[1] = 1;
					}
					break;
		
				case 2: // Up
					if (aKeyData[1] == 1) {
						sProc = sEvent + '.up';
						aCmds[sEvent] = false;
						aKeyData[1] = 0;
					}
					break;
				default:
					sProc = '';
					break;
			}
			if (sProc) {
				this.trigger(sProc);
			}
		}
		for (sEvent in this.aCommands) {
			if (this.aCommands[sEvent]) {
				sProc = sEvent + '.command';
				if (sProc) {
					this.trigger(sProc);
				}
			}
		}
	}
});

ClassMagic.castEventHandler(O876_Raycaster.KeyboardThinker);
