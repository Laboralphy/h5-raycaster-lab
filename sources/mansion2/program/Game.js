O2.extendClass('MANSION.Game', O876_Raycaster.GameAbstract, {
	_oAudio: null,
	_sAmbience: '',
	_sAmbienceAfterFight: '',
	_oScripts: null,
	_oDarkHaze: null,
	
	_oLocators: null,
	
	aDebugLines: null,
	oPhone: null,
	oLogic: null,


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


	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/

	init: function() {
		this._oLocators = {};
		this.initLogic();
		this.initAudio();
		this.initPopup();
		this.on('build', this.gameEventBuild.bind(this));
		this.on('load', this.gameEventLoad.bind(this));
		this.on('level', this.gameEventEnterLevel.bind(this));
		this.on('door', this.gameEventDoor.bind(this));
		this.on('frame', this.gameEventFrame.bind(this));
		this.on('doomloop', this.gameEventDoomloop.bind(this));
		this.on('click', this.gameEventClick.bind(this));
		
		// initialisable
		this.on('itag.light', this.tagEventLight.bind(this));
		this.on('itag.shadow', this.tagEventShadow.bind(this));
		this.on('itag.diffuse', this.tagEventDiffuse.bind(this));
		this.on('itag.locator', this.tagEventLocator.bind(this));
		this.on('itag.lock', this.tagEventLock.bind(this));

		// activable
		this.on('tag.msg', this.tagEventMessage.bind(this));
		this.on('tag.script', this.tagEventScript.bind(this));
		this.on('tag.zone', this.tagEventZone.bind(this));
		this.on('tag.teleport', this.tagEventTeleport.bind(this));
		this.on('tag.item', this.tagEventItem.bind(this));
		this.on('tag.lock', this.tagEventUnlock.bind(this));

		this.on('command0', this.gameEventCommand0.bind(this));
		this.on('command2', this.gameEventCommand2.bind(this));
		this.on('activate', this.gameEventActivate.bind(this));
		this.on('hit', this.gameEventHit.bind(this));
		this.on('attack', this.gameEventAttack.bind(this));
		
		this.on('key.down', this.gameEventKey.bind(this));		
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
	 * Initializes audio system
	 */
	initAudio: function() {
		a = new O876.SoundSystem();
		a.setChannelCount(8);
		this._oAudio = a;
		a.setPath('resources/sounds');
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
	




	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/


	/**
	 * Evènement déclenché lorsque les données du niveau sont en cours
	 * de rassemblage.
	 * On peut agir sur les données ici, pour ajouter des ressources
	 */
	gameEventBuild: function(data) {
		data = WORLD_DATA[this._sLevelIndex];
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
		var sMsg = STRINGS_DATA.RC['l_' + s];
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
		var rc = this.oRaycaster;
		this._oDarkHaze = rc.addGXEffect(MANSION.GX.DarkHaze);
		rc.addGXEffect(O876_Raycaster.GXFade).fadeIn('#000', 1700);
		this.configPlayerThinker();
		this.playAmbience(SOUNDS_DATA.bgm[this.getLevel()]);
		this.oPhone = new MANSION.Phone(this.oRaycaster);
		this.bindPhoneEvents(this.oPhone);
		this._oGhostScreamer = rc.addGXEffect(MANSION.GX.GhostScreamer);
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
		} else {
			this.activateWall(this.getPlayer());
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
		if (!O876_Raycaster.PointerLock.bEnabled) {
			return;
		}
		this.toggleCamera();
	},

	/**
	 * Evenement de click avec coordinnée par rapport au canvas
	 */
	gameEventClick: function(data) {
		var x = data.x;
		var y = data.y;
		var p = this.oPhone;
		var pc = this.oPhone.getCurrentPhone();
		
		// desktop click manager
		if (p.isActive('Desktop') && pc.isVisible()) {
			var pi = pc.oPhone.oImage;
			var xpc = pc.xPhone;
			var ypc = pc.yPhone;
			if (x < xpc || y < ypc || x >= (xpc + pi.width) || y >= (ypc + pi.height)) {
				this.closeApplication(true);
			} else {
				var ax = xpc + pc.SCREEN_X;
				var ay = ypc + pc.SCREEN_Y;
				var oDesktop = p.getCurrentApplication();
				var id = oDesktop.peek(x - ax, y - ay);
				oDesktop.execCommand(id, this);
			}
		}
	},

	/**
	 * Evènement déclenché par la pression de la barre espace
	 * Bouton droit de la souris
	 * Bring the camera up and down
	 */
	gameEventActivate: function() {
		if (this.oPhone.getCurrentApplication()) {
			this.oPhone.close();
			O876_Raycaster.PointerLock.enable(this.oRaycaster.oCanvas);
		} else {
			this.oPhone.activate('Desktop');
			O876_Raycaster.PointerLock.disable();
			this.oPhone.getCurrentApplication().loadNote('home');
		}
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
	

	/**
	 * Event triggered when a key is pressed
	 * @param oEvent {k : pressed key code }
	 */
	gameEventKey: function(oEvent) {
		var oGhost = this.oRaycaster.oHorde.aMobiles[1];
		switch (oEvent.k) {
			case KEYS.ESCAPE:
			break;

			case KEYS.ALPHANUM.E:
			break;

			case KEYS.F1:
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_pat', pos.x, pos.y);
			break;
			
			case KEYS.F2: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_warami', pos.x, pos.y);
			break;
			
			case KEYS.F3: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_dementia', pos.x, pos.y);
			break;		
			
			case KEYS.F4: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_angryman', pos.x, pos.y);
			break;
			
			case KEYS.F5: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_bloodia', pos.x, pos.y);
			break;
			
			case KEYS.F6: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_edwound', pos.x, pos.y);
			break;
			
			case KEYS.F7: 
			case KEYS.F8: 
			case KEYS.F9: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_doll', pos.x, pos.y);
			break;
			case KEYS.F10: 
			case KEYS.F11: 
			case KEYS.F12: 
//				oGhost.getThinker().TODO = oEvent.k - KEYS.F1 + 1;
			break;
		}
	},
	
	/**
	 * Event triggered for each frame being computed. 
	 * @param oEvent {}
	 */
	gameEventDoomloop: function(oEvent) {
		// discarded mobiles
		var aDiscarded = this.oRaycaster.getDiscardedMobiles();
		if (aDiscarded) {
			this.checkGhostAmbience();
		}
		// update camera
		var gl = this.oLogic;
		gl.setTime(this.getTime()); // transmit game time
		this.oPhone.updateLogic(gl);
		/*
		if (this.oPhone.isActive('Camera')) {
			var oCameraApp = this.oPhone.getCurrentApplication();
			oCameraApp.setEnergyGauges(gl.getCameraEnergy(), gl.getCameraMaxEnergy());
		}*/
	},
	
	/**
	 * Event triggered for each frame being rendered (displayed on screen)
	 * @param oEvent {}
	 */
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


	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/
	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/
	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/
	
	/**
	 * Gestionnaire de tag
	 * tag : diffuse
	 * Ce tag règle le facteur "diffuse" d'un bloc, c'est à dire la quantité
	 * de lumière qu'il emet
	 * diffuse 100 indique que le block est totalement lumineux
	 * diffuse 0 indique que le block n'emet pas de lumière
	 * diffuse -100 indique que le block absorbe la lumière (noir)
	 */
	tagEventDiffuse: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var nDiffuse = oEvent.data | 0;
		var rc = this.oRaycaster;
		var b;
		for (var nSide = 0; nSide < 6; ++nSide) {
			b = rc.getBlockData(x, y, nSide);
			b.diffuse = rc.nShadingThreshold * nDiffuse / 100 | 0;
			console.log(x, y, b.diffuse);
		}
		oEvent.remove = true;
	},

	/**
	 * Gestionnaire de tag
	 * tag : locator
	 * Permet d'enregistrer un locator, c'est à dire un repère marqué
	 * afin de pouvoir y faire référence ultérieurement
	 * un locateur peut servir de :
	 * - sortie de téléporteur
	 * - point de spawn pour apparition
	 */
	tagEventLocator: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var sLocator = oEvent.data;
		this._oLocators[sLocator] = {x: x, y: y};
		oEvent.remove = true;
	},
	
	/**
	 * Gestionaire de porte verouillée
	 */
	tagEventLock: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		this.lockDoor(x, y);
	},

	/**
	 * Gestionnaire de tag
	 * tag : light
	 * Ce tag génère de la lumière statique lors du chargement du niveau
	 * light c|f|w pour indiquer une lumière venant du plafon (c) ou du
	 * sol (f) ou des murs (w)
	 */
	tagEventLight: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var sType = oEvent.data;
		var rc = this.oRaycaster;
		var nPhys;
		var aDir = [[1, 0],	[0, -1], [-1, 0], [0, 1]];		
		var pLightFunc = GfxTools.drawCircularHaze;
		var pLightFlatFunc = function(rc, oCanvas, x, y, nSide) {
			pLightFunc(oCanvas, 'middle');
		};
		var sProp;

		switch (sType) {
			case 'c': // ceiling only
				rc.cloneFlat(x, y, 1, pLightFlatFunc);
				sProp = 'top';
			break;

			case 'f': // floor only
				rc.cloneFlat(x, y, 0, pLightFlatFunc);
				sProp = 'bottom';
			break;

			case 'w': // floor and ceiling
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
		this.popupMessage(STRINGS_DATA[this.getLevel()]['m_' + sTag]);
		oEvent.remove = true;
	},
	
	/**
	 * Déclenché lorsqu'on active un tag "zone"
	 */
	tagEventZone: function(oEvent) {
		var sZone = oEvent.data;
		// changement d'ambiance sonore
		if (Event.data in SOUNDS_DATA) {
			this.playAmbience(SOUNDS_DATA.bgm[sZone]);
		}
		// Noter le tag comme étant visité
		var p = this.getPlayer();
		p.data('g-visited-zone-' + sZone, true);
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


	tagEventTeleport: function(oEvent) {
		var sDest = oEvent.data;
		var oLoc = this.getLocator(sDest);
		var p = this.getPlayer();
		var rc = this.oRaycaster;
		rc.addGXEffect(O876_Raycaster.GXFade).fadeIn('#000', 0.7);
		p.setXY(oLoc.x * 64 + 32, oLoc.y * 64 + 32);
	},
	
	/**
	 * Item accroché au mur
	 */
	tagEventItem: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		this.oRaycaster.cloneWall(x, y, false, false);
		var sItem = this.getBlockTag(oEvent.x, oEvent.y, 'item');
		var sItemStr = STRINGS_DATA.ITEMS[sItem];
		this.getPlayer().data('item-' + sItem, true);
		this.popupMessage(STRINGS_DATA.EVENTS.item, {
			$item: sItemStr
		});
		var aItem = sItem.split('-');
		var sSound = aItem.shift();
		if (sSound in SOUNDS_DATA.pickup) {
			this.playSound(SOUNDS_DATA.pickup[sSound]);
		}
		oEvent.remove = true;
	},
	
	tagEventUnlock: function(oEvent) {
		var sKey = this.getBlockTag(oEvent.x, oEvent.y, 'lock');
		var sItemStr = STRINGS_DATA.ITEMS[sKey];
		if (this.getPlayer().data('item-' + sKey)) {
			this.unlockDoor(oEvent.x, oEvent.y);
			this.popupMessage(STRINGS_DATA.EVENTS.unlock, {
				$item: sItemStr
			});
			this.playSound(SOUNDS_DATA.events.doorunlock);
			oEvent.remove = true;
		} else {
			this.popupMessage(STRINGS_DATA.EVENTS.locked, {
				$item: sItemStr
			});
			this.playSound(SOUNDS_DATA.events.doorlocked);
		}
	},


	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/
	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/
	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/

	/**
	 * will bind phone events
	 * This is a kind of phone initialization, but will
	 * occurs after each loaded level 
	 * @param p Phone
	 */
	bindPhoneEvents: function(p) {
		p.on('phone.startup.Camera', this.phoneAppCameraOn.bind(this));
		p.on('phone.shutdown.Camera', this.phoneAppCameraOff.bind(this));
	},
	
	/**
	 * Will configure the player thinker according to what type of level it is now.
	 * Will choose a playerThinnker for normal level
	 * Will choose introThinker for the intro movie sequence
	 */
	configPlayerThinker: function() {
		var oPlayer = this.getPlayer();
		var ct;
		switch (this._sLevelIndex) {
			case 'm050-intro':
				oPlayer.setThinker(new MANSION.IntroThinker());
				ct = oPlayer.getThinker();
			break;
			
			default:
				oPlayer.setThinker(new MANSION.PlayerThinker());
				oPlayer.fSpeed = 3;
				ct = oPlayer.getThinker();
				ct.on('button0.down', (function() { 
					this.trigger('command0');
				}).bind(this))
				.on('button2.down', (function() { 
					this.trigger('command2');
				}).bind(this))
				.on('use.down', (function() { 
					this.trigger('activate');
				}).bind(this));
			break;
		}
		ct.oGame = this;
	},


	phoneAppCameraOn: function(data) {
		oAppCamera = data.application;
		oAppCamera.setEnergyGauges(0, this.oLogic.getCameraMaxEnergy());
		oAppCamera.nCircleSize = this.oLogic.getCameraCircleSize();
		oAppCamera.oParticles.setParticleCanvas(this.oRaycaster.getTile('l_particle').oImage);
		var p = this.oPhone.getCurrentPhone();
		oAppCamera.oParticles.setAttractor(0, p.SCREEN_H, 20480);
		this.getPlayer().fSpeed = 2;
	},

	phoneAppCameraOff: function() {
		this.oLogic.cameraOff();
		this.getPlayer().fSpeed = 3;
	},
	


	/**
	 * Close the current application
	 */
	closeApplication: function(bRestorePointerLock) {
		this.oPhone.close();
		if (bRestorePointerLock) {
			O876_Raycaster.PointerLock.enable(this.oRaycaster.oCanvas);
		}
	},

	
	/**
	 * puts the camera obscura on and off
	 * useful for application that open and close using the same button
	 * like the camera
	 */
	toggleCamera: function() {
		if (this.oPhone.isActive('Camera')) {
			this.closeApplication();
		} else {
			this.oPhone.activate('Camera');
			O876_Raycaster.PointerLock.enable(this.oRaycaster.oCanvas);
		}
	},

	/**
	 * A hostile ghost is spawned.
	 * @param sBlueprint string reference to the blueprint
	 * @param x float initial ghost position x
	 * @param y float initial ghost position y
	 * @param a float initial ghost angle
	 * @return Mobile
	 */
	spawnGhost: function(sBlueprint, x, y, a) {
		var oGhost = this.spawnMobile(sBlueprint, x, y, a);
		oGhost.getThinker().reset();
		oGhost.data('hp', oGhost.data('life'));
		oGhost.data('dead', false);
		oGhost.getThinker().setSpeed(oGhost.data('speed'));
		this.playGhostAmbience(SOUNDS_DATA.bgm.ghost);
	},
	
	/**
	 * Return the number of currently active and hostile ghosts
	 */
	getGhostCount: function() {
		var aMobs = this.oRaycaster.oHorde.aMobiles;
		var n = 0;
		for (var i = 0, l = aMobs.length; i < l; ++i) {
			if (aMobs[i].data('life')) {
				++n;
			}
		}
		return n;
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
		oMissile.fSpeed = oMissile.data('speed');
		oMissile.getThinker().fire(oShooter);
		return oMissile;
	},
	
	
	/**
	 * A visual effect is spawned at the spécified position
	 */
	spawnVisualEffect: function(sBlueprint, x, y) {
		var oVFX = this.spawnMobile(sBlueprint, x, y, 0);
		oVFX.getThinker().reset();
		var oSounds = oVFX.data('sounds');
		if (oSounds && ('spawn' in oSounds)) {
			this.playSound(SOUNDS_DATA.visualeffects[oSounds.spawn], x, y);
		}
		return oVFX;
	},


	/**
	 * Take a picture from the camera obscura
	 */
	cameraShoot: function() {
		var gl = this.oLogic;
		if (gl.isCameraReady()) {
			gl.cameraShoot();
			this.playSound(SOUNDS_DATA.events.camera);
			// draw the ghost screaming effects
			gl.getCapturedGhosts().forEach(function(g) {
				var fDistance = g[2];
				var fAngle = g[1];
				var oGhost = g[0];
				this._oGhostScreamer.addGhost(oGhost);
			}, this);
		}
	},
	
	
	////// UTILITIES //////
	
	/**
	 * Renvoie les coordonée d'un locator
	 * @return object {x: int, y: int}
	 */
	getLocator: function(sLocator) {
		var l = this._oLocators;
		if (sLocator in l) {
			return l[sLocator];
		} else {
			throw new Error('no locator "' + sLocator + '" defined');
		}
	},

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
	
	lockDoor: function(x, y) {
		var rc = this.oRaycaster;
		var p = rc.getMapPhys(x, y);
		if (p >= 2 && p <= 9) {
			this.mapData(x, y, 'locked-phys-code', p);
			rc.setMapPhys(x, y, p == rc.PHYS_SECRET_BLOCK ? rc.PHYS_WALL : rc.PHYS_OFFSET_BLOCK);
			rc.setMapOffs(x, y, rc.nPlaneSpacing >> 1);
		}
	},
	
	unlockDoor: function(x, y) {
		var rc = this.oRaycaster;
		var p = this.mapData(x, y, 'locked-phys-code');
		if (p !== null) {
			rc.setMapPhys(x, y, p);
			rc.setMapOffs(x, y, 0);
			rc.cloneWall(x, y, false, false);
			this.mapData(x, y, 'locked-phys-code', null);
		}
	},

	isDoorLocked: function(x, y) {
		return !!this.mapData(x, y, 'locked-phys-code');
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
			this._oAudio.play(sFile, fVolume);
		}
	},


	_sPreviousAmbience: '',
	
	/**
	 * Lance le fichier musical d'ambiance
	 * @param string sAmb nom du fichier
	 */
	playAmbience: function(sAmb) {
		if (this._sPreviousAmbience) {
			this._sPreviousAmbience = sAmb;
			return;
		}
		if (this.sAmbience == sAmb) {
			return;
		} else if (this.sAmbience) {
			this._oAudio.crossFadeMusic(sAmb);
			this.sAmbience = sAmb;
		} else {
			this._oAudio.playMusic(sAmb);
			this.sAmbience = sAmb;
		}
	},

	checkGhostAmbience: function() {
		if (this._sPreviousAmbience && this.getGhostCount() === 0) {
			var pa = this._sPreviousAmbience;
			this._sPreviousAmbience = '';
			this.playAmbience(pa);
		}
	},

	/**
	 * plays a ghost music
	 */
	playGhostAmbience: function(sGhostAmb) {
		if (this._sPreviousAmbience === '') {
			var pa = this.sAmbience;
			this.playAmbience(sGhostAmb);
			this._sPreviousAmbience = pa;
		}
	}
});

