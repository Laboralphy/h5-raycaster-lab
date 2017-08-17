/**
 * Created by ralphy on 16/08/17.
 */
O2.extendClass('HOTD.ZombieThinker', O876_Raycaster.Thinker, {

	_oStalker: null,
	_nUntilTime: 0,

	ANIM_STAND: 0,
	ANIM_WALK: 1,
	ANIM_ATTACK: 2,
	ANIM_DEATH: 3,
	ANIM_SPAWN: 4,

	__construct: function() {
		this._oStalker = new HOTD.StalkerHelper();
	},

	/**
	 * Spawn the zombie at this place.
	 * The zombie will play animation and immédiatly walk toward the player
	 * @param xSector {number}
	 * @param ySector {number}
	 */
	spawn: function() {
		/**
		 * @var m
		 * @type {O876_Raycaster.Mobile}
		 */
		var m = this.oMobile;
		var ps = this.oGame.oRaycaster.nPlaneSpacing;
		m.oSprite.playAnimationType(this.ANIM_SPAWN);
		this.think = this.thinkSpawning;
	},

	until: function(n) {
		this._nUntilTime = this.oGame.getTime() + n;
	},

	timeout: function() {
		return this.oGame.getTime() >= this._nUntilTime;
	},

	animate: function(n) {
		this.oMobile.oSprite.playAnimationType(n);
	},

	animationIsOver: function() {
		return this.oMobile.oSprite.oAnimation.isOver();
	},

	die: function() {
		this.animate(this.ANIM_DEATH);
		this.think = this.thinkDie;
	},

	chase: function() {
		var g = this.oGame;
		var m = this.oMobile;
		var ps = this.oGame.oRaycaster.nPlaneSpacing;
		var oPlayer = g.getPlayer();
		m.setAngle(this._oStalker.getDirection(m, oPlayer));
		m.setSpeed(m.data('speed'));
		this.think = this.thinkChasing;
		this.until(400);
	},

	thinkSpawning: function() {
		if (this.animationIsOver()) {
			// spawn complet !
			this.animate(this.ANIM_WALK);
			this.think = this.thinkChasing;
		}
	},

	thinkChasing: function() {
		if (this.timeout()) {
			this.chase();
			return;
		}
		var m = this.oMobile;
		m.moveForward();
		var d = this._oStalker.getDistance(m, this.oGame.getPlayer());
		if (d < 40) {
			m.oSprite.playAnimationType(this.ANIM_ATTACK);
			this.think = this.thinkAttacking;
		}
	},

	thinkAttacking: function() {
		if (this.animationIsOver()) {
			this.chase();
		}
	},

	thinkDie: function() {
		if (this.animationIsOver()) {
			this.oMobile.gotoLimbo();
			this.think = this.thinkDead;
		}
	},

	thinkDead: function() {

	}
});
