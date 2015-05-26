/**
 * Thinker des mob controlés par le serveur
 */

O2.extendClass('MW.MobThinker', O876_Raycaster.CommandThinker, {

	oHazes: null,
	bDying: false,

	
	restore: function() {
		__inherited();
		this.bDying = false;
		var m = this.oMobile;
		m.oSprite.playAnimationType(this.ANIMATION_STAND);
		var oSounds = m.getData('sounds');
		if (oSounds && oSounds.spawn) {
			this.oGame.playSound(oSounds.spawn, m.x, m.y);
		}
	},

	die: function() {
		if (this.bDying) {
			return;
		}
		this.clearHaze();
		var m = this.oMobile;
		m.bVisible = true;
		m.oSprite.bTranslucent = false;
		var oSounds = m.getData('sounds');
		if ('die' in oSounds) {
			this.oGame.playSound(oSounds.die, m.x, m.y);
		}
		this.bDying = true;
		__inherited();
	},
	
	/**
	 * Supprime tous les hazes
	 */
	clearHaze: function() {
		this.oHazes = null;
		this.oGame.setSpriteHaze(this.oMobile, null);
	},
	
	/**
	 * Applique un effet de Haze au mobile
	 * @param sHaze correspond au status qui génére le haze
	 * voir la table des HAZE_DATA
	 */
	setHaze: function(sHaze, nSet) {
		var aOverlay = [];
		var h, iHaze = '';
		if (this.oHazes === null) {
			h = {};
			this.oHazes = h;
			for (iHaze in MW.ATTRIBUTES_DATA) {
				h[iHaze] = 0;
			}
		} else {
			h = this.oHazes;
		}
		h[sHaze] = nSet;
		var hi, ad;
		for (iHaze in h) {
			if (iHaze in MW.ATTRIBUTES_DATA) {
				hi = h[iHaze];
				ad = MW.ATTRIBUTES_DATA[iHaze];
				if (hi > 0 && ad.pos.haze !== null) {
					aOverlay.push(ad.pos.haze);
				} else if (hi < 0 && ad.neg.haze !== null) {
					aOverlay.push(ad.neg.haze);
				}
			}
		}
		if (aOverlay.length) {
			this.oGame.setSpriteHaze(this.oMobile, aOverlay);
		} else {
			this.oGame.setSpriteHaze(this.oMobile, null);
		}
	}
});
