// Device Motion

O2.createClass('O876_Raycaster.MotionDevice', {

	boundHandleMotion: null,

	aAlphaRange: null,
	aBetaRange: null,
	aGammaRange: null,
	
	oCommands: null,
	
	__construct: function() {
		this.aAlphaRange = [0, 0, 0, 0];
		this.aBetaRange = [0, 0, 0, 0];
		this.aGammaRange = [0, 0, 0, 0];
		this.oCommands = {
			alpha0: 0,
			alpha1: 0,
			beta0: 0,
			beta1: 0,
			gamma0: 0,
			gamma1: 0
		};
	},
	
	setAlphaRange: function(x0, x1, x2, x3) {
		this.aAlphaRange = [
			parseFloat(x0),
			parseFloat(x1),
			parseFloat(x2),
			parseFloat(x3)
		];
	},
	
	setBetaRange: function(x0, x1, x2, x3) {
		this.aBetaRange = [
			parseFloat(x0),
			parseFloat(x1),
			parseFloat(x2),
			parseFloat(x3)
		];
	},
	
	setGammaRange: function(x0, x1, x2, x3) {
		this.aGammaRange = [
			parseFloat(x0),
			parseFloat(x1),
			parseFloat(x2),
			parseFloat(x3)
		];
	},
	
	compute: function(fAlpha, fBeta, fGamma) {
		// Alpha
		this.oCommands.alpha0 = this.prorata(fAlpha, this.aAlphaRange[0], this.aAlphaRange[1]);
		this.oCommands.alpha1 = this.prorata(fAlpha, this.aAlphaRange[2], this.aAlphaRange[3]);
		this.oCommands.beta0 = this.prorata(fBeta, this.aBetaRange[0], this.aBetaRange[1]);
		this.oCommands.beta1 = this.prorata(fBeta, this.aBetaRange[2], this.aBetaRange[3]);
		this.oCommands.gamma0 = this.prorata(fGamma, this.aGammaRange[0], this.aGammaRange[1]);
		this.oCommands.gamma1 = this.prorata(fGamma, this.aGammaRange[2], this.aGammaRange[3]);
	},
	
	
	handleMotion: function(oEvent) {
		var rr = oEvent.rotationRate;
		this.compute(rr.alpha, rr.beta, rr.gamma);
	},	

	prorata: function(v, m1, m2) {
		var vMin = Math.min(m1, m2);
		var vMax = Math.max(m1, m2);
		if (v >= vMin && v <= vMax) {
			var vLen = vMax - vMin;
			var vNorm = v - vMin;
			return Math.min(1, vNorm / vLen);
		} else {
			return 0;
		}
	},
	
	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugEvents: function(oElement) {
		this.boundHandleMotion = this.handleMotion.bind(this);
		window.addEventListener('devicemotion', this.boundHandleMotion, true);
	},
	
	unplugEvents: function() {
		window.removeEventListener('devicemotion', this.boundHandleMotion);
	},
});

