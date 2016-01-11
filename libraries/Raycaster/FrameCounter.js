O2.createClass('O876_Raycaster.FrameCounter', {

	bCheck: false, // when true the FPS is being checked...
	bCheckLoad: true, // when true, the load factor is being computed, this indicates how busy the CPU is.
	bLoop: true,
	// if FPS is too low we decrease the LOD
	nFPS: 0,
	nTimeStart: 0,
	nCount: 0,
	nSeconds: 0,
	nAcc: 0,
	aLoad: null,
	fAvgLoad: 0,
	
	/**
	 * Starts to count frames per second
	 */
	start: function(nTimeStamp) {
		this.nTimeStart = nTimeStamp;
		this.bCheck = true;
		this.nCount = 0;
	},
	
	getAvgFPS: function() {
		return ((this.nAcc / this.nSeconds) * 10 | 0) / 10;
	},
	
	getAvgLoad: function() {
		return this.fAvgLoad;
	},

	/**
	 * count frames per second
	 */
	check: function(nNowTimeStamp) {
		if (this.bCheck) {
			++this.nCount;
			if ((nNowTimeStamp - this.nTimeStart) >= 1000) {
				this.nFPS = this.nCount;
				this.nAcc += this.nCount;
				++this.nSeconds;
				this.bCheck = this.bLoop;
				if (this.bCheck) {
					this.start(nNowTimeStamp);
				}
				return true;
			}
		}
		if (this.bCheckLoad) {
			var nBusyTime = Date.now();
			var nDelta = nBusyTime - nNowTimeStamp;
			var aLoad = this.aLoad;
			if (!aLoad) {
				aLoad = this.aLoad = [];
			}
			aLoad.push(nDelta);
			if (aLoad.length > 100) {
				var nSum = 0;
				for (var i = 0, l = aLoad.length; i < l; ++i) {
					nSum += aLoad.pop();
				}
				this.fAvgLoad = nSum / l;
			}
		}
		return false;
	},

});
