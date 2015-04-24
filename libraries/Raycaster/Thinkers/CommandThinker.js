/**
 * Ce thinker permet de bouger un mobile en définissant un vecteur de vitesse.
 * Il ne dispose d'aucune intelligence artificielle Ce thinker a été conçu pour
 * être utilisé comme Thinker de base dans un environnement réseau. Le thinker
 * propose les fonction suivantes : - setSpeed(x, y) : définiiton de la vitesse
 * du mobile selon les axes X et Y - die() : le mobile passe à l'état DEAD (en
 * jouant l'animation correspondante - disable() : le mobile disparait -
 * restore() : le mobile réapparait dans la surface de jeux
 */
O2.extendClass('O876_Raycaster.CommandThinker', O876_Raycaster.Thinker, {

	fma : 0, // Moving Angle
	fms : 0, // Moving Speed

	nDeadTime : 0,
	

	ANIMATION_STAND : 0,
	ANIMATION_WALK : 1,
	ANIMATION_ACTION : 2,
	ANIMATION_DEATH : 3,

	setMovement : function(a, s) {
		if (this.fma != a || this.fms != s) {
			this.fma = a;
			this.fms = s;
			var oSprite = this.oMobile.oSprite;
			var nAnim = oSprite.nAnimationType;
			var bStopped = s === 0;
			switch (nAnim) {
				case this.ANIMATION_ACTION:
				case this.ANIMATION_STAND:
					if (!bStopped) {
						oSprite.playAnimationType(this.ANIMATION_WALK);
					}
				break;
				
				case this.ANIMATION_WALK:
					if (bStopped) {
						oSprite.playAnimationType(this.ANIMATION_STAND);
					}
				break;
			}
		}
	},

	die : function() {
		this.setMovement(this.fma, 0);
		this.oMobile.oSprite.playAnimationType(this.ANIMATION_DEATH);
		this.oMobile.bEthereal = true;
		this.nDeadTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
		this.think = this.thinkDying;
	},

	disable : function() {
		this.thinkDisable();
	},

	restore : function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
	},

	think : function() {
		this.restore();
	},

	thinkAlive : function() {
		var m = this.oMobile;
		m.move(this.fma,this.fms);
		if (this.oGame.oRaycaster.clip(m.x, m.y, 1)) {
			m.rollbackXY();
		}
	},

	thinkDisable : function() {
		this.oMobile.bEthereal = true;
		this.nDeadTime = 0;
		this.think = this.thinkDying;
	},

	thinkDying : function() {
		this.nDeadTime -= this.oGame.TIME_FACTOR;
		if (this.nDeadTime <= 0) {
			this.oMobile.gotoLimbo();
			this.think = this.thinkDead;
		}
	},

	thinkDead : function() {
		this.oMobile.bActive = false;
	}
});
