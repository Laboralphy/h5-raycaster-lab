/** La classe mobile permet de mémoriser la position des objets circulant dans le laby
 * O876 Raycaster project
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
	xCollisions: [0, 1, 0, -1],	// Tableau des collision
	yCollisions: [-1, 0, 1, 0],	// ...
	oThinker: null,
	oWallCollision: null,					// x: bool : on bumpe un mur qui empeche la progression en X
	oMobileCollision: null,
	oFrontCell: null,						// coordonnées du bloc devant soit

	nBlueprintType: null,					// type de mobile : une des valeurs de GEN_DATA.blueprintTypes
	bSlideWall: true,						// True: corrige la trajectoire en cas de collision avec un mur
	bVisible: true,							// Visibilité au niveau du mobile (le sprite dispose de sont propre flag de visibilité prioritaire à celui du mobile)
	bWallCollision: false,

	//oData: null,


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

	/** Renvoie le type de blueprint
	 * Si le mobile n'a pas de sprite (et n'a pas de blueprint)
	 * On renvoie 0, c'est généralement le cas pour le mobile-caméra
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

	setThinker: function(oThinker) {
		this.oThinker = oThinker;
		if (oThinker) {
			this.oThinker.oMobile = this;
		}
		this.oWallCollision = {x: 0, y: 0};
		this.gotoLimbo();
	},
	
	getThinker: function() {
		return this.oThinker;
	},

	think: function() {
		this.xSave = this.x;
		this.ySave = this.y;
		if (this.oThinker) {
			this.xSpeed = 0;
			this.ySpeed = 0;
			this.oThinker.think();
		}
	},
	
	/** Modifie l'angle de la caméra d'un delta.
	 * @param f float delta en radiant
	 */
	rotate: function(f) {
		this.setAngle(this.fTheta + f);
	},

	setSpeed: function(f) {
		this.fSpeed = f;
	},

	getSpeed: function(f) {
		return this.fSpeed;
	},

	setAngle: function(f) {
		this.fTheta = f % (PI * 2);
		/*
		var f2Pi = 2 * PI;
		if (f > 0) {
			while (this.fTheta >= PI) {
				this.fTheta -= f2Pi;
			}
		} else {
			while (this.fTheta < -PI) {
				this.fTheta += f2Pi;
			}
		}*/
	},
	
	getAngle: function(f) {
		return this.fTheta;
	},	
	
	/** 
	 * Renvoie les coordonnée du bloc devant le mobile
	 * @param oMobile
	 * @return object x y
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


	/** Quitte la grille de collision de manière à ne plus interférer avec les autres sprites
	 *
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
		if (xs != this.xSector || ys != this.ySector) {
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
		if (xs != this.xSector || ys != this.ySector) {
			this.oRaycaster.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			this.oRaycaster.oMobileSectors.register(this);
		}
	},

	/**
	 * Fait glisser le mobile
	 * détecte les collision avec le mur
	 */
	slide: function(dx, dy) {
		var xc = this.xCollisions;
		var yc = this.yCollisions;
		var x = this.x;
		var y = this.y;
		var ix, iy;
		var ps = this.oRaycaster.nPlaneSpacing;
		var nSize = this.nSize;
		var wc = this.oWallCollision;
		wc.x = 0;
		wc.y = 0;
		var nXYFormula = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx == dy && dx < 0) ? 2 : 0);
		var bCorrection = false;
		var xClip, yClip;
		var bCrashWall = !this.bSlideWall;
		this.bWallCollision = false;
		for (var i = 0; i < 4; ++i) {
			if (nXYFormula == i) {
				continue;
			}
			ix = nSize * xc[i] + x;
			iy = nSize * yc[i] + y;
			xClip = this.oRaycaster.clip(ix + dx, iy, 1);
			yClip = this.oRaycaster.clip(ix, iy + dy, 1);
			if (xClip) {
				dx = 0;
				if (bCrashWall) {
					dy = 0;
				}
				wc.x = xc[i];
				bCorrection = true;
			}
			if (yClip) {
				dy = 0;
				if (bCrashWall) {
					dx = 0;
				}
				wc.y = yc[i];
				bCorrection = true;
			}
		}
		this.bWallCollision = bCorrection;
		if (bCorrection) {
			if (wc.x > 0) {
				x = (x / ps | 0) * ps + ps - 1 - nSize;
			} else if (wc.x < 0) {
				x = (x / ps | 0) * ps + nSize;
			}
			if (wc.y > 0) {
				y = (y / ps | 0) * ps + ps - 1 - nSize;
			} else if (wc.y < 0) {
				y = (y / ps | 0) * ps + nSize;
			}
			bCorrection = false;
		}
		this.setXY(x + dx, y + dy);
		this.xSpeed = dx;
		this.ySpeed = dy;
	},
	
	

	/** Déplace la caméra d'un certain nombre d'unité vers l'avant
	 * @param fDist float Distance de déplacement
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

	/** Test de collision avec le mobile spécifié
	 * @param oMobile mobile susceptible d'entrer en collision
	 * @returnn bool
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

	/** Fait tourner le mobile dans le sens direct en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateLeft: function() {
		this.rotate(-this.fRotSpeed);
	},

	/** Fait tourner le mobile dans le sens retrograde en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateRight: function() {
		this.rotate(this.fRotSpeed);
	},

	/** Déplace le mobile vers l'avant, en fonction de sa vitesse
	 */
	moveForward: function() {
		this.move(this.fTheta, this.fSpeed);
	},

	/** Déplace le mobile vers l'arrière, en fonction de sa vitesse
	 */
	moveBackward: function() {
		this.move(this.fTheta, -this.fSpeed);
	},

	/** Déplace le mobile d'un mouvement latéral vers la gauche, en fonction de sa vitesse
	 */
	strafeLeft: function() {
		this.move(this.fTheta - PI / 2, this.fSpeed);
	},

	/** Déplace le mobile d'un mouvement latéral vers la droite, en fonction de sa vitesse
	 */
	strafeRight: function() {
		this.move(this.fTheta + PI / 2, this.fSpeed);
	}
});

O2.mixin(O876_Raycaster.Mobile, O876.Mixin.Data);
