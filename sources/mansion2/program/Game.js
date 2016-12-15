O2.extendClass('MANSION.Game', O876_Raycaster.GameAbstract, {
	_oAudio: null,
	_sAmbience: '',
	_sAmbienceAfterFight: '',
	_oScripts: null,
	_oDarkHaze: null,
	_sLevelIndex: 'tutorial',
	_oLocators: null,
	
	aDebugLines: null,
	oCamera: null,
	oLogic: null,
	oUI: null,


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
		O2.createObject('MANSION.STRINGS_DATA', MANSION.STRINGS_DATA_EN);
		this._oLocators = {};
		this.initLogic();
		this.initAudio();
		this.initPopup();
		this.initUI();
		this.on('leveldata', this.gameEventBuild.bind(this));
		this.on('load', this.gameEventLoad.bind(this));
		this.on('enter', this.gameEventEnterLevel.bind(this));
		this.on('door', this.gameEventDoor.bind(this));
		this.on('frame', this.gameEventFrame.bind(this));
		this.on('doomloop', this.gameEventDoomloop.bind(this));
		this.on('click', this.gameEventClick.bind(this));
		this.on('mousemove', this.gameEventMouseMove.bind(this));
		
		// initialisable
		this.on('itag.light', this.tagEventLight.bind(this));
		this.on('itag.shadow', this.tagEventShadow.bind(this));
		this.on('itag.diffuse', this.tagEventDiffuse.bind(this));
		this.on('itag.locator', this.tagEventLocator.bind(this));
		this.on('itag.lock', this.tagEventLock.bind(this));
		this.on('itag.photoscript', this.tagEventPhotoScript.bind(this));
		this.on('itag.subject', this.tagEventSubject.bind(this));

		// activable
		this.on('tag.message', this.tagEventMessage.bind(this));
		this.on('tag.script', this.tagEventScript.bind(this));
		this.on('tag.bgm', this.tagEventBgm.bind(this));
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
		var a = new O876.SoundSystem();
		a.setChannelCount(MANSION.CONST.SOUND_CHANNELS);
		this._oAudio = a;
		a.setPath('resources/sounds');
	},
	
	/**
	 * Initialisation des popup
	 */
	initPopup: function() {
		this.setPopupStyle({
			background: 'rgba(128, 64, 10, 0.5)',
			border: 'rgba(128, 32, 0, 0.25)',
			shadow: 'rgb(0, 0, 0)',
			text: 'rgb(255, 255, 255)',
			width: 320,
			height: 32,
			font: 'monospace 10',
			speed: 120,
			position: 8
		});
	},
	
	initUI: function() {
		var w;
		var ui = this.oUI = new MANSION.UIManager();
		ui.init();
		ui.on('command', (function(oEvent) {
			switch (oEvent.command) {
				case 'mo_album':
					w = ui.displayWidget('album');
					w.loadPhotos(this.oLogic.getAlbum());
					break;
				case 'main':
					ui.displayWidget('menu');
					break;
				case 'album_next':
					ui.getWidget('album').showPhoto('next');
					break;
				case 'album_prev':
					ui.getWidget('album').showPhoto('prev');
					break;
				case 'mo_notes': 
					ui.displayWidget('notes').loadTitles(ui, [
						{id: 1, title: 'A black notepad'},
						{id: 2, title: 'The dairy'},
						{id: 3, title: 'A note left on the floor'},
						{id: 4, title: 'Le culte des goules - Comte d\'Erlette'},
						{id: 5, title: 'A shity world'},
						{id: 6, title: 'Le nécronomicon pour les nuls'},
						{id: 7, title: 'Bob l\'éponge contre Séphirot'},
						{id: 8, title: 'Le Livre de Dysan'},
						{id: 9, title: 'The ninth door'},
						{id: 10, title: 'Once upon a time'},
						{id: 11, title: 'W.T.F.'},
					]);
					break;
					
				case 'note_back':
					w = ui.displayWidget('notes');
					if (w._oPad.isVisible()) {
						w.displayList();
					} else {
						ui.displayWidget('menu');
					}
					break;
				case 'note_read':
					ui.displayWidget('notes').displayDocument("Do we need Redux ?", [
						{
							type: 'text',
							content: "People often choose Redux before they need it. “What if our app doesn’t scale without it?” Later, developers frown at the indirection Redux introduced to their code. “Why do I have to touch three files to get a simple feature working?” Why indeed!\n\nPeople blame Redux, React, functional programming, immutability, and many other things for their woes, and I understand them. It is natural to compare Redux to an approach that doesn’t require “boilerplate” code to update the state, and to conclude that Redux is just complicated. In a way it is, and by design so."
						},
						{
							type: 'text',
							content: "If you don't share your database connection (session) between multiple threads for concurrent inserts, this is safe. If multiple threads insert on the same connection, this is unsafe, i.e. you might get either ID or a completely invalid ID."
						},
					]);
					break;

				default: 
					console.log('unknow ui command', oEvent.command, oEvent);
					break;

			}
		}).bind(this));
		ui.oSystem.oScreen.on('click', this.uiHide.bind(this));
	},




	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/


	/**
	 * Evènement déclenché lorsque les données du niveau sont en cours
	 * de rassemblage.
	 * On peut agir sur les données ici, pour ajouter des ressources
	 */
	gameEventBuild: function(wd) {
		var data = LEVEL_DATA[this._sLevelIndex];
		wd.data = data;
		var s = '';
		for (s in MANSION.TILES_DATA) {
			data.tiles[s] = MANSION.TILES_DATA[s];
		}
		if (this._sLevelIndex in MANSION.LEVEL_TILES_DATA) {
			for (s in MANSION.LEVEL_TILES_DATA[this._sLevelIndex]) {
				data.tiles[s] = MANSION.LEVEL_TILES_DATA[this._sLevelIndex][s];
			}
		}
		for (s in MANSION.BLUEPRINTS_DATA) {
			data.blueprints[s] = MANSION.BLUEPRINTS_DATA[s];
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
		var oCanvas = this.oRaycaster.getScreenCanvas();
		var oContext = this.oRaycaster.getScreenContext();
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		var sMsg = MANSION.STRINGS_DATA.RC['l_' + s];
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
		this.playAmbience(MANSION.SOUNDS_DATA.bgm.levels[this.getLevel()]);
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
				this.playSound(MANSION.SOUNDS_DATA.events.dooropen, x * ps + ps2, y * ps + ps2);
				oEffect.done = (function() {
					this.playSound(MANSION.SOUNDS_DATA.events.doorclose, x * ps + ps2, y * ps + ps2);
				}).bind(this);
				break;
				
			case 'Secret':
				this.playSound(MANSION.SOUNDS_DATA.events.secret, x * ps + ps2, y * ps + ps2);
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
		if (this.isCameraActive()) {
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
	},

	gameEventMouseMove: function(data) {
	},

	/**
	 * Evènement déclenché par la pression de la barre espace
	 * Bouton droit de la souris
	 * Bring the camera up and down
	 */
	gameEventActivate: function() {
		var ui = this.oUI;
		if (ui.isVisible()) {
			this.uiHide();
		} else {
			this.uiShow();
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
			case KEYS.F1:
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_aging_girl', pos.x, pos.y);
			break;
			
			case KEYS.F2: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_bashed_boy', pos.x, pos.y);
			break;
			
			case KEYS.F3: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_blond_child', pos.x, pos.y);
			break;		
			
			case KEYS.F4: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_dark_tears', pos.x, pos.y);
			break;
			
			case KEYS.F5: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_decaying', pos.x, pos.y);
			break;
			
			case KEYS.F6: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_dementia', pos.x, pos.y);
			break;
			
			case KEYS.F7: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_eyeball', pos.x, pos.y);
			break;
			case KEYS.F8: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_half_skull', pos.x, pos.y);
			break;
			case KEYS.F9: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_hardy', pos.x, pos.y);
			break;
			case KEYS.F10: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_old_ghoul', pos.x, pos.y);
			break;
			case KEYS.F11: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_severed_jaw', pos.x, pos.y);
			break;
			case KEYS.F12: 
				var pos = this.getPlayer().getFrontCellXY();
				this.spawnGhost('g_spooky_doll', pos.x, pos.y);
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
		if (this.oCamera && this.oCamera.nRaise) {
			this.oCamera.update(gl);
		}
	},
	
	/**
	 * Event triggered for each frame being rendered (displayed on screen)
	 * @param oEvent {}
	 */
	gameEventFrame: function(oEvent) {
		this.oUI.render();

		var aLog = this.aDebugLines;
		if (aLog !== null) {
			var c = this.oRaycaster.getScreenContext();
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
	 * Gestion des block photographiable
	 * La variable photo-script est explotée par cameraShoot
	 */
	tagEventPhotoScript: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		this.mapData(x, y, 'photo-script', oEvent.data);
		oEvent.remove = true;
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
		var sLevel = this.getLevel();
		var lm = MANSION.STRINGS_DATA.LEVELS;
		if ((sLevel in lm) && (sTag in lm[sLevel])) {
			this.popupMessage(lm[sLevel][sTag]);
		} else {
			this.popupMessage('unknown string ref : ' + sTag);
		}
		oEvent.remove = true;
	},
	
	/**
	 * Déclenché lorsqu'on active un tag "zone"
	 */
	tagEventBgm: function(oEvent) {
		var sZone = oEvent.data;
		// changement d'ambiance sonore
		if (sZone in MANSION.SOUNDS_DATA.bgm) {
			this.playAmbience(MANSION.SOUNDS_DATA.bgm[sZone]);
		}
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
		var ps = rc.nPlaneSpacing;
		var ps2 = ps >> 1;
		p.setXY(oLoc.x * ps + ps2, oLoc.y * ps + ps2);
	},
	
	/**
	 * Item accroché au mur
	 */
	tagEventItem: function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		this.oRaycaster.cloneWall(x, y, false, false);
		var sItem = this.getBlockTag(oEvent.x, oEvent.y, 'item');
		var sItemStr = MANSION.STRINGS_DATA.ITEMS[sItem];
		this.getPlayer().data('item-' + sItem, true);
		this.popupMessage(MANSION.STRINGS_DATA.EVENTS.item, {
			$item: sItemStr
		});
		var aItem = sItem.split('_');
		var sSound = aItem.shift();
		if (sSound in MANSION.SOUNDS_DATA.pickup) {
			this.playSound(MANSION.SOUNDS_DATA.pickup[sSound]);
		}
		oEvent.remove = true;
	},
	
	tagEventUnlock: function(oEvent) {
		var sKey = this.getBlockTag(oEvent.x, oEvent.y, 'lock');
		if (sKey === '') {
			// unnamed key required
			this.popupMessage(MANSION.STRINGS_DATA.EVENTS.curselocked);
			this.playSound(MANSION.SOUNDS_DATA.events.doorlocked);
			return; // exit from here
			// cursed lock are unlocked by photo or ghost destruction
		}
		var sKeyType = this.getItemType(sKey);
		var sItemStr = MANSION.STRINGS_DATA.ITEMS[sKey];
		if (this.getPlayer().data('item-' + sKey)) {
			this.unlockDoor(oEvent.x, oEvent.y);
			this.popupMessage(MANSION.STRINGS_DATA.EVENTS.unlock, {
				$item: sItemStr
			});
			this.playSound(MANSION.SOUNDS_DATA.events[sKeyType == 'key' ? 'doorunlock' : 'sigilunlock']);
			oEvent.remove = true;
		} else {
			this.popupMessage(MANSION.STRINGS_DATA.EVENTS.locked, {
				$item: sItemStr
			});
			this.playSound(MANSION.SOUNDS_DATA.events[sKeyType == 'key' ? 'doorlocked' : 'sigillocked']);
		}
	},

	/**
	 * Memorize les variables indiquant que le block est un sujet à photographier
	 */
	tagEventSubject: function(oEvent) {
		this.mapData(oEvent.x, oEvent.y, 'subject', oEvent.data);
		oEvent.remove = true;
	},


	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/
	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/
	/****** GAME LIFE ****** GAME LIFE ****** GAME LIFE ******/

	getLevel: function() {
		return this._sLevelIndex;
	},

	setLevel: function(s) {
		this._sLevelIndex = s;
		this.enterLevel();	
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
			case 'intro':
				oPlayer.setThinker(new MANSION.IntroThinker());
				ct = oPlayer.getThinker();
				O876_Raycaster.PointerLock.disable();
			break;
			
			default:
				oPlayer.setThinker(new MANSION.PlayerThinker());
				oPlayer.fSpeed = MANSION.CONST.SPEED_NORMAL;
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
				O876_Raycaster.PointerLock.enable();
			break;
		}
		ct.oGame = this;
	},

	/**
	 * returns true if the camera is on
	 * @return boolean
	 */
	isCameraActive: function() {
		return this.oCamera && this.oCamera.isRaised();
	},

	
	/**
	 * puts the camera obscura on and off
	 * useful for application that open and close using the same button
	 * like the camera
	 */
	toggleCamera: function() {
		if (!this.oCamera) {
			this.oCamera = this.oRaycaster.addGXEffect(MANSION.GX.CameraObscura);
		}
		var c = this.oCamera;
		var l = this.oLogic;
		if (c.isRaised()) {
			c.hide();
			l.cameraOff();
			this.getPlayer().fSpeed = MANSION.CONST.SPEED_NORMAL;
		} else {
			c.show();
			c.setEnergyGauges(0, l.getCameraMaxEnergy());
			c.nCircleSize = l.getCameraCircleSize();
			this.getPlayer().fSpeed = MANSION.CONST.SPEED_CAMERA;
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
		var oGhost = this.spawnWraith(sBlueprint, x, y, a);
		oGhost.getThinker().setSpeed(oGhost.data('speed'));
		oGhost.data('hp', oGhost.data('life'));
		oGhost.data('dead', false);
		this.playGhostAmbience(MANSION.SOUNDS_DATA.bgm.ghost);
		return oGhost;
	},

	spawnWraith: function(sBlueprint, x, y, a) {
		var oGhost = this.spawnMobile(sBlueprint, x, y, a);
		oGhost.getThinker().reset();
		return oGhost;
	},
	
	/**
	 * Return the number of currently active and hostile ghosts
	 */
	getGhostCount: function() {
		var aMobs = this.oRaycaster.oHorde.aMobiles;
		var n = 0;
		for (var i = 0, l = aMobs.length; i < l; ++i) {
			if (aMobs[i].data('hp')) {
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
			this.playSound(MANSION.SOUNDS_DATA.visualeffects[oSounds.spawn], x, y);
		}
		return oVFX;
	},


	/**
	 * Take a picture from the camera obscura
	 * if a block tagged "photoscript" is targetted, the corresponding script is run
	 */
	cameraShoot: function() {
		var gl = this.oLogic;
		if (gl.isCameraReady()) {
			var b = this.getPlayer().getThinker().getFrontBlock();
			if (b.x !== null && b.y !== null) {
				var sPhotoScript = this.mapData(b.x, b.y, 'photo-script');
				if (sPhotoScript) {
					var aPhotoScript = sPhotoScript.split(' ');
					var sScript = aPhotoScript.shift();
					var sAction = aPhotoScript.shift();
					var oInstance = this.getScript(sScript);
					var oEvent = {
						data: aPhotoScript.join(' '),
						game: this,
						x: b.x,
						y: b.y,
						remove: false
					};
					oInstance[sAction](oEvent);
					if (oEvent.remove) {
						this.mapData(b.x, b.y, 'photo-script', null);
					}		
				}
				var sPhotoSubject = this.mapData(b.x, b.y, 'subject');
				if (sPhotoSubject) {
					var aSubject = sPhotoSubject.split(' ');
					var sName = aSubject.shift();
					var nScore = aSubject.shift() | 0;
					var oPhoto = O876.CanvasFactory.cloneCanvas(this.screenShot(192));
					var oEvent = {
						subject: sName,
						score: nScore,
						photo: oPhoto
					};
					this.getPlayer().data('subject-' + sName, true);
					this.trigger('photo.subject', oEvent);
					this.oLogic.setPhotoSubject(
						MANSION.STRINGS_DATA.SUBJECTS[sName], 
						nScore,
						oEvent.photo
					);
					this.mapData(b.x, b.y, 'subject', null);
				}
			}
			gl.cameraShoot();
			this.playSound(MANSION.SOUNDS_DATA.events.camera);
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
	 * shows UI and exits pointerlock mode
	 */
	uiShow: function() {
		var ui = this.oUI;
		ui.show();
		O876_Raycaster.PointerLock.disable();
		this.pause(true);
	},
	
	/**
	 * hides UI and enters pointerlock mode
	 */
	uiHide: function() {
		var ui = this.oUI;
		ui.hide();
		O876_Raycaster.PointerLock.enable(ui.getRenderCanvas());
		this.resume();
	},
	
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
	 * Ouvre une passage secret précédemmetn scellé
	 * Fait tourner les éventuel décals
	 */
	unlockSecretBlock: function(sLocator) {
		var oLoc = this.getLocator(sLocator);
		var aLook = [
			[0, -1],
			[1, 0],
			[0, 1],
			[-1, 0]
		];
		var rc = this.oRaycaster;
		var x = oLoc.x;
		var y = oLoc.y;
		aLook.some(function(pos) {
			var dx = pos[0];
			var dy = pos[1];
			var sx = x + dx;
			var sy = y + dy;
			if (rc.getMapPhys(sx, sy) == rc.PHYS_SECRET_BLOCK) {
				rc.setMapXY(x, y, rc.getMapXY(sx, sy));
				return true;
			} else {
				return false;
			}
		});
		rc.oXMap.rotateWallSurfaces(x, y);
	},

	/**
	 * Renvoie l'instance du joueur
	 * @return Player
	 */
	getPlayer: function() {
		return this.oRaycaster.oCamera;
	},
	
	/**
	 * Renvoie le type d'objet
	 * key, book, scroll
	 * se base sur l'identifiant...
	 */
	getItemType: function(sItem) {
		return sItem.split('_').shift();
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
		if (this.isDoorLocked(x, y)) {
			return;
		}
		var rc = this.oRaycaster;
		var p = rc.getMapPhys(x, y);
		if (p >= 2 && p <= 9) {
			rc.oXMap.rotateWallSurfaces(x, y);
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
			rc.oXMap.rotateWallSurfaces(x, y, true);
			//rc.cloneWall(x, y, false, false);
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

