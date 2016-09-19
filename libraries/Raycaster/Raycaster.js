/**
 * Raycasting engine
 * -----------------
 * Writen by Raphael Marandet
 * raphael.marandet@gmail.com
 * 
 * Inspiration : 
 * 2 web sites gave me inspiration to create this engine.
 * #1 the first one : 
 *   Raytracing Engine
 *   C0D3D by Gunnar Leffler
 *   http://www.leftech.com/raycaster.htm
 *   Version 1.0
 *   
 * #2 the second one :
 *   http://arguingwithmyself.com/demos/raycaster/
 *   I looked at version 1
 *
 * I took one function from each (CastRay() from #1 and DrawScreen() from #2), 
 * merged them both and added some features.
 * - sprite support with alpha
 * - semi-transparent walls (with windows, iron bars, grates...).
 * - doors (one panel, two panels, sliding up, squeezing up). 
 * - secret doors (just like wolfenstein 3D secret walls).
 * - ambient light and darkness.
 * - weapon canvas layer.
 * - speed optimization.
 * - raster effects.
 * - ...
 */


/** Notes:
 * 
 * Raycaster configuration JSO
 * 
 * raycasterConfig = {
 *   canvas: string | HTMLCanvasElement,   // canvas id or canvas instance
 *   drawMap: boolean,   // drawing map or not
 * }
 */
 
/* jshint undef: false, unused: true */
/* globals O2, PI, O876, O876_Raycaster, GfxTools, ArrayTools, Marker, MathTools */
 
