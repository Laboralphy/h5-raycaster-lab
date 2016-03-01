/**
 * Thinker de missile
 */
O2.extendClass('MANSION.MissileThinker', O876_Raycaster.MissileThinker, {
	_oOwner: null,
	explode: function() {
		__inherited();
		var m = this.oMobile;
		var oEvent = {
			t: this.oLastHitMobile,
			m: m
		};
		this.oGame.playSound(SOUNDS_DATA.missiles[m.getData('sounds').explode], m.x, m.y);
		this.oGame.trigger('hit', oEvent);
	},

	fire: function(oShooter) {
		__inherited(oShooter);
		var m = this.oMobile;
		m.oSprite.nAlpha = 3;
		m.oSprite.bTranslucent = true;
		this.oGame.playSound(SOUNDS_DATA.missiles[m.getData('sounds').fire], m.x, m.y);
	},
	
	thinkGo: function() {
		var m = this.oMobile.oSprite;
		if (m.nAlpha > 0) {
			--m.nAlpha;
			if (m.nAlpha < 0) {
				m.bTranslucent = false;
			}
		}
		__inherited();
	}
});
