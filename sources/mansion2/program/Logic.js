// Raycaster Mansion Game Logic
/**
 * Cette classe contient quelques règle métier concernant le téléphone et l'appareil photo, 
 */

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
	_aCameraSubjects: null,
    _nCameraIntervalTime: 1000, // minimum time between two camera shots
    _nCameraNextShotTime: 1000, // last time the camera took a photo
    _aLastShotStats: null,

	_aCapturedSubjects: null,  // list of all gathered evidences
    _aCapturedGhosts: null,

	_nTime: 0,
	_nChronoSeconds: 0,
	_nAutoSpawnDelayBetweenGhosts: 10,
	_nAutoSpawnMaxLevel: 1,
	_bClearAutoSpawn: false,

	_nScore: 0,

	_aAlbum: null,

	_oEffectProcessor: null,
	_oPlayerEntity: null,  // An object containing all stats
		// we can apply effects on it.
	_oNotes: null,

	/**
	 * Game time transmission
	 * for timed event
	 * @param t {int} elapsed time in millisecond
	 */
	setTime: function(t) {
		this._nTime = t;
		// Periodic events
		if (t >= this._nChronoSeconds) {
            this._nChronoSeconds += (1 + (t - this._nChronoSeconds) / 1000 | 0) * 1000;
            this.processEffects();
		}
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
	 * damage formula :
	 * damage = e * (1 - a / ca) * (1 - d / cd)
	 * a : angle between ghost and target point
	 * ca : capture circle angle
	 * d : distance between camera and ghost
	 * cd : maximum distance 
	 * e : stored energy (from 0 to 1000)
	 * (a full energy got bonus * 1.5)
	 */
	cameraShoot: function() {
		this._bCameraFlash = true;
		this._nCameraNextShotTime = this._nTime + this._nCameraIntervalTime;
		var fEnergy = this._nCameraEnergy;
		var bFullEnergy = fEnergy == this._nCameraMaxEnergy;
		if (bFullEnergy) {
			fEnergy = fEnergy * this._fCameraFullEnergyBonus | 0;
		}
		var nTotalScore = 0;
		var nTotalShots = 0;
		var aTags = [];
		var aSubjects;
		if (this._aCameraSubjects) {
			aSubjects = this._aCameraSubjects.map(function(s) {
				nTotalScore += s.score * MANSION.CONST.SCORE_PER_RANK;
				return s.ref;
			});
			this._aCameraSubjects = [];
		}
		this._aCapturedGhosts.forEach((function(g) {
			var fDistance = g[2];
			var fAngle = g[1];
			var oGhost = g[0];
			switch (oGhost.data('subtype')) {
				case 'ghost':
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
						this.playerDamagesGhost(oGhost, e, bFullEnergy);
						nTotalScore += e;
						++nTotalShots;
					}
					break;

				case 'wraith':
					nTotalScore += oGhost.data('rank') * MANSION.CONST.SCORE_PER_RANK;
					oGhost.getThinker().vanish();
					break;
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
		this._nScore += nTotalScore;
		this._aLastShotStats = {
			score: nTotalScore,
			shots: aTags,
			subjects: aSubjects
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
	 * Given angle and distance, returns the energy multiplicator
	 * 
	 * energy = (1 - angle / captureAngle) * (1 - distance / captureDistance)
	 *
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
		return fEnergy * fEnergy;
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
			var sSubType;
			for (var i = 0, l = aMobs.length; i < l; ++i) {
				mi = aMobs[i];
				oGhost = mi[0];
				if (!oGhost.data('dead')) {
					fAngle = mi[1];
					fDistance = mi[2];
					fEnergy = this.getEnergyDissipation(fAngle, fDistance);
					if (fEnergy > 0) {
						if (oGhost.data('subtype') === 'wraith') {
							fEnergy = 0;
						}
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
	 * A photo of the specified subject is taken
	 * @param id {string} subject identifier
	 * @param nScore {integer} reward value
	 * @param oPhotoCanvas {HTML5CanvasElement} photo content
	 * @param nType {integer} painting = 1, wraith = 2, clue = 3
	 */
	setPhotoSubject: function(id, nScore, oPhotoCanvas, nType) {
		if (!this._aCameraSubjects) {
			this._aCameraSubjects = [];
		}
		if (!this._aTakenSubjects) {
			this._aTakenSubjects = [];
		}
		this._aCameraSubjects.push({
			ref: id,
			score: nScore
		});
		this._aTakenSubjects.push(id);
		// post the photo in the album
		if (!this._aAlbum) {
			this._aAlbum = [];
		}
		this._aAlbum.push({
			ref: id,
			score: nScore,
			data: oPhotoCanvas.toDataURL(),
			type: nType,
			date: Date.now()
		});
	},

	/**
	 * retrevie all the photo in the album
	 * the album has this format :
	 * [{
	 * 		// photo 0
	 * 		ref: reference,
	 * 		score: value
	 * 		data: image content, base 64
	 * }, {
	 * 		// photo 1
	 * 		// ...
	 * ]
	 */
	getAlbum: function() {
		return this._aAlbum;
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


    /**
	 * Returns all gathered notes
     */
	getNotes: function() {
		if (this._oNotes === null) {
            this._oNotes = JSON.parse(JSON.stringify(MANSION.NOTES));
            for (var n in this._oNotes) {
                this.setNoteFlag(n, 'read', false);
                this.setNoteFlag(n, 'found', false);
            }
		}
		return this._oNotes;
	},

	getFoundNoteList: function() {
		return Object.keys(
			this.getNotes()
		).filter(n => this.getNoteFlag(n, 'found'));
	},

    setNoteFlag: function(sNote, sFlag, xValue) {
        this.getNotes()[sNote][0][sFlag] = xValue;
    },

    getNoteFlag: function(sNote, sFlag) {
        return this.getNotes()[sNote][0][sFlag];
    },


    /*******************************************
	 * PLAYER ENTITY
     *******************************************/

    /**
	 * XXX 1) Lancer les Initialiser de Player, EffectProcessor
	 * 2) Différencier Ghost et Player dans l'attribute change
	 * 3) Ajouter ghostDamagesPlayer()
	 * 4) Vérifier le thinker du player pour voir si ca coince ou pas
     */



    /**
	 * Process all temporary effects
     */
    processEffects: function() {
    	this._oEffectProcessor.processEffects();
	},

    /**
	 * An entity inflict damage to another entity
     * @param oEntity {ADV.Creature} entity being damaged
     * @param nAmount {int}
	 * @param oDamager {ADV.Creature} entity who did damage
     */
    damageEntity: function(oEntity, nAmount, oDamager) {
        var eDamage = new Effect.Damage();
        eDamage.setLevel(nAmount);
        eDamage.setSource(oDamager);
        eDamage.setTarget(oEntity);
        eDamage.setDuration(0);
        this._oEffectProcessor.applyEffect(eDamage);
    },

    /**
     * The player has damaged a ghost
     * @param oGhost {O876_Raycaster.Mobile} entity being damaged
     * @param nAmount {int}
     * @param bCritical
     */
    playerDamagesGhost: function(oGhost, nAmount, bCritical) {
        oGhost.getThinker().damage(bCritical);
    	this.damageEntity(oGhost.data('soul'), nAmount, this.getPlayerSoul());
    },

    /**
	 * The player is being damaged by a ghost
     * @param oGhost {O876_Raycaster.Mobile} entity damaging the player
     * @param nAmount {int}
     */
    ghostDamagesPlayer: function(oGhost, nAmount) {
        this.damageEntity(this.getPlayerSoul(), nAmount, oGhost.data('soul'));
    },

    createSoul: function(oMobile) {
    	var nHP = oMobile.data('life') | 0;
        var p = new ADV.Creature();
        var oBase = {
            vitality: 		nHP,
            hp:				nHP,
            power:			0,
            resistance:		0,
            speed:			0,
			sight:			0,
        };
        for (var sAttr in oBase) {
        	p.setAttribute(sAttr, oBase[sAttr]);
		}
        oMobile.data('soul', p);
        p.data('mobile', oMobile);
        p.on('attributechanged', this.attributeChanged.bind(this));
        return p;
    },

	initEffectProcessor: function() {
    	var ep = new ADV.EffectProcessor();
    	this._oEffectProcessor = ep;
	},

	attributeChanged: function(sAttribute, nValue, nPrev, oSoul) {
		var oMobile = oSoul.data('mobile');
		var bPlayer = oMobile.getType() === RC.OBJECT_TYPE_PLAYER;
		switch (sAttribute) {
			case 'hp':
				if (nValue <= 0) {
                    oMobile.getThinker().die();
				}
				break;

			case 'speed':
				oMobile.setSpeed(oMobile.data('speed') * ((100 + nValue) / 100));
				break;

			case 'sight':
				// deux effets GXAmbientLight en même temps... ça le fait pas
				if (bPlayer) {
					// eliminer un ancien GX
					oMobile.oRaycaster.oEffects.getEffects().filter(function (e) {
							return e.sClass === 'AmbientLight';
						}).forEach(function(e) {
							e.terminate();
						});
                    oMobile.oRaycaster
                        .addGXEffect(O876_Raycaster.GXAmbientLight)
                        .setLight(Math.max(10, MANSION.CONST.AMBIENT_LIGHT_NORMAL + nValue), 1500);
                }
                break;
		}
	},

	initPlayerSoul: function(oPlayer) {
        var p = this.createSoul(oPlayer);
        this._oPlayerEntity = p;
    },

	getPlayerSoul: function() {
		return this._oPlayerEntity;
	},

    /**
	 *
     * @returns {ADV.EffectProcessor}
     */
	getEffectProcessor: function() {
        return this._oEffectProcessor;
	}



});
