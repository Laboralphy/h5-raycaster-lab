/**
 * Thinker d'apparition spectrale
 * Ce fantome emet un son quand on le regarde
 */
O2.extendClass('MANSION.WraithThinker', MANSION.GhostThinker, {
	_bSwitchNotSeenYet: true,
	_nLife: 0,
	
	thinkLiving: function() {
		__inherited();
		var oTarget = this.getTarget();
		if (this._bSwitchNotSeenYet) {
			// not seen yet
			if (this.ghostSeen(oTarget)) {
				// now seen
				this._bSwitchNotSeenYet = false;
				this.playSound('seen');
			}
		} else {
			// already seen
			var nLifeSpan = this.oMobile.getData('lifespan');
			if (nLifeSpan) {
				this._nLife = this.oGame.getTime() + nLifeSpan;
				this.think = this.thinkLivingShort;
			} else {
				this.think = this.thinkLivingLong;
			}
		}
	},

	thinkLivingShort: function() {
		this.process();
		if (this.oGame.getTime() > this._nLife) {
			this.vanish();
		}
	},
	
	thinkLivingLong: function() {
		this.process();
	}
});
