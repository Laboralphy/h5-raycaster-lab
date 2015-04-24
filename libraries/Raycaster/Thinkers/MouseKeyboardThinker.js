/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile
 */
O2.extendClass('O876_Raycaster.MouseKeyboardThinker', O876_Raycaster.Thinker, {
	oKeyboard : null,
	oMouse : null,
	aKeys : null,
	aCommands : null,

	defineKeys : function(a) {
		this.aKeys = {};
		this.aCommands = {};
		for ( var k in a) {
			this.aKeys[k] = [ a[k], 0 ];
			this.aCommands[a[k]] = false;
		}
	},
	
	getCommandStatus : function(sKey) {
		return this.aCommands[sKey];
	},

	updateKeys : function() {
		var sKey = '', nKey, sProc, pProc, aButton;
		for (sKey in this.aKeys) {
			nKey = this.aKeys[sKey][0];
			sProc = '';
			switch (this.oKeyboard.aKeys[nKey]) {
				case 1: // down
					if (this.aKeys[sKey][1] === 0) {
						sProc = sKey + 'Down';
						this.aCommands[sKey] = true;
						this.aKeys[sKey][1] = 1;
					}
					break;
		
				case 2: // Up
					if (this.aKeys[sKey][1] == 1) {
						sProc = sKey + 'Up';
						this.aCommands[sKey] = false;
						this.aKeys[sKey][1] = 0;
					}
					break;
				default:
					sProc = '';
					break;
			}
			if (sProc in this) {
				pProc = this[sProc];
				pProc.apply(this, []);
			}
		}
		while (aButton = this.oMouse.inputMouse()) {
			nKey = aButton[3];
			sKey = 'button' + nKey;
			switch (aButton[0]) {
				case 1: // button down
					sProc = sKey + 'Down';
					this.aCommands[sKey] = true;
					break;
					
				case 0: // button up
					sProc = sKey + 'Up';
					this.aCommands[sKey] = false;
					break;

				case 3:
					sProc = 'wheelUp';
					break;
					
				case -3:
					sProc = 'wheelDown';
					break;
					
				default:
					sProc = '';
					break;
			}
			if (sProc in this) {
				pProc = this[sProc];
				pProc.apply(this, []);
			}
		}
		for (sKey in this.aCommands) {
			if (this.aCommands[sKey]) {
				sProc = sKey + 'Command';
				if (sProc in this) {
					pProc = this[sProc];
					pProc.apply(this, []);
				}
			}
		}
	}
});
