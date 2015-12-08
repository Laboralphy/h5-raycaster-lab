O2.extendClass('MW.HUDPlugin', MW.Plugin, {

	oHUD: null,
	
	oData: {
		life: ['MW.HUDLifeBar', 4, -4, 50, 12],
		charge: ['MW.HUDChargeBar', null, -4, 50, 12],
		crosshair: ['MW.HUDCrosshair', null, null, 16, 16],
		target: ['MW.HUDTarget', null, 64, 192, 24],
		chat: ['MW.HUDChat', 4, -20, '50%', '25%'],
		spells: ['MW.HUDSpellSelector', -40, -4, (6 + 2) * 16 - 4, 64],
		//ping: ['MW.HUDPing', -100, 2, 32, 32],
		attributes: ['MW.HUDIconPad', 60, -2, 128, 16]
	},
	
	oIndex: null,

	oClassLoader: null,

	getName: function() {
		return 'HUD';
	},
	
	centerElement: function(oElement) {
		var c = this.oHUD.getCanvas();
		var e = oElement.slice(0);
		if (e[1] === null) {
			e[1] = (c.width - e[3]) >> 1;
		}
		if (e[2] === null) {
			e[2] = (c.height - e[4]) >> 1;
		}
		var r, v;
		if (typeof e[1] === 'string') {
			r = e[1].match(/^(-?[0-9]+)%$/);
			if (r) {
				v = r[1] | 0;
				e[1] = v * c.width / 100 | 0;
			}
		}
		if (typeof e[2] === 'string') {
			r = e[2].match(/^(-?[0-9]+)%$/);
			if (r) {
				v = r[1] | 0;
				e[2] = v * c.height / 100 | 0;
			}
		}
		return e;
	},
	
	activateElement: function(sElement) {
		var d, p;
		d = this.oData[sElement];
		p = this.oClassLoader.loadClass(d[0]);
		d = this.centerElement(d);
		var oElement = new p();
		oElement._sClass = sElement;
		oElement.oGame = this.oGame;
		this.oHUD.addNewElement(oElement, sElement, d[1], d[2], d[3], d[4]);
		this.oIndex[sElement] = oElement; 
		oElement.init();
	},
	
	addElementData: function(sID, d) {
		this.oData[sID] = d;
	},
	
	init: function() {
		this.oClassLoader = new O876.ClassLoader();
		this.oIndex = {};
		this.oHUD = new UI.HUD();
		var c = document.getElementById(CONFIG.raycaster.canvas);
		this.oHUD.setCanvas(c);
		
		// plugin optionels
		var sId = '';
		var p, aHUDData, sRsc;
		for (sId in MW.PLUGINS_DATA) {
			p = MW.PLUGINS_DATA[sId];
			// création constante HUDE
			sRsc = '';
			// déclaration des tiles
			for (sRsc in p.tiles) {
				MW.TILES_DATA[sRsc] = p.tiles[sRsc]; 
			}
			// Déclaration dans HUDPlugin			
			aHUDData = [p.className, p.hud.x, p.hud.y, p.hud.width, p.hud.height];
			this.addElementData(sId, aHUDData);
		}
		
		for (var sID in this.oData) {
			this.activateElement(sID);
		}
		this.register('enterlevel');
		this.register('exitlevel');
		this.register('key');
		this.register('hud_update');
		this.register('ui_resize');
	},
	
	enterlevel: function() {
		this.register('render');
		// crosshair
		this.update('crosshair');
		
		// chargebar
		this.update('charge', 0, 1);

		// life
		this.update('life', 0, 1);
		
		// avatar
		var ld = this.oGame.oLoginData;
		if (ld && ('avatar' in ld)) {
			this.update('avatar', ld.avatar);
		}
		
		var oSpells = this.getElement('spells');
		oSpells.oImage = this.oGame.oRaycaster.oHorde.oTiles.i_icons32.oImage;
		// charger les icones
		var sIcon = '', iIcon = 0;
		for (sIcon in MW.ICONS) {
			oSpells.update_declare(iIcon, MW.ICONS[sIcon], sIcon, STRINGS._('~itm_' + sIcon));
			++iIcon;
		}
		oSpells.update_display(-1);
	},

	exitlevel: function() {
		this.unregister('render');
	},
	
	
	update: function(sElement) {
		var e = this.getElement(sElement);
		if (e) {
			var aArgs = Array.prototype.slice.call(arguments, 1);
			e.update.apply(e, aArgs);
		}		
	},
	
	getElement: function(sElement) {
		return this.oHUD.getElement(sElement);
	},
	
	render: function() {
		// informations vivaces
		/** @TODO achanger bientôt : le moyen de mettre à jour les HUDE vivace */ 
		var oMob = this.oGame.getFirstMobInSight();
		var sMobName = '';
		var sColor = '#FFFFFF', oMobData;
		if (oMob) {
			sMobName = oMob.getData('name');
			oMobData = oMob.getData('extra');
			if (oMobData && ('color' in oMobData)) {
				sColor = oMobData.color;
			}
		}
		this.hud_update('target', sMobName, sColor);
		this.hud_update('chat', null, this.oGame.getTime());
		this.hud_update('spells', null, 'time', this.oGame.getTime());
		this.oHUD.render();
	},
	
	key: function(oKey) {
		var k = oKey.k, p;
		for (var idElement in this.oIndex) {
			p = this.oIndex[idElement];
			if ('keyPress' in p) {
				p.keyPress(k);
			}
		}
	},

	hud_update: function(idElement) {
		var e = this.oIndex[idElement];
		if (e) {
			var aArgs = Array.prototype.slice.call(arguments, 1);
			e.update.apply(e, aArgs);
		}
	},
	
	/**
	 * Recomputes the position and the size of all HUD elements.
	 */
	ui_resize: function() {
		var oElement, d;
		for (var sElement in this.oIndex) {
			oElement = this.oIndex[sElement];
			d = this.centerElement(this.oData[sElement]);
			this.oHUD.addNewElement(oElement, sElement, d[1], d[2], d[3], d[4]);
			oElement.redraw();
		}
	}
});
