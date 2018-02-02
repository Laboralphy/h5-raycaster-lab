/**
 * La classe mobile permet de mémoriser la position des objets circulant dans le laby
 * O876 Raycaster project
 * @class O876_Raycaster.Mobile
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Mobile', {
	oRaycaster: null,						// Référence de retour au raycaster
	x: 0,									// position du mobile
	y: 0,									// ...
	xSave: 0,
	ySave: 0,

	// flags
	bActive: false,							// Flag d'activité
	bEthereal: false,						// Flage de collision globale

	fTheta: 0,								// Angle de rotation
	fMovingAngle: 0,						// Angle de déplacement
	fSpeed: 0,								// Vitesse de déplacement initialisée à partir du blueprint du sprite
	fMovingSpeed: 0,						// Dernière vitesse enregistrée
	fRotSpeed: 0,							// Vitesse de rotation initialisée à partir du blueprint du sprite
	xInertie: 0,							// Vitesse utilisée pour accelerer les calculs...
	yInertie: 0,							// ... lorsque vitesse et angle sont conservée
	xSpeed: 0,								// Dernière vitesse X appliquée
	ySpeed: 0,								// Dernière vitesse Y appliquée
	xSector: -1,							// x Secteur d'enregistrement pour les collision ou les test de proximité
	ySector: -1,							// y ...	
	nSectorRank: -1,						// Rang dans le secteur pour un repérage facile
	nSize: 16,								// Taile du polygone de collision mobile-mur
	oSprite: null,							// Référence du sprite
	oThinker: null,
	oWallCollision: null,					// x: bool : on bumpe un mur qui empeche la progression en X
	oMobileCollision: null,
	oFrontCell: null,						// coordonnées du bloc devant soit

	nBlueprintType: null,					// type de mobile : une des valeurs de GEN_DATA.blueprintTypes
	bSlideWall: true,						// True: corrige la trajectoire en cas de collision avec un mur
	bVisible: true,							// Visibilité au niveau du mobile (le sprite dispose de sont propre flag de visibilité prioritaire à celui du mobile)
	bWallCollision: false,

	//oData: null,


    /**
	 * Retreive the blueprint of the sprite associated with this mobile
	 * If a parameter is given, the method will return its values
	 * else the method return the blueprint object
	 * if no sprite is defined, the method returns null
     * @param sXData {string=} a parameter of the blueprint
     * @returns {*}
     */
	getBlueprint: function(sXData) {
		if (this.oSprite) {
			if (sXData === undefined) {
				return this.oSprite.oBlueprint;
			} else {
				if (this.oSprite.oBlueprint) {
					return this.oSprite.oBlueprint.data(sXData);
				} else {
					return null;
				}
			}
		} else {
			return null;
		}
	},

	isMoving: function() {
		return this.x !== this.xSave || this.y !== this.ySave;
	},

	/**
	 * Renvoie le type de blueprint
	 * Si le mobile n'a pas de sprite (et n'a pas de blueprint)
	 * On renvoie 0, c'est généralement le cas pour le mobile-caméra
	 * @return {int}
	 */
	getType: function() {
		if (this.nBlueprintType === null) {
			if (this.oSprite) {
				this.nBlueprintType = this.oSprite.oBlueprint.nType;
			} else if (this == this.oRaycaster.oCamera){
				this.nBlueprintType = RC.OBJECT_TYPE_PLAYER;
			} else {
				this.nBlueprintType = RC.OBJECT_TYPE_NONE;
			}
		}
		return this.nBlueprintType;
	},


	// évènements

    /**
	 * Define the thinker
     * @param oThinker {O876_Raycaster.Thinker}
     */
	setThinker: function(oThinker) {
		this.oThinker = oThinker;
		if (oThinker) {
			this.oThinker.oMobile = this;
		}
		this.oWallCollision = {x: 0, y: 0};
		this.gotoLimbo();
	},

    /**
	 * Get the thinker instance defined previously by setThinker
     * @returns {O876_Raycaster.Thinker}
     */
	getThinker: function() {
		return this.oThinker;
	},

    /**
	 * Makes the thinker think
     */
	think: function() {
		this.xSave = this.x;
		this.ySave = this.y;
		if (this.oThinker) {
			this.xSpeed = 0;
			this.ySpeed = 0;
			this.oThinker.think();
		}
	},
	
	/**
	 * Rotates the mobile point of view angle
	 * @param f {number} delta en radiant
	 */
	rotate: function(f) {
		this.setAngle(this.fTheta + f);
	},

    /**
	 * Sets the mobile speed
     * @param f {number} new speed
     */
	setSpeed: function(f) {
		this.fSpeed = f;
	},

    /**
	 * Get the mobile speed previously defined by blueprint or by setSpeed
     * @returns {number}
     */
	getSpeed: function() {
		return this.fSpeed;
	},

    /**
	 * Define a new angle
     * @param f {number}
     */
	setAngle: function(f) {
		this.fTheta = f % (PI * 2);
	},

    /**
	 * Get the angle value previously define by setAngle
     * @returns {number}
     */
	getAngle: function() {
		return this.fTheta;
	},	
	
	/** 
	 * Renvoie les coordonnée du bloc devant le mobile
	 * @return {x, y}
	 */
	getFrontCellXY: function() {
		if (this.oFrontCell === null) {
			this.oFrontCell = {};
		}
		var rc = this.oRaycaster;
		var nActionRadius = rc.nPlaneSpacing * 0.75;
		this.oFrontCell.x = (this.x + Math.cos(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		this.oFrontCell.y = (this.y + Math.sin(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		return this.oFrontCell;
	},


	/**
	 * Quitte la grille de collision de manière à ne plus interférer avec les autres sprites
	 */
	gotoLimbo: function() {
		this.oRaycaster.oMobileSectors.unregister(this);
		this.xSector = -1;
		this.ySector = -1;
	},

	/** Modifie la position du mobile
	 * @param x nouvelle position x
	 * @param y nouvelle position y
	 */
	setXY: function(x, y) {
		var rc = this.oRaycaster;
		var ps = rc.nPlaneSpacing;
		this.x = x;
		this.y = y;
		var xs = x / ps | 0;
		var ys = y / ps | 0;
		if (xs !== this.xSector || ys !== this.ySector) {
			rc.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			rc.oMobileSectors.register(this);
		}
		// collision intersprites
		this.oRaycaster.oHorde.computeCollision(this);
	},

	rollbackXY: function() {
		var ps = this.oRaycaster.nPlaneSpacing;
		this.x = this.xSave;
		this.y = this.ySave;
		this.xSpeed = 0;
		this.ySpeed = 0;
		var xs = this.x / ps | 0;
		var ys = this.y / ps | 0;
		if (xs !== this.xSector || ys !== this.ySector) {
			this.oRaycaster.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			this.oRaycaster.oMobileSectors.register(this);
		}
	},

	_vecScale: function(v, fScale) {
		var v1 = MathTools.normalize(v.x, v.y);
		return {
			x: v1.x * fScale,
			y: v1.y * fScale
        };
	},

	/**
	 * Détermine la collision entre le mobile et les murs du labyrinthe
	 * @typedef {Object} xy
	 * @property {number} x
	 * @property {number} y
	 *
	 * @param vPos {xy} position du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param vSpeed {xy} delta de déplacement du mobile. ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param nSize {number} demi-taille du mobile
	 * @param nPlaneSpacing {number} taille de la grille
	 * (pour savoir ou est ce qu'on s'est collisionné). ATTENTION ce vecteur est mis à jour par la fonction !
	 * @param bCrashWall {boolean} si true alors il n'y a pas de correction de glissement
	 * @param pSolidFunction {function} fonction permettant de déterminer si un point est dans une zone collisionnable
	 */
	computeWallCollisions: function(vPos, vSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction) {
		var nDist = MathTools.distance(vSpeed.x, vSpeed.y);
		if (nDist > nSize) {
			var vSubSpeed = this._vecScale(vSpeed, nSize);
			var nModDist = nDist % nSize;
			var r, pos, speed;
			if (nModDist) {
				var vModSpeed = this._vecScale(vSpeed, nModDist);
				r = this.computeWallCollisions(vPos, vModSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction);
				pos = r.pos;
				speed = r.speed;
			} else {
				pos = vPos;
				speed = {x: 0, y: 0};
			}
			for (var iIter = 0; iIter < nDist; iIter += nSize) {
				r = this.computeWallCollisions(pos, vSubSpeed, nSize, nPlaneSpacing, bCrashWall, pSolidFunction);
				pos = r.pos;
				speed = speed.add(r.speed);
			}
			return {
				pos: pos,
				speed: speed,
				wcf: r.wcf
			};
		}
		// par defaut pas de colision détectée
		var oWallCollision = {x: 0, y: 0};
		var dx = vSpeed.x;
		var dy = vSpeed.y;
		var x = vPos.x;
		var y = vPos.y;
		// une formule magique permettant d'igorer l'oeil "à la traine", evitant de se faire coincer dans les portes
		var iIgnoredEye = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx === dy && dx < 0) ? 2 : 0);
		var xClip, yClip, ix, iy, xci, yci;
		var bCorrection = false;
		// pour chaque direction...
		for (var i = 0; i < 4; ++i) {
			// si la direction correspond à l'oeil à la traine...
			if (iIgnoredEye === i) {
				continue;
			}
			// xci et yci valent entre -1 et 1 et correspondent aux coeficients de direction
			xci = (i & 1) * Math.sign(2 - i);
			yci = ((3 - i) & 1) * Math.sign(i - 1);
			ix = nSize * xci + x;
			iy = nSize * yci + y;
			// déterminer les collsion en x et y
			xClip = pSolidFunction(ix + dx, iy);
			yClip = pSolidFunction(ix, iy + dy);
			if (xClip) {
				dx = 0;
				if (bCrashWall) {
					dy = 0;
				}
				oWallCollision.x = xci;
				bCorrection = true;
			}
			if (yClip) {
				dy = 0;
				if (bCrashWall) {
					dx = 0;
				}
				oWallCollision.y = yci;
				bCorrection = true;
			}
		}
		x += dx;
		y += dy;
		if (bCorrection) {
			// il y a eu collsion
			// corriger la coordonée impactée
			if (oWallCollision.x > 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.x < 0) {
				x = (x / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
			if (oWallCollision.y > 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nPlaneSpacing - 1 - nSize;
			} else if (oWallCollision.y < 0) {
				y = (y / nPlaneSpacing | 0) * nPlaneSpacing + nSize;
			}
		}
		return {
			pos: {x: x, y: y},
			speed: {x: x - vPos.x, y: y - vPos.y},
			wcf: oWallCollision
		};
	},


    /**
     * Fait glisser le mobile
     * détecte les collision avec le mur
     * @param dx {number}
     * @param dy {number}
     */
    slide: function(dx, dy) {
    	var vPos = {x: this.x, y: this.y};
        var vSpeed = {x: dx, y: dy};
        var rc = this.oRaycaster;
		var r = this.computeWallCollisions(
			vPos,
			vSpeed,
			this.nSize,
			this.oRaycaster.nPlaneSpacing,
			!this.bSlideWall,
			function(x, y) { return rc.clip(x, y, 1); }
		);
	    this.setXY(r.pos.x, r.pos.y);
        this.xSpeed = r.speed.x;
        this.ySpeed = r.speed.y;
        this.oWallCollision = r.wcf;
    },


	/**
	 * Déplace la caméra d'un certain nombre d'unité vers l'avant
     * @param fAngle {number} Angle of displacement
     * @param fDist {number} Distance de déplacement
	 */
	move: function(fAngle, fDist) {
		if (this.fMovingAngle != fAngle || this.fMovingSpeed != fDist) {
			this.fMovingAngle = fAngle;
			this.fMovingSpeed = fDist;
			this.xInertie = Math.cos(fAngle) * fDist;
			this.yInertie = Math.sin(fAngle) * fDist;
		}
		this.slide(this.xInertie, this.yInertie);
	},

	/**
	 * Test de collision avec le mobile spécifié
	 * @param oMobile {O876_Raycaster.Mobile} mobile susceptible d'entrer en collision
	 * @returnn {bool}
	 */
	hits: function(oMobile) {
		if (this.bEthereal || oMobile.bEthereal) {
			return false;
		}
		var dx = oMobile.x - this.x;
		var dy = oMobile.y - this.y;
		var d2 = dx * dx + dy * dy;
		var dMin = this.nSize + oMobile.nSize;
		dMin *= dMin;
		return d2 < dMin;
	},

	/**
	 * Fait tourner le mobile dans le sens direct en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateLeft: function() {
		this.rotate(-this.fRotSpeed);
	},

	/**
	 * Fait tourner le mobile dans le sens retrograde en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateRight: function() {
		this.rotate(this.fRotSpeed);
	},

	/**
	 * Déplace le mobile vers l'avant, en fonction de sa vitesse
	 */
	moveForward: function() {
		this.move(this.fTheta, this.fSpeed);
	},

	/**
	 * Déplace le mobile vers l'arrière, en fonction de sa vitesse
	 */
	moveBackward: function() {
		this.move(this.fTheta, -this.fSpeed);
	},

	/**
	 * Déplace le mobile d'un mouvement latéral vers la gauche, en fonction de sa vitesse
	 */
	strafeLeft: function() {
		this.move(this.fTheta - PI / 2, this.fSpeed);
	},

	/**
	 * Déplace le mobile d'un mouvement latéral vers la droite, en fonction de sa vitesse
	 */
	strafeRight: function() {
		this.move(this.fTheta + PI / 2, this.fSpeed);
	}
});

O2.mixin(O876_Raycaster.Mobile, O876.Mixin.Data);
