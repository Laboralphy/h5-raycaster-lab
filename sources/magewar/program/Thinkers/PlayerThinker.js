/**
 * Thinker du personnage controlé par le joueur
 */

O2.extendClass('MW.PlayerThinker', O876_Raycaster.MouseKeyboardThinker, {
	
	VEIL_NONE: 0,
	VEIL_SNARE: 1,
	VEIL_ROOT: 2,
	VEIL_HOLD: 3,
	VEIL_REFLECT: 4,
	VEIL_CLOACKED: 5,
	VEIL_BLIND: 6,
	VEIL_VAMPYRE: 7,
	VEIL_POWER: 8,
	VEIL_WEAKNESS: 9,
	VEIL_MAGNET: 10,
	VEIL_DEFENSE: 11,
	
	fLastMovingAngle: 0,
	fLastMovingSpeed: 0,
	fLastTheta: 0,
	nLastUpdateTime: 0,
	xLast: 0,
	yLast: 0,

	fNormalSpeed: 0,
	nDeadTime: 0,
	nChargeStartTime: 0,
	nChargeTime: 0,
	oDeathVeil: null,
	oEffectVeil: null,
	oConfuseVeil: null,
	oBlindVeil: null,
	sKillerInfo: null, // information sur le mec qui nous a tué (son pseudo)
		
	oAttributes: null,
	
	bActive: true,
	
	__construct : function() {
		this.oAttributes = {};
		for (var sAttr in MW.ATTRIBUTES_DATA) {
			this.oAttributes[sAttr] = 0;
		}
		this.defineKeys( {
			forward : [KEYS.ALPHANUM.Z, KEYS.ALPHANUM.W],
			backward : KEYS.ALPHANUM.S,
			left : [KEYS.ALPHANUM.Q, KEYS.ALPHANUM.A],
			right : [KEYS.ALPHANUM.D, KEYS.ALPHANUM.E],
			use : KEYS.SPACE
		});
		this.think = this.thinkAlive;
		this.on('button0.up', this.button0Up.bind(this));
		this.on('button0.down', this.button0Down.bind(this));
		this.on('button0.command', this.button0Command.bind(this));
		this.on('button2.down', this.button2Down.bind(this));
		this.on('use.down', this.useDown.bind(this));
		this.on('wheel.up', this.wheelUp.bind(this));
		this.on('wheel.down', this.wheelDown.bind(this));
	},

	
	/**
	 * Exprime les différents effet appliqués au mobile
	 * ordre de priorité
	 * 1: hold : paralysie complete
	 * 2: root : déplacement nul
	 * 3: snare : déplacement ralenti
	 */
	setupEffect: function(sAttribute, nValue) {
		if (sAttribute) {
			this.oAttributes[sAttribute] = nValue;
		}
		// SNARE & HASTE
		var nVeil = 0;
		var nSpeedModifier = this.oAttributes['speed'] | 0;
		var fSpeed = this.fNormalSpeed * Math.max(0, 1 + nSpeedModifier / 100);
		if (nSpeedModifier < 0) {
			nVeil = this.VEIL_SNARE;
		}
		// BLIND
		if (this.oAttributes['blind'] > 0) {
			if (this.oBlindVeil === null) {
				this.oBlindVeil = this.oGame.oRaycaster.oEffects.addEffect(new MW.GXBlind(this.oGame.oRaycaster));
			}
		} else {
			if (this.oBlindVeil !== null) {
				this.oBlindVeil.terminate();
				this.oBlindVeil = null;
			}
		}

		// CONFUSED
		if (this.oAttributes['confused'] > 0) {
			if (this.oConfuseVeil === null) {
				this.oConfuseVeil = this.oGame.oRaycaster.oEffects.addEffect(new MW.GXConfused(this.oGame.oRaycaster));
			}
		} else {
			if (this.oConfuseVeil !== null) {
				this.oConfuseVeil.terminate();
				this.oConfuseVeil = null;
			}
		}
		
		// DEFENSE
		if (this.oAttributes['defense'] > 0 || this.oAttributes['immortal'] > 0) {
			nVeil = this.VEIL_DEFENSE;
		} else if (this.oAttributes['defense'] < 0) {
			nVeil = this.VEIL_WEAKNESS;
		}
		
		
		// REFLECT
		if (this.oAttributes['reflect'] > 0) {
			nVeil = this.VEIL_REFLECT;
		}
		
		// INVISIBLE
		if (this.oAttributes['invisible'] > 0) {
			nVeil = this.VEIL_CLOAKED;
		}
		
		// VAMPYRE
		if (this.oAttributes['vampyre'] > 0) {
			nVeil = this.VEIL_VAMPYRE;
		}
		
		// POWER
		if (this.oAttributes['power'] > 0) {
			nVeil = this.VEIL_POWER;
		} else if (this.oAttributes['power'] < 0) {
			nVeil = this.VEIL_WEAKNESS;
		}
		
		// MAGNET
		if (this.oAttributes['magnet'] > 0) {
			nVeil = this.VEIL_MAGNET;
		}
		
		// ROOT
		if (this.oAttributes['root'] > 0) {
			fSpeed = 0;
			nVeil = this.VEIL_ROOT;
		}

		// HOLD
		if (this.oAttributes['hold'] > 0) {
			fSpeed = 0;
			nVeil = this.VEIL_HOLD;
		}
		
		this.oMobile.fSpeed = fSpeed;
		this.setupVeil(nVeil);
	},
	
	setupVeil: function(nEffect) {
		var r = this.oGame.oRaycaster;
		if (this.oEffectVeil !== null) {
			this.oEffectVeil.terminate();
			this.oEffectVeil = null;
		}
		switch (nEffect) {
			case this.VEIL_HOLD:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupHold();
				break;

			case this.VEIL_SNARE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupSnare();
				break;

			case this.VEIL_ROOT:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupRoot();
				break;
				
			case this.VEIL_BLIND:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXBlind(r));
				break;

			case this.VEIL_REFLECT:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupReflect();
				break;

			case this.VEIL_CLOAKED:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupInvisible();
				break;

			case this.VEIL_VAMPYRE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupVampyre();
				break;

			case this.VEIL_POWER:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupPower();
				break;

			case this.VEIL_WEAKNESS:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupWeakness();
				break;

			case this.VEIL_MAGNET:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupMagnet();
				break;

			case this.VEIL_DEFENSE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupDefense();
				break;
		}
	},

	readMouseMovement: function(x, y) {
		if (this.isFree()) {
			this.oMobile.rotate(x / 166);
		}
	},
	
	/**
	 * Retransmet les mouvements au Game
	 * Pour qu'il les renvoie au serveur
	 */
	transmitMovement: function() {
		var bUpdate = false;
		var m = this.oMobile;
		// angle de caméra
		var f = m.fTheta;
		// position
		var x = m.x;
		var y = m.y;
		// vitesse
		var fms = m.fMovingSpeed;
		var fma = m.fMovingAngle;
		var nLUD = this.oGame.getTime() - this.nLastUpdateTime;
		if (nLUD > 500) {
			if (x != this.xLast || y != this.yLast) {
				this.xLast = x;
				this.yLast = y;
				bUpdate = true;
			}
		}
		if (bUpdate || this.fLastMovingSpeed != fms || this.fLastMovingAngle != fma || this.fLastTheta != f) {
			this.fLastMovingSpeed = fms;
			this.fLastMovingAngle = fma;
			this.fLastTheta = f;
			bUpdate = true;
		}
		if (bUpdate) {
			this.oGame.gm_movement(f, x, y, fma, fms);
			this.nLastUpdateTime = this.oGame.getTime();
		}
	},

	/**
	 * WTF on peux pas bouger !!!
	 */
	wtfRoot: function() {
		this.oGame.popupMessage(STRINGS._('~alert_wtf_root'), MW.ICONS.wtf_root);
	},
	
	wtfHeld: function() {
		this.oGame.popupMessage(STRINGS._('~alert_wtf_held'), MW.ICONS.wtf_held);
	},
	
	thinkAlive: function() {
		var m = this.oMobile;
		if (this.bActive) {
			this.updateKeys();
		}
		var nMask = 
			(this.aCommands.forward || this.aCommands.forward_w ? 8 : 0) |
			(this.aCommands.backward ? 4 : 0) |
			(this.aCommands.right || this.aCommands.right_e ? 2 : 0) |
			(this.aCommands.left || this.aCommands.left_a ? 1 : 0);
		if (nMask) {
			if (this.isHeld()) {
				this.wtfHeld();
				nMask = 0;
			} else if (this.isRooted()) {
				this.wtfRoot();
				nMask = 0;
			}
		}
		m.fMovingSpeed = 0;
		switch (nMask) {
			case 1: // left
				m.move(m.fTheta - PI / 2, m.fSpeed);
				this.checkCollision();
				break;
				
			case 2: // right
				m.move(m.fTheta + PI / 2, m.fSpeed);
				this.checkCollision();
				break;
				
			case 4: // backward
			case 7:
				m.move(m.fTheta, -m.fSpeed);
				this.checkCollision();
				break;

			case 5: // backward left
				m.move(m.fTheta - 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 6: // backward right
				m.move(m.fTheta + 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 8: // forward
			case 11:
				m.move(m.fTheta, m.fSpeed);
				this.checkCollision();
				break;

			case 9: // forward-left
				m.move(m.fTheta - PI / 4, m.fSpeed);
				this.checkCollision();
				break;
				
			case 10: // forward-right
				m.move(m.fTheta + PI / 4, m.fSpeed);
				this.checkCollision();
				break;
		}
		this.transmitMovement();
	},

	/**
	 * Gestion des collision inter-mobile
	 */
	checkCollision: function() {
	  if (this.oMobile.oMobileCollision !== null) {
	    var oTarget = this.oMobile.oMobileCollision;
	    if (oTarget.getType() != RC.OBJECT_TYPE_MISSILE) {
	    	this.oMobile.rollbackXY();
	    	// augmenter la distance entre les mobiles qui collisionnent
	    	var me = this.oMobile;
	    	var mo = this.oMobile.oMobileCollision;
			var xme = me.x;
			var yme = me.y;
			var xmo = mo.x;
			var ymo = mo.y;
			var dx = xme - xmo;
			var dy = yme - ymo;
			var a = Math.atan2(dy, dx);
			var sdx = me.xSpeed;
			var sdy = me.ySpeed;
			me.move(a, 1);
			me.xSpeed += sdx;
			me.ySpeed += sdy;
	    }
	  }
	},
	
	/**
	 * Renvoie true si l'entity n'est pas sous l'emprise d'une paralysize complete
	 */
	isFree: function() {
		return this.oAttributes['hold'] <= 0;
	},
	
	isHeld: function() {
		return this.oAttributes['hold'] > 0;
	},
	
	/**
	 * Renvoie true si l'entity est rootée
	 */
	isRooted: function() {
		return this.oAttributes['root'] > 0;
	},


	button0Down: function() {
		if (this.isFree()) {
			this.oGame.gm_attack(0);
		} else {
			this.wtfHeld();
		}
		this.nChargeStartTime = this.oGame.getTime();
	},
	
	button0Up: function() {
		// charge time : maximum 10 seconds
		var nCharge = this.oGame.getTime() - this.nChargeStartTime;
		if (nCharge > 500) {
			if (this.isFree()) {
				this.oGame.gm_attack(this.oGame.getTime() - this.nChargeStartTime);
			} else {
				this.wtfHeld();
			}
		}
		this.oGame.gm_charge(0);
	},
	
	button0Command: function() {
		var nCharge = this.oGame.getTime() - this.nChargeStartTime;
		this.oGame.gm_charge(nCharge);
	},
	
	button2Down: function() {
		if (this.isFree()) {
			this.oGame.gm_useItem();
		} else {
			this.wtfHeld();
		}
	},

	useDown: function() {
		if (this.isFree()) {
			this.oGame.gm_activateWall();
		} else {
			this.wtfHeld();
		}
	},
	
	wheelUp: function() {
		this.oGame.gm_wheelUp();
	},

	wheelDown: function() {
		this.oGame.gm_wheelDown();
	},
	
	
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////

	die : function() {
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
	
	revive: function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
		if (this.oDeathVeil) {
			this.oDeathVeil.terminate();
			this.oDeathVeil = null;
		}
		this.sKillerInfo = '';
		this.aCommands[KEYS.MOUSE.BUTTONS.LEFT] = false;
		this.oGame.gm_charge(0);
	},
	
	thinkDying : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkDead;
			this.nDeadTime = 40;
			if (!this.oDeathVeil) {
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
		}
	},
	
	thinkDead : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkWaitForRespawn;
			this.oGame.dialogRespawn();
			var ree = this.oGame.oRaycaster.oEffects.aEffects;
			var reei;
			for (var i = 0; i < ree.length; ++i) {
				reei = ree[i];
				if (reei.sClass) {
					if (reei.sClass === 'ColorVeil' || reei.sClass === 'Blind' || reei.sClass === 'Confused') {
						reei.terminate();
						reei.done();
					}
				}
			}
		}
	},
	
	thinkWaitForRespawn : function() {
	},
	
});
