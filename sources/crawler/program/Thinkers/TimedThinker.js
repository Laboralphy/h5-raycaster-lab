O2.extendClass('TimedThinker', O876_Raycaster.Thinker, {
	nTimeOut: 0,
	  
	start: function(t) {
		this.nTimeOut = this.oGame.nTimeMs + t;
		this.think = this.thinkAlive;
	},
	
	thinkAlive: function() {
		if (this.oGame.nTimeMs > this.nTimeOut) {
			this.think = this.thinkDead;
		}
	},
	
	thinkDead: function() {
		this.oMobile.bActive = false;
	}
});

