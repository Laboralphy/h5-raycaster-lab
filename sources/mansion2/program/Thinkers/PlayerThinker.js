O2.extendClass('MANSION.PlayerThinker', O876_Raycaster.FirstPersonThinker, {
	
	oEasingAngle: null,
	
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
		e.setFunction('cubeDeccel');
		if (fTurn > PI) {
			e.setMove(fMe, fMe + fTurn, 6);
		} else {
			e.setMove(fMe, fMe - fTurn, 6);
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
	 * Un fantome menace.
	 * Tourner l'angle de vue vers le fantome
	 */
	ghostThreat: function(oGhost) {
		var oMe = this.oMobile;
		var fAngle = this.computeAngleToMobile(oGhost);
		this.forceAngle(fAngle);
	},
	
	processAngle: function() {
		var bLastMove = this.oEasingAngle.move();
		this.oMobile.setAngle(this.oEasingAngle.x);
		if (bLastMove) {
			this.oEasingAngle = null;
		}
	},
	
	processGameLogic: function() {
		var gl = this.oGame.oLogic;
		if (this.oGame.oPhone.isActive('Camera')) {
			var aMobs = this.getVisibleMobiles();
			gl.setVisibleMobiles(aMobs);
			if (gl.isCameraBuzzing()) {
				this.oGame.oPhone.getCurrentApplication().charge();
				this.oGame.playSound(SOUNDS_DATA.events.charge);
			}
			if (gl.hasCameraReachedFullCharge()) {
				this.oGame.oPhone.getCurrentApplication().charge();
				this.oGame.playSound(SOUNDS_DATA.events.fullcharge);
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
});
