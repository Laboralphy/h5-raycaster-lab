O2.extendClass('Stub.Game', O876_Raycaster.Engine, {
	sGeneratorUrl : '../../dynamics/laby/laby.php',
	///////////// EVENEMENTS /////////////

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
		return WORLD_DATA;
	},
	
	
	// onLoading: null,
	
	/**
	 * Evènement appelé lorsqu'un niveau a été chargé
	 * Permet l'initialisation des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel: function() {
		this.oRaycaster.nPlaneSpacing = 64;
		var oCT = new O876_Raycaster.CameraMouseKeyboardThinker();
		oCT.oMouse = this._getMouseDevice(this.oRaycaster.oCanvas);
		oCT.oKeyboard = this._getKeyboardDevice();
		oCT.oGame = this;
		this.oRaycaster.oCamera.setThinker(oCT);
		oCT.useDown = function() {
			this.oGame.activateWall(this.oMobile);    
		};

		this.oRaycaster.oCamera.fSpeed = 6;
		this.oRaycaster.bSky = true;
		this.oRaycaster.bFlatSky = true;
	},

	/**
	 * Evènement appelé par le processeur
	 * Ici on lance les animation de textures
	 */
	onDoomLoop: function() {
		this.processKeys();
		this.oRaycaster.textureAnimation();
	},
	
	processKeys: function() {
		switch (this._getKeyboardDevice().inputKey()) {
			case KEYS.ALPHANUM.I:
				this.oRaycaster.fViewHeight += 0.1;
				break;
				
			case KEYS.ALPHANUM.O: 
				this.oRaycaster.fViewHeight -= 0.1;
				break;
		}
	},
	
	
	/**
	 * Evènement appelé à chaque rendu de frame
	 */
	onFrameRendered: function() {
	},
	
	/** 
	 * Appelé par le thinker de caméra
	 */
	activateWall: function(m) {
		var oBlock = m.getFrontCellXY(); 
		this.openDoor(oBlock.x, oBlock.y);
	}
});
