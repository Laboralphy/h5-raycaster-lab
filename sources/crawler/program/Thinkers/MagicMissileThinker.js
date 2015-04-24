/**
 * Thinker de missile avec options
 * Bump : Le missile ricoche contre les murs
 * Sine : Le missile adopte une trajectoire sinusoidale
 * Cosine : idem mais avec un décalage par rapport à Sine (pour les effets sympas)
 * Random : Le missile change aléatoirement de cap (missile fou)
 */

O2.extendClass('MagicMissileThinker', O876_Raycaster.MissileThinker, {
	nRndTime : 0,
	fSineTime : 0,
	fSineInc : 0,
	fSine : 0,

	bHeavy : false, // Les missiles lourds repoussent la cible / les missile légers n'ont pas d'effets
	bRandom : false, // Déplacement aléatoire du missile
	bBump : false, // Le missile rebondit contre les murs
	bSine : false, // Le missile suit une trajectoire sinusoidale
	bCosine : false, // Le missile suit une trajectoire sinusoidale avec un décalage de phase de PI / 2
	bAoE : false, // Le missile explode en AOE
	nAoE : 0, // distance de l'aoe

	aEffects : null,
	aChances : null,
	nPower : 0,

	oOwner : null,

	/** Définition des options de trajectoire grace à la chaine de caractère
	 * transmise en paramètre
	 * 'bscrha'
	 */
	setOptions : function(sOptions) {
		this.fSineInc = this.oGame.TIME_FACTOR / 320;
		this.bRandom = false;
		this.bBump = false;
		this.bSine = false;
		this.bCosine = false;
		this.bHeavy = false;
		this.bAoE = false;
		this.nAoE = 0;
		var nOptLen = sOptions.length;

		for ( var iOpt = 0; iOpt < nOptLen; iOpt++) {
			switch (sOptions.charAt(iOpt)) {
			case 'h':
				this.bHeavy = true;
				break;

			case 'b':
				this.bBump = true;
				break;

			case 's':
				this.bSine = true;
				break;

			case 'c':
				this.bCosine = true;
				break;

			case 'r':
				this.bRandom = true;
				break;

			case 'a':
				this.bAoE = true;
				// vérifier option suivante
				if ((iOpt + 1) < nOptLen) {
					this.nAoE = (this.oGame.oRaycaster.nPlaneSpacing >> 1) * (sOptions.charAt(iOpt + 1) | 0);
					iOpt++;
				}
				break;
			}
		}
	},

	/** 
	 * Défini les effets véhiculés par le missile
	 * @param aEffect array of string, listes des effets
	 * @param aChances array of float, chance d'application des effets
	 * @param nBonus int bonus du niveau de chaque effet
	 */
	setEffects : function(aEffects, aChances, nBonus) {
		this.aEffects = aEffects;
		this.aChances = aChances;
		this.nPower = nBonus;
	},

	fire : function(oMobile) {
		this.nRndTime = 0;
		this.fSineTime = PI / 2;
		if (this.bCosine) {
			this.fSineTime += PI / 2;
		}
		this.fSine = 0;
		__inherited(oMobile);
	},

	bump : function() {
		// rebond du missile
		var dx = this.oMobile.xSpeed;
		var dy = this.oMobile.ySpeed;

		if (this.oMobile.oWallCollision.x) {
			dx = -dx;
		}
		if (this.oMobile.oWallCollision.y) {
			dy = -dy;
		}
		this.oMobile.fTheta = Math.atan2(dy, dx);
		this.oMobile.moveForward();
	},

	/** La collision contre un mur provoquera un rebond si bBump est actif
	 * La collision provoque l'application de tous les effets porté par le missile
	 */
	isCollisioned : function() {
		var b = __inherited();
		var oMC = this.oMobile.oMobileCollision;
		if (b) {
			if (this.bBump && oMC === null) {
				this.bump();
				b = false;
			}
			if (oMC) {
				var oMCC = oMC.getData('creature');
				// vérifier attribut reflect qui permet de dévier les missiles
				var nReflect = oMCC.getAttribute('reflect');
				if (nReflect > 0) {
					this.oMobile.rollbackXY();
					this.oMobile.rotate(PI);
					// le mobile qui a dévié le missile est quand même affecté
					this.oGame.gc_affect(oMC, this.aEffects, this.aChances, this.nPower - nReflect);
					return false;
				}
				var oMCT = oMC.oThinker;
				oMCT._hitByMissile(this.oMobile);
				if (this.bHeavy) {
					oMCT.oPulse.x += 10 * Math.cos(this.oMobile.fTheta);
					oMCT.oPulse.y += 10 * Math.sin(this.oMobile.fTheta);
				}
				if (this.bAoE) { // toucher les autres creature également
					this.boom();
				} else {
					this.oGame.gc_affect(oMC, this.aEffects, this.aChances, this.nPower);
				}
			}
		}
		return b;
	},

	extinct : function() {
		if (this.bAoE) { // si AOE alors exploser
			this.boom();
			this.explode();
		} else {
			__inherited();
		}
	},

	/** 
	 * Applique les effet du missile à tous les mobile présent dans la zone d'effet circulaire
	 * centrée sur la position du missile et d'un rayon d'action (this.nAoE);
	 */
	boom : function() {
		var xBoom = this.oMobile.x, yBoom = this.oMobile.y, fBoomAngle;
		var xVic, yVic;
		var aVictims = this.oGame.gc_selectMobilesInCircle(xBoom, yBoom,
				this.nAoE);
		var nBodyCount = aVictims.length;
		var i, oVictim;
		for (i = 0; i < nBodyCount; i++) {
			oVictim = aVictims[i];
			if (this.bHeavy) {
				xVic = oVictim.x;
				yVic = oVictim.y;
				fBoomAngle = Math.atan2(yVic - yBoom, xVic - xBoom);
				oVictim.oThinker.oPulse.x += 10 * Math.cos(fBoomAngle);
				oVictim.oThinker.oPulse.y += 10 * Math.sin(fBoomAngle);
			}
			this.oGame.gc_affect(oVictim, this.aEffects, this.aChances, this.nPower);
		}
	},

	/** Déplacement du missile selon 
	 * bRandom : changement de cap aléatoire tout les 8 appels
	 * bSine ou bCosine : changement de cap selon sinusoidale
	 */
	advance : function() {
		__inherited();
		var f;
		if (this.bRandom) {
			this.nRndTime = (this.nRndTime + 1) & 3;
			if (this.nRndTime === 0) {
				this.oMobile.rotate((Math.random() - 0.5) / 2);
			}
		}
		if (this.bSine) {
			this.fSineTime += this.fSineInc;
			f = 0.5 * Math.sin(this.fSineTime);
			this.oMobile.rotate(f - this.fSine);
			this.fSine = f;
		} else if (this.bCosine) {
			this.fSineTime += this.fSineInc;
			f = 0.5 * Math.cos(this.fSineTime);
			this.oMobile.rotate(f - this.fSine);
			this.fSine = f;
		}
	},

	explode: function() {
		var oMobile = this.oMobile.oMobileCollision;
		if (oMobile) {
			var oCreature = oMobile.getData('creature');
			var nReflect = oCreature.getAttribute('reflect');
			if (nReflect > 0) {
				this.oMobile.rollbackXY();
				this.oMobile.rotate(PI);
				return;
			}
		}
		__inherited();
	},

	/** Normalement : rien à faire en cas de collision avec un missile
	 */
	_hitByMissile : function(oMissile) {
	}
});
