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
		var oData = WORLD_DATA.level1;
		var aLaby = oData.map;
		return this.buildRaycasterMap(oData, aLaby);
	},
	
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	/**
	 * Transforme une carte labyrinthe logique en carte physique pour le raycaster
	 * Prend en compte les donnée "metacodes" et "specialcodes".
	 * @param oData données tile, textures, blueprint...
	 * @param aLaby tableau 2D carte logique contenant des metacodes qui seront traduit en codes physiques
	 * @return objet oData mis à jour & contenant une carte raycaster.
	 */
	buildRaycasterMap: function(oData, aLaby) {
		var xBlock, yBlock, aRow, nCode;
		oData.map = [];
		for (yBlock = 0; yBlock < aLaby.length; yBlock++) {
			aRow = [];
			for (xBlock = 0; xBlock < aLaby[yBlock].length; xBlock++) {
				nBlock = aLaby[yBlock][xBlock];
				if (nBlock in oData.walls.metacodes) {
					if (typeof oData.walls.metacodes[nBlock] === 'object') {
						nCode = MathTools.rndChoose(oData.walls.metacodes[nBlock]);
					} else {
						nCode = oData.walls.metacodes[nBlock];
					}
				} else {
					nCode = 0;
				}
				if (nCode === 0) {
					nCode = 0;
				}
				aRow.push(nCode);
			}
			oData.map.push(aRow);
		}
		return oData;
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
