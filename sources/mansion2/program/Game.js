/**
 * @class MANSION.Game
 *
 *
 */

/* global MAIN */
/* global CONFIG */
O2.extendClass('MANSION.Game', O876_Raycaster.GameAbstract, {
	_oAudio: null,
	_sAmbiance: '',
	_sAmbianceAfterFight: '',
	_oScripts: null,
	_oDarkHaze: null,
	_sLevelIndex: 'ch1',
	_oLocators: null,
	_oConsole: null,


	_bCameraDisabled: false,

	oCamera: null,
	oLogic: null,
	oUI: null,
	oSnail: null,
	oRandom: null,
	oScheduler: null,

	console: function() {
		return this._oConsole;
	},

	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/

	init: function() {
		MANSION.STRINGS_DATA = MANSION.STRINGS_DATA_EN;
		this._oLocators = {};
		this.oSnail = new O876.Snail();
		this.oRandom = new O876.Random();
		this.oScheduler = new O876_Raycaster.Scheduler();
		this.oScheduler.schedule(0);
		this.initLogic();
		this.initAudio();
		this.initPopup();
		this.initRandom();
		this._oConsole = new MANSION.Console();
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
		this.on('tag.sound', this.tagEventSound.bind(this));

		this.on('command0', this.gameEventCommand0.bind(this));
		this.on('command2', this.gameEventCommand2.bind(this));
		this.on('activate', this.gameEventActivate.bind(this));
		this.on('hit', this.gameEventHit.bind(this));
        this.on('attack', this.gameEventAttack.bind(this));
        this.on('death', this.gameEventDeath.bind(this));

		this.on('key.down', this.gameEventKey.bind(this));


	},

	/**
	 * Initialization of random generator
	 */
	initRandom: function() {
		const r = new O876.Random();
		r.seed(Date.now() / 1000);
		MAIN.rand = function(x, y) {
			return r.rand(x, y);
		};
	},

	/**
	 * Logic initialization
	 * Done once per game.
	 */
	initLogic: function() {
		let logic = new MANSION.Logic();
		logic.setCameraCaptureRank(1);
		logic.initEffectProcessor();
		this.oLogic = logic;
	},
	
	/**
	 * Initializes audio system
	 */
	initAudio: function() {
		const a = new O876.SoundSystem();
		a.setChannelCount(MANSION.CONST.SOUND_CHANNELS);
		this._oAudio = a;
		a.setPath('resources/sounds');
		if (CONFIG.game.mute) {
			a.mute();
		}
	},
	
	/**
	 * Initialisation des popup
	 */
	initPopup: function() {
		this.setPopupStyle({
			background: 'rgb(240, 232, 220)',
			border: 'rgba(32, 32, 32, 0.25)',
			shadow: 'rgb(200, 202, 200)',
			text: 'rgb(0, 0, 0)',
			width: 320,
			height: 32,
			font: 'monospace 10',
			speed: 120,
			position: 8
		});
	},
	
	initUI: function(oCanvas) {
		var w;
		var ui = this.oUI = new MANSION.UIManager();
		ui.init(oCanvas);
		ui.on('command', (function(oEvent) {
			switch (oEvent.command) {
				case 'mo_album':
					w = ui.displayWidget('albumBrowser');
					w.loadPhotos(ui, this.oLogic.getAlbum());
					break;
				case 'main':
					ui.displayWidget('menu');
					break;
				case 'album_view':
					w = ui.displayWidget('album');
					w.loadPhotos(this.oLogic.getAlbum());
					w.showPhoto(oEvent.photo);
					break;
				case 'album_next':
					ui.getWidget('album').showNextPhoto();
					break;
				case 'album_prev':
					ui.getWidget('album').showPrevPhoto();
					break;
				case 'mo_notes': 
					ui.displayWidget('notes').loadTitles(ui, this.oLogic.getNotes());
					ui.displayWidget('notes').displayList();
					break;

				case 'mo_status':
					var oPS = this.oLogic.getPlayerSoul();
					ui.displayWidget('statuspad')
                        .setIndicatorValue('vitality', oPS.getBonus('vitality'))
                        .setIndicatorValue('power', oPS.getBonus('power'))
						.setIndicatorValue('resistance', oPS.getBonus('resistance'));
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
					ui.displayWidget('notes')
						.displayDocument(this.oLogic.getNotes()[oEvent.note], (
							function(oItem) {
                        		this.readSpellScroll(oItem);
                        		this.oLogic.setNoteFlag(oEvent.note, 'read', true);
							}
						).bind(this));
					break;

				case 'alb_sort_date':
					w = ui.displayWidget('albumBrowser');
					w.sortPhotosBy(0);
					w.loadPhotos(ui, this.oLogic.getAlbum());
					break;

				case 'alb_sort_type':
					w = ui.displayWidget('albumBrowser');
					w.sortPhotosBy(1);
					w.loadPhotos(ui, this.oLogic.getAlbum());
					break;

				default: 
					console.log('unknown ui command', oEvent.command, oEvent);
					break;

			}
		}).bind(this));
		ui.oSystem.oScreen.on('click', this.uiHide.bind(this));
	},

	initHUD: function(oCanvas) {
        this.oHUD = new MANSION.HUD();
        this.oHUD.init(oCanvas);
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
		const data = LEVEL_DATA[this._sLevelIndex];
		wd.data = data;
		for (let s in MANSION.TILES_DATA) {
			data.tiles[s] = MANSION.TILES_DATA[s];
		}
		for (let s in MANSION.WRAITH_TILES_DATA) {
			data.tiles[s] = MANSION.WRAITH_TILES_DATA[s];
		}
		if (this._sLevelIndex in MANSION.LEVEL_TILES_DATA) {
			for (let s in MANSION.LEVEL_TILES_DATA[this._sLevelIndex]) {
				data.tiles[s] = MANSION.LEVEL_TILES_DATA[this._sLevelIndex][s];
			}
		}
		for (let s in MANSION.BLUEPRINTS_DATA) {
			data.blueprints[s] = MANSION.BLUEPRINTS_DATA[s];
		}
		for (let s in MANSION.WRAITH_BLUEPRINTS_DATA) {
			data.blueprints[s] = MANSION.WRAITH_BLUEPRINTS_DATA[s];
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
		let s = oEvent.phase;
		let n = oEvent.progress;
		let nMax = oEvent.max;
		let oCanvas = this.oRaycaster.getScreenCanvas();
		let oContext = this.oRaycaster.getScreenContext();
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		let sMsg = MANSION.STRINGS_DATA.RC['l_' + s];
		let y = oCanvas.height >> 1;
		let nPad = 96;
		let xMax = oCanvas.width - (nPad << 1);
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
		const rc = this.oRaycaster;
        this.initUI(rc.getRenderCanvas());
        this.initHUD(rc.getRenderCanvas());
		this._oDarkHaze = rc.addGXEffect(MANSION.GX.DarkHaze);
		this.fadeIn('black', 1700);
        this.getPlayer().data({
            'life': 100,
            'speed': MANSION.CONST.SPEED_NORMAL
        });
		this.configPlayerThinker();
		this.playAmbiance(MANSION.SOUNDS_DATA.bgm.levels[this.getLevel()]);
		this._oGhostScreamer = rc.addGXEffect(MANSION.GX.GhostScreamer);
		this.oLogic.initPlayerSoul(this.getPlayer());
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
     * @param oEvent.t {O876_Raycaster.Mobile} entité cible
     * @param oEvent.a {O876_Raycaster.Mobile} aggresseur
	 */
	gameEventAttack: function(oEvent) {
		var oTarget = oEvent.t;
		if (oTarget == this.getPlayer()) {
			// joueur touché par fantôme
			this._oDarkHaze.startPulse();
			oTarget.getThinker().ghostThreat(oEvent.a);
			this.oLogic.ghostDamagesPlayer(oEvent.a, 20);
		} else {
			// ???
			// un fantome qui attaquye une autre fantome ?
		}
	},

    /**
	 * Death of player -> game over
     * @param oEvent
     */
	gameEventDeath: function(oEvent) {
		var rc = this.oRaycaster;
		this.fadeOut('black', 3000).neverEnding();
        // virer les fantomes
		this.clearGhosts();
    },

	/**
	 * Event triggered when a key is pressed
	 * @param oEvent {k : pressed key code }
	 */
	gameEventKey: function(oEvent) {
		var oGhost = this.oRaycaster.oHorde.aMobiles[1];
		switch (oEvent.k) {
			case KEYS.ALPHANUM.P:
				var sCommand = this.prompt('Enter command');
				var aCommand = sCommand.split(' ');
				var sScript = 'Debug';
				var sAction = aCommand.shift();
				try {
					var oScript = this.getScript(sScript);
					if (sAction in oScript) {
						oScript[sAction].call(oScript, {
							game: this,
							data: aCommand
						});
					}
				} catch (e) {
					this.console().print(e);
				}
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
			this.checkGhostAmbiance();
		}
		// update camera
		var gl = this.oLogic;
		gl.setTime(this.getTime()); // transmit game time
		if (this.oCamera && this.oCamera.nRaise) {
			this.oCamera.update(gl);
		}
		var hud = this.oHUD;
		if (hud) {
			hud.update(gl);
        }
        this.oScheduler.schedule(this.getTime());
	},
	
	/**
	 * Event triggered for each frame being rendered (displayed on screen)
	 * @param oEvent {}
	 */
	gameEventFrame: function(oEvent) {
		this.oUI.render();
		this._oConsole.render(this.oRaycaster.getRenderContext(), 4, 12);
		this.oHUD.render();
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
			if (nPhys !== rc.PHYS_NONE && nPhys !== rc.PHYS_INVISIBLE_BLOCK) {
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
			this.playAmbiance(MANSION.SOUNDS_DATA.bgm[sZone]);
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
			oEvent.player = this.getPlayer();
			oInstance._event = oEvent;
			oInstance[sAction]();
		}
	},


	tagEventTeleport: function(oEvent) {
		var sDest = oEvent.data;
		var oLoc = this.getLocator(sDest);
		var p = this.getPlayer();
		var rc = this.oRaycaster;
		this.fadeIn('black', 700);
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
		var sItemType = aItem.shift();
		var sItemRemain = aItem.join('_');
		// playing the right sound according to item type
		if (sItemType in MANSION.SOUNDS_DATA.pickup) {
			this.playSound(MANSION.SOUNDS_DATA.pickup[sItemType]);
		}
		// adding a note
		switch (sItemType) {
            case 'book':
            case 'note':
				this.oLogic.setNoteFlag(sItemRemain, 'found', true);
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
			this.playSound(MANSION.SOUNDS_DATA.events[sKeyType === 'key' ? 'doorunlock' : 'sigilunlock']);
			oEvent.remove = true;
		} else {
			this.popupMessage(MANSION.STRINGS_DATA.EVENTS.locked, {
				$item: sItemStr
			});
			this.playSound(MANSION.SOUNDS_DATA.events[sKeyType === 'key' ? 'doorlocked' : 'sigillocked']);
		}
	},

	/**
	 * Memorize les variables indiquant que le block est un sujet à photographier
	 */
	tagEventSubject: function(oEvent) {
		this.mapData(oEvent.x, oEvent.y, 'subject', oEvent.data);
		oEvent.remove = true;
	},

	tagEventPhotoScript: function(oEvent) {
		this.mapData(oEvent.x, oEvent.y, 'photo-script', oEvent.data);
		oEvent.remove = true;
	},

	tagEventSound: function(oEvent) {
		this.playSound(oEvent.data);
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
		let oPlayer = this.getPlayer();
		let ct;
		switch (this._sLevelIndex) {
			case 'intro':
				oPlayer.setThinker(new MANSION.IntroThinker());
				oPlayer.setXY(oPlayer.x, oPlayer.y);
				ct = oPlayer.getThinker();
				O876_Raycaster.PointerLock.disable();
			break;

			default:
				oPlayer.setThinker(new MANSION.PlayerThinker());
				oPlayer.setXY(oPlayer.x, oPlayer.y);
				oPlayer.setSpeed(oPlayer.data('speed'));
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
	 * Disable camera,
	 * The camera can not be used anymore until it is enabled back.
	 */
	disableCamera: function() {
		if (this.isCameraActive()) {
			this.toggleCamera();
		}
		this._bCameraDisabled = true;
	},

	/**
	 * If the camera has been disabled, this function will enable it
	 */
	enableCamera: function() {
		this._bCameraDisabled = false;
	},

	/**
	 * puts the camera obscura on and off
	 * useful for application that open and close using the same button
	 * like the camera
	 */
	toggleCamera: function() {
		if (this._bCameraDisabled) {
			return;
		}
		if (!this.oCamera) {
			this.oCamera = this.oRaycaster.addGXEffect(MANSION.GX.CameraObscura);
		}
		var c = this.oCamera;
		var l = this.oLogic;
        var oPlayer = this.getPlayer();
        var oSoul = oPlayer.data('soul');
        if (c.isRaised()) {
			c.hide();
			l.cameraOff();
            if (oPlayer.data('cameraSpeedEffect')) {
                oPlayer.data('cameraSpeedEffect').dispel();
                oPlayer.data('cameraSpeedEffect', null);
            }
		} else if (c.isHidden()) {
			c.show();
			c.setEnergyGauges(0, l.getCameraMaxEnergy());
			c.nCircleSize = l.getCameraCircleSize();
			//this.getPlayer().fSpeed = MANSION.CONST.SPEED_CAMERA;
            var eSlow = new Effect.Bonus('speed');
            eSlow.setTarget(oSoul);
            eSlow.setSource(oSoul);
            eSlow.setLevel(MANSION.CONST.SPEED_CAMERA_MODIFIER);
            eSlow.setDuration(Infinity);
            if (oPlayer.data('cameraSpeedEffect')) {
                oPlayer.data('cameraSpeedEffect').dispel();
            }
            oPlayer.data('cameraSpeedEffect', eSlow);
            l.getEffectProcessor().applyEffect(eSlow);
		}
	},

	/**
	 * A hostile ghost is spawned.
	 * If no coordinates are given : use random location near player
	 * @param sBlueprint string reference to the blueprint
	 * @param x float initial ghost position x
	 * @param y float initial ghost position y
	 * @param a float initial ghost angle
	 * @return Mobile
	 */
	spawnGhost: function(sBlueprint, x, y, a) {
		if (x === undefined) {
			var pos = ArrayTools.shuffle(this.getSectorsNearObject(this.getPlayer(), 128, 256)).shift();
			if (pos) {
				x = pos.x;
				y = pos.y;
			} else {
				return;
			}
		}
		var oGhost = this.spawnWraith(sBlueprint, x, y, a);
        this.oLogic.createSoul(oGhost);
		oGhost.getThinker().setSpeed(oGhost.data('speed'));
		oGhost.data('dead', false);
		this.playGhostAmbiance(MANSION.SOUNDS_DATA.bgm.ghost);
		//garder trace du temps
		this.getPlayer().data('last-ghost-spawn-time', this.getTime());
		return oGhost;
	},


	/**
	 * Demarre le cycle autospawn des fantome
	 */
	startAutoSpawn: function() {
		this.autoSpawnProcedure();
	},

	autoSpawnProcedure: function() {
		if (this.oLogic._bClearAutoSpawn) {
			this.oLogic._bClearAutoSpawn = false;
			return;
		}
		var dbg = this.oLogic._nAutoSpawnDelayBetweenGhosts;
		var dbgMax = dbg + (dbg >> 1);
		var nNextGhostTime = this.oRandom.rand(dbg, dbgMax);
		this.oScheduler.delay((function() {
			var aGhostList = [];
			var nMaxLevel = this.oLogic._nAutoSpawnMaxLevel;
			for (var ghost in MANSION.BLUEPRINTS_DATA) {
				if (ghost.match(/^g_/) && MANSION.BLUEPRINTS_DATA[ghost].data.level <= nMaxLevel) {
					aGhostList.push(ghost);
				}
			}
			this.spawnGhost(this.oRandom.rand(aGhostList));
			this.autoSpawnProcedure();
		}).bind(this), nNextGhostTime);
	},

	spawnWraith: function(sBlueprint, x, y, a) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oGhost = this.spawnMobile(sBlueprint, ps * x + ps2, ps * y + ps2, a);
		oGhost.getThinker().reset();
		return oGhost;
	},
	
	/**
	 * Return the number of currently active and hostile ghosts
	 */
	getGhostCount: function() {
		let aMobs = this.oRaycaster.oHorde.aMobiles;
		let n = 0;
		for (let i = 0, l = aMobs.length; i < l; ++i) {
			if (aMobs[i].data('dead') === false) {
				++n;
			}
		}
		return n;
	},

	clearGhosts: function() {
        let aMobs = this.oRaycaster.oHorde.aMobiles;
        let n = 0;
        for (let i = 0, l = aMobs.length; i < l; ++i) {
            if (aMobs[i].data('dead') === false) {
                aMobs[i].getThinker().vanish();
            }
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
	 * Stores the current view (photo in the album)
	 */
	storePhoto: function(sSubjectRef, nScore, nType) {
		if (this.getPlayer().data('subject-' + sSubjectRef)) {
			return;
		}
		// screenshot de la photo
		var oPhoto = O876.CanvasFactory.cloneCanvas(this.screenShot(192));
		var oEvent = {
			subject: sSubjectRef,
			score: nScore,
			photo: oPhoto
		};
		this.getPlayer().data('subject-' + sSubjectRef, true);
		this.trigger('photo.subject', oEvent);
		this.oLogic.setPhotoSubject(
			sSubjectRef,
			nScore,
			oEvent.photo,
			nType
		);
	},


    /**
	 * Cast a spell from a scroll, or a document.
	 * This action has a drawback on the document itself : the spell beign read-once, the whole spell section (tag) will vanish.
     * @param sSpell id of spell
     */
	readSpellScroll: function(oSection) {
		this.uiHide();
		// cast the spell
		var aAction = oSection.action.split(' ');
		var sSpell = aAction.shift();
        // remove the section
		oSection.disabled = true;
		this.castSpell(sSpell, aAction);
	},

	castSpell: function(sSpell, aOptions) {
        if (sSpell in MANSION.SPELLS) {
            const SpellClass = MANSION.SPELLS[sSpell];
            let spell = new SpellClass();
            spell.run(this, aOptions);
        } else {
            this.popupMessage('Unknown spell "' + sSpell + '" !');
        }
	},


	/**
	 * Take a picture from the camera obscura
	 * if a block tagged "photoscript" is targetted, the corresponding script is run
	 */
	cameraShoot: function() {
		
		function createPhoto(sSubjectRef, nScore, sData) {
			var oPhoto = O876.CanvasFactory.cloneCanvas(this.screenShot(192));
			var oEvent = {
				subject: sName,
				score: nScore,
				photo: oPhoto
			};
			this.getPlayer().data('subject-' + sName, true);
			this.trigger('photo.subject', oEvent);
			this.oLogic.setPhotoSubject(
				sName,
				nScore,
				oEvent.photo,
				0
			);
		}
		
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
					this.storePhoto(sName, nScore, MANSION.CONST.PHOTO_TYPE_PAINTING);
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
				if (oGhost.data('subtype') === 'wraith') {
					this.storePhoto(oGhost.getBlueprint().sId, oGhost.data('rank'), MANSION.CONST.PHOTO_TYPE_WRAITH);
				}
				this._oGhostScreamer.addGhost(oGhost);
			}, this);
		}
	},
	
	
	////// UTILITIES //////

	/**
	 * Prompt for tech command, 
	 * pausing the game before the prompt
	 * resuming the game after prompt
	 * @param sCaption text to be displayed
	 * @param sDefault valeur par défaut
	 */
	prompt: function(sCaption, sDefault) {
		this.pause(true);
		var s = prompt(sCaption, sDefault);
		this.resume();
		return s;
	},
	
	/**
	 * shows UI and exits pointerlock mode
	 */
	uiShow: function() {
		var ui = this.oUI;
		this.oHUD.hide();
		ui.show();
		ui.oSystem.oScreen.setBackground(this.oRaycaster.getRenderCanvas());
		ui.displayWidget('menu');
		O876_Raycaster.PointerLock.disable();
		this.pause(true);
        ui.oSystem.listenToMouseEvents(MAIN.screen);
	},
	
	/**
	 * hides UI and enters pointerlock mode
	 */
	uiHide: function() {
		var ui = this.oUI;
		this.oHUD.show();
        ui.oSystem.deafToMouseEvents(MAIN.screen);
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
	 * Renvoie true si l'endroit spécifié est traversable par un mobile
	 * Renvoie false si le secteur spécifié est hors carte
	 * @param x coordoonées secteur
	 * @param y coordoonées secteur
	 * @return bool
	 */
	isSectorWalkable: function(x, y) {
		var rc = this.oRaycaster;
		var rcs = rc.nMapSize;
		if (x >= 0 && y >= 0 && x < rcs && y < rcs) {
			return rc.getMapPhys(x, y) === rc.PHYS_NONE;
		} else {
			return false;
		}
	},
	
	/**
	 * Renvoie true si l'endroit spécifié est solid (non traversable par un mobile)
	 * Renvoie false si le secteur spécifié est hors carte
	 * @param x coordoonées secteur
	 * @param y coordoonées secteur
	 * @return bool
	 */
	isSectorSolid: function(x, y) {
		var rc = this.oRaycaster;
		var rcs = rc.nMapSize;
		if (x >= 0 && y >= 0 && x < rcs && y < rcs) {
			return rc.getMapPhys(x, y) !== rc.PHYS_NONE;
		} else {
			return false;
		}
	},


	
	/**
	 * Trouve une place à proximité de l'objet spécifié, et a distance indiquée
	 * L'endroit trouvé sera assurément un walkable
	 * @param oTarget objet mobile de référence
	 * @param nDistMin distance minimum (texel)
	 * @param nDistMax distance maximum (texel)
	 * @return plain object {x, y} coordonnées texel (centrée sur secteur)
	 */
	getSectorsNearObject: function(oTarget, nDistMin, nDistMax) {
		if (nDistMax === undefined) {
			nDistMin = nDistMax;
		}
		var ps = this.oRaycaster.nPlaneSpacing;
		var bWalkable, 
			xMe = oTarget.xSector,
			yMe = oTarget.ySector;
		return this
			.oSnail
			.crawl(
				nDistMin / ps | 0, 
				nDistMax / ps | 0
			)
			.filter(
				oSector => this.isSectorWalkable(
						oSector.x + xMe, 
						oSector.y + yMe
					)
			);
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
			pClass = O2.loadObject(sClass);
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


    fadeIn: function(sColor, fTime) {
        return this.oRaycaster.addGXEffect(O876_Raycaster.GXFade).fadeIn(sColor, fTime);
    },

    fadeOut: function(sColor, fTime) {
        return this.oRaycaster.addGXEffect(O876_Raycaster.GXFade).fadeOut(sColor, fTime);
    },

	
	/** 
	 * Lecture d'un son à la position x, y
	 * Le son est modifié en amplitude en fonction de la distance séparant le point sonore avec
	 * la position de la caméra
	 * @param  sFile string fichier son à jouer
	 * @param  x float position de la source du son
	 * @param  y float
	 */
	playSound : function(sFile, x, y) {
		if (sFile === '') {
			return;
		}
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


	_sPreviousAmbiance: '',
	
	/**
	 * Lance le fichier musical d'ambiance
	 * @param string sAmb nom du fichier
	 */
	playAmbiance: function(sAmb) {
		if (this._sPreviousAmbiance) {
			this._sPreviousAmbiance = sAmb;
			return;
		}
		if (this.sAmbiance === sAmb) {
			return;
		} else if (this.sAmbiance) {
			this._oAudio.crossFadeMusic(sAmb);
			this.sAmbiance = sAmb;
		} else {
			this._oAudio.playMusic(sAmb);
			this.sAmbiance = sAmb;
		}
	},

	checkGhostAmbiance: function() {
		if (this._sPreviousAmbiance && this.getGhostCount() === 0) {
			var pa = this._sPreviousAmbiance;
			this._sPreviousAmbiance = '';
			this.playAmbiance(pa);
		}
	},

	/**
	 * plays a ghost music
	 */
	playGhostAmbiance: function(sGhostAmb) {
		if (this._sPreviousAmbiance === '') {
			var pa = this.sAmbiance;
			this.playAmbiance(sGhostAmb);
			this._sPreviousAmbiance = pa;
		}
	},

    /**
	 * Le joueur prend une photo, mais c'est un autre endroit qui est montré sur la photo
	 * La transition entre la photo et l'endroit mystère est assurée par un GX
     */
	takeLocatorPhoto: function(sSubject, sMoveAtLocator, sLookAtLocator) {
		this.disableCamera();
		this.getPlayer().getThinker().freeze();
        var rc = this.oRaycaster;
        var oPhoto0 = this.screenShot(256);
		var p0 = this.getLocator(sMoveAtLocator);
		var p1 = this.getLocator(sLookAtLocator);
		var ps = rc.nPlaneSpacing;
		var ps2 = ps >> 1;
		var pos0 = {
			x: p0.x * ps + ps2,
			y: p0.y * ps + ps2
		};
		var pos1 = {
            x: p1.x * ps + ps2,
            y: p1.y * ps + ps2
        };
		var oPlayer = this.getPlayer();
		var pSave = {
			x: oPlayer.x,
			y: oPlayer.y,
			a: oPlayer.fTheta
        };
		oPlayer.setXY(pos0.x, pos0.y);
		oPlayer.fTheta = Math.atan2(pos0.x - pos1.x, pos0.y - pos1.y);
		rc.frameRender();
		this.storePhoto(sSubject, 1, 3);
		var oPhoto1 = this.screenShot(256);
		oPlayer.setXY(pSave.x, pSave.y);
		oPlayer.fTheta = pSave.a;
        rc.frameRender();
        var oPola = rc.addGXEffect(MANSION.GX.Polaroid);
        oPola.setPhotos(oPhoto0, oPhoto1);
        oPola.whenDone((function() {
			this.enableCamera();
			this.getPlayer().getThinker().thaw();
			this.popupMessage(MANSION.STRINGS_DATA.EVENTS.mystphoto);
		}).bind(this));
        this.playSound('events/chimes-long');
	},

    /**
	 * Returns a random number
     * @returns {*}
     */
	rand: function() {
		return this.oRandom.rand(...arguments);
	},

	/**
	 * Efface l'écran et affiche un XML
	 */
	displayXML: function(sURL) {
		this._halt();
		O876_Raycaster.PointerLock.disable();
		var oCvs = document.querySelector('#' + CONFIG.raycaster.canvas);
		if (oCvs) {
			oCvs.remove();
		}
		var xhr = new O876.XHR();
		xhr.get(sURL, (function(data) {
			var d = document.createElement('div');
			d.innerHTML = data;
			document.body.appendChild(d);
			document.getElementById('game_over_score').innerHTML = this.oLogic._nScore;
		}).bind(this));
	},

    /**
	 * Arrète le jeu et affiche un écran de fin
     */
	end: function() {
        this.playAmbiance('music/manor');
        this.displayXML('resources/ui/screens/gameover.xml')
	}
});

