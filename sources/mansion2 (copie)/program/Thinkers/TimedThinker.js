O2.extendClass('MANSION.TimedThinker', O876_Raycaster.Thinker, {
	nTimeOut: 0,
	
	reset: function() {
		this.nTimeOut = 0;
		this.think = this.thinkInit;
	},
	
	thinkInit: function() {
		this.oMobile.oSprite.playAnimation(0);
		var a = this.oMobile.oSprite.oAnimation;
		if (!a) {
			throw new Error('Animation required for TimedThinker : this mobile does not have any');
		}
		a.reset();
		t = a.nDuration * a.nCount;
		this.nTimeOut = this.oGame.getTime() + t;
		this.think = this.thinkAlive;
		console.log('vfx time', this.oGame.getTime(), '+', t, '=', this.nTimeOut);
	},
	
	thinkAlive: function() {
		if (this.oGame.getTime() > this.nTimeOut) {
			this.think = this.thinkDead;
		}
	},
	
	thinkDead: function() {
		console.log('vfx dead');
		this.oMobile.gotoLimbo();
		this.oMobile.bActive = false;
	},
});

