// Device Motion

O2.createClass('O876_Raycaster.MotionDevice', {

	boundHandleMotion: null,

	aRanges: null,
	oOutput: null,
	oEventAngles: null,
	sMode: 'Acceleration',
	
	__construct: function() {
		this.oOutput = {
			alpha: 0,
			beta: 0,
			gamma: 0
		};
		this.createAngleRange('alpha', 0);
		this.createAngleRange('alpha', 1);
		this.createAngleRange('beta', 0);
		this.createAngleRange('beta', 1);
		this.createAngleRange('gamma', 0);
		this.createAngleRange('gamma', 1);
	},
	
	createAngleRange: function(sAngle, n) {
		if (!this.aRanges) {
			this.aRanges = {};
		}
		if (!(sAngle in this.aRanges)) {
			this.aRanges[sAngle] = [];
		}
		var a = new O876_Raycaster.MotionDeviceRange();
		this.aRanges[sAngle][n] = a;
	},
	
	getAngleRange: function(sAngle, n) {
		return this.aRanges[sAngle][n];
	},
	
	compute: function(f) {
		this.oEventAngles = f;
		var i, l, r, R = this.aRanges;
		var oOutput = {}, aOutput;
		var sAngle;
		for (sAngle in R) {
			r = R[sAngle];
			l = r.length;
			aOutput = [];
			for (i = 0; i < l; ++i) {
				aOutput[i] = r[i].compute(f[sAngle]);
			}
			oOutput[sAngle] = aOutput;
		}
		for (sAngle in oOutput) {
			r = oOutput[sAngle];
			if (r[0] != 0) {
				this.oOutput[sAngle] = -r[0];
			} else {
				this.oOutput[sAngle] = r[1];
			}
		}
		return this.oOutput;
	},
	
	getAngleValue: function(sAngle) {
		if (this.oOutput) {
			return this.oOutput[sAngle];
		} else {
			return 0;
		}
	},
	
	setMotionCaptureMethod: function(s) {
		var sAllowed = 'Acceleration Rotation';
		var aAllowed = sAllowed.split(' ');
		if (aAllowed.indexOf(s) >= 0) {
			this.sMode = s;
		} else {
			throw new Error('Device motion capture method unknown : "' + s + '". Allowed values are "' + sAllowed + '"');
		}
	},
	
	handleMotionRotation: function(oEvent) {
		var rr = oEvent.rotationRate;
		this.compute({
			alpha: rr.alpha,
			beta: rr.beta,
			gamma: rr.gamma
		});
	},
	
	handleMotionAcceleration: function(oEvent) {
		var aig = oEvent.accelerationIncludingGravity;
		this.compute({
			alpha: aig.x,
			beta: aig.y,
			gamma: aig.z
		});
	},	

	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugEvents: function(oElement) {
		this.boundHandleMotion = this['handleMotion' + this.sMode].bind(this);
		window.addEventListener('devicemotion', this.boundHandleMotion, false);
	},
	
	unplugEvents: function() {
		window.removeEventListener('devicemotion', this.boundHandleMotion);
	},
});

O2.createClass('O876_Raycaster.MotionDeviceRange', {
	min: 0,
	max: 0,
	value: 0,
	bInvert: false,
	
	setRange: function(min, max, bInvert) {
		this.min = parseFloat(min);
		this.max = parseFloat(max);
		this.bInvert = !!bInvert;
	},
	
	compute: function(v) {
		return this.value = this.prorata(v, this.min, this.max);
	},
	
	prorata: function(v, m1, m2) {
		if (m1 == 0 && m2 == 0) {
			return 0;
		}
		var vLen, vNorm, vMin, vMax, bInvert = this.bInvert;
		if (!bInvert) {
			vMin = Math.min(m1, m2);
			vMax = Math.max(m1, m2);
			if (v >= vMin) {
				vLen = vMax - vMin;
				vNorm = v - vMin;
				return Math.min(1, vNorm / vLen);
			} else {
				return 0;
			}
		} else {
			vMin = Math.max(m1, m2);
			vMax = Math.min(m1, m2);
			if (v <= vMin) {
				vLen = vMax - vMin;
				vNorm = v - vMin;
				return Math.min(1, vNorm / vLen);
			} else {
				return 0;
			}
		}
	}
});
