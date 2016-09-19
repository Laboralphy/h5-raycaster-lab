/**
 * This thinker uses DeviceMotion event to control the player point of view
 */
O2.extendClass('O876_Raycaster.MotionThinker', O876_Raycaster.Thinker,
{
	
	oMotionDevice: null,
	
	__construct : function() {
		var md = new O876_Raycaster.MotionDevice();
		var nMin = 2;
		var nMax = 4;
		md.getAngleRange('alpha', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('alpha', 1).setRange(nMin, nMax, false);
		md.getAngleRange('beta', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('beta', 1).setRange(nMin, nMax, false);
		md.getAngleRange('gamma', 0).setRange(-nMin, -nMax, true);
		md.getAngleRange('gamma', 1).setRange(nMin, nMax, false);
		md.plugEvents();
		this.oMotionDevice = md;
	},

	think: function() {
		var alpha = this.oMotionDevice.getAngleValue('alpha');
		var beta = this.oMotionDevice.getAngleValue('beta');
		var gamma = this.oMotionDevice.getAngleValue('gamma');
		if (gamma < 0) {
			// backward
			this.oMobile.fSpeed = Math.abs(gamma) * 4;
			this.oMobile.moveBackward();
			this.checkCollision();
		} else if (gamma > 0) {
			// forward
			this.oMobile.fSpeed = Math.abs(gamma) * 4;
			this.oMobile.moveForward();
			this.checkCollision();
		}
		if (beta != 0) {
			if (Math.abs(beta) < 0.5) {
				this.oMobile.fSpeed = Math.abs(beta) * 4;
				if (beta < 0) {
					this.oMobile.strafeLeft();
					this.checkCollision();
				} else {
					this.oMobile.strafeRight();
					this.checkCollision();
				}
			} else {
				this.oMobile.rotate(beta / 10);
			}
		}
	},

	checkCollision: function() {
		if (this.oMobile.oWallCollision.x || this.oMobile.oWallCollision.y) {
			var fc = this.oMobile.getFrontCellXY();
			this.oGame.openDoor(fc.x, fc.y);
		}
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	}
});


O2.mixin(O876_Raycaster.MotionThinker, O876.Mixin.Events);
