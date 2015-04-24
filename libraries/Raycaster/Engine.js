O2.extendClass('O876_Raycaster.Engine', O876_Raycaster.Transistate, {
	// Juste une copie du TIME_FACTOR du raycaster
	TIME_FACTOR : 50, // Doit être identique au TIME_FACTOR du raycaster

	oRaycaster : null,
	oKbdDevice : null,
	oMouseDevice : null,
	oThinkerManager : null,
	oObjectIndex : null,

	nLastTimeStamp : 0,
	nShadedTiles : 0,
	nShadedTileCount : 0,
	
	bCheckFPS: false, // when true the FPS is being checked... 
	// if FPS is too low we decrease the LOD
	aFPSStats: null,

	__construct : function() {
		__inherited('stateInitialize');
		this.resume();
	},

	initRequestAnimationFrame : function() {
		if ('requestAnimationFrame' in window) {
			return true;
		}
		var RAF = null;
		if ('requestAnimationFrame' in window) {
			RAF = window.requestAnimationFrame;
		} else if ('webkitRequestAnimationFrame' in window) {
			RAF = window.webkitRequestAnimationFrame;
		} else if ('mozRequestAnimationFrame' in window) {
			RAF = window.mozRequestAnimationFrame;
		}
		if (RAF) {
			window.requestAnimationFrame = RAF;
			return true;
		} else {
			return false;
		}
	},
	
	initDoomLoop: function() {
		__inherited();
		this.nLastTimeStamp = Date.now();
	},

	/**
	 * Déclenche un évènement
	 * 
	 * @param sEvent
	 *            nom de l'évènement
	 * @param oParam
	 *            paramètre optionnels à transmettre à l'évènement
	 * @return retour éventuel de la fonction évènement
	 */
	_callGameEvent : function(sEvent, oParams) {
		if (sEvent in this && this[sEvent]) {
			var pFunc = this[sEvent];
			return pFunc.apply(this, [ oParams ]);
		}
		return null;
	},

	/**
	 * Arret du moteur et affichage d'une erreur
	 * 
	 * @param sError
	 *            Message d'erreur
	 */
	_halt : function(sError, oError) {
		if (('console' in window) && ('log' in window.console) && (sError)) {
			console.log(sError);
			if (oError) {
				console.log(oError.toString());
			}
		}
		this.pause();
		this.setDoomloop('stateEnd');
		if (this.oKbdDevice) {
			this.oKbdDevice.unplugEvents();
		}
		if (this.oMouseDevice) {
			this.oMouseDevice.unplugEvents();
		}
	},

	/**
	 * Renvoie une instance du périphérique clavier
	 * 
	 * @return KeyboardDevice
	 */
	_getKeyboardDevice : function() {
		if (this.oKbdDevice === null) {
			this.oKbdDevice = new O876_Raycaster.KeyboardDevice();
			this.oKbdDevice.plugEvents();
		}
		return this.oKbdDevice;
	},

	_getMouseDevice : function(oElement) {
		if (this.oMouseDevice === null) {
			if (oElement === undefined) {
				throw new Error('no target element specified for the mouse device');
			}
			this.oMouseDevice = new O876_Raycaster.MouseDevice();
			this.oMouseDevice.plugEvents(oElement);
		}
		return this.oMouseDevice;
	},
	
	/**
	 * Renvoie le temps actuel en millisecondes
	 * @return int
	 */
	getTime: function() {
		return this.nLastTimeStamp;
	},

	// ////////// METHODES PUBLIQUES API ////////////////

	/**
	 * Charge un nouveau niveau et ralnce la machine. Déclenche l'évènement
	 * onExitLevel avant de changer de niveau. Utiliser cet évènement afin de
	 * sauvegarder les données utiles entre les niveaux.
	 * 
	 * @param sLevel
	 *            référence du niveau à charger
	 */
	enterLevel : function(sLevel) {
		this._callGameEvent('onExitLevel');
		this.setDoomloop('stateStartRaycaster');
	},

	/**
	 * Active un effet d'ouverture de porte ou passage secret sur un block
	 * donné. L'effet d'ouverture inclue la modification temporaire de la
	 * propriété du block permettant ainsi le libre passage des mobiles le temps
	 * d'ouverture (ce comportement est codé dans le GXDoor). Le bloc doit
	 * comporte un code physique correspondant à une porte : Un simple mur (code
	 * 1) ne peut pas faire office de porte
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bStayOpen
	 *            désactive autoclose et garde la porte ouverte
	 * 
	 */
	openDoor : function(x, y, bStayOpen) {
		var nPhys = this.oRaycaster.getMapXYPhysical(x, y);
		var o = null;
		switch (nPhys) {
			case 2: // Raycaster::PHYS_FIRST_DOOR
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8: // Raycaster::PHYS_LAST_DOOR
				if (!Marker.getMarkXY(this.oRaycaster.oDoors, x, y)) {
					o = new O876_Raycaster.GXDoor(this.oRaycaster);
					o.x = x;
					o.y = y;
					if (bStayOpen) {
						o.setAutoClose(0);
					}
					this.oRaycaster.oEffects.addEffect(o);
				}
				break;
	
			case 9: // Raycaster::PHYS_SECRET_BLOCK
				if (!Marker.getMarkXY(this.oRaycaster.oDoors, x, y)) {
					o = new O876_Raycaster.GXSecret(this.oRaycaster);
					o.x = x;
					o.y = y;
					this.oRaycaster.oEffects.addEffect(o);
				}
				break;
		}
		return o;
	},

	/**
	 * Fermeture manuelle d'une porte à la position X Y Utilisé avec les portes
	 * sans autoclose. S'il n'y a pas de porte ouverte en X Y -> aucun effet
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bForce
	 *            force la fermeture même en case de présence de mobile
	 */
	closeDoor : function(x, y, bForce) {
		var oDoor = Marker.getMarkXY(this.oRaycaster.oDoors, x, y);
		if (oDoor) {
			oDoor.setAutoClose(1);
			oDoor.close();
		}
		return oDoor;
	},

	/**
	 * Permet d'indexé un objet, de lui attribuer un identifiant afin de le
	 * retrouver plus facilement plus tard Ceci est utilisé dans le cadre des
	 * parties en réseaux dans lesquelles le serveur tient un registre d'objet
	 * qu'il partage avec ses clients.
	 * 
	 * @param oObject
	 *            objet (généralement mobile)
	 * @param id
	 *            identifiant
	 * @return objet
	 */
	setObjectIndex : function(oObject, id) {
		this.oObjectIndex[id] = oObject;
	},

	/**
	 * Supprime l'index précédemment attribué d'un objet, ne supprime pas
	 * l'objet
	 * 
	 * @param id
	 */
	clearObjectIndex : function(id) {
		delete this.oObjectIndex[id];
	},

	/**
	 * Retrouve un objet à partir de son id
	 * 
	 * @param id
	 * @return objet retrouvé grace à l'id, ou null si aucun objet trouvé
	 * @throws Error
	 *             si objet non trouvé
	 */
	getObjectIndex : function(id) {
		if (id in this.oObjectIndex) {
			return this.oObjectIndex[id];
		} else {
			throw new Error('game.getObjectIndex: object (' + id + ') not found.');
		}
	},

	/**
	 * Création d'un nouveau mobile à la position spécifiée
	 * 
	 * @param sBlueprint
	 *            blueprint de l'objet à créer
	 * @param x
	 *            coordonnées initiales
	 * @param y
	 * @param fAngle
	 *            angle initial
	 * @return objet créé
	 */
	spawnMobile : function(sBlueprint, x, y, fAngle) {
		return this.oRaycaster.oHorde.spawnMobile(sBlueprint, x, y, fAngle);
	},
	
	/**
	 * Starts to count frames per second
	 */
	startCheckingFPS: function() {
		this.aFPSStats = [this.nLastTimeStamp];
		this.bCheckFPS = true;
	},

	/**
	 * count frames per second
	 */
	checkFPS: function(nNowTimeStamp) {
		if (this.bCheckFPS) {
			var a = this.aFPSStats;
			a.push(nNowTimeStamp);
			if (a.length > 100) {
				this.bCheckFPS = false;
				var i;
				var f = 0;
				for (i = a.length - 1; i > 0; --i) {
					a[i] = a[i] - a[i - 1];
					f += a[i];
				}
				this._callGameEvent('onFrameCount', [ 1000 * (a.length - 1) / f ]);
			}
		}
	},

	// /////////// EVENEMENTS /////////////

	// onInitialize: null,

	// onRequestLevelData: null,

	// onLoading: null,

	// onEnterLevel: null,

	// onMenuLoop: null,

	// onDoomLoop: null,

	// onFrameRendered: null,

	// ////////////// ETATS ///////////////

	/**
	 * Initialisation du programme Ceci n'intervient qu'une fois
	 */
	stateInitialize : function() {
		// Evènement initialization
		this._callGameEvent('onInitialize');

		this.TIME_FACTOR = this.nInterval = CONFIG.game.interval;

		switch (CONFIG.game.doomloop) {
		case 'interval':
			this.stateRunning = this.stateRunningInt;
			break;

		case 'raf':
			if (this.initRequestAnimationFrame()) {
				this.stateRunning = this.stateRunningRAF;
			} else {
				this.stateRunning = this.stateRunningInt;
			}
			break;
		}
		this.setDoomloop('stateMenuLoop');
		this.resume();
	},

	/**
	 * Attend le choix d'une partie. Le programme doit afficher un menu ou un
	 * écran d'accueil. Pour lancer la partie, l'évènement onMenuLoop doit
	 * retourner la valeur 'true';
	 */
	stateMenuLoop : function() {
		if (this._callGameEvent('onMenuLoop')) {
			this.setDoomloop('stateStartRaycaster');
		}
	},

	/**
	 * Initialisation du Raycaster Ceci survient à chaque chargement de niveau
	 */
	stateStartRaycaster : function() {
		if (this.oRaycaster) {
			this.oRaycaster.finalize();
		} else {
			this.oRaycaster = new O876_Raycaster.Raycaster();
			this.oRaycaster.TIME_FACTOR = this.TIME_FACTOR;
		}
		this.oRaycaster.setConfig(CONFIG.raycaster);
		this.oObjectIndex = {};
		this.oRaycaster.initialize();
		this.oThinkerManager = this.oRaycaster.oThinkerManager;
		this.oThinkerManager.oGameInstance = this;
		this._callGameEvent('onLoading', [ 'lvl', 0, 2 ]);
		this.setDoomloop('stateBuildLevel');
	},

	/**
	 * Prépare le chargement du niveau. RAZ de tous les objets.
	 */
	stateBuildLevel : function() {
		// Evènement chargement de niveau
		var oData = this._callGameEvent('onRequestLevelData');
		if (typeof oData != 'object') {
			this._halt('no world data : without world data I can\'t build the world. (onRequestLevelData did not return object)');
		}
		this.oRaycaster.defineWorld(oData);
		this._callGameEvent('onLoading', [ 'lvl', 1, 2 ]);
		this.oRaycaster.buildLevel();
		this._callGameEvent('onLoading', [ 'lvl', 2, 2 ]);
		this.setDoomloop('stateLoadComplete');
	},

	/**
	 * Patiente jusqu'à ce que les ressource soient chargée
	 */
	stateLoadComplete : function() {
		if (this.oRaycaster.oImages.complete()) {
			// calculer le nombre de shading à faire
			this.nShadedTileCount = 0;
			var iStc = '';
			for (iStc in this.oRaycaster.oHorde.oTiles) {
				if (this.oRaycaster.oHorde.oTiles[iStc].bShading) {
					++this.nShadedTileCount;
				}
			}
			this.oRaycaster.backgroundRedim();
			this._callGameEvent('onLoading', [ 'shd', this.nShadedTiles = 0, this.nShadedTileCount ]);
			this.setDoomloop('stateShading');
		} else {
			this._callGameEvent('onLoading', [ 'gfx', this.oRaycaster.oImages.countLoaded(), this.oRaycaster.oImages.countLoading() ]);
		}
	},

	/**
	 * Procède à l'ombrage des textures
	 */
	stateShading : function() {
		this._callGameEvent('onLoading', [ 'shd', ++this.nShadedTiles, this.nShadedTileCount ]);
		if (!this.oRaycaster.shadeProcess()) {
			return;
		}
		// this._callGameEvent('onLoading', ['shd', 1, 1]);
		this.nLastTimeStamp = Date.now();
		this.startCheckingFPS();
		this.setDoomloop('stateRunning');
		this._callGameEvent('onLoading', [ 'end', 1, 1 ]);
		this._callGameEvent('onEnterLevel');
	},

	/**
	 * Déroulement du jeu
	 */
	stateRunning : null,

	/**
	 * Déroulement du jeu
	 */
	stateRunningInt : function() {
		var nNowTimeStamp = Date.now();
		var nFrames = 0;
		while (this.nLastTimeStamp < nNowTimeStamp) {
			this.oRaycaster.frameProcess();
			this._callGameEvent('onDoomLoop');
			this.nLastTimeStamp += this.nInterval;
			nFrames++;
		}
		if (nFrames) {
			this.oRaycaster.frameRender();
			this._callGameEvent('onFrameRendered');
		}
		this.checkFPS(nNowTimeStamp);
	},

	/**
	 * Déroulement du jeu
	 */
	stateRunningRAF : function(nTime) {
		var E = window.__transistateMachine;
		requestAnimationFrame(E.stateRunning);
		var nNowTimeStamp = Date.now();
		var nFrames = 0;
		while (E.nLastTimeStamp < nNowTimeStamp) {
			E.oRaycaster.frameProcess();
			E._callGameEvent('onDoomLoop');
			E.nLastTimeStamp += E.nInterval;
			nFrames++;
		}
		if (nFrames) {
			E.oRaycaster.frameRender();
			E._callGameEvent('onFrameRendered');
		}
		this.checkFPS(nNowTimeStamp);
	},

	/**
	 * Fin du programme
	 * 
	 */
	stateEnd : function() {
		this.pause();
	}
});
