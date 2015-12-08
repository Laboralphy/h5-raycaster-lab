var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente

var ModAccuracy = O2.extendClass(Plugin, {
	
	oStats: null,		// les stats de chaque client
						// le client dispose d'un identifiant UNIQUE
						// toutes instances confondu
	aInvalids: null,	// Liste des accuracy invalides

	getName: function() {
		return 'ModAccuracy';
	},
	
	

	init: function() {
		this.oStats = {};
		this.aInvalids = [];
		this.register('playerIn');
		this.register('playerOut');
		this.register('entityHit');
		this.register('entityShot');
		this.register('timeSecond');
	},
	
	playerIn: function(oInstance, oData) {
		var oPlayer = oData.c;
		var id = oPlayer.getId();
		this.oStats[id] = {
			entity: oData.e,
			shots: 0,
			hits: 0,
			invalid: false
		};
	},
	
	playerOut: function(oInstance, oData) {
		var oPlayer = oData.c;
		var id = oPlayer.getId();
		delete this.oStats[id];
	},
	
	entityHit: function(oInstance, oData) {
		var s = this.getEntityStat(oData.o);
		if (s) {
			s.hits++;
			this.invalidate(s);
		}
	},
	
	entityShot: function(oInstance, oData) {
		var s = this.getEntityStat(oData.e);
		if (s) {
			s.shots++;
			this.invalidate(s);
		}
	},
	
	timeSecond: function(oInstance) {
		var s;
		while (this.aInvalids.length) {
			s = this.aInvalids.shift();
			s.invalid = false;
			if (s.hits >= s.shots) {
				this.sendAccuracy(oInstance, s.entity, '100');
			} else {
				var fAcc = (10000 * s.hits / s.shots | 0) / 100;
				this.sendAccuracy(oInstance, s.entity, fAcc.toString());
			}
		}
	},
	
	/**
	 * Renvoie les stats associée à l'entité
	 * Il faut que l'entité soit associée à un client
	 */
	getEntityStat: function(oEntity) {
		var idClient = oEntity.getData('idClient');
		if (idClient) {
			return this.oStats[idClient];
		} else {
			return null;
		}
	},
	
	invalidate: function(s) {
		if (!s.invalid) {
			s.invalid = true;
			this.aInvalids.push(s);
		}
	},
	
	sendAccuracy: function(oInstance, oWho, sAcc) {
		oInstance.updateHud([oWho], 'ModAccuracy', sAcc);
	}
});

module.exports = ModAccuracy;
