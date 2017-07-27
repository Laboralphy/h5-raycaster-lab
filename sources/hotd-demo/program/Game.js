/**
 * @class MANSION.Game
 *
 *
 */

/* global MAIN */
/* global CONFIG */
O2.extendClass('HOTD.Game', O876_Raycaster.GameAbstract, {


	_oLocators: null,

	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/
	/****** INIT ****** INIT ****** INIT ******/

	init: function() {
		this._oLocators = {};
		this.on('leveldata', function(wd) {
			wd.data = LEVEL_DATA.level1;
		});


		// initialisable
		this.on('itag.light', this.tagEventLight.bind(this));
		this.on('itag.shadow', this.tagEventShadow.bind(this));
		this.on('itag.diffuse', this.tagEventDiffuse.bind(this));
		this.on('itag.locator', this.tagEventLocator.bind(this));
		// this.on('itag.lock', this.tagEventLock.bind(this));

		this.on('enter', this.gameEventEnterLevel.bind(this));

		/*
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
        this.on('death', this.gameEventDeath.bind(this));

		this.on('key.down', this.gameEventKey.bind(this));
*/

	},

/*


déplacement automatique de la caméra
	la camera se déplace automatiquement suivant un script


	move locator
	angle a
	wait



*/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/
	/****** GAME EVENTS ****** GAME EVENTS ****** GAME EVENTS ******/



	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/
	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/
	/****** TAG EVENTS ****** TAG EVENTS ****** TAG EVENTS ******/

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

	/**
	 * Gestionnaire de tag
	 * tag : diffuse
	 * Ce tag règle le facteur "diffuse" d'un bloc, c'est à dire la quantité
	 * de lumière qu'il emet.
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
			oInstance[sAction].apply(oInstance, [oEvent]);
		}
	},


	getPlayer: function() {
		return this.oRaycaster.oCamera;
	},


	/**
	 * Evènement déclenché lorsqu'on entre dans un niveau
	 * pas de paramètre
	 */
	gameEventEnterLevel: function() {
		const rc = this.oRaycaster;
		this._oDarkHaze = rc.addGXEffect(HOTD.GX.DarkHaze);
		this.fadeIn('black', 1700);
		let oPlayer = this.getPlayer();
		oPlayer.setXY(oPlayer.x, oPlayer.y);
		//this.configPlayerThinker();
		//this.playAmbiance(MANSION.SOUNDS_DATA.bgm.levels[this.getLevel()]);
	},


	fadeIn: function(sColor, fTime) {
		return this.oRaycaster.addGXEffect(O876_Raycaster.GXFade).fadeIn(sColor, fTime);
	},

	fadeOut: function(sColor, fTime) {
		return this.oRaycaster.addGXEffect(O876_Raycaster.GXFade).fadeOut(sColor, fTime);
	},

});

