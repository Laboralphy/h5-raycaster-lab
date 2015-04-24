O2.extendClass('PlayerKeyboardThinker', O876_Raycaster.MouseKeyboardThinker, {
	nDeadTime : 0,
	nRotationTime : 0,
	nRotationMask : 0,
	nRotationLeftTime : 0,
	nRotationRightTime : 0,

	ROTATION_MASK_LEFT : 0,
	ROTATION_MASK_RIGHT : 1,
	ROTATION_MASK_FORWARD : 2,
	ROTATION_MASK_BACKWARD : 3,

	oDeathVeil : null,
	oCreature: null,
	
	// Physics
	oPulse: null,       // Vecteur des forces extérieures influençant le mouvement
	
	nChargeStartTime: 0,  // Temps à partir duquel on maintient le tir appuyé

	bActive : true, // Flag d'activité, à FLAG le Thinker ne lit plus le clavier
	
	__construct : function() {
		this.oPulse = {
			x: 0,
			y: 0
		};
	},
	
	/** Calcule les effets à appliquer (tous les 32 tours)
	 */
	processEffects: function() {
		if (this.isDead()) {
			this.think = this.thinkDie;
		}
		if (this.oGame.bNewSecond) {
			this.oCreature.processEffects();
		}
		this.pulse();
	},
	
	pulse: function() {
		// traitement du pulse
		var xPulse = this.oPulse.x;
		var yPulse = this.oPulse.y;
		if (xPulse || yPulse) {
			this.oMobile.slide(xPulse | 0, yPulse | 0);
			this.oPulse.x /= 1.33;
			this.oPulse.y /= 1.33;
			if (Math.abs(this.oPulse.x) < 1) {
				this.oPulse.x = 0;
			}
			if (Math.abs(this.oPulse.y) < 1) {
				this.oPulse.y = 0;
			}
		}
	},

	readMouseMovement: function(x, y) {
		this.oMobile.rotate(x / 133);
	},
	
	
	move: function(nType) {
		if (nType === undefined) {
			nType = 0;
		}
		
		// Checking mov
		var g = this.oGame;
		this.oMobile.fSpeed = g.TIME_FACTOR * g.oDungeon.getCreatureMoveSpeed(this.oCreature) / 1000; 
		
		
		switch (nType) {
			case 0:
				this.oMobile.moveForward();
				break;
				
			case 1:
				this.oMobile.strafeLeft();
				break;
				
			case 2:
				this.oMobile.strafeRight();
				break;
				
			case 3:
				this.oMobile.moveBackward();
				break;
		}
	},
	
	checkCollision : function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.getType() != RC.OBJECT_TYPE_MISSILE) {
				this.oMobile.rollbackXY();
			}
		}
	},

	forwardCommand : function() {
		this.processRotationSpeed();
		this.move();
		this.checkCollision();
	},

	leftCommand : function() {
		this.processRotationSpeed();
		if (this.bStrafe) {
			this.move(1);
			this.checkCollision();
		} else {
			this.oMobile.rotateLeft();
		}
	},

	rightCommand : function() {
		this.processRotationSpeed();
		if (this.bStrafe) {
			this.move(2);
			this.checkCollision();
		} else {
			this.oMobile.rotateRight();
		}
	},

	strafeDown : function() {
		this.bStrafe = true;
	},

	strafeUp : function() {
		this.bStrafe = false;
	},

	backwardCommand : function() {
		this.move(3);
		this.checkCollision();
	},
	
	wheelDown: function() {
		this.oGame.gc_equipWeapon(this.oMobile, true);
	},

	wheelUp: function() {
		this.oGame.gc_equipWeapon(this.oMobile, false);
	},

	useDown : function() {
		// activation de mur, ouverture de porte
		this.oGame.gc_activateWall(this.oMobile);
		// rammassage d'objet au sol
		this.oGame.gc_pickup(this.oMobile);		
	},

	think : function() {
		this.oCreature = this.oMobile.getData('creature');
		this.think = this.thinkAlive;
	},

	thinkAlive : function() {
		this.oMobile.xSpeed = 0;
		this.oMobile.ySpeed = 0;
		if (this.bActive && !this.isHeld()) {
			this.updateKeys();
		}
		this.processEffects();
	},


	/** 
	 * Renvoie true si la créature est paralysée
	 */
	isHeld: function() {
		return this.oCreature.getAttribute('held') > 0;
	},
	
	/**
	 * Renvoie true si la creature est morte
	 */
	isDead: function() {
		return this.oCreature.getAttribute('dead') > 0;
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

	forwardDown : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},

	backwardDown : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},

	leftDown : function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
	},

	rightDown : function() {
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
	
	
	
	
	/// FPS COBNRTOLS
	
	forward_fCommand: function() {
		this.move();
		this.checkCollision();
	},
	
	backward_fCommand: function() {
		this.move(3);
		this.checkCollision();
	},
	 
	strafeleft_fCommand: function() {
		this.move(1);
		this.checkCollision();
	},
	
	straferight_fCommand: function() {
		this.move(2);
		this.checkCollision();
	},
	
	button0Down: function() {
		if (this.bActive) {
			this.nChargeStartTime = this.oGame.nTimeMs;
			this.oGame.gc_attack(this.oMobile, 0);
		}
	},
	
	button0Up: function() {
		if (this.bActive) {
			this.oGame.gc_attack(this.oMobile, this.oGame.nTimeMs - this.nChargeStartTime);
		}
	},
	
	button2Down: function() {
		if (this.bActive) {
			this.oGame.sendPluginSignal('key', KEYS.MOUSE.BUTTONS.RIGHT);
		}
	},
	
	button2Up: function() {
		if (this.bActive) {
			this.oGame.sendPluginSignal('key', -KEYS.MOUSE.BUTTONS.RIGHT);
		}
	},
	
	fireDown : function() {
		this.nChargeStartTime = this.oGame.nTimeMs;
		this.oGame.gc_attack(this.oMobile, 0);
	},
	
	// Charge terminée
	fireUp: function() {
		this.oGame.gc_attack(this.oMobile, this.oGame.nTimeMs - this.nChargeStartTime);
	},
	

	
	
	

	processRotationSpeed : function() {
		if (this.nRotationMask !== 0) {
			this.nRotationTime++;
			switch (this.nRotationTime) {
				case 1:
					this.oMobile.fRotSpeed = this.oGame.TIME_FACTOR * 0.0005;
					break;
	
				case 4:
					this.oMobile.fRotSpeed = this.oGame.TIME_FACTOR * 0.001;
					break;
	
				case 8:
					this.oMobile.fRotSpeed = this.oGame.TIME_FACTOR * 0.002;
					break;
			}
		}
	},

	die: function() {
		this.think = this.thinkDie;
	},
	
	revive : function() {
		this.think = this.thinkAlive;
		this.oMobile.bEthereal = false;
		if (this.oDeathVeil) {
			this.oDeathVeil.terminate();
			this.oDeathVeil = null;
		}
	},
	
	thinkDie : function() {
		this.oMobile.xSpeed = 0;
		this.oMobile.ySpeed = 0;
		this.oMobile.bEthereal = true;
		this.think = this.thinkDying;
		this.nDeadTime = 18;
		var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
		oFadeOut.oColor = {
			r : 128,
			g : 0,
			b : 0
		};
		oFadeOut.fAlpha = 0;
		oFadeOut.fAlphaFade = 0.05;
		this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
	},
	
	thinkDying : function() {
		this.nDeadTime--;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkDead;
			this.nDeadTime = 40;
			var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
			oFadeOut.oColor = {
				r : 128,
				g : 0,
				b : 0
			};
			oFadeOut.fAlpha = 0.95;
			oFadeOut.fAlphaFade = 0;
			this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
			this.oDeathVeil = oFadeOut;
		}
	},
	
	thinkDead : function() {
		this.nDeadTime--;
		if (this.nDeadTime <= 0) {
			this.oGame.gc_respawnRequest(this.oMobile);
			this.think = this.thinkWaitForRespawn;
		}
	},
	
	thinkWaitForRespawn : function() {
	},
	
	/** Frappé par un missile: 
	 * Cette méthode permet de personnaliser le comportement à adopter
	 * en fonction de cet évènement.
	 */
	_hitByMissile: function(oMissile) {
	}
});
