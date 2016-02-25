O2.extendClass('MW.Game', O876_Raycaster.Engine, {
	oData : null,
	oSoundSystem : null,
	oClientSocket : null,
	oPluginSystem : null,
	sClientName : '',
	idClient : 0,
	idEntity : 0,
	nMenuState : 0,
	bMapReady : false,
	aEntities : null,
	aInvisibles : null, // liste des entités invisibles
	sAudioType : 'ogg',
	aDoorsOpen : null, // liste des portes ouvertes au chargement
	sBossModeTitle : '', // sauvegarde du titre de la fenetre en mode boss
	nWeaponChargeTime: 3000,
	nInstanceId: 0,
	

	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////
	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////
	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////

	gpRespawn : function() {
		this.sendSignal('ui_close');
		this.send('RR', {});
	},

	/**
	 * Relancer le jeu (totalement, car il a planté ou déconnecté)
	 */
	gpReboot : function() {
		location.reload();
	},
	
	
	gpEndGame: function() {
		this.setPlayerControllable(false);
		this.nMenuState = 2;
		this.setDoomloop('stateMenuLoop');
	},
	
	/**
	 * Reconnects to the previously joined instance
	 */	
	gpReconnect: function() {
		this.nMenuState = 0;
		this.sendSignal('ui_close');
		this.csGameJoin(this.nInstanceId);
	},
	
	/**
	 * Display message in HTML
	 * @param sTitle title of window
	 * @param sHTML content of window
	 */
	gpDisplayHTMLMessage: function(sTitle, sHTML) {
		MW.Microsyte.openInfoForm(sTitle, sHTML);
	},

	



	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////
	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////
	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////

	/**
	 * <proxy> Envoi de message au serveur
	 * 
	 * @param string
	 *            sMessage
	 * @param object
	 *            xData
	 */
	send : function(sMessage, xData) {
		this.oClientSocket.send(sMessage, xData);
	},

	/**
	 * Envoie un message de debug
	 */
	csDebug : function(sMessage) {
		this.send('ZZ', {
			m : sMessage
		});
	},

	csChatMessage : function(sMessage) {
		this.send('CM', {
			m : sMessage
		});
	},

	/**
	 * LI { n: client-name } Soumettre un nom d'utilisateur au serveur.
	 */
	csLogin : function(sLogin) {
		this.send('LI', {
			n : sLogin
		});
	},

	/**
	 * GJ { i: instance id } Demande de rejoindre une partie hébéergée par le
	 * serveur
	 */
	csGameJoin : function(idGame) {
		this.nInstanceId = idGame;
		this.send('GJ', {
			i : idGame
		});
	},

	/**
	 * RY Indique au serveur qu'on est pret à jouer
	 */
	csReady : function() {
		this.send('RY', {});
	},

	/**
	 * Mise à jour du mobile du client
	 */
	csMyUpdate : function(f, x, y, ma, ms) {
		this.send('UD', {
			t : this.getTime(),
			x : x,
			y : y,
			a : f, // angle de vue
			ma : ma, // angle de mouvement
			ms : ms
		// vitesse
		});
	},

	/**
	 * Activation d'un pan de mur
	 * 
	 * @param x
	 *            ...
	 * @param y
	 *            coordonnées du mur activé
	 */
	csActivateWall : function(x, y) {
		this.send('WA', {
			x : x,
			y : y
		});
	},

	/**
	 * Tir de missile
	 */
	csAttack : function(nTime) {
		this.send('PA1', {
			t : nTime
		});
	},

	/**
	 * Utilisation d'objet
	 */
	csUse : function(n) {
		this.send('PA2', {
			i : n
		});
	},
	
	/**
	 * Jeter un objet
	 */
	csDrop: function(n) {
		this.send('PAD', {
			i: n
		});
	},
	
	csPluginMessage: function(m) {
		this.send('PM', m);
	},

	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////
	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////
	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////

	/**
	 * Active les gestionnaires de messages reseau. Les gestionnaire sont les
	 * fonction don le nom commence par "sc"
	 */
	activateNetworkListeners : function() {
		this.setSocketHandler('disconnect');
		this.setSocketHandler('connect');
		Object.keys(Object.getPrototypeOf(this)).filter(function(x) {
			return x.match(/^sc[0-9A-Z]{2}$/);
		}).map(function(x) {
			return x.substr(2);
		}).forEach(this.setSocketHandler.bind(this));
	},

	/**
	 * Définition d'un gestionnaire de mesage réseau
	 * 
	 * @param string
	 *            sEvent nom de l'évènement
	 */
	setSocketHandler : function(sEvent) {
		var sHandler = 'sc' + sEvent;
		var pHandler = this[sHandler];
		var pBound = pHandler.bind(this);
		this.oClientSocket.setSocketHandler(sEvent, pBound);
	},
	
	onConnected: function() {
	},
	
	scconnect : function() {
		this.onConnected();
	},

	/**
	 * Deconnection forcée du client
	 */
	scdisconnect : function() {
		this.oClientSocket.disconnect();
		this.dialogDisconnect();
	},

	/**
	 * ID { n: client-name, i: client-id } Le serveur accepte le login de
	 * l'utilsateur et lui transmet son identifiant Normalement les données du
	 * niveau vont suivre Ou bien une liste des differentes parties enregistrées
	 * sur le serveur
	 */
	scID : function(xData) {
		this.sClientName = xData.n;
		this.idClient = xData.i;
		this.csGameJoin(1);
	},

	/**
	 * MD { m: game-data } Map Data : Le serveur envoie les données d'un niveau
	 */
	scMD : function(xData) {
		this.oData = xData.m;
		this.aDoorsOpen = xData.d;
		for (var iTile in MW.TILES_DATA) {
			this.oData.tiles[iTile] = MW.TILES_DATA[iTile];
		}
		for (var iBlueprint in MW.BLUEPRINTS_DATA) {
			this.oData.blueprints[iBlueprint] = MW.BLUEPRINTS_DATA[iBlueprint];
		}
		this.bMapReady = true;
		this.aEntities = [];
		this.aInvisibles = [];
	},

	/**
	 * YO { i: identifiant, x: position x, y: position y, a: angle initial }
	 * Your Object : Le serveur indique au client l'objet dont il a la charge
	 */
	scYO : function(xData) {
		var id = xData.i;
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var b = xData.b;
		var p = this.getPlayer();
		p.nSize = this.oRaycaster.aWorld.blueprints[b].width >> 1;
		p.setXY(x, y);
		p.setAngle(a);
		p.setData('idEntity', id);
		p.setData('name', xData.n);
		if ('w' in xData) {
			this.scYW(xData.w);
		}
		this.idEntity = id;
		this.aEntities[id] = p;
	},
	
	scYW: function(xData) {
		this.popupMessage(STRINGS._('~item_equip', ['~itm_' + xData.n]));
		this.nWeaponChargeTime = xData.c;
	},

	/**
	 * OC { i: identifiant, x: position x, y: position y, a: angle initial, b:
	 * blueprint, n: nom affichable, d: données supplémentaires } Object create : Le serveur indique la création d'un objet
	 */
	scOC : function(xData) {
		var id = xData.i;
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var sBP = xData.b;
		var m = this.spawnMobile(sBP, x, y, a);
		m.getThinker().restore();
		m.setData('idEntity', id);
		if ('n' in xData && xData.n) {
			// entity has a name
			m.setData('name', xData.n);
		}
		if ('d' in xData && xData.d) {
			// entity has extra data
			m.setData('extra', xData.d);
		}
		this.aEntities[id] = m;
	},

	/**
	 * OD {i: identifiant x: last position x, y: last position y} Object Destroy :
	 * Supprimer un objet si l'objet n'existe pas, rien ne se produit L'objet
	 * est positionné avant d'etre détruit
	 */
	scOD : function(xData) {
		this.destroyObject(xData.i, xData.x, xData.y);
	},

	/**
	 * OU {i: identifiant x: position x, y: position y, a: angle de vue, ma:
	 * angle de déplacement, ms: vitesse de déplacement} Object Update : Mise a
	 * jour d'entité de l'instance L'angle de vue est angle vers lequel le
	 * mobile regarde L'angle de déplacement est la direction empruntée par le
	 * mobile ors de son déplacement
	 */
	scOU : function(xData) {
		var nLen, i, id, x, y, ma, ms, a, m, sm;
		var D;
		nLen = xData.length;
		for (i = 0; i < nLen; ++i) {
			D = xData[i];
			id = D.i;
			if (id == this.idEntity) {
				continue;
			}
			if (!this.aEntities[id]) {
				continue;
			}
			m = this.aEntities[id];
			x = D.x;
			y = D.y;
			a = D.a;
			ma = D.ma;
			ms = D.ms;
			sm = D.sm;
			m.setAngle(a);
			m.getThinker().setMovement(ma, ms * sm);
			m.setXY(x, y);
		}
	},

	/**
	 * Notre entité subit des changement d'attributs
	 */
	scOS_me : function(xData) {
		var n;
		var oPlayer = this.getPlayer();
		var oPlayerThinker = oPlayer.getThinker();
		for ( var s in xData) {
			n = xData[s];
			switch (s) {
				case 'vitality': // hp max
					this.sendSignal('hud_update', 'life', null, n);
					break;
	
				case 'hp': // hp
					this.sendSignal('hud_update', 'life', n, null);
					break;
	
				case 'dhp': // dhp : difference de hp
					if (n < -20) {
						this.gxFlash('#D00', 0.75);
					} else if (n < -4) { // dégâts
						this.gxFlash('#D00', 0.5);
					} else if (n < 0) { // dégâts
						this.gxFlash('#D00', 0.2);
					} else if (n > 0) { // soins
						this.gxFlash('#0D0', 0.5);
					}
					break;
	
				case 'esp':
					if (n > 0) {
						this.aInvisibles.forEach(function(e) {
							e.bVisible = true;
							e.oSprite.bTranslucent = true;
						});
					} else {
						this.aInvisibles.forEach(function(e) {
							e.bVisible = false;
							e.oSprite.bTranslucent = false;
						});
					}
					oPlayerThinker.setupEffect(s, n);
					break;
					
				case 'clairvoyance':
					if (G.oRaycaster.oMinimap) {
						G.oRaycaster.oMinimap.bRestricted = n <= 0;
					}
					break;
				
				default:
					oPlayerThinker.setupEffect(s, n);
					break;
			}
		}
		this.sendSignal('hud_update', 'attributes', oPlayerThinker.oAttributes);
	},

	/**
	 * Une entité (pas la notre) subit des changement d'attributs
	 */
	scOS_other : function(oGuy, xData) {
		var nParam, oPlayer;
		for (var s in xData) {
			nParam = xData[s];
			switch (s) {
				case 'invisible':
					if (nParam > 0) {
						oPlayer = this.getPlayer();
						// le guy devient invisible
						if (this.aInvisibles.indexOf(oGuy) < 0) {
							this.aInvisibles.push(oGuy);
						}
						if (oPlayer.oThinker.oAttributes['esp'] > 0) {
							// mais j'ai l'ESP
							oGuy.bVisible = true;
							oGuy.oSprite.bTranslucent = true;
						} else {
							// et j'ai pas l'ESP
							oGuy.bVisible = false;
						}
					} else {
						// le guy redevient visible
						var nInvis = this.aInvisibles.indexOf(oGuy);
						if (nInvis >= 0) {
							this.aInvisibles.splice(nInvis, 1);
						}
						oGuy.bVisible = true;
						oGuy.oSprite.bTranslucent = false;
					}
	
					this.spawnVisualEffect('o_smoke_white', oGuy.x, oGuy.y);
					break;

				default:
					oGuy.oThinker.setHaze(s, nParam);
					break;
			}
		}
	},

	/**
	 * Transmission des changement d'états logique des entités
	 */
	scOS : function(xData) {
		var nLen, i, id;
		var D;
		nLen = xData.length;
		for (i = 0; i < nLen; ++i) {
			D = xData[i];
			id = D.i;
			delete D.i;
			if (id == this.idEntity) {
				this.scOS_me(D);
			} else if (this.aEntities[id]) {
				this.scOS_other(this.aEntities[id], D);
			}
		}
	},

	/**
	 * DO : {x, y} Door Open Commande l'ouverture d'une porte
	 */
	scDO : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var oDoor = this.openDoor(xData.x, xData.y, true);
		if (!oDoor) {
			return;
		}
		var rc = this.oRaycaster;
		var ps = rc.nPlaneSpacing;
		var ps2 = ps >> 1;
		var nSound = 0;
		switch (rc.getMapPhys(x, y)) {
		case rc.PHYS_CURT_SLIDING_UP:
		case rc.PHYS_CURT_SLIDING_DOWN:
			nSound = 1;
			break;

		case rc.PHYS_SECRET_BLOCK:
			nSound = 2;
			break;
		}
		var xDoor = xData.x * ps + ps2;
		var yDoor = xData.y * ps + ps2;
		var sOpenSound = MW.SOUND_DATA.DOOR_OPEN[nSound];
		var sCloseSound = MW.SOUND_DATA.DOOR_CLOSE[nSound];
		if (sOpenSound) {
			this.playSound(sOpenSound, xDoor, yDoor);
		}
		if (sCloseSound) {
			oDoor.done = (function() {
				this.playSound(sCloseSound, xDoor, yDoor);
			}).bind(this);
		}
	},

	/**
	 * DC : {x, y} Door Close Commande de fermeture de la porte
	 */
	scDC : function(xData) {
		if (!this.closeDoor(xData.x, xData.y)) {
			// surement un passage secret
			this.oRaycaster.setMapPhys(xData.x, xData.y, this.oRaycaster.PHYS_SECRET_BLOCK);
			this.oRaycaster.setMapOffs(xData.x, xData.y, 0);
		}
	},

	/**
	 * MC { i: identifiant, x: position x, y: position y, a: angle initial, b:
	 * blueprint } Missile create : Le serveur indique la créatiob d'un missile
	 */
	scMC : function(xData) {
		if (Array.isArray(xData)) {
			for (var i = 0; i < xData.length; ++i) {
				this.scMC(xData[i]);
			}
		} else {
			var id = xData.i;
			var x = xData.x;
			var y = xData.y;
			var a = xData.a;
			var sBP = xData.b;
			var m = this.spawnMobile(sBP, x, y, a);
			m.getThinker().restore();
			m.setData('idEntity', id);
			this.aEntities[id] = m;
		}
	},

	/**
	 * Une entity en a buté une autre
	 */
	scPK : function(xData) {
		var p = this.getPlayer();
		p.setData('killer', xData.k);
		p.getThinker().die();
		this.setPlayerControllable(false);
	},

	/**
	 * Player Respawn
	 */
	scPR : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var p = this.getPlayer();
		p.setXY(x, y);
		p.setAngle(a);
		p.getThinker().revive();
		this.setPlayerControllable(true);
	},

	/**
	 * Map modification
	 */
	scMM : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var b = xData.b;
		var t = xData.t;
		// la map modification peut s'accopagner d'un effet spécial
		// visuel ou sonore
		if (t in MW.SOUND_DATA) {
			var ps = this.oRaycaster.nPlaneSpacing;
			var ps2 = ps >> 1;
			var xSound = x * ps + ps2;
			var ySound = y * ps + ps2;
			this.playSound(MW.SOUND_DATA[t], xSound, ySound);
		}
		this.oRaycaster.setMapXY(x, y, b);
	},

	// Réception d'un nouvel état de l'inventaire
	scNM_inv : function(xData) {
		var sInv = xData.i;
		this.sendSignal('hud_update', 'spells', sInv);
	},

	// mise à jour du HUD par un plugin
	scNM_hud : function(xData) {
		var sHud = xData.h;
		var aArgs = xData.d;
		aArgs.unshift(sHud);
		aArgs.unshift('hud_update');
		this.sendSignal.apply(this, aArgs);
	},
	
	/**
	 * Renseigne sur le cooldown d'un objet
	 */
	scNM_cooldown: function(xData) {
		var nItem = xData.i;
		var nCooldown = xData.n;
		this.sendSignal('hud_update', 'spells', null, 'cooldown', nItem, nCooldown);
	},

	/**
	 * Production d'un effet visuel
	 * 
	 * @param xData
	 * @returns
	 */
	scNM_vfx : function(xData) {
		var sBlueprint = xData.b;
		var x = xData.x;
		var y = xData.y; // position
		this.spawnVisualEffect(sBlueprint, x, y);
	},

	/**
	 * L'objet spécifié est déplacé sur une nouvelle position (téléportation) Ce
	 * message à un caractère modificationel à cause d'une regle (téléportation,
	 * reflection...) Cela diffère du message 'OU' qui a un caractère
	 * correctionnel.
	 */
	scNM_pos : function(xData) {
		var id = xData.i;
		if (!this.aEntities[id]) {
			return;
		}
		var m = this.aEntities[id];
		m.setXY(xData.x, xData.y);
		if ('a' in xData) {
			m.setAngle(xData.a);
		}
		if (('ma' in xData) && ('ms' in xData)) {
			m.getThinker().setMovement(xData.ma, xData.ms);
		}
	},
	
	/**
	 * Un simple message popup
	 */
	scNM_msg: function(xData) {
		this.popupMessage(STRINGS._('~' + xData.s, xData.p), MW.ICONS[xData.i], null, xData.a);
	},

	/**
	 * Un changement d'animation
	 */
	scNM_ani: function(xData) {
		var eid = xData.i;
		var nAnim = xData.a;
		if (!this.aEntities[eid]) {
			return;
		}
		var m = this.aEntities[eid];
		m.oSprite.playAnimationType(nAnim);
	},

	scNM : function(xData) {
		var sMeth = 'scNM_' + xData.m;
		if (sMeth in this) {
			this[sMeth](xData);
		}
	},

	// Chat message
	scCM : function(xData) {
		this.sendSignal('hud_update', 'chat', xData.n + ': ' + xData.m, this.getTime());
	},
	
	// Fin de l'instance
	scEG: function(xData) {
		this.gpEndGame();
	},

	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////
	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////
	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////

	/**
	 * Evènement apellé lors de l'initialisation du jeu Appelé une seule fois.
	 */
	onInitialize : function() {
		// Sound system
		this.oSoundSystem = new SoundSystem();
		this.oSoundSystem.addChans(8);
		this.oSoundSystem.bMute = !CONFIG.game.sound;

		// client socket
		this.oClientSocket = new MW.ClientSocket();
		this.oClientSocket.connect();
		this.activateNetworkListeners();

		// plugin system
		var ps = new O876.Mediator.Mediator();
		this.oPluginSystem = ps;
		ps.setApplication(this);
		ps.addPlugin(new MW.UIPlugin());
		ps.addPlugin(new MW.DialogPlugin());
		ps.addPlugin(new MW.HUDPlugin());
		ps.addPlugin(new MW.PopupPlugin());
		this.sendSignal = ps.sendPluginSignal.bind(ps);
	},

	/**
	 * Cette évènement doit renvoyer TRUE pour pouvoir passer à l'étape suivante
	 * 
	 * @return bool
	 */
	onMenuLoop : function() {

		switch (this.nMenuState) {
		case 0: // start game
			if (this.sClientName) {
				this.sendSignal('startgame');
				this.nMenuState = 1;
			}
			break;

		case 1: // waiting for map to be ready
			if (this.bMapReady) {
				this.nMenuState = 0;
				O876_Raycaster.PointerLock.exitPointerLock();
				return true;
			}
			break;

		case 2: // ending game init
			this.sendSignal('exitlevel');
			this.nTime = 0;
			this.nMenuState = 3;
			break;

		case 3: // ending game / fade out
			++this.nTime;
			this.sendSignal('render');
			if (this.nTime >= 10) {
				this.nMenuState = 4;
			}
			break;

		case 4: // game has ended
			this.sendSignal('render');
			this.bMapReady = false;
			this.oData = null;
			this.idEntity = 0;
			this.aEntities = null;
			this.aInvisibles = null;
			this.aDoorsOpen = null;
			this.oCamera = null;
			break;
		}
		return false;
	},

	/**
	 * Evènement appelé lors du chargement d'un niveau, cet évènement doit
	 * renvoyer des données au format du Raycaster.
	 * 
	 * @return object
	 */
	onRequestLevelData : function() {
		return this.oData;
	},

	/**
	 * Evènement appelé quand une ressource et chargée sert à faire des barres
	 * de progressions
	 */
	onLoading : function(s, n, nMax) {
		var oCanvas = this.oRaycaster.oCanvas;
		var oContext = this.oRaycaster.oContext;
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		var sMsg = STRINGS._('~load_' + s);
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
	 * Evènement appelé lorsqu'un niveau a été chargé Permet l'initialisation
	 * des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel : function() {
		var oRC = this.oRaycaster;
		oRC.bSky = true;
		oRC.bFlatSky = true;
		oRC.nPlaneSpacing = 64;
		var oCT = new MW.PlayerThinker();
		oCT.oMouse = this.getMouseDevice(oRC.oCanvas);
		oCT.oKeyboard = this.getKeyboardDevice();
		oCT.oGame = this;
		oRC.oCamera.setThinker(oCT);
		// Tags data
		if ('tags' in oRC.aWorld) {
			var iTag, oTag;
			var aTags = oRC.aWorld.tags;
			this._oTagData = Marker.create();
			for (iTag = 0; iTag < aTags.length; ++iTag) {
				oTag = aTags[iTag];
				Marker.markXY(this._oTagData, oTag.x, oTag.y, oTag.tag);
			}
		}
		// decals
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
					oCanvas.getContext('2d').drawImage(oImage, 0, 0, wt, ht, (rc.xTexture - wt) >> 1, (rc.yTexture - ht) >> 1, wt, ht);
				});
			});
		}
		// ouvertures des portes
		var oThis = this;
		this.aDoorsOpen.forEach(function(dxy) {
			var x = dxy[0];
			var y = dxy[1];
			var b = dxy[2];
			oRC.setMapXY(x, y, b);
			var oDoorEffect = oThis.openDoor(x, y, true);
			oDoorEffect.fOffset = 1024;
		});
		this.aDoorsOpen = null;
		oRC.oCamera.getThinker().fNormalSpeed = oRC.oCamera.fSpeed = 4;
		this.gxFadeIn();
		this.csReady();
		this.sendSignal('enterlevel');
	},

	/**
	 * Evènement appelé par le processeur Ici on lance les animation de textures
	 */
	onDoomLoop : function() {
		this.processKeys();
		this.oRaycaster.textureAnimation();
	},

	/**
	 * Evènement appelé à chaque rendu de frame
	 */
	onFrameRendered : function() {
		this.sendSignal('render');
	},
	
	onFrameCount: function(nFPS, nAVG, nTime) {
		if (nTime > 5 && this.oRaycaster.oCanvas.width > 400 && nAVG < CONST.MINIMUM_FPS) {
			this.oRaycaster.downgrade();
			this.sendSignal('ui_resize');
			window.screenResize(null);
			this.popupMessage(STRINGS._('~alert_wtf_tooslow'), MW.ICONS.wtf_alert, null, 'amb_chat');
		}
	},

	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////

	/**
	 * Déclenche une attaque.
	 * 
	 * @param int
	 *            nTime temps de charge de l'attaque
	 */
	gm_attack : function(nTime) {
		this.csAttack(nTime * (1 + this.getPlayer().oThinker.oAttributes['energy'] / 100) | 0);
	},

	/**
	 * Déclenche la début de la charge
	 * 
	 * @param int
	 *            nTime temps de charge si 0 alors on remet la charge à zero
	 */
	gm_charge : function(nTime) {
		this.sendSignal('hud_update', 'charge', nTime * (1 + this.getPlayer().oThinker.oAttributes['energy'] / 100) | 0, this.nWeaponChargeTime);
	},

	/**
	 * Activation du mur d'en face
	 */
	gm_activateWall : function() {
		var m = this.getPlayer();
		var b = m.getFrontCellXY();
		this.csActivateWall(b.x, b.y);
	},

	gm_wheelUp : function() {
		this.sendSignal('hud_update', 'spells', null, 'left');
	},

	gm_wheelDown : function() {
		this.sendSignal('hud_update', 'spells', null, 'right');
	},

	/**
	 * Utilise l'objet actuellement selectionné
	 */
	gm_useItem : function() {
		var oSpells = this.oPluginSystem.getPlugin('HUD').getElement('spells');
		var nItem = oSpells.nDisplayed;
		var sItemId = oSpells.aGiven[nItem];
		var nCooldown = oSpells.aCooldown[nItem] || 0;
		if ((sItemId in MW.FEEDBACK) &&  (nCooldown < oSpells.nCurrentTime)) {
			var oFeedback = MW.FEEDBACK[sItemId];
			if ('flash' in oFeedback) {
				for (var iFlash = 0; iFlash < oFeedback.flash.length; iFlash += 3) {
					this.gxFade(oFeedback.flash[iFlash], oFeedback.flash[iFlash + 1] / 100, -oFeedback.flash[iFlash + 2] / 100);
				}
			}
			if ('sound' in oFeedback) {
				this.playSound(oFeedback.sound);
			}
		}
		this.csUse(nItem);
		// this.sendSignal('playercmd_useitem', nItem);
	},

	/**
	 * Transmission du mouvement du mobile controllé par le client
	 * 
	 * @param float
	 *            f angle de vue
	 * @param float
	 *            x position x
	 * @param float
	 *            y position y
	 * @param float
	 *            xs vitesse en x
	 * @param float
	 *            ys vitesse en y
	 */
	gm_movement : function(f, x, y, ma, ms) {
		this.csMyUpdate(f, x, y, ma, ms);
	},

	/**
	 * Renvoie l'instance du mobile controlé par le client (caméra)
	 */
	getPlayer : function() {
		return this.oRaycaster.oCamera;
	},

	/**
	 * Renvoie le premier MOB qui se trouve pile en face de la camera Renvoie
	 * null s'il n'y a pas de MOB visible pile en face de la caméra (dans la
	 * trajectoire d'un eventuel tir)
	 */
	getFirstMobInSight : function() {
		var oPlayer = this.getPlayer();
		if (!oPlayer) {
			return null;
		}
		var oRaycaster = this.oRaycaster;
		var oMobileRegister = oRaycaster.oMobileSectors;
		var oVisibles = oRaycaster.fastCastRay(oPlayer.x, oPlayer.y, oPlayer.fTheta);
		var x = 0, y = 0, aSector, i, nLen, oObject, nType;
		for (x in oVisibles) {
			for (y in oVisibles[x]) {
				aSector = oMobileRegister.get(x, y);
				nLen = aSector.length;
				for (i = 0; i < nLen; ++i) {
					oObject = aSector[i];
					nType = oObject.getType();
					if ((nType == RC.OBJECT_TYPE_PLAYER || nType == RC.OBJECT_TYPE_MOB) && oObject.bVisible && oObject.oSprite.bVisible) {
						return oObject;
					}
				}
			}
		}
		return null;
	},

	/**
	 * Active ou désactive le controle clavier de la caméra
	 * 
	 * @param b
	 *            true : camera controlable
	 * @returns
	 */
	setPlayerControllable : function(b) {
		var p = this.getPlayer();
		if (p && p.oThinker) {
			p.oThinker.bActive = b;
		}
		if (b) {
			this.getMouseDevice().nSecurityDelay = 8;
		}
	},

	/**
	 * Destruction d'un objet ayant un thinker avec une methode die();
	 * 
	 * @param nId
	 *            identifiant
	 * @param x
	 *            ...
	 * @param y
	 *            position finale de l'objet (optionel)
	 */
	destroyObject : function(nId, x, y) {
		if (nId === this.idEntity) {
			return;
		}
		var oMob = this.aEntities[nId];
		if (oMob) {
			if (x !== undefined && y != undefined) {
				oMob.setXY(x, y);
			}
			oMob.getThinker().die();
		}
		this.aEntities[nId] = null;
	},
	
	/**
	 * Activation d'un mur On envoie un message au serveur pour l'occasion C'est
	 * le serveur qui decide quoi faire ensuite...
	 */
	activateWall : function(oMobile) {
		var oBlock = oMobile.getFrontCellXY();
		var x = oBlock.x;
		var y = oBlock.y;
		this.openDoor(x, y);
	},

	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////

	dialogDisconnect : function() {
		if (this.oRaycaster === null) {
			
		} else {
			this.sendSignal('ui_dialog', STRINGS._('~dlg_disconnected_title'), STRINGS._('~dlg_disconnected_message'), [ [ STRINGS._('~dlg_button_reboot'), this.gpReboot.bind(this), 1 ] ]);
		}
	},

	dialogRespawn : function() {
		this.sendSignal('ui_dialog', STRINGS._('~dlg_youdied_title'), STRINGS._('~dlg_youdied_message', [ this.getPlayer().getData('killer') ]), [ [ STRINGS._('~dlg_button_respawn'),
				this.gpRespawn.bind(this), 1 ] ]);
	},

	dialogEndGame : function() {
		this.sendSignal('ui_dialog', STRINGS._('~dlg_endgame_title'), STRINGS._('~dlg_endgame_message', []), [ [ STRINGS._('~dlg_button_continue'), this.gpReboot.bind(this), 1 ],
				[ STRINGS._('~dlg_button_scores'), this.gpReboot.bind(this), 1 ] ]);
	},
	

	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////

	processKeys : function() {
		var nKey = this.getKeyboardDevice().inputKey();
		if (nKey) {
			var oKey = {
				k : nKey
			};
			this.sendSignal('key', oKey);
			switch (oKey.k) {
			case KEYS.ALPHANUM.B:
				// touche boss
				var oBody = document.getElementsByTagName('body')[0];
				if (this.bBoss) {
					this.oRaycaster.oCanvas.style.display = '';
					oBody.style.backgroundColor = '';
					oBody.style.color = '';
					oBody.removeChild(this.oBossMsg);
					this.oSoundSystem.unmute();
					this.bBoss = false;
					document.title = this.sBossModeTitle;
				} else {
					O876_Raycaster.PointerLock.exitPointerLock();
					this.oRaycaster.oCanvas.style.display = 'none';
					oBody.style.backgroundColor = 'white';
					oBody.style.color = 'black';
					this.oBossMsg = document.createElement('div');
					this.oBossMsg.appendChild(document.createTextNode(STRINGS._('~boss_msg')));
					oBody.appendChild(this.oBossMsg);
					this.oSoundSystem.mute();
					this.bBoss = true;
					this.sBossModeTitle = document.title;
					document.title = STRINGS._('~boss_title');
				}
				break;

			case KEYS.ENTER:
				MW.Microsyte.openChatForm();
				break;
				
			case KEYS.TAB: 
				this.sendSignal('hud_update', 'spells', null, 'next');
				break;
				
			case KEYS.BACKSPACE:
				var oSpells = this.oPluginSystem.getPlugin('HUD').getElement('spells');
				var nItem = oSpells.nDisplayed;
				if (nItem >= 0) {
					this.csDrop(nItem);
					var aItemData = oSpells.getItemName(nItem);
					if (aItemData) {
						var sName = aItemData[0];
						var nIcon = aItemData[1];
						this.popupMessage(STRINGS._('~item_drop', [sName]), nIcon);
					}
				}
			}
		}
	},

	/**
	 * Affiche un message popup
	 * 
	 * @param string
	 *            sMessage contenu du message
	 */
	popupMessage : function(sMessage, nIcon, sTile, sSound) {
		this.sendSignal('popup', sMessage, nIcon, sTile, sSound);
	},

	/**
	 * permet de définir l'apparence des popups l'objet spécifié peut contenir
	 * les propriété suivantes : - background : couleur de fond - border :
	 * couleur de bordure - text : couleur du texte - shadow : couleur de
	 * l'ombre du texte - width : taille x - height : taille y - speed : vitesse
	 * de frappe - font : propriété de police - position : position y du popup
	 */
	setPopupStyle : function(oProp) {
		var sProp = '';
		var gmxp = O876_Raycaster.GXMessage.prototype.oStyle;
		for (sProp in oProp) {
			gmxp[sProp] = oProp[sProp];
		}
	},

	/**
	 * Lecture d'un son à la position x, y Le son est modifié en amplitude en
	 * fonction de la distance séparant le point sonore avec la position de la
	 * caméra
	 * 
	 * @param sFile
	 *            fichier son à jouer
	 * @param x
	 *            position de la source du son
	 * @param y
	 */
	playSound : function(sFile, x, y) {
		sFile = 'resources/snd/' + this.sAudioType + '/' + sFile + '.' + this.sAudioType;
		var nChan = this.oSoundSystem.getFreeChan(sFile);
		var fDist = 0;
		if (x !== undefined) {
			var oPlayer = this.getPlayer();
			fDist = MathTools.distance(oPlayer.x - x, oPlayer.y - y);
		}
		var fVolume = 1;
		var nMinDist = 64;
		var nMaxDist = 512;
		if (fDist > nMaxDist) {
			fVolume = 0;
		} else if (fDist <= nMinDist) {
			fVolume = 1;
		} else {
			fVolume = 1 - (fDist / nMaxDist);
		}
		if (fVolume > 1) {
			fVolume = 1;
		}
		var nTime = this.getTime();
		if (fVolume > 0.01) {
			if (this.oSoundSystem.worthPlaying(nTime, sFile, fVolume)) {
				this.oSoundSystem.play(sFile, nChan, fVolume);
			}
		}
	},

	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////
	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////
	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////

	gxFade : function(sStyle, fAlpha, fSpeed) {
		var rc = this.oRaycaster;
		var gx = new O876_Raycaster.GXFade(rc);
		gx.oColor = GfxTools.buildStructure(sStyle);
		gx.fAlpha = fAlpha;
		gx.fAlphaFade = fSpeed;
		rc.oEffects.addEffect(gx);
	},

	gxFlash : function(sColor, nPower) {
		this.gxFade(sColor, nPower, -0.1);
	},

	gxFadeIn : function() {
		this.gxFade('#000', 1, -0.1);
	},

	/**
	 * Place un effet visuel sur le terrain.
	 * 
	 * @param sBlueprint string blueprint de l'effet
	 * @param x float position en "pixel"
	 * @param y float
	 */
	spawnVisualEffect : function(sBlueprint, x, y) {
		switch (sBlueprint) {
			case 'GXQuake':
				var p = this.getPlayer();
				var d = MathTools.distance(x - p.x, y - p.y) >> 6;
				d = Math.max(0, 10 - d);
				if (d) {
					var rc = this.oRaycaster;
					var gx = new MW.GXQuake(rc);
					gx.fAmp = d;
					rc.oEffects.addEffect(gx);
				}
			break;
			
			default:
				var oMob = this.spawnMobile(sBlueprint, x, y, 0);
				oMob.oSprite.playAnimationType(0, true);
				var oThinker = oMob.getThinker();
				oThinker.start();
				oMob.bEthereal = true;
				var oSounds = oMob.getData('sounds');
				if (oSounds && ('spawn' in oSounds)) {
					this.playSound(oSounds.spawn, x, y);
				}
			break;
		}
	},

	/**
	 * Coller un haze sur un sprite
	 */
	setSpriteHaze : function(oMob, nOverlay) {
		if (nOverlay !== null) {
			oMob.oSprite.oOverlay = this.oRaycaster.oHorde.oTiles.e_hazes;
			oMob.oSprite.nOverlayFrame = nOverlay;
		} else {
			oMob.oSprite.oOverlay = null;
			oMob.oSprite.nOverlayFrame = null;
		}
	},

	sendChatMessage : function(sMsg) {
		var r = sMsg.match(/^ *\/([a-z0-9]+) *(.*)$/i);
		if (r) {
			var sMeth = 'cmd_' + r[1];
			if (sMeth in this) {
				this[sMeth](r[2]);
			}
			return;
		} else {
			this.csChatMessage(sMsg);
		}
		var oChat = this.oPluginSystem.getPlugin('HUD').getElement('chat');
		if (oChat) {
			oChat.nLastTimestamp = this.getTime();
		}
	},

	cmd_debug : function(a) {
		this.csDebug(a);
	}
});
