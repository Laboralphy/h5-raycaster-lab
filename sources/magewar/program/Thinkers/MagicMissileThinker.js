O2.extendClass('MW.MagicMissileThinker', MW.MobThinker, {
	ANIMATION_DEATH: 0,
	ANIMATION_WALK: 1,
	ANIMATION_STAND: 1,
	ANIMATION_ACTION: 1,
	
	restore: function() {
		__inherited();
		var m = this.oMobile;
		m.bEthereal = true;
		m.bSlideWall = false;
	},
	
	
	thinkAlive: function() {
		__inherited();
		var m = this.oMobile;
		var wc = m.oWallCollision;
		if (wc.x != 0 ||  wc.y != 0) {
			m.rollbackXY();
			this.die();
		}
	},
});