O2.createClass('O876_Raycaster.Raycaster',  {
	// Laby Phys Properties
	PHYS_NONE : 0x00,
	PHYS_WALL : 0x01,

	// Laby door properties
	PHYS_FIRST_DOOR : 0x02,
	PHYS_DOOR_SLIDING_UP : 0x02,
	PHYS_CURT_SLIDING_UP : 0x03,
	PHYS_DOOR_SLIDING_DOWN : 0x04,
	PHYS_CURT_SLIDING_DOWN : 0x05,
	PHYS_DOOR_SLIDING_LEFT : 0x06,
	PHYS_DOOR_SLIDING_RIGHT : 0x07,
	PHYS_DOOR_SLIDING_DOUBLE : 0x08,

	PHYS_LAST_DOOR : 0x08,

	PHYS_SECRET_BLOCK : 0x09,
	PHYS_TRANSPARENT_BLOCK : 0x0A,
	PHYS_INVISIBLE_BLOCK : 0x0B,
	PHYS_OFFSET_BLOCK : 0x0C,
	PHYS_DOOR_D : 0x0D,
	PHYS_DOOR_E : 0x0E,
	PHYS_DOOR_F : 0x0F,
	// Permet de régler les évènements liés au temps
	TIME_FACTOR : 50,  // c'est le nombre de millisecondes qui s'écoule entre chaque calcul

	// World Render params
	oWall : null,
	oFloor : null,
	oBackground : null,
	nMapSize : 0,
	aMap : null,
	oVisual : null,
	nPlaneSpacing : 64,
	nShadingFactor : 50,
	nShadingThreshold : 15,    // default 15
	nDimmedWall : 7,
	oDoors : null,
	oXMap : null, // Données supplémentaires pour chaque faces d'un block
	oMinimap: null,
	oRainbow: null, // outil de management des couleurs

	// Textures
	xTexture : 64,
	yTexture : 96,

	// Viewport
	_oCanvas : null,
	_oContext : null,
	_oRenderCanvas : null,
	_oRenderContext : null,
	
	b3d: false, // active l'option 3D
	i3dFrame: 0, // what frame is being rendered
	x3dOfs: 0, // offset 3D
	y3dOfs: 0, // offset 3D
	n3dGap: 4, // ecar entre deux camera
	xLimitL: 0, // x limite à gauche
	xLimitR: 400, // x limite à droite
	bUseVideoBuffer : true, // true: semble plus rapide sur chromium
	bGradient: true, // dessine des gradients
	bFloor : true,	// utilise le rendu du sol (automatiquement positionné selon le world def)
	bCeil : true,	// active le plafond
	bSky: false,		// active le ciel
	bFlatSky: false,	// a utiliser si le plafond a des "trous" au travers desquels on peut voir le ciel.
		// sinon on ne pourra voir le ciel qu'a travers les fenetre

	nZoom : 1,
	wCanvas : 0, // ratio 0.625
	hCanvas : 0,
	xScrSize : 0,
	yScrSize : 0,
	fViewAngle : 0,
	fViewHeight: 1,

	// Rendu des murs
	nRayLimit: 100,
	bExterior : false,
	nMeteo : 0,
	fCameraBGOfs : 0,
	fBGOfs: 0,
	fDist : 1,
	bSideWall : false,
	nWallPanel : 1,
	nWallPos : 1,
	xWall : 0,
	yWall : 0,
	aZBuffer : null,
	oContinueRay: null,
	
	// sprites
	oHorde : null,
	aScanSectors : null,
	oMobileSectors : null,
	oThinkerManager : null,
	aVisibleMobiles: null,
	aDiscardedMobiles: null,

	// weapon Layer
	oWeaponLayer: null,

	oImages : null,

	// Effects
	oEffects : null,

	// Data
	aWorld : null,
	oConfig : null,
	
	oUpper: null,
	
	setConfig : function(oConfig) {
		if (this.oConfig === null) {
			this.oConfig = oConfig;
		} else {
			for (var i in oConfig) {
				this.oConfig[i] = oConfig[i];
			}
		}
	},
	
	set3d: function(b) {
		if (b) {
			this.b3d = true;
			this.xLimitL = this.xScrSize * 0.25 | 0;
			this.xLimitR = this.xScrSize * 0.75 | 0;
			if (this.oUpper) {
				this.oUpper.b3d = true;
				this.oUpper.xLimitL = this.xScrSize * 0.25 | 0;
				this.oUpper.xLimitR = this.xScrSize * 0.75 | 0;
			}
		} else {
			this.b3d = false;
			if (this.oUpper) {
				this.oUpper.b3d = false;
			}
		}
	},

	/** Définition des données initiale du monde
	 * @param aWorld objet contenant des définition de niveau
	 */
	defineWorld : function(aWorld) {
		this.aWorld = aWorld;
	},
	
	getMapSize: function() {
		return this.nMapSize;
	},

	initialize : function() {
		this.oRainbow = new O876.Rainbow();
		this.fViewAngle = PI / 4;
		if (this.oConfig.planeSpacing) {
			this.nPlaneSpacing = this.oConfig.planeSpacing; 
			this.xTexture = this.oConfig.planeSpacing; 
		}
		if (this.oConfig.wallHeight) {
			this.yTexture = this.oConfig.wallHeight; 
		}
		if (this._oCanvas === null) {
			this.initCanvas();
		}
		this.setDetail(1);
		this.aZBuffer = [];
		this.oEffects = new O876_Raycaster.GXManager();
		if (this.oImages === null) {
			this.oImages = new O876_Raycaster.ImageLoader();
		}
		this.oThinkerManager = new O876_Raycaster.ThinkerManager();
		this.oContinueRay = { bContinue: false };
		this.oWeaponLayer = {
			canvas: null,
			x: -1024,
			y: 0,
			width: 0,
			height: 0,
			index: 0,
			alpha: 1,
			zoom: 1
		};
		// économiser la RAM en diminuant le nombre de shading degrees
		if (this.oConfig.shades) {
			this.nShadingThreshold = this.oConfig.shades;
		}
		if (this.oConfig.stereo) {
			this.set3d(true);
		}
		
		switch (this.nShadingThreshold) {
			case 0:
				this.nDimmedWall = 0;
				break;
				
			case 1:
				this.nDimmedWall = 1;
				break;
				
			default:
				this.nDimmedWall = Math.round(this.nShadingThreshold / 3);
				break;
		}
	},
	
	finalize: function() {
		this.oEffects.clear();
		this.oEffects = null;
		this.oImages.finalize();
		this.oImages = null;
		this.oThinkerManager = null;
	},

	/** Le shade process est un processus qui peut prendre du temps
	 * aussi proposons nous un callback destiné à afficher une barre de progression
	 */
	shadeProcess : function() {
		if (this.nShadingThreshold === 0) {
			return true;
		}
		var i = '';
		var w = this.shadeImage(this.oWall.image, false);
		this.oWall.image = w;
		if (this.bFloor) {
			w = this.shadeImage(this.oFloor.image, false);
			this.oFloor.image = w;
		}
		
		for (i in this.oHorde.oTiles) {
			if (this.oHorde.oTiles[i].bShading) {
				w = this.shadeImage(this.oHorde.oTiles[i].oImage, true);
				this.oHorde.oTiles[i].bShading = false;
				this.oHorde.oTiles[i].oImage = w;
				return false;
			}
		}
		return true;
	},
	
	drawUpper: function() {
		this.oUpper.fViewHeight = this.fViewHeight + 2; 
		this.oUpper.drawScreen();
	},
	
	getDiscardedMobiles: function() {
		return this.aDiscardedMobiles;
	},

	frameProcess : function() {
		this.aDiscardedMobiles = this.updateHorde();
		this.oEffects.process();
	},

	frameRender : function() {
		if (this.b3d) {
			var c = this.oCamera; // camera
			var a = c.fTheta; // angle camera
			var cx = c.x; // position x camera centrale
			var cy = c.y; // position y camera centrale
			var r = this.n3dGap; // demi distance entre 2 yeux
			var al = a - PI / 2; // angle à adopter à gauche
			var ar = a + PI / 2; // angle à adopter à droite
			var fSinL = Math.sin(al);
			var fCosL = Math.cos(al);
			var fSinR = Math.sin(ar);
			var fCosR = Math.cos(ar);
			var cxl = r * fCosL + cx; 
			var cyl = r * fSinL + cy; 
			var cxr = r * fCosR + cx; 
			var cyr = r * fSinR + cy;
			c.x = cxl;
			c.y = cyl;
			this.i3dFrame = 0;
			this.drawScreen();
			this.oEffects.render();
			this.flipBuffer();
			this.i3dFrame = 1;
			c.x = cxr;
			c.y = cyr;
			this.i3dFrame = 1;
			this.drawScreen();
			this.oEffects.render();
			this.flipBuffer();
			c.x = cx;
			c.y = cy;
		} else {
			this.drawScreen();
			this.oEffects.render();
			this.flipBuffer();
		}
	},
	
	/**
	 * Retreive a tile
	 */
	getTile: function(sTile) {
		var t = this.oHorde.oTiles;
		if (sTile in t) {
			return t[sTile];
		} else {
			throw new Error('this tile is not defined : "' + sTile + '"');
		}
	},
	
	/**
	 * An emergency fonction which decrease the level of detail
	 * because the computer is too slow
	 */
	downgrade: function() {
		this._oCanvas.width >>= 1;
		this._oCanvas.height >>= 1;
		this.xScrSize >>= 1;
		this.yScrSize >>= 1;
		this.backgroundRedim();
		if (this.oUpper) {
			this.oUpper.xScrSize >>= 1;
			this.oUpper.yScrSize >>= 1;
		}
	},

	/**
	 * Ajoute une instance GX Effect dans le circuit
	 * @param G Classe GX Effect
	 */
	addGXEffect: function(G) {
		var g = new G(this);
		this.oEffects.addEffect(g);
		return g;
	},
	
	/** Rendu graphique de l'arme
	 * canvas : référence du canvas source
	 * index : numero de la frame affiché
	 * width : largeur en pixel d'une frame
	 * height : hauteur d'une frame
	 * x : position du sprite à l'écran
	 * y : *        *         *
	 * zoom : zoom appliqué au sprite 
	 */
	drawWeapon: function() {
		var w = this.oWeaponLayer;
		if (w.index >= 0 && w.canvas) {
			var fAlpha = 1;
			if (w.alpha != 1) {
				fAlpha = this._oRenderContext.globalAlpha;
				this._oRenderContext.globalAlpha = w.alpha;
			}
			this._oRenderContext.drawImage(
				w.canvas,    // canvas des tiles d'arme 
				w.index * w.width,   
				0, 
				w.width, 
				w.height, 
				w.x, 
				w.y, 
				w.width * w.zoom | 0, 
				w.height * w.zoom | 0
			);
			if (w.alpha != 1) {
				this._oRenderContext.globalAlpha = fAlpha;
			}
		}
	},

	buildLevel : function() {
		this.oHorde = null;
		this.oEffects.clear();
		this.aScanSectors = null;
		this.oMobileSectors = null;
		this.buildMap();
		this.buildHorde();
	},

	updateHorde : function() {
		return this.oHorde.think();
	},

	initCanvas : function() {
		if (typeof this.oConfig.canvas == 'string') {
			this._oCanvas = document.getElementById(this.oConfig.canvas);
		} else if (typeof this.oConfig.canvas == 'object' && this.oConfig.canvas !== null) {
			this._oCanvas = this.oConfig.canvas;
		} else {
			throw new Error('initCanvas failed: configuration object needs a valid canvas entry (dom or string id)');
		}
		if (this.wCanvas) {
			this._oCanvas.width = this.wCanvas;
		}
		if (this.hCanvas) {
			this._oCanvas.height = this.hCanvas;
		}
		this._oContext = this._oCanvas.getContext('2d');
		if (this.bUseVideoBuffer) {
			if (this._oRenderCanvas === null) {
				this._oRenderCanvas = O876.CanvasFactory.getCanvas();
			}
			this._oRenderCanvas.height = this._oCanvas.height;
			this._oRenderCanvas.width = this._oCanvas.width;
			this._oRenderContext = this._oRenderCanvas.getContext('2d');
		} else {
			this._oRenderCanvas = this._oCanvas;
			this._oRenderContext = this._oContext;
		}
		if ('smoothTextures' in this.oConfig) {
			this._oRenderContext.mozImageSmoothingEnabled = this.oConfig.smoothTextures;
			this._oRenderContext.webkitImageSmoothingEnabled = this.oConfig.smoothTextures;
		}
		this.xScrSize = this._oCanvas.width;
		this.yScrSize = this._oCanvas.height >> 1;
	},
	
	getRenderContext: function() {
		return this._oRenderContext;
	},

	getRenderCanvas: function() {
		return this._oRenderCanvas;
	},
	
	getScreenCanvas: function() {
		return this._oCanvas;
	},

	getScreenContext: function() {
		return this._oContext;
	},

	/** Modification du détail 
	 * @param nDetail 0: interdit ; 1: haute qualité ; 2: bonne qualité ; 4 basse qualité
	 */
	setDetail : function(nDetail) {
		switch (nDetail) {
			case 1:
				this.nZoom = 1;
				this.xScrSize = this._oCanvas.width;
				this.drawFloor = this.drawFloor_zoom1;
				this.drawFloorAndCeil = this.drawFloorAndCeil_zoom1;
				break;
				
			default:
				console.warning('setting detail is now deprecated. Use css resizing instead');
		}
	},

	loadImage : function(sUrl) {
		return this.oImages.load(sUrl);
	},
	
	
	filterImage : function(oImage, f) {
		if (f) {
			var oCtx = oImage.getContext('2d');
			var oImgData = oCtx.getImageData(0, 0, oImage.width, oImage.height);
			var aPixData = oImgData.data;
			var nPixCount = aPixData.length;
			var fr = f.r, fg = f.g, fb = f.b;
			/*var b255 = function(x) {
				return Math.min(255, Math.max(0, x | 0));
			};*/
			for (var iPix = 0; iPix < nPixCount; iPix += 4) {
				aPixData[iPix] = Math.min(255, Math.max(0, aPixData[iPix] * fr | 0));     //b255(aPixData[iPix] * fr); 
				aPixData[iPix + 1] = Math.min(255, Math.max(0, aPixData[iPix + 1] * fg | 0));     //b255(aPixData[iPix + 1] * fg); 
				aPixData[iPix + 2] = Math.min(255, Math.max(0, aPixData[iPix + 2] * fb | 0));    //b255(aPixData[iPix + 1] * fb); 
			}
			oCtx.putImageData(oImgData, 0, 0);
		}
	},

	/** Le shading est un traitement long et est soumis à une limite de temps
	 * Si la fonction dépasse le temps limite elle se termine
	 */
	shadeImage : function(oImage, bSprite) {
		if (oImage.__shaded) {
			return oImage;
		}
		// Récupération du Shaded en cours (ou création d'un nouveau)
		var oShaded = O876.CanvasFactory.getCanvas();
		oShaded.width = oImage.width;
		oShaded.height = oImage.height * (this.nShadingThreshold + 1);
		var oCtx = oShaded.getContext('2d');
		var g;
		var nMethod = 1;
		g = {
			r : this.oVisual.fogColor.r,
			g : this.oVisual.fogColor.g,
			b : this.oVisual.fogColor.b
		};
		// Maximiser le filter
		if (bSprite && this.oVisual.filter) {
			var oFilteredImage;
			oFilteredImage = O876.CanvasFactory.getCanvas();
			oFilteredImage.width = oImage.width;
			oFilteredImage.height = oImage.height;
			oFilteredImage.getContext('2d').drawImage(oImage, 0, 0);
			this.filterImage(oFilteredImage, this.oVisual.filter);
			oImage = oFilteredImage;
		}
		var fAlphaMin = this.oVisual.diffuse || 0;
		// i : 0 -> shadingThreshold
		// f : 0 -> 1
		// f2 : fAlphaMin -> 1
		for ( var i = 0; i <= this.nShadingThreshold; i++) {
			g.a = Math.min(i / this.nShadingThreshold, 1) * (1 - fAlphaMin);
			switch (nMethod) {
				case 0: // Méthode conservant l'Alpha (ne marche pas sous moz)
					oCtx.globalCompositeOperation = 'source-over';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.fillStyle = this.oRainbow.rgba(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'destination-in';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 1:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-atop';
					oCtx.fillStyle = this.oRainbow.rgba(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 2:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;
			}
		}
		oShaded.__shaded = true;
		return oShaded;
	},

	/**
	 * Clonage de mur.
	 * La texture nSide du pan mur spécifié par x, y est copiée dans un canvas transmis 
	 * à une function callBack. à charge de cette fonction de dessiner ce qu'elle veux dans 
	 * ce canvas cloné. cette modification sera reportée dans le jeu.
	 *   
	 * @param x coordonnée X du mur
	 * @param y coordonnée Y du mur
	 * @param nSide coté du mur 0:nord, 1:est, 2:sud, 3:ouest
	 * @param pDrawingFunction fonction qui servira à déssiner le mur (peut être un tableau [instance, function],
	 * cette fonction devra accepter les paramètres suivants :
	 * - param1 : instance du raycaster
	 * - param2 : instance du canvas qui contient le clone de la texture.
	 * - param3 : coordoonée X du mur
	 * - param4 : coordoonée Y du mur
	 * - param5 : coté du mur concerné
	 */
	cloneWall : function(x, y, nSide, pDrawingFunction) {
		if (nSide === false) {
			for (var i = 0; i < 4; ++i) {
				this.cloneWall(x, y, i, pDrawingFunction);
			}
			return;
		}
		if (pDrawingFunction === false) {
			this.oXMap.removeClone(x, y, nSide);
		} else {
			var c = this.oXMap.cloneTexture(this.oWall.image, this.aWorld.walls.codes[this.getMapCode(x, y)][nSide], x, y, nSide);
			pDrawingFunction(this, c, x, y, nSide);
			this.shadeCloneWall(c, x, y, nSide);
		}
	},

	shadeCloneWall : function(oCanvas, x, y, nSide) {
		var a = this.shadeImage(oCanvas, false);
		this.oXMap.get(x, y, nSide).surface = a;
		return a;
	},
	
	cloneFlat: function(x, y, nSide, pDrawingFunction) {
		if (nSide === false) {
			this.cloneFlat(x, y, 0, pDrawingFunction);
			this.cloneFlat(x, y, 1, pDrawingFunction);
			return;
		}
		if (pDrawingFunction === false) {
			this.oXMap.removeClone(x, y, nSide + 4);
			return;
		}
		var iTexture = this.aWorld.flats.codes[this.getMapCode(x, y)][nSide];
		if (iTexture < 0) {
			return;
		}
		var c = this.oXMap.cloneTexture(this.oFloor.image, iTexture, x, y, nSide + 4);
		nSide += 4;
		pDrawingFunction(this, c, x, y, nSide);
		c = this.shadeCloneWall(c, x, y, nSide);
		// faire l'image map du canvas
		var b = this.oXMap.get(x, y, nSide);
		var oCtx = c.getContext('2d');
		b.imageData = oCtx.getImageData(0, 0, c.width, c.height);
		b.imageData32 = new Uint32Array(b.imageData.data.buffer);
	},
	
	/* Code map
	 * Numéro de Tile (byte)
	 * Propriété physique (byte)
	 * - 0: pas d'état
	 * - 1: porte coulissant vers le haut
	 * - 2: porte coulissant vers le bas
	 * - 3: porte coulissant vers la gauche
	 * - 4: porte coulissant vers la droite
	 * Transitionneur (nombre permettant de faire evoluer un etat) (byte)
	 * - 1, 2, 3, 4: Offset de déplacement

	 */
	/** Vérifie l'existance d'une série de clé dans un objet
	 * @param oObj objet à vérifier
	 * @param aKeys liste des clés
	 * @return bool true : l'objet est OK, false : il manque une ou plusieur clé
	 */
	checkObjectStructure : function(oObj, xKeys) {
		// clé composée
		if (ArrayTools.isArray(xKeys)) {
			for (var i = 0; i < xKeys.length; i++) {
				this.checkObjectStructure(oObj, xKeys[i]);
			}
			return true;
		}
		if (xKeys.indexOf('.') >= 0) {
			var aKeys = xKeys.split('.');
			var sKey0 = aKeys.shift();
			if (this.checkObjectStructure(oObj, sKey0)) {
				// Vérifier premier objet
				return this.checkObjectStructure(oObj[sKey0], aKeys.join('.'));
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		} else {
			if (typeof oObj != 'object') {
				throw new Error('invalid object type : ' + (typeof oObj) + ' ; can not contain key [' + xKeys + ']');
			}
			if (oObj === null) {
				throw new Error('object is null, and can not contain key [' + xKeys + ']');
			}
			if (xKeys in oObj) {
				return true;
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		}
	},

	/** Construction de la map avec les donnée contenues dans aWorld
	 */
	buildMap : function() {
		var oData = this.aWorld;
		// verifier integrité des données
		try {
			this.checkObjectStructure(oData, [
			'map.length',
			'walls.src',
			'walls.codes',
			'startpoint.x',
			'startpoint.y',
			'startpoint.angle',
			'visual'
			]);
		} catch (e) {
			
		}
		this.nMapSize = oData.map.length;
		this.oMobileSectors = new O876_Raycaster.MobileRegister(
				this.nMapSize);
		this.oDoors = Marker.create();
		this.aMap = [];
		var yMap, xMap;
		for (yMap = 0; yMap < oData.map.length; ++yMap) {
			this.aMap[yMap] = new Uint32Array(oData.map[yMap].length);
			for (xMap = 0; xMap < oData.map[yMap].length; ++xMap) {
				this.aMap[yMap][xMap] = oData.map[yMap][xMap];
			}
		}
		this.oWall = {
			image : this.loadImage(oData.walls.src),
			codes : oData.walls.codes,
			animated : 'animated' in oData.walls ? oData.walls.animated : {}
		};
		if ('flats' in oData) {
			this.bFloor = true;
			var bEmptyCeil = oData.flats.codes.every(function(item) {
				if (item) {
					return item[1] === -1;
				} else {
					return true;
				}
			});
			var bEmptyFloor = oData.flats.codes.every(function(item) {
				if (item) {
					return item[0] === -1;
				} else {
					return true;
				}
			});
			this.bCeil = !bEmptyCeil;
			this.bFloor = !bEmptyFloor;
			if (this.bFloor) {
				this.oFloor = {
					image : this.loadImage(oData.flats.src),
					codes : oData.flats.codes,
					imageData : null,
					imageData32 : null,
					renderSurface32 : null
				};
			}
		} else {
			this.bFloor = false;
			this.bCeil = false;
		}
		if ('background' in oData && oData.background) {
			this.oBackground = this.loadImage(oData.background);
			this.bSky = true;
		} else {
			this.oBackground = null;
			this.bSky = false;
		}
		// construction des textures animées
		this.buildAnimatedTextures();
		// Définition de la caméra
		this.oCamera = new O876_Raycaster.Mobile();
		this.oCamera.oRaycaster = this;
		this.oCamera.fSpeed = 8;
		this.oCamera.fRotSpeed = 0.1;
		this.oCamera.xSave = this.oCamera.x = oData.startpoint.x;
		this.oCamera.ySave = this.oCamera.y = oData.startpoint.y;
		this.oCamera.xSector = this.oCamera.x / this.nPlaneSpacing | 0;
		this.oCamera.ySector = this.oCamera.y / this.nPlaneSpacing | 0;
		this.oCamera.fTheta = oData.startpoint.angle;
		this.oCamera.bActive = true;
		this.oVisual = {
			ceilColor: oData.visual.ceilColor,		// couleur du plafond au pixel le plus proche
			floorColor: oData.visual.floorColor,	// couleur du sol au pixel le plus proche
			light: oData.visual.light,				// puissance lumineuse combinée à la distance pour déterminer la luminosité final d'un objet 
			diffuse: oData.visual.diffuse,			// luminosité minimale de tout objet ou mur
			filter: oData.visual.filter,			// filtre coloré appliqué aux sprites
			fogDistance: oData.visual.fogDistance,	// indice du gradient correspondant à la fogColor (0..1)
			fogColor: oData.visual.fogColor			// couleur du fog
		};
		this.buildGradient();
		// Extra Map
		this.oXMap = new O876_Raycaster.XMap();
		this.oXMap.setBlockSize(this.xTexture, this.yTexture);
		this.oXMap.setSize(this.nMapSize, this.nMapSize);
		if ('uppermap' in oData && !!oData.uppermap) {
			this.buildSecondFloor();
		}
	},
	
	backgroundRedim: function() {
		var oBackground = this.oBackground;
		var dh = this.yScrSize << 1;
		if (oBackground && oBackground.height != dh) {
			var sw = oBackground.width;
			var sh = oBackground.height;
			var dw = sw * dh / sh | 0;
			var bg2 = O876.CanvasFactory.getCanvas();
			bg2.height = dh;
			bg2.width = dw;
			var ctx = bg2.getContext('2d');
			ctx.drawImage(oBackground, 0, 0, sw, sh, 0, 0, dw, dh);
			this.oBackground = bg2;
		}
	},
	
	/**
	 * Ajoute un second étage au raycaster
	 */
	buildSecondFloor: function() {
		// Ajout du second étage
		var oData = this.aWorld;
		if ('uppermap' in oData) {
			var SELF = this.constructor;
			var urc = new SELF();
			urc.TIME_FACTOR = this.TIME_FACTOR;
			urc.setConfig(this.oConfig);
			urc.bUseVideoBuffer = false;
			urc.initialize();
			var oUpperWorld = {
				map: oData.uppermap,
				walls: oData.walls,
				visual: oData.visual,
				startpoint: oData.startpoint,
				tiles: oData.tiles,
				blueprints: {},
				objects: []
			};
			urc.defineWorld(oUpperWorld);
			urc.buildMap();
			urc.bGradient = false;
			urc.oCamera = this.oCamera;
			urc.oWall = this.oWall;
			urc._oRenderCanvas = this._oRenderCanvas;
			urc._oRenderContext = this._oRenderContext;
			this.oUpper = urc;
		}
	},

	buildHorde : function() {
		this.oHorde = new O876_Raycaster.Horde(this);
		this.oHorde.oThinkerManager = this.oThinkerManager;
		var aData = this.aWorld;
		var oTiles = aData.tiles;
		var oBlueprints = aData.blueprints;
		var oMobs = aData.objects;
		this.oHorde.linkMobile(this.oCamera);
		var i = '';
		for (i in oTiles) {
			this.oHorde.defineTile(i, oTiles[i]);
		}
		for (i in oBlueprints) {
			this.oHorde.defineBlueprint(i, oBlueprints[i]);
		}
		for (i = 0; i < oMobs.length; i++) {
			this.oHorde.defineMobile(oMobs[i]);
		}
	},

	/** Création des gradient
	 * pour augmenter la luz :
	 * this.oVisual.light = 200; 
	 * this.oVisual.fogDistance = 1; 
	 * G.oRaycaster.buildGradient();
	 */
	buildGradient : function() {
		var g;
		var rainbow = this.oRainbow;
		this.oVisual.gradients = [];
		g = this._oRenderContext.createLinearGradient(0, 0, 0, this._oCanvas.height >> 1);
		g.addColorStop(0, rainbow.rgba(this.oVisual.ceilColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, rainbow.rgba(this.oVisual.fogColor));
		}
		g.addColorStop(1, rainbow.rgba(this.oVisual.fogColor));
		this.oVisual.gradients[0] = g;

		g = this._oRenderContext.createLinearGradient(0, this._oCanvas.height - 1, 0, (this._oCanvas.height >> 1) + 1);
		g.addColorStop(0, rainbow.rgba(this.oVisual.floorColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, rainbow.rgba(this.oVisual.fogColor));
		}
		g.addColorStop(1, rainbow.rgba(this.oVisual.fogColor));
		this.oVisual.gradients[1] = g;

		this.nShadingFactor = this.oVisual.light;
	},
	
	insideMap: function(x) {
		return x >= 0 && x < this.nMapSize;
	},

	/** Lance un rayon dans la map actuelle
	 * Lorsque le rayon frappe un mur opaque, il s'arrete et la fonction renvoie la liste
	 * des secteur traversé (visible).
	 * La fonction mets à jour un objet contenant les propriétés suivantes :
	 *   nWallPanel    : Code du Paneau (texture) touché par le rayon
	 *   bSideWall     : Type de coté (X ou Y)
	 *   nSideWall     : Coté
	 *   nWallPos      : Position du point d'impact du rayon sur le mur
	 *   xWall         : position du mur sur la grille
	 *   yWall         :  "       "       "       "
	 *   fDist         : longueur du rayon
	 * @param oData objet de retour
	 * @param x position de la camera
	 * @param y    "      "      "
	 * @param dx pente du rayon x (le cosinus de son angle)
	 * @param dy pente du rayon y (le sinus de son angle)
	 * @param aExcludes tableau des cases semi transparente que le rayon peut traverser
	 * @param aVisibles tableau des cases visitées par le rayon
	 */
	projectRay : function(oData, x, y, dx, dy, aExcludes, aVisibles) {
		var side = 0;
		var map = this.aMap;
		var nMapSize = this.nMapSize;
		var nScale = this.nPlaneSpacing;

		//raycount++;
		var xi, yi, xt, dxt, yt, dyt, t, dxi, dyi, xoff, yoff, cmax = oData.nRayLimit;
		
		var oContinue = oData.oContinueRay;
		
		
		// Le continue sert à se passer de refaire le raycast depuis la 
		// source (camera), on mémorise xi et yi
		if (oContinue.bContinue) {
			xi = oContinue.xi;
			yi = oContinue.yi;
		} else {
			xi = x / nScale | 0;
			yi = y / nScale | 0;
		}
		xoff = (x / nScale) - xi;
		yoff = (y / nScale) - yi;
		if (dx < 0) {
			xt = -xoff / dx;
			dxt = -1 / dx;
			dxi = -1;
		} else {
			xt = (1 - xoff) / dx;
			dxt = 1 / dx;
			dxi = 1;
		}
		if (dy < 0) {
			yt = -yoff / dy;
			dyt = -1 / dy;
			dyi = -1;
		} else {
			yt = (1 - yoff) / dy;
			dyt = 1 / dy;
			dyi = 1;
		}
		
		var xScale = nScale * dx;
		var yScale = nScale * dy;
		
		t = 0;
		var done = 0;
		var c = 0;
		var bStillVisible = true;
		var nOfs, nTOfs = 0;
		var nText;
		
		var Marker_getMarkXY = Marker.getMarkXY;
		var Marker_markXY = Marker.markXY;

		var nPhys;
		var nPHYS_FIRST_DOOR = this.PHYS_FIRST_DOOR;
		var nPHYS_LAST_DOOR = this.PHYS_LAST_DOOR;
		var nPHYS_SECRET_BLOCK = this.PHYS_SECRET_BLOCK;
		var nPHYS_OFFSET_BLOCK = this.PHYS_OFFSET_BLOCK;
		var nPHYS_TRANSPARENT_BLOCK = this.PHYS_TRANSPARENT_BLOCK;
		var xint = 0, yint = 0;
		
		var sameOffsetWall = this.sameOffsetWall;
		var BF = O876_Raycaster.BF;
		var BF_getPhys = BF.getPhys;
		var BF_getOffs = BF.getOffs;
		
		while (done === 0) {
			if (xt < yt) {
				xi += dxi;
				if (xi >= 0 && xi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 12) & 0xF; // **code12** phys
					
					if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					}
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys == nPHYS_SECRET_BLOCK || nPhys == nPHYS_TRANSPARENT_BLOCK || nPhys == nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF; // **Code12** offs
					} else {
						nOfs = 0;
					}
					
					if (nOfs) {
						xint = x + xScale * xt;
						yint = y + yScale * xt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dxt / nScale) * nOfs;
							yint = y + yScale * (xt + nTOfs);
							if (((yint / nScale | 0)) != yi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					// 0xB00 : INVISIBLE_BLOCK ou vide 0x00
					if (nPhys === 0xB || nPhys === 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						xt += dxt;
					} else {
						t = xt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 1;
						bStillVisible = false;
					}
				} else {
					t = xt;
					c = cmax;
				}
			} else {
				yi += dyi;
				if (yi >= 0 && yi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 12) & 0xF; // **Code12** phys

					if (nText !== 0 && Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					} 
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys == nPHYS_SECRET_BLOCK || nPhys == nPHYS_TRANSPARENT_BLOCK || nPhys == nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF; // **Code12** offs
					} else {
						nOfs = 0;
					}

					if (nOfs) {
						xint = x + xScale * yt;
						yint = y + yScale * yt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dyt / nScale) * nOfs;
							xint = x + xScale * (yt + nTOfs);
							if (((xint / nScale | 0)) != xi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					if (nPhys === 0xB || nPhys === 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						yt += dyt;
					} else {
						t = yt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 2;
						bStillVisible = false;
					}
				} else {
					t = yt;
					c = cmax;
				}
			}
			c++;
			if (c >= cmax) {
				//			t = 100;
				done = 1;
			}
		}
		if (c < cmax) {
			oData.nWallPanel = map[yi][xi];
			oData.bSideWall = side == 1;
			oData.nSideWall = side - 1;
			oData.nWallPos = oData.bSideWall ? yint % oData.xTexture
					: xint % oData.xTexture;
			if (oData.bSideWall && dxi < 0) {
				oData.nWallPos = oData.xTexture - oData.nWallPos;
				oData.nSideWall = 2;
			}
			if (!oData.bSideWall && dyi > 0) {
				oData.nWallPos = oData.xTexture - oData.nWallPos;
				oData.nSideWall = 3;
			}
			oData.xWall = xi;
			oData.yWall = yi;
			oData.fDist = t * nScale;
			oData.bExterior = false;
			if (this.isWallTransparent(oData.xWall, oData.yWall)) {
				oContinue.bContinue = true;
				oContinue.xi = xi;
				oContinue.yi = yi;
			} else {
				oContinue.bContinue = false;
			}
		} else {
			oData.fDist = t * nScale;
			oData.bExterior = true;
		}
	},

	/**
	 * Calcule le caste d'un rayon  
	 */
	castRay : function(oData, x, y, dx, dy, xScreen, aVisibles) {
		var aExcludes = Marker.create();
		var oXBlock = null;
		var oWall;
		var nTextureBase;
		var nMaxIterations = 6;
		if (!aVisibles) {
			aVisibles = Marker.create();
		}
		var oBG = this.oBackground;
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.bExterior) {
				// hors du laby
				if (oBG) {
					this.drawExteriorLine(xScreen, oData.fDist);
				}
			} else if (oData.fDist >= 0) {
				if (xScreen !== undefined) {
					// Lecture données extra du block;
					oXBlock = this.oXMap.get(oData.xWall, oData.yWall,
							oData.nSideWall);
					if (oXBlock.surface) {
						oWall = oXBlock.surface;
						nTextureBase = 0;
					} else {
						oWall = oData.oWall.image;						
						nTextureBase = oData.oWall.codes[oData.nWallPanel & 0xFFF][oData.nSideWall] * this.xTexture; // **code12** code
					}
					this.drawLine(xScreen, oData.fDist, nTextureBase,
							oData.nWallPos | 0, oData.bSideWall, oWall,
							oData.nWallPanel, oXBlock.diffuse);
				} 
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			nMaxIterations--;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	/**
	 * CastRay rapide (pas de considération graphique)
	 * @param oData données à mettre à jour (bExterior fDist xwall ywall owall)
	 * @param x position camera x
	 * @param y position camera y
	 * @param dx direction du rayon X
	 * @param dy direction du rayon y
	 * @param xScreen (facultatif) Y actuellement déssiné (pour l'extérieur)
	 * @param aVisibles liste des secteur visibles
	 * @returns aVisibles
	 */
	fastCastRay : function(x, y, a) {
		var aExcludes = Marker.create();
		var nMaxIterations = 6;
		var aVisibles = {};
		var dx = Math.cos(a);
		var dy = Math.sin(a);
		var oData = { 
			oContinueRay : {
				bContinue : false
			},
			nRayLimit : 10
		};
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.fDist >= 0) {
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			nMaxIterations--;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	
	
	sameOffsetWall : function(nOfs, x0, y0, xm, ym, fBx, fBy, ps) {
		x0 += nOfs * fBx;
		y0 += nOfs * fBy;
		var ym2, xm2;
		ym2 = y0 / ps | 0;
		xm2 = x0 / ps | 0;
		return xm2 == xm && ym2 == ym;
	},

	// compare z, départage les z identique en comparant les x
	// du plus grand au plus petit Z (distance)
	// si Z identitiques du plus petit au plus grand dx
	zBufferCompare : function(a, b) {
		if (a[9] != b[9]) {
			return b[9] - a[9];
		}
		return a[5] - b[5];
	},

	// renvoie true si le code correspond à une porte (une vrai porte, pas un passage secret)
	isDoor : function(xw, yw) {
		var nPhys = this.getMapPhys(xw, yw);
		return (nPhys >= this.PHYS_FIRST_DOOR && nPhys <= this.PHYS_LAST_DOOR);
	},

	// Renvoie true si on peut voir a travers le murs, et qu'on doit relancer le seekWall pour ce Ray
	isWallTransparent : function(xWall, yWall) {
		var nPhys = this.getMapPhys(xWall, yWall);
		if (nPhys === 0) {
			return false;
		}
		var nOffset = this.getMapOffs(xWall, yWall);
		// code physique transparent
		if ((nPhys >= this.PHYS_FIRST_DOOR &&
				nPhys <= this.PHYS_LAST_DOOR && nOffset !== 0) ||
				nPhys == this.PHYS_TRANSPARENT_BLOCK ||
				nPhys == this.PHYS_INVISIBLE_BLOCK) {
			return true;
		}
		return false;
	},
	
	// Renvoie la distance d'un éventuel renfoncement
	getWallDepth : function(xw, yw) {
		var nPhys = this.getMapPhys(xw, yw);
		if (this.isDoor(xw, yw)) {
			return this.nPlaneSpacing >> 1;
		}
		if (nPhys == this.PHYS_SECRET_BLOCK || nPhys == this.PHYS_TRANSPARENT_BLOCK || nPhys == this.PHYS_OFFSET_BLOCK) {
			return this.getMapOffs(xw, yw);
		}
		return 0;
	},
	
	getBlockData: function(x, y, nSide) {
		return this.oXMap.get(x, y, nSide);
	},

	setMapXY: function(x, y, nCode) {
		this.aMap[y][x] = nCode;
	},

	getMapXY: function(x, y) {
		return this.aMap[y][x];
	},

	setMapCode : function(x, y, nTexture) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFFF000) | nTexture; // **code12** code
	},

	getMapCode : function(x, y) {
		return this.aMap[y][x] & 0xFFF; // **code12** code
	},

	setMapPhys : function(x, y, nPhys) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFF0FFF) | (nPhys << 12); // **code12** phys
	},

	getMapPhys : function(x, y) {
		return (this.aMap[y][x] >> 12) & 0xF;  // **code12** phys
	},

	setMapOffs : function(x, y, nOffset) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFF00FFFF) // **code12** offs
				| (nOffset << 16);
	},

	getMapOffs : function(x, y) {
		return (this.aMap[y][x] >> 16) & 0xFF; // **code12** offs
	},

	drawScreen : function() {
		// phase 1 raycasting
		
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);
		var dx = (wx2 - wx1) / this.xScrSize;
		var dy = (wy2 - wy1) / this.xScrSize;
		var fBx = wx1;
		var fBy = wy1;
		var xCam = this.oCamera.x;
		var yCam = this.oCamera.y;
		var xCam8 = xCam / this.nPlaneSpacing | 0;
		var yCam8 = yCam / this.nPlaneSpacing | 0;
		var i = 0;
		this.aZBuffer = [];
		this.aScanSectors = Marker.create();
		if (this.oBackground) { // Calculer l'offset camera en cas de background
			this.fCameraBGOfs = (PI + this.oCamera.fTheta) * this.oBackground.width / PI;
		}
		Marker.markXY(this.aScanSectors, xCam8, yCam8);
		var oContinueRay = this.oContinueRay;
		var xScrSize = this.xScrSize;
		var aScanSectors = this.aScanSectors;
		var xl = this.b3d ? this.xLimitL : 0;
		var xr = this.b3d ? this.xLimitR : xScrSize;
		for (i = 0; i < xScrSize; ++i) {
			if (i >= xl && i <= xr) { 
				oContinueRay.bContinue = false;
				this.castRay(this, xCam, yCam, fBx, fBy, i, aScanSectors);
			}
			fBx += dx;
			fBy += dy;
		}
		
		// Optimisation ZBuffer -> suppression des drawImage inutile, élargissement des drawImage utiles.
		// si le last est null on le rempli
		// sinon on compare last et current
		// si l'un des indices 0, 1 diffèrent alors on flush, sinon on augmente le last
		var aZ = [];
		var nLast = 1;
		var nLLast = 1;
		var nLLLast = 1;
		var z = 1;
		
		// image 0
		// sx  1
		// sy  2
		// sw  3
		// sh  4
		// dx  5
		// dy  6
		// dw  7
		// dh  8
		// z   9
		// fx  10
		
		var zb = this.aZBuffer;
		var zbl = zb.length;
		if (zbl === 0) {
			return;
		}
		var b; // Element courrant du ZBuffer;
		var lb = zb[0];
		var llb = lb;
		var lllb = lb;
		var abs = Math.abs;
		
		for (i = 0; i < zbl; i++) {
			b = zb[i];
			// tant que c'est la même source de texture
			if (b[10] == lb[10] && b[0] == lb[0] && b[1] == lb[1] && abs(b[9] - lb[9]) < 8) { 
				nLast += z;
			} else if (b[10] == llb[10] && b[0] == llb[0] && b[1] == llb[1] && abs(b[9] - llb[9]) < 8) {
				nLLast += z;
			} else if (b[10] == lllb[10] && b[0] == lllb[0] && b[1] == lllb[1] && abs(b[9] - lllb[9]) < 8) {
				nLLLast += z;
			} else {
				lllb[7] = nLLLast;
				aZ.push(lllb);
				lllb = llb;
				nLLLast = nLLast;
				llb = lb;
				nLLast = nLast;
				lb = b;
				nLast = z;
			}
		}
		lllb[7] = nLLLast;
		aZ.push(lllb);
		llb[7] = nLLast;
		aZ.push(llb);
		lb[7] = nLast;
		aZ.push(lb);
		
		this.aZBuffer = aZ;
		this.drawHorde();
		// Le tri permet d'afficher les textures semi transparente après celles qui sont derrières
		this.aZBuffer.sort(this.zBufferCompare);
		
		var rctx = this._oRenderContext;
		

		// phase 2 : rendering

		// sky
		if (this.bSky && this.oBackground) {
			var oBG = this.oBackground;
			var wBG = oBG.width;
			var hBG = oBG.height;
			var xBG = (this.fBGOfs + this.fCameraBGOfs) % wBG | 0;
			var yBG = this.yScrSize - (hBG >> 1);
			hBG = hBG + yBG;
			rctx.drawImage(oBG, 0, 0, wBG, hBG, wBG - xBG, yBG, wBG, hBG);
			rctx.drawImage(oBG, 0, 0, wBG, hBG, -xBG, yBG, wBG, hBG);
		} else if (this.bGradient) {
			rctx.fillStyle = this.oVisual.gradients[0];
			rctx.fillRect(0, 0, this._oCanvas.width, this._oCanvas.height >> 1);
			if (!this.bFloor) {
				rctx.fillStyle = this.oVisual.gradients[1];
				rctx.fillRect(0, (this._oCanvas.height >> 1), this._oCanvas.width, this._oCanvas.height >> 1);
			}
		}
		
		// 2ndFloor
		if (this.oUpper) {
			this.drawUpper();
		}

		// floor
		if (this.bFloor) {
			if (this.bCeil && this.fViewHeight != 1) {
				this.drawFloorAndCeil();
			} else {
				this.drawFloor();
			}
		}
		
		zbl = this.aZBuffer.length;
		for (i = 0; i < zbl; ++i) {
			this.drawImage(i);
		}
		if (this.oConfig.drawMap) {
			this.drawMap();
		}
		this.drawWeapon();
	},
	
	/**
	 * Transfere le contenu du buffer mémoire vers le buffer écran
	 */
	flipBuffer: function() {
		var rc = this._oRenderCanvas;
		if (this.bUseVideoBuffer) {
			if (this.b3d) {
				var rcw2 = rc.width >> 1;
				this._oContext.drawImage(
					rc, 
					this.xLimitL,
					0, 
					rcw2, 
					rc.height, 
					this.i3dFrame * rcw2, 
					0, 
					rcw2, 
					rc.height
				);
			} else {
				this._oContext.drawImage(rc, 0, 0);
			}
		}
	},

	drawSprite : function(oMobile) {
		var oSprite = oMobile.oSprite;
		// Si le sprite n'est pas visible, ce n'est pas la peine de gaspiller du temps CPU
		// on se barre immédiatement
		if (!(oSprite.bVisible && oMobile.bVisible)) {
			return;
		}
		var oTile = oSprite.oBlueprint.oTile;
		var dx = oMobile.x - this.oCamera.x;
		var dy = oMobile.y - this.oCamera.y;

		// Gaffe fAlpha est un angle ici, et pour un sprite c'est une transparence
		var fTarget = Math.atan2(dy, dx);
		var fAlpha = fTarget - this.oCamera.fTheta; // Angle
		if (fAlpha >= PI) { // Angle plus grand que l'angle plat
			fAlpha = -(PI * 2 - fAlpha);
		}
		if (fAlpha < -PI) { // Angle plus grand que l'angle plat
			fAlpha = PI * 2 + fAlpha;
		}
		var w2 = this._oCanvas.width >> 1;

		// Animation
		if (!this.b3d || (this.b3d && this.i3dFrame === 0)) {
			var fAngle1 = oMobile.fTheta + (PI / 8) - fTarget;
			if (fAngle1 < 0) {
				fAngle1 = 2 * PI + fAngle1;
			}
			oSprite.setDirection(((8 * fAngle1 / (2 * PI)) | 0) & 7);
			oSprite.animate(this.TIME_FACTOR);
		}

		if (Math.abs(fAlpha) <= (this.fViewAngle * 1.5)) {
			var x = (Math.tan(fAlpha) * w2 + w2) | 0;
			// Faire tourner les coordonnées du sprite : projection sur l'axe de la caméra
			var z = MathTools.distance(dx, dy) * Math.cos(fAlpha) * 1.333;  // le 1.333 empirique pour corriger une erreur de tri bizarroïde
			// Les sprites bénéficient d'un zoom 2x afin d'améliorer les détails.

			var dz = (oTile.nScale * oTile.nHeight / (z / this.yScrSize) + 0.5);
			var dzy = this.yScrSize - (dz * this.fViewHeight);
			var iZoom = (oTile.nScale * oTile.nWidth / (z / this.yScrSize) + 0.5);
			var nOpacity; // j'ai nommé opacity mais ca n'a rien a voir : normalement ca aurait été sombritude
			// Self luminous
			var nSFx = oSprite.oBlueprint.nFx | (oSprite.bTranslucent ? (oSprite.nAlpha << 2) : 0);
			if (nSFx & 2) {
				nOpacity = 0;
			} else {
				nOpacity = z / this.nShadingFactor | 0;
				if (nOpacity > this.nShadingThreshold) {
					nOpacity = this.nShadingThreshold;
				}
			}
			var aData = [ oTile.oImage, // image 0
					oSprite.nFrame * oTile.nWidth, // sx  1
					oTile.nHeight * nOpacity, // sy  2
					oTile.nWidth, // sw  3
					oTile.nHeight, // sh  4
					x - iZoom | 0, // dx  5
					dzy | 0, // dy  6   :: this.yScrSize - dz + (dz >> 1)
					iZoom << 1, // dw  7
					dz << 1, // dh  8
					z, 
					nSFx]; 
			oSprite.aLastRender = aData;
			this.aZBuffer.push(aData);
			// Traitement overlay
			var oOL = oSprite.oOverlay;
			if (oOL) {
				if (Array.isArray(oSprite.nOverlayFrame)) {
					oSprite.nOverlayFrame.forEach(function(of, iOF) {
						this.aZBuffer.push(
						[	oOL.oImage, // image 0
							of * oOL.nWidth, // sx  1
							0, // sy  2
							oOL.nWidth, // sw  3
							oOL.nHeight, // sh  4
							aData[5], // dx  5
							aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
							aData[7], // dw  7
							aData[8], // dh  8
							aData[9] - 1 - (iOF / 100), 
							2
						]);
					}, this);
				} else if (oSprite.nOverlayFrame !== null) {
					this.aZBuffer.push(
					[	oOL.oImage, // image 0
						oSprite.nOverlayFrame * oOL.nWidth, // sx  1
						0, // sy  2
						oOL.nWidth, // sw  3
						oOL.nHeight, // sh  4
						aData[5], // dx  5
						aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
						aData[7], // dw  7
						aData[8], // dh  8
						aData[9] - 1, 
						2
					]);
				}
			}
		}
	},
	

	drawHorde : function() {
		var x = '', y = '', aMobiles, oMobile, nMobileCount, i;
		this.aVisibleMobiles = [];
		for (x in this.aScanSectors) {
			for (y in this.aScanSectors[x]) {
				aMobiles = this.oMobileSectors.get(x, y);
				nMobileCount = aMobiles.length;
				for (i = 0; i < nMobileCount; i++) {
					oMobile = aMobiles[i];
					if (oMobile.bActive && oMobile.oSprite) {
						this.aVisibleMobiles.push(oMobile);
						this.drawSprite(oMobile);
					}
				}
			}
		}
	},

	drawExteriorLine : function(x, z) {
		var dz, sx, sy, sw, sh, dx, dy, dw, dh, a = null;
		if (z < 0.1) {
			z = 0.1;
		}
		dz = (this.yTexture / (z / this.yScrSize));
		var dzfv = (dz * this.fViewHeight);
		var dzy = this.yScrSize - dzfv;
		// dz = demi hauteur de la texture projetée
		var oBG = this.oBackground;
		var wBG = oBG.width, hBG = oBG.height;
		sx = (x + this.fCameraBGOfs) % wBG | 0;
		sy = Math.max(0, (hBG >> 1) - dzfv);
		sw = 1;
		sh = Math.min(hBG, dz << 1);
		dx = x;
		dy = Math.max(dzy, this.yScrSize - (hBG >> 1));
		dw = sw;
		dh = Math.min(sh, dz << 1);
		a = [ oBG, sx, sy, sw, sh, dx, dy, dw, dh, z, 0 ];
		this.aZBuffer.push(a);
	},
	
	
	drawFloor: null,
	
	/**
	 * Rendu du floor et du ceil quand fViewHeight est à 1
	 */
	drawFloor_zoom1: function() {
		var bCeil = this.bCeil;
		var oFloor = this.oFloor;
		var x, 
			y,
			xStart = this.b3d ? this.xLimitL : 0, 
			xEnd = this.b3d ? this.xLimitR : this.xScrSize,
			w = this.xScrSize, 
			h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var ofsDstCeil; // offset de l'array pixel de destination (plancher)
		var wyCeil;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		var fy64, fx64;
		var oXMap = this.oXMap;
		var oXBlock, oXBlockImage;
		var oXBlockCeil;
		var nXDrawn = 0; // 0: pas de texture perso ; 1 = texture perso sol; 2=texture perso plafond
		var fBx, fBy;
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			wyCeil = w * (h - y - 1);
			yOfs = Math.min(st, dFront / sf | 0);
			
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				fy64 = fy / ps | 0; // sector
				fx64 = fx / ps | 0;
				if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nXDrawn = 0;
					oXBlock = oXMap.get(fx64, fy64, 4);
					oXBlockCeil = oXMap.get(fx64, fy64, 5);
					if (oXBlock.imageData32) {
						oXBlockImage = oXBlock.imageData32;
						ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
						nXDrawn += 1;
					}
					if (oXBlockCeil.imageData32) {
						oXBlockImage = oXBlockCeil.imageData32;
						if (nXDrawn === 0) {
							ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						}
						aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
						nXDrawn += 2;
					}
					if (nXDrawn != 3) {
						nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							if (nXDrawn != 1) {
								xOfs = aFBlock[0];
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
							}
							if (bCeil && nXDrawn != 2) {
								xOfs = aFBlock[1];
								if (xOfs >= 0) {
									ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
									aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
								}
							}
						}
					}
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this._oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	
	drawFloorAndCeil: null,
	
	/**
	 * Rendu du floor et du ceil si le fViewHeight est différent de 1
	 * (presque double ration de calcul....)
	 */
	drawFloorAndCeil_zoom1: function() {
		var oFloor = this.oFloor;
		var x, 
			y,
			xStart = this.b3d ? this.xLimitL : 0, 
			xEnd = this.b3d ? this.xLimitR : this.xScrSize,
			w = this.xScrSize, 
			h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this._oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var fhCeil = (this.yTexture >> 1) + ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDeltaFrontCeil = 0;
		var yDeltaFrontCeil = 0;
		var fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
		var dFrontCeil; // distance "devant caméra" du pixel actuellement pointé
		var ofsDstCeil; // offset de l'array pixel de destination (plafon) 
		var wyCeil = 0;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		
		var bCeil = this.bCeil;
		
		// aFloorSurf -> doit pointer vers XMap.get(x, y)[4].imageData32
		// test : if XMap.get(x, y)[4]
		
		var fy64, fx64;
		var oXMap = this.oXMap;
		var oXBlock, oXBlockCeil, oXBlockImage;
		var fBx, fBy, yOfsCeil;
		
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			yOfs = Math.min(st, dFront / sf | 0);

			// ceill
			if (bCeil) {
				dFrontCeil = fhCeil * ff / y; 
				fyCeil = wy1 * dFrontCeil + yCam;
				fxCeil = wx1 * dFrontCeil + xCam;
				xDeltaFrontCeil = xDelta * dFrontCeil;
				yDeltaFrontCeil = yDelta * dFrontCeil;
				wyCeil = w * (h - y);
				yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
			}
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				fy64 = fy / ps | 0;
				fx64 = fx / ps | 0;
				if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					oXBlock = oXMap.get(fx64, fy64, 4);
					if (oXBlock.imageData32) {
						oXBlockImage = oXBlock.imageData32;
						ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
						aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
					} else {
						nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							xOfs = aFBlock[0];
							if (xOfs >= 0) {
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
					fy64 = fyCeil / ps | 0;
					fx64 = fxCeil / ps | 0;
					oXBlockCeil = oXMap.get(fx64, fy64, 5);
					if (oXBlockCeil.imageData32) {
						oXBlockImage = oXBlockCeil.imageData32;
						ofsSrc = (((fyCeil  % ps) + yOfs * ps | 0) * ps + (((fxCeil % ps) | 0)));
						aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
					} else {
						nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
						aFBlock = F[nBlock];
						if (aFBlock !== null) {
							xOfs = aFBlock[1];
							if (xOfs >= 0) {
								ofsSrc = (((fyCeil % ps) + yOfs * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil) {
					fyCeil += yDeltaFrontCeil;
					fxCeil += xDeltaFrontCeil;
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this._oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	drawLine : function(x, z, nTextureBase, nPos, bDim, oWalls, nPanel, nLight) {
		if (z < 0.1) {
			z = 0.1;
		}
		//var dz = (this.yTexture / (z / this.yScrSize) + 0.5) | 0;
		var ytex = this.yTexture;
		var xtex = this.xTexture;
		var yscr = this.yScrSize;
		var shf = this.nShadingFactor;
		var sht = this.nShadingThreshold;
		var dmw = this.nDimmedWall;
		var dz = ytex * yscr / z;
		var fvh = this.fViewHeight;
		dz = dz + 0.5 | 0;
		var dzy = yscr - (dz * fvh);
		var nPhys = (nPanel >> 12) & 0xF;  // **code12** phys
		var nOffset = (nPanel >> 16) & 0xFF; // **code12** offs
		var nOpacity = z / shf | 0;
		if (bDim) {
			nOpacity = (sht - dmw) * nOpacity / sht + dmw - nLight | 0;
		} else {
			nOpacity -= nLight;
		}
		nOpacity = Math.max(0, Math.min(sht, nOpacity));
		var aData = [
				oWalls, // image 0
				nTextureBase + nPos, // sx  1
				ytex * nOpacity, // sy  2
				1, // sw  3
				ytex, // sh  4
				x, // dx  5
				dzy - 1, // dy  6
				1, // dw  7
				(2 + dz * 2), // dh  8
				z, // z 9
				bDim ? RC.FX_DIM0 : 0
		];

		// Traitement des portes
		switch (nPhys) {
			case this.PHYS_DOOR_SLIDING_UP: // porte coulissant vers le haut
				aData[2] += nOffset;
				if (nOffset > 0) {
					aData[4] = ytex - nOffset;
					aData[8] = ((aData[4] / (z / yscr) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_UP: // rideau coulissant vers le haut
				if (nOffset > 0) {
					aData[8] = (((ytex - nOffset) / (z / yscr) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_DOWN: // rideau coulissant vers le bas
				aData[2] += nOffset; // no break here 
				// suite au case 4...

			case this.PHYS_DOOR_SLIDING_DOWN: // Porte coulissant vers le bas
				if (nOffset > 0) {
					// 4: sh
					// 6: dy
					// 8: dh 
					// on observe que dh est un peut trop petit, ou que dy es trop haut
					aData[4] = ytex - nOffset;
					aData[8] = ((aData[4] / (z / yscr) + 0.5));
					aData[6] += (dz - aData[8]) << 1;
					aData[8] <<= 1;
				}
				break;

			case this.PHYS_DOOR_SLIDING_LEFT: // porte latérale vers la gauche
				if (nOffset > 0) {
					if (nPos > (xtex - nOffset)) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_RIGHT: // porte latérale vers la droite
				if (nOffset > 0) {
					if (nPos < nOffset) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_DOUBLE: // double porte latérale
				if (nOffset > 0) {
					if (nPos < (xtex >> 1)) { // panneau de gauche
						if ((nPos) > ((xtex >> 1) - nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + nOffset) % xtex + nTextureBase;
						}
					} else {
						if ((nPos) < ((xtex >> 1) + nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
						}
					}
				}
				break;

			case this.PHYS_INVISIBLE_BLOCK:
				aData[0] = null;
				break;
		}
		if (aData[0]) {
			this.aZBuffer.push(aData);
		}
	},

	/** Rendu de l'image stackée dans le Z Buffer
	 * @param i rang de l'image
	 */
	drawImage : function(i) {
		var rc = this._oRenderContext;
		var aLine = this.aZBuffer[i];
		var sGCO = '';
		var fGobalAlphaSave = 0;
		var nFx = aLine[10];
		if (nFx & 1) {
			sGCO = rc.globalCompositeOperation;
			rc.globalCompositeOperation = 'lighter';
		}
		if (nFx & 12) {
			fGobalAlphaSave = rc.globalAlpha;
			rc.globalAlpha = RC.FX_ALPHA[nFx >> 2];
		}
		var xStart = aLine[1];
		// Si xStart est négatif c'est qu'on est sur un coté de block dont la texture est indéfinie (-1)
		// Firefox refuse de dessiner des textures "négative" dont on skipe le dessin
		if (xStart >= 0) {
			rc.drawImage(
				aLine[0], 
				aLine[1] | 0,
				aLine[2] | 0,
				aLine[3] | 0,
				aLine[4] | 0,
				aLine[5] | 0,
				aLine[6] | 0,
				aLine[7] | 0,
				aLine[8] | 0);
		}
		if (sGCO !== '') {
			rc.globalCompositeOperation = sGCO;
		}
		if (nFx & 12) {
			rc.globalAlpha = fGobalAlphaSave;
		}
	},

	drawSquare : function(x, y, nWidth, nHeight, sColor) {
		this._oRenderContext.fillStyle = sColor;
		this._oRenderContext.fillRect(x, y, nWidth, nHeight);
	},

	drawMap : function() {
		if (this.oMinimap) {
			this.oMinimap.render();
		} else {
			this.oMinimap = new O876_Raycaster.Minimap();
			this.oMinimap.reset(this);
		}
	},

	/* sprites:
	
	1) déterminer la liste des sprite susceptible d'etre visible
	- ce qui sont dans les secteurs traversés par les rayons
	2) déterminer la distance
	3) déterminer l'angle
	4) déterminer la position X (angle)

	 */

	/** Renvoie des information concernant la case contenant le point spécifié
	 * @param x coordonnée du point à étudier
	 * @param y
	 * @param n optionnel, permet de spécifier le type d'information voulu
	 *  - undefined : tout
	 *  - 0: le code texture 0-0xFF
	 *  - 1: le code physique
	 *  - 2: le code offset
	 *  - 3: le tag
	 * @return code de la case.
	 */
	clip : function(x, y, n) {
		if (n === undefined) {
			n = 0;
		}
		var ps = this.nPlaneSpacing;
		var xm = x / ps | 0;
		var ym = y / ps | 0;
		switch (n) {
			case 0:
				return this.getMapCode(xm, ym);
			case 1:
				return this.getMapPhys(xm, ym);
			case 2:
				return this.getMapOffs(xm, ym);
			case 3:
				return this.getMapXYTag(xm, ym);
			default:
				return this.aMap[ym][xm];
		}
	},
	
	/**
	 * Animation des textures
	 * Toutes les textures déclarée dans walls.animated subissent un cycle d'animation
	 * Cette fonction n'est pas appelée automatiquement
	 */
	textureAnimation: function() {
		// Animation des textures
		var oAnim, w = this.oWall, wc = w.codes, wcn, wa = w.animated;
		var i, l, x;
		for (var iAnim in wa) {
			wcn = wc[iAnim | 0];
			oAnim = wa[iAnim];
			if ('animate' in oAnim) {
				oAnim.animate(this.TIME_FACTOR);
				for (i = 0, l = oAnim.__start.length; i < l; ++i) {
					x = oAnim.__start[i];
					wcn[i] = x + oAnim.nFrame;
				}
			}
		}
	},
	
	buildAnimatedTextures: function() {
		// animation des textures
		var w = this.oWall;
		if (!('animated' in w)) {
			w.animated = {};
		}
		var wc = w.codes, wcc, wa = w.animated;
		var oAnim;
		var wcStart, wcDur, wcCount, wcLoop;
		for (var nCode = 0; nCode < wc.length; ++nCode) {
			wcc = wc[nCode];
			if (wcc) {
				if (Array.isArray(wcc[0])) { // Une animation de texture ?
					if (wcc[0].length === 2) {
						// convertir en mure à 4 coté
						wcc[0].push(wcc[0][0]);
						wcc[0].push(wcc[0][1]);
					}
					wcStart = wcc[0];
					wcCount = wcc[1];
					wcDur = wcc[2];
					wcLoop = wcc[3];
					// Enregistrer l'animation de texture dans la propriété "animated"
					oAnim = new O876_Raycaster.Animation();
					oAnim.nCount = wcCount;
					oAnim.nDuration = wcDur;
					oAnim.nLoop = wcLoop;
					oAnim.__start = wcStart;
					wa[nCode] = oAnim;
				} else if (wcc.length === 2) { // mur 2 ou 4
					// répéter les code 0 et 1 en 2 et 3
					wcc.push(wcc[0]);
					wcc.push(wcc[1]);
				}
			}
		}
	}
});
