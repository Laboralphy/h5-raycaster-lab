/**
 * Thinker d'esprit vengeur
 * Ce fantome attaque Miku
 */
O2.extendClass('MANSION.VengefulThinker', MANSION.GhostThinker, {

	_nActionTime: 0,
	_nEvadeDir: 0,
	_fSpeed: 2,
	_fFireProb: 0.333,
	_fFireProb: 0.333,
	
	_bShutter: false, // when "true", the ghost is about to attack
	// means the next few moves will aim at attacking player
	// ex : rush,  or teleport + rush...
	_oBresenham: null,
	
	MAX_INVISIBLE_DISTANCE: 384,
	MAX_VISIBLE_DISTANCE: 640,
	
	__construct: function() {
		__inherited();
		this._oBresenham = new O876.Bresenham();
	},

	/**
	 * sets the normal moving speed of the ghost
	 * @param f float normal speed
	 */
	setSpeed: function(f) {
		this._fSpeed = f;
	},

	setExpireTime: function(t) {
		this._nActionTime = this._nTime + t;
	},	
	
	/**
	 * Returns true if the time has expired
	 */
	isActionExpired: function() {
		return this._nActionTime < this._nTime;
	},
	
	/**
	 * Renvoie true si la variable time est multiple du paramètre numérique spécifié
	 * Permet de programmer des évènements periodiques
	 */
	isTimeMultiple: function(n) {
		return this._nTime % n === 0;
	},
	
	isShutterChance: function() {
		return this._sCurrentThinkProc == 'Shutter';
	},
	
	
	
	
	
	/**
	 * Renvoie l'angle q'uil faut adopter pour viser la cible
	 */
	getEntityAngle: function(oTarget) {
		if (oTarget !== null) {
			var oMe = this.oMobile;
			var fAngle = Math.atan2(oTarget.y - oMe.y, oTarget.x - oMe.x);
			if (!this.isEntityVisible(oTarget)) { // cible invisible ou mobile aveuglé
				if (this.distanceTo(oTarget) >= this.MAX_INVISIBLE_DISTANCE) {
					return false;
				}
				fAngle += 6 * Math.random() - 3;
			}
			return fAngle;
		}
		return false;
	},

	/**
	 * Renvoie true si le sujet peut voir la cible.
	 * pour que la fonction renvoie true il faut que le sujet puisse voir la cible
	 * ceci prend en compte l'invisibilité de la cible, 
	 * le niveau de detection et l'aveuglement du sujet,
	 * les obstacle muraux qui cacheraient éventuellement la cible
	 * @return bool
	 */
	isEntityVisible : function(oTarget) {
		var oMe = this.oMobile;
		var xMe = oMe.xSector;
		var yMe = oMe.ySector;
		var xTarget = oTarget.xSector;
		var yTarget = oTarget.ySector;
		return !!this._oBresenham.line(
			xMe, 
			yMe, 
			xTarget, 
			yTarget, 
			(x, y) => this.testWalkable(x, y));
	},


	testSolid: function(x, y) {
		var rc = this.oGame.oRaycaster;
		var rcs = rc.nMapSize;
		if (x >= 0 && y >= 0 && x < rcs && y <= rcs) {
			return rc.getMapPhys(x, y) !== rc.PHYS_NONE;
		} else {
			return false;
		}
	},

	testWalkable: function(x, y) {
		var rc = this.oGame.oRaycaster;
		var rcs = rc.nMapSize;
		if (x >= 0 && y >= 0 && x < rcs && y <= rcs) {
			return rc.getMapPhys(x, y) === rc.PHYS_NONE;
		} else {
			return false;
		}
	},

			
	
	/**
	 * Renvoie la distance séparant le mob de sa cible si la
	 * cible est détruite, la distance renvoyé est -1
	 * @param oTarget Entity 
	 * @return float
	 */
	distanceTo: function(oTarget) {
		if (oTarget) {
			var oMobile = this.oMobile;
			return MathTools.distance(oMobile.x - oTarget.x, oMobile.y - oTarget.y);
		} else {
			return -1;
		}
	},
	

	/**
	 * Initie un mouvement vers la cible
	 * @param fSpeed float vitesse de marche
	 */
	walkToTarget: function(fSpeed, fVariation) {
		fVariation = fVariation || 0;
		var a = this.getEntityAngle(this.getTarget());
		if (a !== false) {
			var m = this.oMobile;
			m.fSpeed = fSpeed;
			m.setAngle(a + fVariation);
		} else {
			this.setThink('Idle');
		}
	},

	/**
	 * Téléportation devant la cible
	 */
	teleportFront: function() {
		this.setThink('Teleport', 64, 0);
	},

	/**
	 * Téléportation derrière la cible
	 */
	teleportRear: function() {
		this.setThink('Teleport', 64, Math.PI);
	},

	/**
	 * Téléportation à proximité de la cible
	 * a une position aléatoire
	 */
	teleportRandom: function(nDistMin, nDistMax) {
		this.setThink('Teleport', nDistMin + Math.random() * nDistMax, Math.random() * 2 * Math.PI - Math.PI);
	},

	stop: function() {
		this.oMobile.oSprite.playAnimationType(0);
		this.oMobile.fSpeed = 0;
	},
	
	attack: function() {
		this.oMobile.oSprite.playAnimationType(2);
		this.oGame.trigger('attack', {a: this.oMobile, t: this.getTarget()});
	},
	
	move: function(n) {
		var m = this.oMobile;
		m.oSprite.playAnimationType(1);
		switch (n) {
			case 'f':
				m.moveForward();
			break;
			
			case 'b':
				m.moveBackward();
			break;
			
			case 'l':
				m.strafeLeft();
			break;
			
			case 'r':
				m.strafeRight();
			break;
		}
		if (m.oMobileCollision) {
			m.rollbackXY();
			if (m.oMobileCollision == this.getTarget()) {
				this.setThink('attack');
			}
		}
	},
	
	
	
	damage: function(nAmount, bCritical) {
		var hp = this.oMobile.data('hp');
		this.oMobile.data('hp', hp -= nAmount);
		if (hp <= 0) {
			this.setThink('Die');
			return;
		}
		if (bCritical) {
			this.setThink('Wounded', 30);
		} else {
			this.setThink('Wounded', 5);
		}
	},
	
	
	
	
	
	/**
	 * ghost is being hurt and move backward slightly
	 */
	thinkWounded_enter: function(n) {
		this.setExpireTime(n);
		var m = this.oMobile;
		m.fSpeed = this._fSpeed / 2;
		this.playSound('hit');
	},
	
	
	thinkWounded: function() {
		this.process();
		this.move('b');
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},


	/**
	 * Patiente un certain temps
	 */
	thinkWait_enter: function(n) {
		this.setExpireTime(n);
	},

	thinkWait: function() {
		this.process();
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	/**
	 * Pourchasse la cible en se positionnant vers elle et en avancant
	 */
	thinkChase_enter: function(n) {
		this.setExpireTime(n);
	},

	thinkChase: function() {
		if (this.isTimeMultiple(20)) {
			this.walkToTarget(this._fSpeed);
		}
		this.process();
		this.move('f');
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	/**
	 * Bat en retraite
	 */
	thinkRetreat_enter: function(n) {
		this.setExpireTime(n);
	},

	thinkRetreat: function() {
		if (this.isTimeMultiple(20)) {
			this.walkToTarget(-this._fSpeed);
		}
		this.process();
		this.move('b');
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},

	/**
	 * Pourchasse la cible en se positionnant vers elle et en avancant
	 */
	thinkRush_enter: function(n) {
		this.setExpireTime(n);
		this.walkToTarget(this._fSpeed * 3);
	},

	thinkRush: function() {
		this.move('f');
		this.process();
		var m = this.oMobile;
		if (m.oWallCollision.x || m.oWallCollision.y) {
			this.setThink('Idle');
		}
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	
	/**
	 * Pourchasse la cible en zigzagant vers elle
	 */
	bZigZag: false,
	thinkZigZagChase_enter: function(n) {
		this.setExpireTime(n);
		this.bZigZag = false;
	},

	thinkZigZagChase: function() {
		if (this.isTimeMultiple(40)) {
			this.bZigZag = !this.bZigZag;
		}
		if (this.isTimeMultiple(20)) {
			this.walkToTarget(this._fSpeed, this.bZigZag ? Math.PI / 4 : -Math.PI / 4);
		}
		this.process();
		this.move('f');
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	
	/**
	 * Effectue une manoeuvre d'évitement
	 */
	thinkEvade_enter: function(n) {
		this.setExpireTime(n);
	},

	thinkEvade: function() {
		if (this.isTimeMultiple(20)) {
			this.walkToTarget(this._fSpeed);
		}
		var m = this.oMobile;
		if (m.oWallCollision.x || m.oWallCollision.y) {
			this._nEvadeDir = 1 - this._nEvadeDir;
		}
		switch (this._nEvadeDir) {
			case 0:
				this.move('l');
			break;

			case 1:
				this.move('r');
			break;
		}
		this.process();
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	/**
	 * Shoot an ecto missile against the target
	 */
	shoot: function() {
		if (this.getEntityAngle(this.getTarget()) !== false) {
			this.walkToTarget(this._fSpeed);
			this.oGame.spawnMissile('p_ecto', this.oMobile);
		}
	},

	/**
	 * Effectue une manoeuve d'évitement tout en tirant des missiles
	 * de temps en temps
	 */
	thinkEvadeShoot_enter: function(n) {
		this.setExpireTime(n);
	},

	thinkEvadeShoot: function() {
		if (this.isTimeMultiple(40) && Math.random() < this._fFireProb) {
			this.shoot();
		}
		this.thinkEvade();
	},

	thinkShoot: function() {
		this.process();
		var a = this.getEntityAngle(this.getTarget());
		if (a !== false) {
			var m = this.oMobile;
			m.setAngle(a);
			this.oGame.spawnMissile('p_ecto', m);
		}
		this.setThink('Idle');
	},
	
	
	/**
	 * Téléporte le fantome devant le nez de la cible
	 * terrible !
	 */
	fTeleportDist: 0, // distance de téléportation cible
	fTeleportAngle: 0, // angle de téléport par rapport à la cible (0 = devant ; PI = derrière)
	thinkTeleport_enter: function(fDist, fAngle) {
		var s = this.oMobile.oSprite;
		s.nAlpha = 0;
		s.bTranslucent = true;
		this.fTeleportDist = fDist;
		this.fTeleportAngle = fAngle;
		this.stop();
	},

	thinkTeleport: function() {
		var t = this.getTarget();
		var m = this.oMobile;
		var s = m.oSprite;
		++s.nAlpha;
		if (s.nAlpha > 3) {
			s.bVisible = false;
			s.nAlpha = 3;
			var fDist = this.fTeleportDist;
			var fAngle = t.getAngle() + this.fTeleportAngle;
			var ps = this.oGame.oRaycaster.nPlaneSpacing;
			// calculer les coordonnée finales
			var x = t.x + fDist * Math.cos(fAngle);
			var y = t.y + fDist * Math.sin(fAngle);
			// calculer le secteur final
			var xs = (x / ps | 0);
			var ys = (y / ps | 0);
			// vérifier que le secteur final est walkable
			var rc = this.oGame.oRaycaster;
			if (rc.insideMap(xs) && rc.insideMap(ys) && !this.testSolid(xs, ys)) {
				// calculer les coordonnées centrales du secteur
				var x1 = (x / ps | 0) * ps + (ps >> 1);
				var y1 = (y / ps | 0) * ps + (ps >> 1);
				// se mettre sur ces coordonnées
				m.setXY(x1, y1);
				// et bouger jusqu'a coordonnées finales
				m.slide(x - x1, y - y1);
				this.setThink('TeleportOut');
			}
		}
	},

	/**
	 * Sortie de téléportation
	 */
	thinkTeleportOut_enter: function() {
		var m = this.oMobile;
		var s = m.oSprite;
		s.bVisible = false;
		s.nAlpha = 3;
	},

	thinkTeleportOut: function() {
		var m = this.oMobile;
		var s = m.oSprite;
		if (!s.bVisible) {
			s.bVisible = true;
		} else {
			--s.nAlpha;
		}
		if (s.nAlpha <= 0) {
			this.setThink('Idle');
		}
	},
	
	thinkAttack_enter: function() {
		this.attack();
		this.setExpireTime(30);
		this.playSound('attack');
	},
	
	thinkAttack: function() {
		this.process();
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},

	/**
	 * Special thinker
	 */
	thinkShutter_enter: function() {
		this.setExpireTime(30);
		this.oMobile.data('shutter', true);
	},

	thinkShutter: function() {
		this.process();
		if (this.isActionExpired()) {
			this.setThink('Idle');
		}
	},
	
	thinkShutter_exit: function() {
		this.oMobile.data('shutter', false);
	},
	
	thinkDie_enter: function() {
		this.oMobile.oSprite.playAnimationType(2);
		this.oMobile.data('dead', true);
		this.setExpireTime(30);
		this.playSound('die');
	},
	
	thinkDie: function() {
		this.process();
		if (this.isActionExpired()) {
			this.setThink('Dead');
		}
	},

	thinkDead_enter: function() {
		var g = this.oGame;
		var m = this.oMobile;
		var s = m.oSprite;
		m.data('hp', 0);
		g.spawnVisualEffect('o_flame', m.x, m.y);
		s.nAlpha = 0;
		s.bTranslucent = true;
	},
	
	thinkDead: function() {
		var m = this.oMobile;
		var s = m.oSprite;
		++s.nAlpha;
		if (s.nAlpha > 3) {
			m.gotoLimbo();
			s.nAlpha = 0;
			s.bTranslucent = false;
			m.bActive = false;
			// unlocking door blocked by the spirit
			var sHD = this.oMobile.data('hold-door');
			if (sHD) {
				sHD.split(' ').forEach(function(sDoorLocator) {
					var oDoor = this.oGame.getLocator(sDoorLocator);
					if (oDoor) {
						this.oGame.unlockDoor(oDoor.x, oDoor.y);
					}
				}, this);
			}
		}
	}
});
