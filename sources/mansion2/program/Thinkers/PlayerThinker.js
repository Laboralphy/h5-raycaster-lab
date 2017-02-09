O2.extendClass('MANSION.PlayerThinker', O876_Raycaster.FirstPersonThinker, {
	
	oEasingAngle: null,
	oBresenham: null,

	__construct: function() {
		__inherited();
		this.oBresenham = new O876.Bresenham();
	},
	
	damage: function(oAggressor) {
	},
	
	forceAngle: function(fTarget) {
		var m = this.oMobile;
		var fMe = m.getAngle();
		while (fTarget < 0) {
			fTarget += 2 * PI;
			fMe += 2 * PI;
		}
		var fTurn = fMe - fTarget;
		var e = new O876.Easing();
		e.use('cubeDeccel');
		if (fTurn > PI) {
			e.from(fMe).to(fMe + fTurn).during(6);
		} else {
			e.from(fMe).to(fMe - fTurn).during(6);
		}
		this.oEasingAngle = e;
	},
	
	/**
	 * Compute the angle between The Mobile Heading and another Mobile
	 */
	computeAngleToMobile: function(t) {
		var oMe = this.oMobile;
		return Math.atan2(t.y - oMe.y, t.x - oMe.x);
	},
	
	sortMobilesByDistance: function(A, B) {
		return A[2] - B[2];
	},
	
	/**
	 * Check all visible mobiles (TYPE_MOB and TYPE_MISSILES)
	 * For each object, compute angle and distance
	 */
	getVisibleMobiles: function() {
		// get present ghosts
		var vm = this.oGame.oRaycaster.aVisibleMobiles;
		if (vm === null) {
			return null;
		}
		var x, y;
		var m = this.oMobile;
		var xMe = m.x, yMe = m.y;
		var aMobiles = [], fAngle, fDist, fMyAngle = m.getAngle();
		var sLogType, nType;
		var pi2 = 2 * PI;
		for (var i = 0, l = vm.length; i < l; ++i) {
			m = vm[i];
			nType = m.getType();
			if (nType === RC.OBJECT_TYPE_MOB || nType === RC.OBJECT_TYPE_MISSILE) {
				fAngle = this.computeAngleToMobile(m) - fMyAngle;
				if (fAngle < -PI) {
					fAngle += 2 * PI;
				}
				if (fAngle > PI) {
					fAngle -= 2 * PI;
				}
				fDist = MathTools.distance(xMe - m.x, yMe - m.y);
				aMobiles.push([m, Math.abs(fAngle), fDist]);
			}
		}
		if (aMobiles.length > 1) {
			aMobiles.sort(this.sortMobilesByDistance);
		}
		return aMobiles;
	},



	/** 
	 * Renvoie le block non-walkable qui se trouve a distance d'objectif
	 * Les block walkable ne comptent pas.
	 */
	getFrontBlock: function() {
		var fDist = 2.5 * this.oGame.oRaycaster.nPlaneSpacing;
		var m = this.oMobile;
		var fTheta = m.fTheta;
		var xOri = m.x;
		var yOri = m.y;
		var xFin = fDist * Math.cos(fTheta) + xOri;
		var yFin = fDist * Math.sin(fTheta) + yOri;
		var b = this.oBresenham;
		var res = {x: null, y: null};
		b.line(xOri, yOri, xFin, yFin, (function(x, y, n) {
			if ((n & 3) == 0) {
				var rc = this.oGame.oRaycaster;
				var ps = rc.nPlaneSpacing;
				var b = rc.getMapPhys(x / ps | 0, y / ps | 0) === rc.PHYS_NONE;
				if (b) {
					return true;
				} else {
					res.x = x / ps | 0;
					res.y = y / ps | 0;
					return false;
				}
			} else {
				return true;
			}
		}).bind(this));
		return res;
	},

	/**
	 * Un fantome menace.
	 * Tourner l'angle de vue vers le fantome
	 */
	ghostThreat: function(oGhost) {
		var oMe = this.oMobile;
		var fAngle = this.computeAngleToMobile(oGhost);
		this.forceAngle(fAngle);
	},
	
	processAngle: function() {
		var bLastMove = this.oEasingAngle.next().over();
		this.oMobile.setAngle(this.oEasingAngle.val());
		if (bLastMove) {
			this.oEasingAngle = null;
		}
	},
	
	processGameLogic: function() {
		var gl = this.oGame.oLogic;
		if (this.oGame.isCameraActive()) {
			var aMobs = this.getVisibleMobiles();
			gl.setVisibleMobiles(aMobs);
			if (gl.isCameraBuzzing()) {
				this.oGame.oCamera.charge();
				this.oGame.playSound(MANSION.SOUNDS_DATA.events.charge);
			}
			if (gl.hasCameraReachedFullCharge()) {
				this.oGame.oCamera.charge();
				this.oGame.playSound(MANSION.SOUNDS_DATA.events.fullcharge);
			}
		}
	},
	
	think: function() {
		if (this.oEasingAngle) {
			this.processAngle();
		}
		this.processGameLogic();
		__inherited();
	},
	
	readMouseMovement: function(x, y) {
		if (this.oEasingAngle === null) {
			__inherited(x, y);
		}
	},


	die: function() {
		this.think = this.thinkDie;
	},

	_oDeathEasing: null,
    thinkDie: function() {
        this.oMobile.data('dead', true);
        this.oGame.trigger('death');
        this._oDeathEasing = new O876.Easing();
        this._oDeathEasing.from(1).to(1.7).during(30).use('squareAccel');
        this.think = this.thinkDieFall;
    },

    thinkDieFall: function() {
        var bOver = this._oDeathEasing.next().over();
        this.oGame.oRaycaster.fViewHeight = this._oDeathEasing.val();
        if (bOver) {
            this.think = this.thinkDead;
        }
    },

    thinkDead: function() {
    },
});
