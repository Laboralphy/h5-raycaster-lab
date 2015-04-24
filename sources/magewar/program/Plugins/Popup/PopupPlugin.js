O2.extendClass('MW.PopupPlugin', MW.Plugin, {

	aPopupMessages: null,
	
	nIconSize: 32,
	

	getName: function() {
		return 'Popup';
	},
	
	init: function() {
		// popups
		this.aPopupMessages = [];
		this.aPopupMessages.__currentMessage = null;
		this.register('render');
		this.register('popup');
	},
	
	render: function() {
		// Gestion des popups
		var r = this.oGame.oRaycaster;
		if (this.aPopupMessages.__currentMessage) {
			if (this.aPopupMessages.__currentMessage.isOver()) {
				this.aPopupMessages.__currentMessage = this.aPopupMessages.shift();
				if (this.aPopupMessages.__currentMessage) {
					r.oEffects.addEffect(this.aPopupMessages.__currentMessage);
					if ('__sound' in this.aPopupMessages.__currentMessage) {
						this.oGame.playSound(this.aPopupMessages.__currentMessage.__sound);
					}
				}
			}
		} else {
			this.aPopupMessages.__currentMessage = this.aPopupMessages.shift();
			if (this.aPopupMessages.__currentMessage) {
				r.oEffects.addEffect(this.aPopupMessages.__currentMessage);
				if ('__sound' in this.aPopupMessages.__currentMessage) {
					this.oGame.playSound(this.aPopupMessages.__currentMessage.__sound);
				}
			}
		}
	},
	
	popup: function(sMessage, nIcon, sTile, sSound) {
		// Y a t il déja eu un message comme ca récemment ?
		var r = this.oGame.oRaycaster;
		if (!r) {
			return;
		}
		if (this.aPopupMessages.length &&
				(this.aPopupMessages.some(function(m) { return m.sMessage == sMessage; })) && 
				!this.aPopupMessages[this.aPopupMessages.length - 1].isOver()) {
			// On spamme le message ... pas de new message
			return;
		}
		var oGX = new MW.GXMessage(r);
		this.aPopupMessages.push(oGX);
		oGX.setMessage(sMessage);
		oGX.nTime /= 1 + (this.aPopupMessages.length * 0.66);
		oGX.nTime |= 0;
		oGX.yPos = oGX.yTo - 16;
		oGX.buildPath();
		if (nIcon !== undefined) {
			sTile = sTile || 'i_icons32';
			var oIcons = r.oHorde.oTiles[sTile]; 
			oGX.setIcon(oIcons.oImage, nIcon * this.nIconSize, 0, this.nIconSize, this.nIconSize);
		}
		if (sSound !== undefined) {
			oGX.__sound = sSound;
		}
	}
	
});
