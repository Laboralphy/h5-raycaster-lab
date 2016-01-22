O2.extendClass('MANSION.Game', O876_Raycaster.GameAbstract, {
	_oAudio: null,
	_sAmbience: '',
	_oScripts: null,
	_oDarkHaze: null,
	
	aDebugLines: null,
	oPhone: null,
	oLogic: null,

	init: function() {
		this.initLogic();
		this.initAudio();
		this.initPopup();
		this.on('build', this.gameEventBuild.bind(this));
		this.on('load', this.gameEventLoad.bind(this));
		this.on('level', this.gameEventEnterLevel.bind(this));
		this.on('door', this.gameEventDoor.bind(this));
		this.on('frame', this.gameEventFrame.bind(this));
		this.on('doomloop', this.gameEventDoomloop.bind(this));
		
		this.on('itag.light', this.tagEventLight.bind(this));
		this.on('itag.shadow', this.tagEventShadow.bind(this));
		this.on('tag.msg', this.tagEventMessage.bind(this));
		this.on('tag.script', this.tagEventScript.bind(this));
		this.on('tag.zone', this.tagEventZone.bind(this));
		this.on('command0', this.gameEventCommand0.bind(this));
		this.on('command2', this.gameEventCommand2.bind(this));
		this.on('hit', this.gameEventHit.bind(this));
		this.on('attack', this.gameEventAttack.bind(this));
		
		this.on('key', this.gameEventKey.bind(this));
	},
	
	/**
	 * Logic initialization
	 * Done once per game.
	 */
	initLogic: function() {
		this.oLogic = new MANSION.Logic();
		this.oLogic.setCameraCaptureRank(1);
	},
	
	
	
	/**
	 * Displays a debug line
	 * @param n line number
	 * @param s string displayed text 
	 */
	displayDebugLine: function(n, s) {
		if (this.aDebugLines === null) {
			this.aDebugLines = [];
		}
		this.aDebugLines[n] = s;
	},

	initAudio: function() {
		a = new SoundSystem();
		a.addChans(8);
		this._oAudio = a;
	},
	
	/**
	 * Initialisation des popup
	 */
	initPopup: function() {
		this.setPopupStyle({
			font: 'monospace 10',
			width: 320,
			height: 32,
			speed: 120,
			position: 8
		});
	},
	
	/**
	 * Evènement déclenché lorsque les données du niveau sont en cours
	 * de rassemblage.
	 * On peut agir sur les données ici, pour ajouter des ressources
	 */
	gameEventBuild: function(data) {
		var s = '';
		for (s in TILES_DATA) {
			data.tiles[s] = TILES_DATA[s];
		}
		for (s in BLUEPRINTS_DATA) {
			data.blueprints[s] = BLUEPRINTS_DATA[s];
		}
	},

	/**
	 * Evènement déclenché lorsque le niveau est un cours de chargement
	 * l'objet passé en paramètre contient les données suivante
	 * - phase : string, nom de la phase de chargement
	 * - progress : int, progression
	 * - max : int, valeur max de la progression
	 */
	gameEventLoad: function(oEvent) {
		var s = oEvent.phase;
		var n = oEvent.progress;
		var nMax = oEvent.max;
		var oCanvas = this.oRaycaster.oCanvas;
		var oContext = this.oRaycaster.oContext;
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		var sMsg = MESSAGES_DATA.RC['l_' + s];
		var y = oCanvas.height >> 1;
		var nPad = 96;
		var xMax = oCanvas.width - (nPad << 1);
		oContext.font = '10px monospace';
		oContext.fillStyle = 'white';
		oContext.fillText(sMsg, nPad, oCanvas.height >> 1);
		oContext.fillStyle = 'rgb(48, 0, 0)';
		oContext.fillRect(nPad, y + 12, xMax, 8);
		oContext.fillStyle = 'rgb(255, 48, 48)';
		oContext.fillRect(nPad, y + 12, n * xMax / nMax, 8);
	},
		
	/**
	 * Evènement déclenché lorsqu'on entre dans un niveau
	 * pas de paramètre
	 */
	gameEventEnterLevel: function() {
		this._oDarkHaze = this.oRaycaster.addGXEffect(MANSION.GX.DarkHaze);
		var oGXFade = this.oRaycaster.addGXEffect(O876_Raycaster.GXFade);
		oGXFade.fAlpha = 1.5;
		oGXFade.oColor = { r: 0, g: 0, b: 0, a: 1 };
		oGXFade.fAlphaFade = -0.05;
		var oPlayer = this.getPlayer();
		oPlayer.fSpeed = 3;
		oPlayer.getThinker().button0Down = (function() { 
			this.trigger('command0');
		}).bind(this);
		oPlayer.getThinker().button2Down = (function() { 
			this.trigger('command2');
		}).bind(this);
		this.playAmbience(SOUNDS_DATA.bgm[this.getLevel()]);
		this.oPhone = new MANSION.Phone(this.oRaycaster);
		this._oGhostScreamer = this.oRaycaster.addGXEffect(MANSION.GX.GhostScreamer);
	},
	
	/**
	 * Evènement déclenché lorsqu'on ouvre une porte
	 * - x, y : int position de la porte
	 * - door : effet généré par la porte (peut etre annulé)
	 */
	gameEventDoor: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oEffect = oEvent.door;
		switch (oEffect.sClass) {
			case 'Door':
				this.playSound(SOUNDS_DATA.events.dooropen, x * ps + ps2, y * ps + ps2);
				oEffect.done = (function() {
					this.playSound(SOUNDS_DATA.events.doorclose, x * ps + ps2, y * ps + ps2);
				}).bind(this);
				break;
				
			case 'Secret':
				this.playSound(SOUNDS_DATA.events.secret, x * ps + ps2, y * ps + ps2);
				break;
			
		}
	},

	/**
	 * Evènement déclenché par la commande 0 
	 * Bouton gauche de la souris
	 */
	gameEventCommand0: function() {
		//this.spawnMissile('p_ecto', this.getPlayer());
		if (!O876_Raycaster.PointerLock.locked()) {
			return;
		}
		if (this.oPhone.isActive('Camera')) {
			this.cameraShoot();
		}
	},

	/**
	 * Evènement déclenché par la commande 2 
	 * Bouton droit de la souris
	 * Bring the camera up and down
	 */
	gameEventCommand2: function() {
		if (!O876_Raycaster.PointerLock.locked()) {
			return;
		}
		this.toggleCamera();
	},

	/**
	 * Evènement déclenché quand une entité est touchée par un missile
	 * @param oEvent {t: entité cible, m: missile}
	 */
	gameEventHit: function(oEvent) {
		var oTarget = oEvent.t;
		var oMissile = oEvent.m;
		if (oTarget == this.getPlayer()) {
			// joueur touché par un missile
			this._oDarkHaze.startPulse();
		} else {
			// ???
		}
	},

	/**
	 * Evènement déclenché lorsqu'une entitée est aggressée physiquement
	 * par une autre (contact).
	 * @param oEvent {t: entité cible, a: aggresseur}
	 */
	gameEventAttack: function(oEvent) {
		var oTarget = oEvent.t;
		if (oTarget == this.getPlayer()) {
			// joueur touché par fantôme
			this._oDarkHaze.startPulse();
			oTarget.getThinker().ghostThreat(oEvent.a);
		} else {
			// ???
		}
	},
	
	gameEventKey: function(oEvent) {
		var oGhost = this.oRaycaster.oHorde.aMobiles[1];
		switch (oEvent.k) {
			case KEYS.ALPHANUM.E:
				
			break;
			case KEYS.F1: 
			case KEYS.F2: 
			case KEYS.F3: 
			case KEYS.F4: 
			case KEYS.F5: 
			case KEYS.F6: 
			case KEYS.F7: 
			case KEYS.F8: 
			case KEYS.F9: 
			case KEYS.F10: 
			case KEYS.F11: 
			case KEYS.F12: 
//				oGhost.getThinker().TODO = oEvent.k - KEYS.F1 + 1;
			break;
		}
	},
	
	gameEventDoomloop: function(oEvent) {
		// update camera
		var gl = this.oLogic;
		gl.setTime(this.getTime()); // transmit game time
		if (this.oPhone.isActive('Camera')) {
			var oCameraApp = this.oPhone.getCurrentApplication();
			oCameraApp.setEnergyGauges(gl.getCameraEnergy(), gl.getCameraMaxEnergy());
		}
	},
	
	gameEventFrame: function(oEvent) {
		var aLog = this.aDebugLines;
		if (aLog !== null) {
			var c = this.oRaycaster.oContext;
			c.fillStyle = '#FFF';
			for (var i = 0, l = aLog.length; i < l; ++i) {
				if (aLog[i] !== undefined) {
					c.fillText(aLog[i], 0, i * 12 + 12);
				}
			}
		}
	},


	////// TAG EVENTS ////// TAG EVENTS ////// TAG EVENTS //////
	////// TAG EVENTS ////// TAG EVENTS ////// TAG EVENTS //////
	////// TAG EVENTS ////// TAG EVENTS ////// TAG EVENTS //////
	
	/**
	 * Gestionnaire de tag
	 * tag : lightsource
	 * Ce tag génère de la lumière statique lors du chargement du niveau
	 * lightsource c|f|w pour indiquer une lumière venant du plafon (c) ou du
	 * sol (f) ou des murs (w)
	 */
	tagEventLight: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var sType = oEvent.param;
		var rc = this.oRaycaster;
		var nPhys;
		var aDir = [[1, 0],	[0, -1], [-1, 0], [0, 1]];		
		var pLightFunc = GfxTools.drawCircularHaze;
		var pLightFlatFunc = function(rc, oCanvas, x, y, nSide) {
			pLightFunc(oCanvas, 'middle');
		};
		var sProp;

		switch (sType) {
			case 'c':
				rc.cloneFlat(x, y, 1, pLightFlatFunc);
				sProp = 'top';
			break;

			case 'f':
				rc.cloneFlat(x, y, 0, pLightFlatFunc);
				sProp = 'bottom';
			break;

			case 'w':
				rc.cloneFlat(x, y, 0, pLightFlatFunc);
				rc.cloneFlat(x, y, 1, pLightFlatFunc);
				sProp = 'middle';
			break;
		}
		
		var pDrawFunc = function(rc, oCanvas, x, y, nSide) {
			pLightFunc(oCanvas, sProp);
		};
		
		aDir.forEach(function(a, ia) {
			var xd = x + a[0], yd = y + a[1];
			nPhys = rc.getMapPhys(xd, yd);
			if (nPhys != rc.PHYS_NONE && nPhys != rc.PHYS_INVISIBLE) {
				rc.cloneWall(xd, yd, ia, pDrawFunc);
			}
		});
		oEvent.remove = true;
	},
	
	/**
	 * Gestionnaire de tag
	 * tag : shadow
	 * Ce tag génère une ombre au sol
	 */
	tagEventShadow: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		this.oRaycaster.cloneFlat(x, y, 0, function(rc, oCanvas, x, y, nSide) {
			var ctx = oCanvas.getContext('2d');
			var w = oCanvas.width;
			var w2 = w >> 1;
			var w4 = w >> 2;
			var oGrad = ctx.createRadialGradient(w2, w2, w4, w2, w2, w2);
			oGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
			oGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = oGrad;
			ctx.fillRect(0, 0, w, w);
		});
		oEvent.remove = true;
	},
	
	
	tagEventMessage: function(oEvent) {
		var sTag = oEvent.data;
		this.popupMessage(MESSAGES_DATA[this.getLevel()]['m_' + sTag]);
		oEvent.remove = true;
	},
	
	/**
	 * Déclenché lorsqu'on active un tag "zone"
	 */
	tagEventZone: function(oEvent) {
		// changement d'ambiance sonore
		this.playAmbience(SOUNDS_DATA.bgm[oEvent.data]);
	},
	
	/**
	 * Exécute un script
	 */
	tagEventScript: function(oEvent) {
		var sTag = oEvent.data;
		var aTag = sTag.split(' ');
		var sScript = aTag.shift();
		var sAction = aTag.shift();
		var oInstance = this.getScript(sScript);
		if (sAction in oInstance) {
			oEvent.game = this;
			oInstance[sAction].apply(oInstance, [oEvent]);
		}
	},
	
	
	////// GAME LIFE //////

	/**
	 * puts the camera obscura on and off
	 */
	toggleCamera: function() {
		var oApp = this.oPhone.getCurrentApplication();
		if (oApp && oApp.name === 'Camera') {
			this.oPhone.hide();
			this.oLogic.cameraOff();
			this.getPlayer().fSpeed = 3;
		} else {
			var oAppCamera = this.oPhone.activate('Camera');
			oAppCamera.setEnergyGauges(0, this.oLogic.getCameraMaxEnergy());
			oAppCamera.nCircleSize = this.oLogic.getCameraCircleSize();
			this.getPlayer().fSpeed = 2;
		}
	},
	
	/**
	 * Le mobile spécifié tire un missile
	 * @param sBlueprint string la référence du blueprint du missile
	 * @param oShooter mobile qui a tiré
	 */
	spawnMissile: function(sBlueprint, oShooter) {
		var a = oShooter.getAngle(), x = oShooter.x, y = oShooter.y;
		var nSize = oShooter.nSize + oShooter.fSpeed;
		var xm = nSize * Math.cos(a) + x;
		var ym = nSize * Math.sin(a) + y;
		var oMissile = this.spawnMobile('p_ecto', xm, ym, a);
		oMissile.fSpeed = oMissile.getData('speed');
		oMissile.getThinker().fire(oShooter);
		return oMissile;
	},


	/**
	 * Take a picture from the camera obscura
	 */
	cameraShoot: function() {
		var gl = this.oLogic;
		if (gl.isCameraReady()) {
			gl.cameraShoot();
			// draw the flash effect
			this.oPhone.getCurrentApplication().flash();
			this.playSound(SOUNDS_DATA.events.camera);
			// draw the ghost screaming effects
			gl.getCapturedGhosts().forEach((function(g) {
				var fDistance = g[2];
				var fAngle = g[1];
				var oSprite = g[0];
				this._oGhostScreamer.addGhost(g[0]);
			}).bind(this));
		}
	},
	
	
	
	////// UTILITIES //////
	
	
	
	/**
	 * Renvoie l'instance du joueur
	 * @return Player
	 */
	getPlayer: function() {
		return this.oRaycaster.oCamera;
	},
	
	/**
	 * Renvoie l'objet script correspondant
	 * @param sScript nom du script
	 * @return instance de l'objet script
	 */
	getScript: function(sScript) {
		if (this._oScripts === null) {
			this._oScripts = {};
		}
		var s = this._oScripts;
		var sClass = 'MANSION.Script.' + sScript;
		var pClass, oInstance;
		if (sClass in s) {
			oInstance = s[sClass];
		} else {
			pClass = O2._loadObject(sClass);
			oInstance = new pClass();
			s[sClass] = oInstance;
		}
		return oInstance;
	},
	
	
	/** 
	 * Lecture d'un son à la position x, y
	 * Le son est modifié en amplitude en fonction de la distance séparant le point sonore avec
	 * la position de la caméra
	 * @param string sFile fichier son à jouer
	 * @param float x position de la source du son
	 * @param float y
	 */
	playSound : function(sFile, x, y) {
		sFile = 'resources/snd/' + sFile;
		var nChan = this._oAudio.getFreeChan(sFile);
		var fDist = 0;
		if (x !== undefined) {
			var oPlayer = this.getPlayer();
			fDist = MathTools.distance(
				oPlayer.x - x,
				oPlayer.y - y);
		}
		var fVolume = 1;
		var nMinDist = 64;
		var nMaxDist = 512;
		if (fDist > nMaxDist) {
			fVolume = 0;
		} else if (fDist <= nMinDist) {
			fVolume = 1;
		} else {
			fVolume = 1 - (fDist  / nMaxDist);
		}
		if (fVolume > 1) {
			fVolume = 1;
		}
		if (fVolume > 0.01) {
			this._oAudio.play(sFile, nChan, fVolume);
		}
	},
	
	/**
	 * Lance le fichier musical d'ambiance
	 * @param string sAmb nom du fichier
	 */
	playAmbience: function(sAmb) {
		if (this.sAmbience == sAmb) {
			return;
		} else if (this.sAmbience) {
			this._oAudio.crossFadeMusic('resources/snd/' + sAmb);
			this.sAmbience = sAmb;
		} else {
			this._oAudio.playMusic('resources/snd/' + sAmb);
			this.sAmbience = sAmb;
		}
	},
});
