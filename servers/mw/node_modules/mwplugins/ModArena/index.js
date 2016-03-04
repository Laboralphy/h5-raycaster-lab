var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente
var wsh = require('wshelper');

var ModArena = O2.extendClass(Plugin, {
	
	oScores: null,		// les stats de chaque client
						// le client dispose d'un identifiant UNIQUE
						// toutes instances confondu
	
	nPlayerCount: 0,
	
	nGameDuration: 10,
	oConfigs: null,
	
	getName: function() {
		return 'ModArena';
	},

	init: function() {
		this.oScores = {};
		this.oConfigs = {};
		this.register('instanceCreated');
		this.register('playerIn');
		this.register('playerOut');
		this.register('entityDeath');
		this.register('timeSecond');
	},
	
	instanceCreated: function(oInstance, oData) {
		var oConfig = oData.c;
		if ('duration' in oConfig) {
			oConfig.timeOut = oConfig.duration * 60;
		}
		this.oConfigs[oInstance.getId()] = oConfig;
	},

	playerIn: function(oInstance, oData) {
		var oPlayer = oData.c;
		var sColor = oPlayer.getData('color') || '#FFFFFF';
		var id = oPlayer.getId();
		this.oScores[id] = {
			name: oPlayer.getName(),
			kills: 0,
			deaths: 0,
			color: sColor
		};
		this.send(oInstance, 'playerJoined', oPlayer.getName());
		this.nPlayerCount = oInstance.getClientEntities().length;
	},
	
	playerOut: function(oInstance, oData) {
		var oPlayer = oData.c;
		var id = oPlayer.getId();
		delete this.oScores[id];
		this.send(oInstance, 'playerLeft', oPlayer.getName());
		--this.nPlayerCount;
		if (this.nPlayerCount <= 0) {
			this.loadNextMap(oInstance);
		}
	},
	
	entityDeath: function(oInstance, oData) {
		var idKiller = oData.k.getData('idClient');
		var idVictim = oData.e.getData('idClient');
		if (idKiller && idVictim) {
			var oScore = this.oScores[idKiller];
			++oScore.kills;
			oScore = this.oScores[idVictim];
			++oScore.deaths;
			this.send(oInstance);
		}
	},

	timeSecond: function(oInstance, oData) {
		var id = oInstance.getId();
		var c = this.oConfigs[id];
		if (('duration' in c) && ('maplist' in c) && (this.nPlayerCount > 0)) {
			--c.timeOut;
			switch (c.timeOut) {
				case 60:
				case 30:
				case 10:
					oInstance.pushNetworkMessage(oInstance.getClientEntities(), {
						m: 'msg', 
						s: 'alert_level_change_' + c.timeOut, 
						i: 'wtf_alert',
						a: 'amb_chat'
					});
					break;
			}
			if (c.timeOut <= 0) {
				this.loadNextMap(oInstance);
			}
		}
	},
	
	/**
	 * Loads a new map
	 * @param Instance oInstance instance
	 */
	loadNextMap: function(oInstance) {
		var id = oInstance.getId();
		var c = this.oConfigs[id];
		// load another map
		this.send(oInstance, 'endGame');
		c.maplist.push(c.map);
		c.map = c.maplist.shift();
		oInstance.terminate();
		c.timeOut = c.duration * 60;
	},
	
	
	/**
	 * Builds score board
	 * the built structure is an array 2D
	 * each row is an array [name, kills, deaths, id] 
	 */
	buildScoreBoard: function() {
		var s = [];
		var oX;
		for (var sId in this.oScores) {
			oX = this.oScores[sId];
			s.push([oX.name, oX.kills, oX.deaths, sId, oX.color]);
		}
		s.sort(this.sortScoresProc);
		this.aScoreBoard = s;
		return s;
	},

	/**
	 * This function is a callback for sort
	 * it sorts array items order by element[1]
	 * @param a first item (array)
	 * @param b second item (array)
	 * @return int
	 */
	sortScoresProc: function(a, b) {
		return b[1] - a[1];
	},


	send: function(oInstance, sEvent, sParam) {
		var aScores = [], aSc;
		for (var s in this.oScores) {
			aSc = this.oScores[s];
			aScores.push([aSc.name, aSc.kills, aSc.deaths, aSc.color]);
		}
		aScores.sort(function(a, b) {
			return b[1] - a[1];
		});
		oInstance.updateHud(oInstance.getClientEntities(), 'ModArena', aScores, sEvent, sParam);
	}
});

module.exports = ModArena;
