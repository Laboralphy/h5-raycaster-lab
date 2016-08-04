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
	_nCameraESStep: 126,
	_nCameraESNext: null,
	_fCameraFullEnergyBonus: 1.5, // damage bonus granted when camera is fully loaded
	_bCameraCharging: false,
	_bCameraFullCharge: false,
	_bCameraFlash: false,
	
	
	_nTime: 0, 
	_nCameraIntervalTime: 1000, // minimum time between two camera shots
	_nCameraNextShotTime: 1000, // last time the camera took a photo
	
	_aCapturedGhosts: null,
	_aLastShotStats: null,
	
	
	_nPhoneBattery: 100,
	_nPhoneNetwork: 100,
	_nPhoneClockH: 0,
	_nPhoneClockM: 0,
	

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
	 * @return int
	 */
	getCameraMaxEnergy: function() {
		return this._nCameraMaxEnergy;
	},
	
	/**
	 * Returns the camera capture distance 
	 * @return int
	 */
	getCameraCaptureDistance: function() {
		return this._nCameraCaptureDistance;
	},
	
	
	/**
	 * Get more ecto-energy
	 */
	increaseCameraEnergy: function(nAmount) {
		this._nCameraEnergy = Math.max(0, Math.min(this._nCameraMaxEnergy, this._nCameraEnergy + nAmount));
	},

	/**
	 * Decreases ecto energy (no ghost in the visor)
	 */
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
	 * Returns true if the camera has flashed
	 * Sets this flag to false, so the function can only be called once
	 */
	cameraFlashTriggered: function() {
		var b = this._bCameraFlash;
		this._bCameraFlash = false;
		return b;
	},
	
	/**
	 * We have taken photo
	 * updating energy gauges
	 */
	cameraShoot: function() {
		this._bCameraFlash = true;
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
		this._bCameraFullCharge = false;
		this._nCameraESNext = null;
		this._aLastShotStats = {
			damage: nTotalDamage,
			shots: aTags
		};
	},
	
	/** 
	 * Get statistic about the last shot
	 * These stat are for displaying
	 * @returns an objet {damage: int, shots: [description]}
	 */
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
				if (!oGhost.data('dead')) {
					fAngle = mi[1];
					fDistance = mi[2];
					fEnergy = this.getEnergyDissipation(fAngle, fDistance);
					if (fEnergy > 0) {
						aCaptured.push(mi);
						fTotalEnergy += fEnergy;
					}
				}
			}
		}
		if (fTotalEnergy > 0) {
			this.increaseCameraEnergy(this._nCameraEnergyAcc * fTotalEnergy);
		} else {
			this.decreaseCameraEnergy(this._nCameraEnergyDep);
		}
		this._bCameraCharging = fTotalEnergy > 0;
		this._aCapturedGhosts = aCaptured;
	},
	
	/**
	 * Return true if the camera is being charged and making noise
	 */
	isCameraBuzzing: function() {
		var esn = this._nCameraESNext;
		var ess = this._nCameraESStep;
		if (esn === null) {
			esn = this._nCameraESNext = this._nCameraEnergy + ess;
		}
		if (this._bCameraCharging) {
			if (this._nCameraEnergy >= esn) {
				this._nCameraESNext = esn + ess;
				return true;
			}
		} else {
			this._nCameraESNext = null;
		}
		return false;
	},
	
	/**
	 * Returns true if the camera has reach full charge
	 */
	hasCameraReachedFullCharge: function() {
		if (!this._bCameraFullCharge && this._nCameraEnergy >= this._nCameraMaxEnergy) {
			this._bCameraFullCharge = true;
			return true;
		} else if (this._nCameraEnergy < this._nCameraMaxEnergy) {
			this._bCameraFullCharge = false;
		}
		return false;
	},
	
	/**
	 * Return all ghost structure [sprite, angle, dist] that is being captured
	 */
	getCapturedGhosts: function() {
		return this._aCapturedGhosts;
	},
	
	
	
	/***************************************
	 *            PHONE STATE              *
	 ***************************************/
	
	/**
	 * Returns the network coverage indicator
	 * @returns int between 0 and 100
	 */
	getNetworkIndicator: function() {
		return this._nPhoneNetwork;
	},

	/**
	 * Returns the battery charge indicator
	 * @returns int between 0 and 100
	 */
	getBatteryIndicator: function() {
		return Math.min(99, Math.max(0, this._nPhoneBattery));
	},
	
	/**
	 * Returns the time of night to be displayed
	 * @returns string like "02:36"
	 */
	getClockTime: function() {
		return {h: this._nPhoneClockH, m: this._nPhoneClockM};
	}
});
