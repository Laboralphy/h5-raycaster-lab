// Raycaster Mansion Game Logic

O2.createClass('MANSION.Logic', {
	
	
	CAPTURE_ANGLE_PER_RANK: 5,  // IN DEGREes
	CAPTURE_ANGLE_RANK_0: 8,
	
	
	_nCameraCaptureRank: 1,  // affects the capture circle size
	_nCameraCaptureDistance: 640,
	_nCameraEnergy: 0,
	_nCameraMaxEnergy: 1000,
	_nCameraEnergyDepletion: 2,
	_fFullEnergyBonus: 1.5, // damage bonus granted when camera is fully loaded
	
	_aCapturedGhosts: null,
	
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
	 * We have taken photo
	 */
	cameraShoot: function() {
		var nEnergy = this._nCameraEnergy;
		this._aCapturedGhosts.forEach(function(g) {
			var fDistance = g[2];
			var fAngle = g[1];
			var oGhost = g[0];
			var bFullEnergy = nEnergy == this._nCameraMaxEnergy;
			if (bFullEnergy) {
				nEnergy = nEnergy * this._fFullEnergyBonus | 0;
			}
		});
		this._nCameraEnergy = 0;
	},

	/**
	 * The game informs us what mobiles (ghost, missiles) are currently visibles
	 */
	setVisibleMobiles: function(aMobs) {
		var nGhostCaptured = 0;
		var fEnergy = 0, fAllEnergies = 0;
		var fCaptureAngle = this.getCameraCaptureAngle();
		var fCaptureDistance = this.getCameraCaptureDistance();
		var aCaptured = [];
		if (aMobs) {
			var mi;
			var fAngle;
			var fDistance;
			var oGhost;
			for (var i = 0, l = aMobs.length; i < l; i += 3) {
				mi = aMobs[i];
				oGhost = mi[0];
				fAngle = mi[1];
				fDistance = mi[2];
				fEnergy = 0;
				if (fAngle <= fCaptureAngle) {
					fEnergy = 1 - fAngle / fCaptureAngle;
					if (fDistance <= fCaptureDistance) {
						fEnergy *= 1 - fDistance / fCaptureDistance;
						aCaptured.push(mi);
					} else {
						fEnergy = 0;
					}
				}
			}
			fAllEnergies += fEnergy;
		}
		if (fAllEnergies) {
			this.increaseCameraEnergy(10 * fAllEnergies);
		} else {
			this.decreaseCameraEnergy(this._nCameraEnergyDepletion);
		}
		this._aCapturedGhosts = aCaptured;
	},
	
	/**
	 * Return all ghost structure [sprite, angle, dist] that is being captured
	 */
	getCapturedGhosts: function() {
		return this._aCapturedGhosts;
	},
	
});
