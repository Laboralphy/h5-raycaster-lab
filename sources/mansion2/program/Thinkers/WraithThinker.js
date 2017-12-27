/**
 * Thinker d'apparition spectrale
 * Ce fantome emet un son quand on le regarde
 */
O2.extendClass('MANSION.WraithThinker', MANSION.GhostThinker, {
	_bSwitchNotSeenYet: false,
	_nLife: 0,
	_nLifespan: 0,

	thinkSpawning: function() {
		__inherited();
		this.playSound('spawn');
		this.setThink('Living');
	},

	move: function(sDir, fSpeed) {
		var oDir = {
			n: PI * 1.5,
			nw: PI * 1.75,
			w: 0,
			sw: PI / 4,
			s: PI / 2,
			se: PI * 0.75,
			e: PI,
			ne: PI * 1.25
		};
		this.oMobile.setAngle(oDir[sDir]);
		this.oMobile.setSpeed(fSpeed);
	},

	boo: function() {
		this._bSwitchNotSeenYet = true;
	},

	setLifespan: function(t) {
		this._nLifespan = t;
	},

	thinkLiving: function() {
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
			var nLifeSpan = this._nLifespan;
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
		this.oMobile.moveForward();
		if (this.oGame.getTime() > this._nLife) {
			this.vanish();
		}
	},
	
	thinkLivingLong: function() {
		this.process();
	}
});
