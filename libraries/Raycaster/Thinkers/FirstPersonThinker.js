O2.extendClass('O876_Raycaster.FirstPersonThinker', O876_Raycaster.MouseKeyboardThinker,
{
	nMouseSensitivity: 166,

	__construct : function() {
		this.defineKeys( {
			forward : [KEYS.ALPHANUM.Z, KEYS.ALPHANUM.W],
			backward : KEYS.ALPHANUM.S,
			left : [KEYS.ALPHANUM.Q, KEYS.ALPHANUM.A],
			right : KEYS.ALPHANUM.D,
			use : KEYS.SPACE
		});
		this.on('forward.command', (function() {
			this.oMobile.moveForward();
			this.checkCollision();
		}).bind(this));
		this.on('left.command', (function() {
			this.oMobile.strafeLeft();
			this.checkCollision();
		}).bind(this));
		this.on('right.command', (function() {
			this.oMobile.strafeRight();
			this.checkCollision();
		}).bind(this));
		this.on('backward.command', (function() {
			this.oMobile.moveBackward();
			this.checkCollision();
		}).bind(this));
	},

	readMouseMovement: function(x, y) {
		this.oMobile.rotate(x / this.nMouseSensitivity);
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
	}
});
