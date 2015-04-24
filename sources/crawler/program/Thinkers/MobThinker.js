/**
 * IA de base des mobs : Permet à un mob de se déplacer et tenter de repérer le
 * joueur
 * 
 */
O2.extendClass('MobThinker', O876_Raycaster.Thinker, {
	oMobileSectors : null,

	// Physics
	oPulse : null, // Vecteur des forces extérieures
					// influençant le mouvement

	// inventory object : loot and weapon firerate
	oInventory : null,
	oWeapon : null,

	// Liste des angles
	aAngles : null,

	// Recherche de cible
	fViewAngle : 0, // Angle de vue par défaut
	oDummyData : null, // Structure temporaire utilisée pour la
						// fonction de recherche
	oCreature : null, // Creature du mobile
	oTarget : null, // Mobile pris pour cible
	oLastAggressor: null, // dernier agresseur
	
	// compteurs de temps
	nNewActionTime : 0, // compteur pour temporiser la prochaine
						// action
	nLastFireTime : 0,
	nDeadTime : 0,

	// divers delais
	nSearchingTime : 2500, // delai durant lequel le mob
							// cherche une cible
	nWalkingTime : 750, // delai durant lequel le mob marche
						// avant de s'arreter pour changer de
						// mode
	nCastingTime : 250,   // délai au bout duquel le mob lance son sort
	nWanderingTime : 250, // delai durant lequel le mob s'arrete
						// pour "réfléchir"
	nWeaponSpeed : 10, // vitesse de frappe de l'arme

	bAttacking : false, // Témoin d'attaque (pour donner une
						// fréquence d'attaque appropriée)
	
	nHazedEffects : 0,
	nBoredTime : 0, // Compteur d'ennui au bout duquel le mob
				// repasse en mode wander

	bSnared : false,
	bRooted : false,
	bHeld : false,
	bConfused : false,
	bBlind : false,
	bVulnerable : false,
	bDisease : false,
	bWeak : false,

	nCastAttack : 0,
	aCastTimes : null,

	TIME_REACTIVITY : 1, // Temps de réactivité :
	ANIM_IDLE : 0,
	ANIM_WALK : 1,
	ANIM_ATTACK : 2,
	ANIM_DIE : 3,

	COLLISION_NONE : 0,
	COLLISION_MOBILE : 1,
	COLLISION_TARGET : 2,
	COLLISION_WALL_X : 3,
	COLLISION_WALL_Y : 4,

	MAX_BORING_TIME : 10000,

	/**
	 * Liste des halo lumineux expriment une altératino d'état
	 * On affiche le halo le plus prioritaire L'ordre détermine
	 * la priorité d'expression (snared s'affichera s'il n'y a
	 * pas rooted)
	 */
	EFFECT_HAZES : {
		blind : {
			property : 'bBlind',
			haze : 11
		},
		confused : {
			property : 'bConfused',
			haze : 6
		},
		held : {
			property : 'bHeld',
			haze : 9
		},
		rooted : {
			property : 'bRooted',
			haze : 1
		},
		snared : {
			property : 'bSnared',
			haze : 0
		},
		vulnerable : {
			property : 'bVulnerable',
			haze : 4
		},
		disease : {
			property : 'bDisease',
			haze : 7
		},
		weak : {
			property : 'bWeak',
			haze : 7
		}
	},

	__construct : function() {
		this.fViewAngle = PI;
		this.aAngles = [ 0, 0.25 * PI, 0.5 * PI, 0.75 * PI, PI,
			-0.75 * PI, -0.5 * PI, -0.25 * PI ];
		this.oDummyData = {
			oContinueRay : {
				bContinue : false
			},
			nRayLimit : 10
		};
		this.oPulse = {
			x : 0,
			y : 0
		};
		this.think = this.thinkInit;
	},
	

	

	/**
	 * Calcule les effets à appliquer (tous les 32 tours)
	 */
	processEffects : function() {
		if (this.isDead()) {
			this.think = this.thinkDie;
		}
		if (this.isHeld()) {
			this.oMobile.oSprite.playAnimationType(this.ANIM_IDLE);
			this.think = this.thinkHeld;
		}
		if (this.oGame.bNewSecond) {
			this.oCreature.processEffects();
			this.checkVisibility();
		}
		this.pulse();
	},

	/**
	 * Vérifie que la cible spécifiée est dans le champ de
	 * vision : - pas trop loin - dans l'angle de vue - pas
	 * derrière un mur Si la cible est détectée : renvoie true
	 * 
	 * @return bool
	 */
	searchForTarget : function(oTarget) {
		if (oTarget === null) {
			return;
		}
		var sx = oTarget.x;
		var sy = oTarget.y;
		var mx = this.oMobile.x;
		var my = this.oMobile.y;
		var fSearchAngle = Math.atan2(sy - my, sx - mx);
		// tester si l'angle de recherche est dans le range de
		// vision
		var fSA = Math.abs((fSearchAngle + PI) - (this.oMobile.fTheta + PI));
		if (fSA > this.fViewAngle) {
			// hors du champ de vision
			return false;
		}
		var dx = Math.cos(fSearchAngle);
		var dy = Math.sin(fSearchAngle);
		var aVisibles = this.oGame.oRaycaster.castRay(this.oDummyData, this.oMobile.x, this.oMobile.y, dx, dy);
		return Marker.getMarkXY(aVisibles, oTarget.xSector,	oTarget.ySector);
	},

	/**
	 * Recherche d'une cible aléatoire dans le champ de vision
	 * du mobile return Mobile trouvé
	 */
	searchForRandomTarget : function() {
		var aMobs = this.oGame.gc_selectMobilesInCircle(
				this.oMobile.x, this.oMobile.y, 384);
		var nMe = aMobs.indexOf(this.oMobile);
		if (nMe >= 0) { // se retirer de la liste
			ArrayTools.removeItem(aMobs, nMe);
		}
		if (aMobs.length) { // toujours du monde dans la liste ?
			return MathTools.rndChoose(aMobs);
		} else {
			return null;
		}
	},

	/**
	 * Renvoie true si la cible peut être vue
	 * 
	 * @return bool
	 */
	isTargetVisible : function(t) {
		if (t === null) {
			return false;
		}
		var c = t.getData('creature');

		var bInvisible = c.getAttribute('invisible') > 0;
		var bEsp = c.getAttribute('esp') > 0;

		if (bInvisible && (!bEsp)) {
			return false;
		}

		if ((!bInvisible) && this.bBlind) {
			return false;
		}

		return true;
	},

	/**
	 * Renvoie la distance séparant le mob de sa cible si la
	 * cible est détruite, la distance renvoyé est -1 return
	 * float
	 */
	distanceToTarget : function() {
		var t = this.getTarget();
		if (t) {
			return MathTools.distance(this.oMobile.x - t.x,
					this.oMobile.y - t.y);
		} else {
			return -1;
		}
	},

	/**
	 * Défini la nouvelle cible à poursuivre Si le mob est
	 * aveugle, et que sa cible est trop loin, il repasse en
	 * mode wander Si le mob est aveugle et proche de sa cible
	 * il pert néanmoins de la précision
	 */
	chaseTarget : function(oTarget) {
		this.oTarget = oTarget;
		if (this.getTarget() !== null) {
			this.oMobile.fTheta = Math.atan2(oTarget.y - this.oMobile.y, oTarget.x - this.oMobile.x);
			if (!this.isTargetVisible(oTarget)) { // cible invisible ou mobile aveuglé
				if (this.distanceToTarget() < 384) {
					this.oMobile.fTheta += 4 * Math.random() - 2;
				} else {
					this.setWanderMode();
				}
			}
		}
	},

	/**
	 * Renvoie la cible prédédemment sélectionnée avec
	 * vérification de sa vie si la cible est détruite, renvoie
	 * null
	 */
	getTarget : function() {
		if (this.oTarget && this.oTarget.getData('creature').getAttribute('dead')) {
			this.oTarget = null;
		}
		return this.oTarget;
	},

	/**
	 * Vérifie s'il y a collision et avec quel type de mobile
	 * Stoppe le mobile en cas de collision avec autre chose
	 * qu'un missile 0: pas de collision 1: collision avec un
	 * mobile quelconque 2: collision avec la cible poursuivie
	 * 3: collision murale
	 */
	getCollisionType : function() {
		if (this.oMobile.oMobileCollision !== null) {
			var oTarget = this.oMobile.oMobileCollision;
			if (oTarget.getType() == RC.OBJECT_TYPE_MISSILE) {
				return this.COLLISION_NONE; // les collisions
											// missile ne sont
											// pas
											// significatives
			} else {
				this.oMobile.rollbackXY();
				if (oTarget == this.getTarget()) {
					return this.COLLISION_TARGET; // collision
													// avec la
													// cible !
				} else {
					return this.COLLISION_MOBILE; // collision
													// avec un
													// mobile
													// sans
													// interêt
				}
			}
		} else {
			if (this.oMobile.oWallCollision.x) {
				return this.COLLISION_WALL_X; // collision
												// avec un mur
			} else if (this.oMobile.oWallCollision.y) {
				return this.COLLISION_WALL_Y; // collision
												// avec un mur
			}
		}
		return this.COLLISION_NONE; // pas de collision
	},

	/**
	 * Tente de fuir un mobile
	 * 
	 * @param oMobile
	 *            mobile à fuir
	 */
	escapeFrom : function(oMobile) {
		var fAngle = Math.atan2(this.oMobile.y - oMobile.y,
				this.oMobile.x - oMobile.x);
		this.oMobile.move(fAngle, this.oMobile.fSpeed);
	},

	/**
	 * Désactive instantanément un mobile
	 */
	disable : function() {
		this.oMobile.bEthereal = true;
		this.oMobile.gotoLimbo();
		this.think = this.thinkDead();
	},

	/**
	 * Le mob est actuellement repoussé Fait intervenir le
	 * vecteur pulse pour représenter la force qui repousse le
	 * mob
	 */
	pulse : function() {
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

	/**
	 * Déplacement standar avec gestion des collisions
	 * 
	 * @param nType
	 *            type de déplacement 0: avancer ; 1: glissement
	 *            gauche ; 2: glissement droit; 3: reculer
	 */
	move : function(nType) {
		if (nType === undefined) {
			nType = 0;
		}
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

		// Autre collision
		var nCollisionType = this.getCollisionType();
		switch (nCollisionType) {
			case this.COLLISION_TARGET:
				this.oMobile.rollbackXY();
				break;
	
			case this.COLLISION_MOBILE:
				this.oMobile.rollbackXY();
				this.escapeFrom(this.oMobile.oMobileCollision);
				this.nBoredTime += g.TIME_FACTOR;
				break;
	
			case this.COLLISION_WALL_X:
			case this.COLLISION_WALL_Y:
				this.nBoredTime += g.TIME_FACTOR;
				break;
	
			case this.COLLISION_NONE:
				this.nBoredTime = 0;
		}
		return nCollisionType;
	},


	/**
	 * Calcule si on doit choisir une nouvelle activité
	 */
	isActionTimeExpired : function() {
		return this.oGame.nTimeMs > this.nNewActionTime;
	},

	/**
	 * Défini le temps qui doit s'écouler avant une prochaine
	 * nouvelle action le temps est aléatoire entre 2 bornes
	 * spécifiées
	 */
	setNextActionTime : function(nNextActionTimeRndMin,	nNextActionTimeRndMax) {
		if (nNextActionTimeRndMax === undefined) {
			this.nNewActionTime = this.oGame.nTimeMs + nNextActionTimeRndMin;
		} else {
			this.nNewActionTime = this.oGame.nTimeMs + MathTools.rnd(nNextActionTimeRndMin, nNextActionTimeRndMax);
		}
	},

	// VERIFICATION DES ETATS QUI INFLUENCENT L'INTELLIGENCE
	// ARTICFICIELLE

	/**
	 * Renvoie true si le mob est frappé de confusion
	 */
	isConfused : function() {
		return this.bConfused;
	},

	/**
	 * Renvoie true si le mob est frappé de cécité
	 */
	isBlind : function() {
		return this.bBlind;
	},

	/**
	 * Suspend toute activité du mob
	 */
	isHeld : function() {
		return this.bHeld;
	},

	/**
	 * Creature morte
	 */
	isDead : function() {
		return this.oCreature.getAttribute('dead') > 0;
	},

	/**
	 * Empeche le déplacement
	 */
	isRooted : function() {
		return this.bRooted;
	},

	/**
	 * Ralenti le déplacement
	 */
	isSnared : function() {
		return this.bSnared;
	},

	/**
	 * Verifie si le mob est toujour invisible aux yeux du
	 * joueur
	 */
	checkVisibility : function() {
		this.oMobile.bVisible = this.oCreature.getAttribute('invisible') <= 0 || this.oGame.oDungeon.getPlayerCreature().getAttribute('esp') > 0;
	},

	/**
	 * Comportement personalisé lorsqu'un attribut de la crature
	 * change
	 * 
	 */
	creatureAttributeChanged : function(oCreature, sAttribute, nNewValue, nPreviousValue) {
		// Modifier les variables d'influence IA
		if (sAttribute in this.EFFECT_HAZES) {
			this[this.EFFECT_HAZES[sAttribute].property] = nNewValue > 0;
			this.setupHaze();
		}
		// cas spéciaux
		switch (sAttribute) {
			case 'invisible':
				this.checkVisibility();
				break;
				
			case 'hp':
				if (nNewValue > nPreviousValue && this.oLastAggressor !== oCreature) {
					this.oGame.sendPluginSignal('damage', this.oLastAggressor, this.oMobile, nNewValue - nPreviousValue);
				}
				break;

			case 'dead':
				if (nNewValue > nPreviousValue && this.oLastAggressor !== oCreature) {
					this.oGame.sendPluginSignal('kill', this.oLastAggressor, this.oMobile);
				}
				break;
		}
	},

	/**
	 * Calcule un halo lumineux de la bonne couleur en fonction
	 * des attributs de la creature
	 */
	setupHaze : function() {
		var nHaze = 0;
		var bHaze = false;
		var oHazeDef;

		for ( var sHaze in this.EFFECT_HAZES) {
			oHazeDef = this.EFFECT_HAZES[sHaze];
			if (this[oHazeDef.property]) {
				nHaze = oHazeDef.haze;
				bHaze = true;
				break;
			}
		}

		if (bHaze) { // il faut un overlay
			if (this.oMobile.oSprite.oOverlay === null) {
				this.oMobile.oSprite.oOverlay = this.oGame.oRaycaster.oHorde.oTiles.e_hazes;
				this.oMobile.oSprite.nOverlayFrame = nHaze;
			}
		} else { // il ne faut pas d'overlay
			if (this.oMobile.oSprite.oOverlay) {
				this.oMobile.oSprite.oOverlay = null;
			}
		}
	},

	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////
	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////
	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////
	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////
	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////
	////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE ////// MODE POURSUITE //////

	/**
	 * Comportement personnalisé à l'initialisation de l'IA
	 * 
	 */
	_init : function() {
	},

	/**
	 * comportement personnalisé en mode poursuite Fonction
	 * callback appelée lorsque le mobe est passé en mode
	 * poursuite après avoir choisi une cible.
	 */
	_follow : function(nTime) {
		// stub
	},

	/**
	 * Fonction callback appelée lorsque le mob est passé en
	 * mode attaque A l'issue de cette fonction le mob retourne
	 * en mode poursuite ou en mode wander s'il est confu
	 */
	_attack : function(nTime) {
		// stub
	},

	_dead : function() {
		// stub
	},

	_cast : function(nTime) {
		// stub
	},

	/**
	 * Réaction par défaut car on prend un missile dans la tête
	 * Si on n'a pas déja de cible et que le missile appartient
	 * au joueur : on prend en chasse le joueur
	 */
	_hitByMissile : function(oMissile) {
		var oBastard = this.oLastAggressor = oMissile.oThinker.oOwner;
		// si le mob est frappé de confusion :
		// on ignore le missile
		if (this.isConfused()) {
			return;
		}
		if (this.getTarget() === null && oBastard == this.oGame.getPlayer()) {
			this.chaseTarget(oBastard);
			this.setPursuitMode();
		}
	},

	setAttackMode : function() {
		this.oMobile.oSprite.playAnimationType(this.ANIM_ATTACK);
		this.think = this.thinkAttack;
	},

	// Passage en Mode de recherche active
	setSearchMode : function() {
		this.setNextActionTime(this.nSearchingTime,	this.nSearchingTime << 1);
		this.oMobile.oSprite.playAnimationType(this.ANIM_IDLE);
		this.think = this.thinkSearch;
	},

	// Passage en mode poursuite
	// On suit une cible définie
	setPursuitMode : function() {
		this.oMobile.oSprite.playAnimationType(this.ANIM_WALK);
		this.think = this.thinkFollow;
	},

	// Passage en mode Errance :
	// On ne fait rien de particulier à part marcher et verifier
	// de temps
	// en temps qu'il n'y a pas de danger
	setWanderMode : function() {
		this.oMobile.oSprite.playAnimationType(this.ANIM_IDLE);
		this.setNextActionTime(this.nWanderingTime,
				this.nWanderingTime << 1);
		this.chaseTarget(null);
		this.think = this.thinkWander;
	},

	// Passage en mode cast
	// Lancement d'un sort
	setCastMode : function(nCast) {
		this.bAttacking = false;
		this.nCastAttack = nCast;
		this.nCastingTime = this.aCastTimes[this.nCastAttack] + 1;
		this.setNextActionTime(this.nCastingTime);
		this.think = this.thinkCast;
	},
	
	// Suppression de tous les effets
	stripEffects: function() {
		// suprimer les effets actuellement en cours
		this.oGame.oDungeon.oEffectProcessor.dispellEffects(this.oCreature, this.oGame.oDungeon.oEffectProcessor.selectorAll);
		for (var sHaze in this.EFFECT_HAZES) {
			this[this.EFFECT_HAZES[sHaze].property] = false;
		}
		if (this.oMobile.oSprite.oOverlay) {
			this.oMobile.oSprite.oOverlay = null;
		}
	},

	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////
	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////
	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////
	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////
	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////
	////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS ////// THINKERS //////

	/**
	 * Thinker d'initialisation Initialise la vitesse et
	 * l'étherage
	 */
	thinkInit : function() {
		this.oMobile.bEthereal = false;
		this.oCreature = this.oMobile.getData('creature');
		this.oInventory = this.oGame.oDungeon.getCreatureInventory(this.oCreature);
		this.oWeapon = this.oInventory.oEquipSlots.hand;
		this.nWeaponSpeed = this.oWeapon.speed;

		this.oMobileSectors = this.oGame.oRaycaster.oMobileSectors;
		this.setNextActionTime(0);
		if (this.isDead()) {
			this.disable();
		}

		this.aCastTimes = [];
		for ( var i = 0; i < this.oWeapon.spells.length; i++) {
			this.aCastTimes.push(this.oWeapon.spells[i].time);
		}

		this.TIME_REACTIVITY = 400 / this.oGame.TIME_FACTOR | 0;
		this._init();
		this.setWanderMode();
	},

	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////
	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////
	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////
	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////
	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////
	////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE ////// MODE ERRANCE //////

	/**
	 * Mode errance : Le mob attend quelques instants puis
	 * choisi un angle aléatoire et passe en Mode Marche
	 */
	thinkWander : function() {
		this.processEffects();
		if (this.isActionTimeExpired()) {
			this.oMobile.fSpeed = 0;
			this.oMobile.fTheta = this.aAngles[MathTools.rnd(0,	this.aAngles.length - 1)];
			this.oMobile.oSprite.playAnimationType(this.ANIM_WALK);
			this.setNextActionTime(this.nWalkingTime, this.nWalkingTime << 1);
			this.think = this.thinkWalk;
		}
	},

	/**
	 * Mode Paralysie Le mob ne bouge plus Lorsque le mob n'est
	 * plus paralysé il repart en mode Recherche.
	 */
	thinkHeld : function() {
		this.processEffects();
		if (!this.isHeld()) {
			this.setSearchMode();
		}
	},

	/**
	 * Mode Marche : marcher de quelques pas En cas de rencontre
	 * avec un mur : choisir un autre angle à la fin de la
	 * marche : passage en mode recherche
	 */
	thinkWalk : function() {
		this.processEffects();
		this.move();
		if (this.isActionTimeExpired()) {
			this.setSearchMode();
		}
	},

	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////
	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////
	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////
	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////
	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////
	////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE ////// MODE RECHERCHE //////

	/**
	 * Mode recherche Effectue une recherche dans l'angle de vu
	 * actuellement adopté Si joueur non trouvé, au bout d'un
	 * certain temps on repasse en mode Errance Si joueur trouvé :
	 * on passe en mode poursuite
	 */
	thinkSearch : function() {
		this.processEffects();

		// si le mob est frappé de confusion --> passe en
		// recherche confuse
		if (this.isConfused()) {
			this.think = this.thinkSearchConfused;
			return;
		}

		if (this.searchForTarget(this.oGame.getPlayer())) {
			this.chaseTarget(this.oGame.getPlayer());
			this.setPursuitMode();
		} else if (this.isActionTimeExpired()) {
			this.setWanderMode();
		}
	},

	/**
	 * Mode recherche confuse Le mob cherche une cible au hasard
	 * dans son champ de vision et l'attaque. La cible peut etre
	 * le joueur ou un autre mob
	 */
	thinkSearchConfused : function() {
		this.processEffects();
		var oTarget = null;

		// si le mob n'est plus frappé des confusion : retour au
		// mode normal
		if (!this.isConfused()) {
			this.think = this.thinkSearch;
			return;
		}
		oTarget = this.searchForRandomTarget();
		if (oTarget) {
			this.chaseTarget(oTarget);
			this.setPursuitMode();
		}
		if (this.isActionTimeExpired()) {
			this.setWanderMode();
		}
	},

	/** Mode poursuite
	 * Fonce vers la cible jusqu'a l'atteindre au contact
	 */
	thinkFollow : function() {
		this.processEffects();
		var nTime = this.oGame.nTime;
		if (this.nBoredTime > this.MAX_BORING_TIME) {
			this.setWanderMode();
		} else {
			this._follow(nTime);
		}
	},

	/** Mode attaque.
	 * Déclenche une attaque, puis re-passe en mode poursuite
	 * passe en mode Wander en cas de confusion
	 */
	thinkAttack : function() {
		this.processEffects();
		if (!this.bAttacking) {
			this.oMobile.oSprite.playAnimationType(this.ANIM_ATTACK);
			this.bAttacking = true;
			// Calcul du délai de la prochaine attaque
			this.setNextActionTime(this.nWeaponSpeed);
			// L'IA-fille se charge de l'attaque
			this._attack(this.oGame.nTime);
		} else if (this.isActionTimeExpired()) {
			this.bAttacking = false;
			this.oMobile.oSprite.playAnimationType(this.ANIM_WALK);
			// si le mob est frappé de confusion : on abandonne la cible
			// après l'avoir frappé
			if (this.isConfused()) {
				this.setWanderMode();
			} else {
				this.setPursuitMode();
			}
		}
	},

	/**
	 * Marque une pause le temps de caster un truc énorme
	 * Au bout d'un certain temps, appelle la méthode _cast
	 * et passe en mode pursuit
	 */
	thinkCast : function() {
		this.processEffects();
		if (!this.bAttacking) {
			this.oMobile.oSprite.playAnimationType(this.ANIM_ATTACK);
			this.bAttacking = true;
			// Calcul du délai de la prochaine attaque
			this.setNextActionTime(this.nCastingTime);
		} else if (this.isActionTimeExpired()) {
			this.bAttacking = false;
			this.oMobile.oSprite.playAnimationType(this.ANIM_WALK);
			// si le mob est frappé de confusion : on abandonne la cible
			// après l'avoir frappé
			if (this.isConfused()) {
				this.setWanderMode();
			} else {
				this._cast(this.oGame.nTime);
			}
		}
	},

	/** Mode destruction
	 * Déclenche la série de phases qui conduisent à la destruction du mob
	 * Die -> Dying -> Dead
	 */
	thinkDie : function() {
		this.pulse();
		this.oMobile.oSprite.playAnimationType(this.ANIM_DIE);
		this.oMobile.bEthereal = true;
		this.nDeadTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
		// Lacher du Loot
		this.oGame.gc_dropLoot(this.oMobile.oSprite.oBlueprint.sId, this.oMobile);
		// suprimer les effets actuellement en cours
		this.stripEffects();
		this.think = this.thinkDying;
		this.oGame.sys_playSound(SOUNDS.FOE_SLAIN, this.oMobile.x, this.oMobile.y);
	},

	thinkDying : function() {
		this.pulse();
		this.nDeadTime -= this.oGame.TIME_FACTOR;
		if (this.nDeadTime <= 0) {
			this.oMobile.gotoLimbo();
			this.think = this.thinkDead;
		}
	},

	thinkDead : function() {
		this.oMobile.bActive = false;
		this._dead();
	}
});
