/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile.
 * Permet de tester rapidement la mobilité d'un mobile
 */
O2.extendClass('O876_Raycaster.KbdArrowThinker', O876_Raycaster.KeyboardThinker, {
	
	__construct: function() {
		this.defineKeys( {
			forward : KEYS.UP,
			backward : KEYS.DOWN,
			left : KEYS.LEFT,
			right : KEYS.RIGHT
		});
		
	},
	
	think: function() {
		this.oMobile.fSpeed = 4;
		this.oMobile.fRotSpeed = 0.1;
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

	forwardDown: function() {
		this.oMobile.oSprite.playAnimationType(1);
	},

	forwardUp: function() {
		this.oMobile.oSprite.playAnimationType(0);
	},
	
	forwardCommand: function() {
		this.oMobile.moveForward();
		this.checkCollision();
	},

	leftCommand: function() {
		this.oMobile.rotateLeft();
	},

	rightCommand: function() {
		this.oMobile.rotateRight();
	},

	backwardCommand: function() {
		this.oMobile.moveBackward();
		this.checkCollision();
	},
	
});

