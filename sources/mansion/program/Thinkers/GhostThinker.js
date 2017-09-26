O2.extendClass('Mansion.GhostThinker', O876_Raycaster.Thinker, {
	nTime : 0,
	
	oTarget: null,
	

	__construct : function() {
		this.think = this.thinkInit;
	},

	/** 
	 * Fait disparaitre le fantome et le désactive
	 */ 
	vanish: function() {
		this.nTime = 0;
		this.think = this.thinkVanishing;
		var s = this.oMobile.oSprite;
		s.bTranslucent = true;
		s.nAlpha = 1;
	},
	
	playSound: function(sSound) {
		var oMe = this.oMobile;
		var oSounds = oMe.data('sounds');
		if (oSounds && sSound in oSounds) {
			this.oGame.playSound(SOUNDS_DATA.ghosts[oSounds[sSound]], oMe.x, oMe.y);
		}
	},
	
	/**
	 * Renvoie true si la cible spécifié est tournée vers le fantome.
	 * @param oTarget mobile dont on souhaite tester s'il nous a vu
	 * @return bool
	 */
	ghostSeen: function(oTarget) {
		var fTargetAngle = oTarget.fTheta;
		var oMe = this.oMobile;
		return MathTools.isPointInsideAngle(oTarget.x, oTarget.y, fTargetAngle, PI / 2, oMe.x, oMe.y);
	},
	
	/**
	 * fonctionnement normal du fantome
	 */
	process: function() {
		++this.nTime;
		var s = this.oMobile.oSprite;
		if (this.nTime & 1) {
			s.bTranslucent = true;
			s.nAlpha = 1;
		} else {
			s.bTranslucent = false;
		}
		this.oMobile.moveForward();
	},
	
	thinkInit: function() {
		var s = this.oMobile.oSprite;
		s.bTranslucent = true;
		s.nAlpha = 3;
		this.oTarget = this.oGame.getPlayer();
		this.think = this.thinkSpawning;
	},
	
	thinkSpawning: function() {
		var s = this.oMobile.oSprite;
		--s.nAlpha;
		if (s.nAlpha <= 0) {
			s.bTranslucent = false;
			this.think = this.thinkLiving;
		}
	},

	thinkLiving: function() {
		this.process();
	},
	
	thinkVanishing: function() {
		var s = this.oMobile.oSprite;
		++this.nTime;
		s.nAlpha = (this.nTime >> 1) + 1;
		if (s.nAlpha > 3) {
			s.nAlpha = 3;
			this.oMobile.bActive = false;
			this.oMobile.gotoLimbo();
			this.think = this.thinkVanished;
		}
	},
	
	thinkVanished: function() {
	},

});
