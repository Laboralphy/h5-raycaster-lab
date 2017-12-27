O2.extendClass('MW.TimedThinker', O876_Raycaster.Thinker, {
	nTimeOut: 0,
	  
	start: function() {
		var a = this.oMobile.oSprite.oAnimation;
		if (!a) throw new Error('bordel de merde');
		t = a.nDuration * a.nCount;
		this.nTimeOut = this.oGame.getTime() + t;
		this.think = this.thinkAlive;
	},
	
	thinkAlive: function() {
		if (this.oGame.getTime() > this.nTimeOut) {
			this.think = this.thinkDead;
		}
	},
	
	thinkDead: function() {
		this.oMobile.gotoLimbo();
		this.oMobile.bActive = false;
	}
});

