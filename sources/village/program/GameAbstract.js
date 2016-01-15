O2.extendClass('O876_Raycaster.GameAbstract', O876_Raycaster.Engine, {
	_sLevelIndex: '',
	_oScreenShot: null,
	_oTagData: null,
	_sTag: '',
	_oEvents: null,

	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////
	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////
	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////

	on: function(sEvent, pFunction) {
		this._oEvents[sEvent] = pFunction;
	},
	
	/**
	 * Récupération de la notification issue du serveur
	 * Cette notification est dispatchée sur l'une des fonction scn_
	 */
	trigger: function(sEvent, data) {
		if (sEvent in this._oEvents) {
			return this._oEvents[sEvent](data);
		} else {
			return true;
		}		
	},

	/** 
	 * Evènement apellé lors de l'initialisation du jeu
	 * Appelé une seule fois.
	 */
	onInitialize: function() {
		this._oEvents = {};
		this.on('tag', this.onTagTriggered.bind(this));
		if (this.init) {
			this.init();
		}
	},
	
	/**
	 * Cette évènement doit renvoyer TRUE pour pouvoir passer à l'étape suivante
	 * @return bool
	 */
	onMenuLoop: function() {
		return this.trigger('menuloop');
		// Doit retourner TRUE pour indiquer la validation du menu et passer à l'étape suivante
		// ici il n'y a pas de menu donc "true" pour passer directement à l'étape suivante
	},
	
	
	/**
	 * Evènement appelé lors du chargement d'un niveau,
	 * cet évènement doit renvoyer des données au format du Raycaster.
	 * @return object
	 */
	onRequestLevelData: function() {
		var aWorldDataKeys = Object.keys(WORLD_DATA);
		this._sLevelIndex = aWorldDataKeys[aWorldDataKeys.indexOf(this._sLevelIndex) + 1];
		this.trigger('build', WORLD_DATA[this._sLevelIndex]);
		return WORLD_DATA[this._sLevelIndex];
	},
	
	/**
	 * Evènement appelé quand une ressource et chargée
	 * sert à faire des barres de progressions
	 */
	onLoading: function(aProgress) {
		this.trigger('load', { phase: aProgress[0], progress: aProgress[1], max: aProgress[2] });
	},
	
	/**
	 * Evènement appelé lorsqu'un niveau a été chargé
	 * Permet l'initialisation des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel: function() {
		this.oRaycaster.bSky = true;
		this.oRaycaster.bFlatSky = true;
		this.oRaycaster.nPlaneSpacing = 64;
		var oCT = new O876_Raycaster.CameraMouseKeyboardThinker();
		oCT.oMouse = this._getMouseDevice(this.oRaycaster.oCanvas);
		oCT.oKeyboard = this._getKeyboardDevice();
		oCT.oGame = this;
		this.oRaycaster.oCamera.setThinker(oCT);
		oCT.useDown = function() {
			this.oGame.activateWall(this.oMobile);    
		};
		// Tags data
		var iTag, oTag;
		var aTags = this.oRaycaster.aWorld.tags;
		this._oTagData = Marker.create();
		for (iTag = 0; iTag < aTags.length; ++iTag) {
			oTag = aTags[iTag];
			Marker.markXY(this._oTagData, oTag.x, oTag.y, oTag.tag);
		}
		// decals
		var oRC = this.oRaycaster;
		if ('decals' in oRC.aWorld) {
			oRC.aWorld.decals.forEach(function(d) {
				var x = d.x;
				var y = d.y;
				var nSide = d.side;
				var sImage = d.tile;
				oRC.cloneWall(x, y, nSide, function(rc, oCanvas, xw, yw, sw) {
					var oImage = rc.oHorde.oTiles[sImage].oImage;
					var wt = rc.oHorde.oTiles[sImage].nWidth;
					var ht = rc.oHorde.oTiles[sImage].nHeight;
					oCanvas.getContext('2d').drawImage(
						oImage,
						0,
						0,
						wt,
						ht,
						(rc.xTexture - wt) >> 1, 
						(rc.yTexture - ht) >> 1, 
						wt,
						ht
					);
				});
			});
		}
		this.oRaycaster.oCamera.fSpeed = 6;
		this.trigger('level');
	},

	/**
	 * Evènement appelé par le processeur
	 * Ici on lance les animation de textures
	 */
	onDoomLoop: function() {
		this.processKeys();
		this.oRaycaster.textureAnimation();
	},
	
	
	/** 
	 * Evènement appelé à chaque changement de tag
	 * Si on entre dans une zone non taggée, la valeur du tag sera une chaine vide
	 * @param int x
	 * @param int y position du tag
	 * @param string sTag valeur du tag 
	 */
	onTagTriggered: function(x, y, sTag) {
		if (sTag) {
			var rc = this.oRaycaster;
			var oMsg = new O876_Raycaster.GXMessage(rc);
			oMsg.setMessage(sTag);
			rc.oEffects.addEffect(oMsg);
		}
	},
	
	
	/**
	 * Evènement appelé à chaque rendu de frame
	 */
	onFrameRendered: function() {
		this.detectTag();
		this.trigger('frame');
	},	



	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	
	/**
	 * Renvoie l'identifiant du niveau actuellement chargé
	 * @return string
	 */
	getLevel: function() {
		return this._sLevelIndex;
	},

	processKeys: function() {
		this.trigger('key', this._getKeyboardDevice().inputKey());
	},
	
	/**
	 * Affiche un message popup
	 * @param string sMessage contenu du message
	 */
	popupMessage: function(sMessage) {
		var rc = this.oRaycaster;
		var oMsg = new O876_Raycaster.GXMessage(rc);
		oMsg.setMessage(sMessage);
		rc.oEffects.addEffect(oMsg);
	},
	
	/**
	 * permet de définir l'apparence des popups
	 * l'objet spécifié peut contenir les propriété suivantes :
	 * - background : couleur de fond
	 * - border : couleur de bordure
	 * - text : couleur du texte
	 * - shadow : couleur de l'ombre du texte
	 * - width : taille x
	 * - height : taille y
	 * - speed : vitesse de frappe
	 * - font : propriété de police
	 * - position : position y du popup
	 */
	setPopupStyle: function(oProp) {
		var sProp = '';
		var gmxp = O876_Raycaster.GXMessage.prototype.oStyle;
		for (sProp in oProp) {
			gmxp[sProp] = oProp[sProp];
		}
	},


	/**
	 * Effectue un screenshot de l'écran actuellement rendu
	 * L'image (canvas) générée est stockée dans la propriété _oScreenShot
	 */
	screenShot: function() {
		var oCanvas = O876.CanvasFactory.getCanvas();
		var wr = this.oRaycaster.xScrSize;
		var hr = this.oRaycaster.yScrSize << 1;
		var w = 192;
		var h = hr * w / wr | 0;
		oCanvas.width = w;
		oCanvas.height = h;
		var oContext = oCanvas.getContext('2d');
		oContext.drawImage(this.oRaycaster.oCanvas, 0, 0, wr, hr, 0, 0, w, h);
		this._oScreenShot = oCanvas;
	},

	/**
	 * Effectue une vérification du block actuellement traversé
	 * Si on entre dans une zone taggée (ensemble des blocks contigüs portant le même tag), on déclenche l'évènement.
	 */
	detectTag: function() {
		var rc = this.oRaycaster;
		var rcc = rc.oCamera;
		x = rcc.xSector;
		y = rcc.ySector;
		var sTag = this.getBlockTag(x, y);
		if (sTag != this._sTag) {
			this.trigger('tag', {x: x, y: y, tag: sTag});
			this._sTag = sTag;
		}
	},

	/**
	 * Répond à l'évènement : le player à activé un block mural (celui en face de lui) 
	 * Si le block mural activé est porteur d'un tag : déclencher l'evènement onTagTriggered
	 * Si le block est une porte : ouvrir la porte 
	 */
	activateWall: function(m) {
		var oBlock = m.getFrontCellXY();
		var x = oBlock.x;
		var y = oBlock.y;
		var sTag = this.getBlockTag(x, y);
		if (sTag) {
			this.trigger('tag', {x: x, y: y, tag: sTag});
		}
		var oEffect = this.openDoor(x, y);
		if (oEffect) {
			this.trigger('door', {x: x, y: y, door: oEffect});
		}
	},

	/**
	 * Renvoie le tag associé au block
	 * @param int x
	 * @param int y position du block qu'on interroge
	 */
	getBlockTag: function(x, y) {
		var s = this.oRaycaster.nMapSize;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			return Marker.getMarkXY(this._oTagData, x, y);
		} else {
			return null;
		}
	},
	
	/**
	 * Ajoute un tag de block
	 * si le tag est null on le vire
	 * @param int x
	 * @param int y position du block
	 * @param string sTag tag
	 */
	setBlockTag: function(x, y, sTag) {
		var s = this.oRaycaster.nMapSize;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			Marker.markXY(this._oTagData, x, y, sTag);
		} else {
			return null;
		}		
	},
	
	clearBlockTag: function(x, y) {
		var s = this.oRaycaster.nMapSize;
		if (x >= 0 && y >= 0 && x < s && y < s) {
			Marker.clearXY(this._oTagData, x, y);
		}
	}
});
