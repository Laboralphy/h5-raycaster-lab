O2.extendClass('O876_Raycaster.CameraMouseKeyboardThinker', O876_Raycaster.MouseKeyboardThinker,
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
			forward : KEYS.ALPHANUM.Z,
			forward2 : KEYS.ALPHANUM.W,
			backward : KEYS.ALPHANUM.S,
			left : KEYS.ALPHANUM.Q,
			left2 : KEYS.ALPHANUM.A,
			right : KEYS.ALPHANUM.D,
			use : KEYS.SPACE
		});
	},

	readMouseMovement: function(x, y) {
		this.oMobile.rotate(x / 166);
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
		this.oMobile.moveForward();
		this.checkCollision();
	},

	leftCommand: function() {
		this.oMobile.strafeLeft();
		this.checkCollision();
	},

	forward2Command: function() {
		this.oMobile.moveForward();
		this.checkCollision();
	},

	left2Command: function() {
		this.oMobile.strafeLeft();
		this.checkCollision();
	},

	rightCommand: function() {
		this.oMobile.strafeRight();
		this.checkCollision();
	},

	backwardCommand: function() {
		this.oMobile.moveBackward();
		this.checkCollision();
	}
});
