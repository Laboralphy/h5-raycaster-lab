O2.extendClass('O876_Raycaster.CameraKeyboardThinker', O876_Raycaster.KeyboardThinker,
{
	nRotationTime : 0,
	nRotationMask : 0,
	nRotationLeftTime : 0,
	nRotationRightTime : 0,
	
	fRotationSpeed: 0.1,

	ROTATION_MASK_LEFT : 0,
	ROTATION_MASK_RIGHT : 1,
	ROTATION_MASK_FORWARD : 2,
	ROTATION_MASK_BACKWARD : 3,

	__construct : function() {
		this.defineKeys( {
			forward : KEYS.UP,
			backward : KEYS.DOWN,
			left : KEYS.LEFT,
			right : KEYS.RIGHT,
			use : KEYS.SPACE,
			strafe : KEYS.ALPHANUM.C
		});
	},

	setRotationMask : function(nBit, bValue) {
		var nMask = 1 << nBit;
		var nNotMask = 255 ^ nMask;
		if (bValue) {
			this.nRotationMask |= nMask;
		} else {
			this.nRotationMask &= nNotMask;
			if (this.nRotationMask === 0) {
				this.nRotationTime = 0;
			}
		}
	},

	think: function() {
		this.updateKeys();
	},

	checkCollision: function() {
	  if (this.oMobile.oMobileCollision !== null) {
	    var oTarget = this.oMobile.oMobileCollision;
	    if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
	      this.oMobile.rollbackXY();
	    }
	  }
	},

	forwardCommand: function() {
		this.processRotationSpeed();
		this.oMobile.moveForward();
		this.checkCollision();
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},

	leftCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
		if (this.bStrafe) {
			this.oMobile.strafeLeft();
			this.checkCollision();
		} else {
			this.oMobile.rotateLeft();
		}
	},

	rightCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
		if (this.bStrafe) {
			this.oMobile.strafeRight();
			this.checkCollision();
		} else {
			this.oMobile.rotateRight();
		}
	},

	strafeDown: function() {
		this.bStrafe = true;
	},

	strafeUp: function() {
		this.bStrafe = false;
	},

	backwardCommand: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
		this.oMobile.moveBackward();
		this.checkCollision();
	},




	forwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	backwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	leftDown: function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
	},
	
	rightDown: function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
	},

	forwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	backwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	leftUp : function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, false);
	},

	rightUp : function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, false);
	},

	processRotationSpeed : function() {
		if (this.nRotationMask !== 0) {
			this.nRotationTime++;
			switch (this.nRotationTime) {
			case 1:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 4;
				break;

			case 4:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 2;
				break;

			case 8:
				this.oMobile.fRotSpeed = this.fRotationSpeed;
				break;
			}
		}
	}
});
