O2.extendClass('STUB.Game', O876_Raycaster.Engine, {
	_sLevelIndex: '',
	_oScreenShot: null,
	_oTagData: null,
	_sTag: '',

	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////
	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////
	///////////// EVENEMENTS ///////////// EVENEMENTS /////////////

	/** 
	 * Evènement apellé lors de l'initialisation du jeu
	 * Appelé une seule fois.
	 */
	onInitialize: function() {
	},
	
	/**
	 * Cette évènement doit renvoyer TRUE pour pouvoir passer à l'étape suivante
	 * @return bool
	 */
	onMenuLoop: function() {
		return true; // Doit retourner TRUE pour indiquer la validation du menu et passer à l'étape suivante
		// ici il n'y a pas de menu donc "true" pour passer directement à l'étape suivante
	},
	
	
	/**
	 * Evènement appelé lors du chargement d'un niveau,
	 * cet évènement doit renvoyer des données au format du Raycaster.
	 * @return object
	 */
	onRequestLevelData: function() {
		var aWorldDataKeys = Object.keys(LEVEL_DATA);
		this._sLevelIndex = aWorldDataKeys[aWorldDataKeys.indexOf(this._sLevelIndex) + 1];
		return LEVEL_DATA[this._sLevelIndex];
	},
	
	/**
	 * 2vnèement appelé quand une ressource et chargée
	 * sert à faire des barres de progressions
	 */
	// onLoading: null,
	
	/**
	 * Evènement appelé lorsqu'un niveau a été chargé
	 * Permet l'initialisation des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel: function() {
		this.oRaycaster.bSky = true;
		this.oRaycaster.bFlatSky = true;
		this.oRaycaster.nPlaneSpacing = 64;
		var oCT = new O876_Raycaster.FirstPersonThinker();
		oCT.oMouse = this.getMouseDevice(this.oRaycaster.getScreenCanvas());
		oCT.oKeyboard = this.getKeyboardDevice();
		oCT.oGame = this;
		this.oRaycaster.oCamera.setThinker(oCT);
		oCT.on('use.down', (function() {
			this.activateWall(oCT.oMobile);    
		}).bind(this));
		// Tags data
		var iTag, oTag;
		var aTags = this.oRaycaster.aWorld.tags;
		this._oTagData = Marker.create();
		for (iTag = 0; iTag < aTags.length; ++iTag) {
			oTag = aTags[iTag];
			Marker.markXY(this._oTagData, oTag.x, oTag.y, oTag.tag);
		}
		// message for tags
		O876_Raycaster.GXMessage.prototype.wSize = 256;
		O876_Raycaster.GXMessage.prototype.yOfs = 16;
		this.oRaycaster.oCamera.fSpeed = 3;
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
	},	



	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////

	processKeys: function() {
		switch (this.getKeyboardDevice().inputKey()) {
			case KEYS.ALPHANUM.I:
				this.oRaycaster.fViewHeight += 0.1;
				break;
				
			case KEYS.ALPHANUM.O: 
				this.oRaycaster.fViewHeight -= 0.1;
				break;
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
		oContext.drawImage(this.oRaycaster.getScreenCanvas(), 0, 0, wr, hr, 0, 0, w, h);
		this._oScreenShot = oCanvas;
	},

	/**
	 * Effectue une vérification du block actuellement traversé
	 * Si on entre dans une zone taggée (ensemble des blocks contigüs portant le même tag), on déclenche l'évènement.
	 */
	detectTag: function() {
		var rc = this.oRaycaster;
		var rcc = rc.oCamera;
		var x = rcc.xSector;
		var y = rcc.ySector;
		var sTag = this.getBlockTag(x, y);
		if (sTag != this._sTag) {
			if (this.onTagTriggered) {
				this.onTagTriggered(x, y, sTag);
			}
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
			this.onTagTriggered(x, y, sTag);
		}
		this.openDoor(x, y);
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
	}
});
