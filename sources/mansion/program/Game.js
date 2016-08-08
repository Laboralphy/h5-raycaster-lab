O2.extendClass('Stub.Game', O876_Raycaster.GameAbstract, {
	
	_oAudio: null,
	
	sAmbience: '',
	
	oGameScriptData: null,
	oTagIndex: null,
	
	init: function() {
		this.initAudio();
		this.initPopup();
		this.oGameScriptData = {};
		//this.on('tag', this.gameEventTag.bind(this));		

		//this.on('itag.light', this.tagEventLight.bind(this));
		//this.on('itag.shadow', this.tagEventShadow.bind(this));
		this.on('tag.msg', this.tagEventMessage.bind(this));
		this.on('tag.script', this.tagEventScript.bind(this));
		this.on('tag.zone', this.tagEventZone.bind(this));
		this.on('tag.pic', this.tagEventPicture.bind(this));


		this.on('build', this.gameEventBuild.bind(this));	
		this.on('level', this.gameEventLevel.bind(this));	
		this.on('door', this.gameEventDoor.bind(this));
		this.on('load', this.gameEventLoad.bind(this));
	},
	
	initAudio: function() {
		a = new O876.SoundSystem();
		a.setChannelCount(8);
		a.setPath('resources/snd');
		this._oAudio = a;
	},
	
	initPopup: function() {
		this.setPopupStyle({
			font: 'monospace 10',
			width: 320,
			height: 32,
			speed: 120,
			position: 8
		});
	},
	
	gameEventBuild: function(data) {
		var i = '';
		for (i in TILES_DATA) {
			data.tiles[i] = TILES_DATA[i];
		}
		for (i in BLUEPRINTS_DATA) {
			data.blueprints[i] = BLUEPRINTS_DATA[i];
		}
		// indexation des tags
		var oTagIndex = {};
		data.tags.forEach(function(t) {
			oTagIndex[t.tag] = [t.x, t.y];
		});
		this.oTagIndex = oTagIndex;
	},
	
	gameEventLoad: function(data) {
		var s = data.phase;
		var n = data.progress;
		var nMax = data.max;
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
	
	gameEventLevel: function() {
		this.getPlayer().fSpeed = 3;
		this.playAmbience(SOUNDS_DATA.ambience[this.getLevel()]);
		this.oRaycaster.oEffects.addGXEffect(O876_Raycaster.GXFade).fadeIn('#000', 0.6);
	},
	

	tagEventZone: function(oEvent) {
		var sTag = oEvent.data;
		if (!sTag) {
			return;
		}
		this.playAmbience(SOUNDS_DATA.ambience[sTag]);
	},
	
	tagEventMessage: function(oEvent) {
		var sTag = oEvent.data;
		this.popupMessage(MESSAGES_DATA[this.getLevel()]['m_' + sTag]);
		oEvent.remove = true;
	},
	
	tagEventPicture: function(oEvent) {
		var sTag = oEvent.data;
		this.popupMessage(MESSAGES_DATA[this.getLevel()]['p_' + sTag]);
	},
	
	tagEventScript: function(oEvent) {
		var sTag = oEvent.data;
		if (!sTag) {
			return;
		}
		var aTags = sTag.split(' ');
		var sScript = 'gameScript' + aTags.shift();
		if (sScript in this) {
			this[sScript].apply(this, [oEvent.x, oEvent.y, aTags]);
			oEvent.remove = true;
		}
	},
	
	gameEventDoor: function(data) {
		var x = data.x;
		var y = data.y;
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oEffect = data.door;
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
	
	////// GAME SCRIPTS ////// GAME SCRIPTS ////// GAME SCRIPTS //////
	////// GAME SCRIPTS ////// GAME SCRIPTS ////// GAME SCRIPTS //////
	////// GAME SCRIPTS ////// GAME SCRIPTS ////// GAME SCRIPTS //////

	
	gsSetData: function(sData, xValue) {
		this.oGameScriptData[sData] = xValue;
	},

	gsGetData: function(sData) {
		if (sData in this.oGameScriptData) {
			return this.oGameScriptData[sData];
		} else {
			return null;
		}
	},


	/**
	 * Fait apparaitre ayako
	 */
	gameScriptAyakoGhost: function(x, y, aTags) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oMob = this.spawnMobile('g_ayako', x * ps + ps2, (y + 2) * ps, 0); 
		this.gsSetData('ga_ayako', oMob);
		this.setBlockTag(x, y + 1, 'script AyakoGhostOff');
	},
	
	gameScriptAyakoGhostOff: function(x, y, aTags) {
		var oMob = this.gsGetData('ga_ayako');
		if (oMob) {
			oMob.oThinker.vanish();
			this.gsSetData('ga_ayako', null);
		}
	},
	
	gameScriptHangedGhost: function(x, y, aTags) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oMob = this.spawnMobile('g_hanged', (x - 1) * ps + ps2, (y + 4) * ps, 0); 
		this.gsSetData('ga_hanged', oMob);
	},
	
	gameScriptHangedGhostOff: function(x, y, aTags) {
		var oMob = this.gsGetData('ga_hanged');
		if (oMob) {
			oMob.oThinker.vanish();
			this.gsSetData('ga_hanged', null);
		}
	},

	gameScriptReikaGhost: function(x, y, aTags) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oMob = this.spawnMobile('g_reika', (x + 2) * ps + 1, (y + 4) * ps + ps2, 0); 
		this.gsSetData('ga_reika', oMob);
	},

	gameScriptReikaGhostOff: function(x, y, aTags) {
		var oMob = this.gsGetData('ga_reika');
		if (oMob) {
			oMob.oThinker.vanish();
			this.gsSetData('ga_reika', null);
		}
	},
	
	gameScriptHeadGhost: function(x, y, aTags) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var xHead;
		if (this.getPlayer().xSector > x) {
			xHead = x * ps - 1;
		} else {
			xHead = (x + 1) * ps + 1;
		}
		this.spawnMobile('g_head', xHead, y * ps + ps2, 0); 
	},

	gameScriptWandererGhost: function(x, y, aTags) {
		var ps = this.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		if (this.getPlayer().xSector > x) {
			return;
		}
		var oMob = this.spawnMobile('g_wanderer', (x + 3) * ps + ps2, (y - 1) * ps + ps2, PI / 2);
		oMob.fSpeed = 2;
	},
	
	getPlayer: function() {
		return this.oRaycaster.oCamera;
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
	
	/**
	 * Lance le fichier musical d'ambiance
	 * @param string sAmb nom du fichier
	 */
	playAmbience: function(sAmb) {
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

});
