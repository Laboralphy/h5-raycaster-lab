// Raycaster Mansion Game Logic

O2.createClass('MANSION.Logic', {
	
	
	CAPTURE_ANGLE_PER_RANK: 5,  // IN DEGREes
	CAPTURE_ANGLE_RANK_0: 8,
	
	
	_nCameraCaptureRank: 1,  // affects the capture circle size
	_nCameraCaptureDistance: 640,
	_nCameraEnergy: 0,
	_nCameraMaxEnergy: 1000,
	_nCameraEnergyDep: 2,
	_nCameraEnergyAcc: 10,
	_fCameraFullEnergyBonus: 1.5, // damage bonus granted when camera is fully loaded
	
	_nTime: 0, 
	_nCameraIntervalTime: 1000, // minimum time between two camera shots
	_nCameraNextShotTime: 1000, // last time the camera took a photo
	
	_aCapturedGhosts: null,
	_aLastShotStats: null,
	

	/**
	 * Game time transmission
	 * for timed event
	 */
	setTime: function(t) {
		this._nTime = t;
	},
	
	/**
	 * returns the capture circle size value
	 * according to the player's ability
	 * @return integer size in pixel
	 */
	getCameraCircleSize: function() {
		return Math.tan(this.getCameraCaptureAngle()) * 152 | 0;
	},
	
	/**
	 * returns the capture circle aperture
	 * Depends on player capture rank
	 * @return float angle in radians
	 */
	getCameraCaptureAngle: function() {
		return PI * (this.CAPTURE_ANGLE_PER_RANK * 
			this.getCameraCaptureRank() + this.CAPTURE_ANGLE_RANK_0) / 180;
	},
	
	/**
	 * Define a new capture rank for the player
	 * @param n int
	 */
	setCameraCaptureRank: function(n) {
		this._nCameraCaptureRank = n;
	},
	
	/**
	 * Returns the capture rank for the player
	 * @return int
	 */
	getCameraCaptureRank: function() {
		return this._nCameraCaptureRank;
	},
	
	/**
	 * Returns the amount of energy store in the camera
	 */
	getCameraEnergy: function() {
		return this._nCameraEnergy | 0;
	},

	/**
	 * Returns the maximum amount of storable energy in the camera
	 */
	getCameraMaxEnergy: function() {
		return this._nCameraMaxEnergy;
	},
	
	getCameraCaptureDistance: function() {
		return this._nCameraCaptureDistance;
	},
	
	
	/**
	 * Get more ecto-energy
	 */
	increaseCameraEnergy: function(nAmount) {
		this._nCameraEnergy = Math.max(0, Math.min(this._nCameraMaxEnergy, this._nCameraEnergy + nAmount));
	},

	decreaseCameraEnergy: function(nAmount) {
		this._nCameraEnergy = Math.max(0, Math.min(this._nCameraMaxEnergy, this._nCameraEnergy - nAmount));
	},
	
	/**
	 * Deplete all stored energy
	 */
	cameraOff: function() {
		this._nCameraEnergy = 0;
	},
	
	/**
	 * returns true of camera is ready to tak a picture
	 */
	isCameraReady: function() {
		return this._nTime > this._nCameraNextShotTime;
	},
	
	/**
	 * We have taken photo
	 * updating energy gauges
	 */
	cameraShoot: function() {
		this._nCameraNextShotTime = this._nTime + this._nCameraIntervalTime;
		var fEnergy = this._nCameraEnergy;
		var bFullEnergy = fEnergy == this._nCameraMaxEnergy;
		if (bFullEnergy) {
			fEnergy = fEnergy * this._fCameraFullEnergyBonus | 0;
		}
		var nTotalDamage = 0;
		var nTotalShots = 0;
		var aTags = [];
		this._aCapturedGhosts.forEach((function(g) {
			var fDistance = g[2];
			var fAngle = g[1];
			var oGhost = g[0];
			var e = fEnergy * this.getEnergyDissipation(fAngle, fDistance) | 0;
			if (e) {
				if (fDistance < 64) {
					aTags.push('close');
				}
				if (fAngle < 0.01) {
					aTags.push('core');
				}
				if (oGhost.getThinker().isShutterChance()) {
					aTags.push('fatal');
				}
				if (bFullEnergy) {
					aTags.push('zero');
				}
				oGhost.getThinker().damage(e, bFullEnergy);
				nTotalDamage += e;
				++nTotalShots;
			}
		}).bind(this));
		switch (nTotalShots) {
			case 0:
			case 1:
			break;
			
			case 2: 
				aTags.push('double');
			break;
			
			case 3: 
				aTags.push('triple');
			break;
			
			default:
				aTags.push('multiple');
			break;
		}
		this._nCameraEnergy = 0;
		this._aLastShotStats = {
			damage: nTotalDamage,
			shots: aTags
		}
	},
	
	getLastShotStats: function() {
		return this._aLastShotStats;
	},
	
	/**
	 * Given angle and distance, returns
	 */
	getEnergyDissipation: function(fAngle, fDistance) {
		var fCaptureAngle = this.getCameraCaptureAngle();
		var fCaptureDistance = this.getCameraCaptureDistance();
		var fEnergy = 0;
		if (fAngle <= fCaptureAngle) {
			fEnergy = 1 - fAngle / fCaptureAngle;
			if (fDistance <= fCaptureDistance) {
				fEnergy *= 1 - fDistance / fCaptureDistance;
			} else {
				fEnergy = 0;
			}
		}
		return fEnergy;
	},

	/**
	 * The game informs us what mobiles (ghost, missiles) are currently visibles
	 */
	setVisibleMobiles: function(aMobs) {
		var nGhostCaptured = 0;
		var fEnergy = 0, fTotalEnergy = 0;
		var fCaptureAngle = this.getCameraCaptureAngle();
		var fCaptureDistance = this.getCameraCaptureDistance();
		var aCaptured = [];
		if (aMobs) {
			var mi;
			var fAngle;
			var fDistance;
			var oGhost;
			for (var i = 0, l = aMobs.length; i < l; ++i) {
				mi = aMobs[i];
				oGhost = mi[0];
				fAngle = mi[1];
				fDistance = mi[2];
				fEnergy = this.getEnergyDissipation(fAngle, fDistance);
				if (fEnergy > 0) {
					aCaptured.push(mi);
					fTotalEnergy += fEnergy;
				}
			}
		}
		if (fTotalEnergy) {
			this.increaseCameraEnergy(this._nCameraEnergyAcc * fTotalEnergy);
		} else {
			this.decreaseCameraEnergy(this._nCameraEnergyDep);
		}
		this._aCapturedGhosts = aCaptured;
	},
	
	/**
	 * Return all ghost structure [sprite, angle, dist] that is being captured
	 */
	getCapturedGhosts: function() {
		return this._aCapturedGhosts;
	}	
});
