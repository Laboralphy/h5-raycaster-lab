var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente
var u = require('mwgame/Utils.js');
var CONST = require('mwgame/data/consts.js');

var ENTITIES = [
	'm_bigknight', 'm_pumpkin', 'm_imp1', 'm_imp2', 'm_imp1', 'm_imp2', 'm_imp1', 'm_imp2'
];

var FACTION = 222; // faction of mobs
var PERIOD = 12;  // each period, a new mob may appear
var MAX_MOBS = 8; // maximum number of mobs

O2.extendClass('ModMobLife', Plugin, {
	
	nMaxMob: 0,
	
	
	getName: function() {
		return 'ModMobLife';
	},
	
	init: function() {
		this.register('playerIn');
		this.register('playerOut');
		this.register('timeSecond');
	},
	
	playerIn: function(oInstance, oData) {
		this.adjustMaxMob(oInstance);
	},
	
	playerOut: function(oInstance, oData) {
		this.adjustMaxMob(oInstance);
	},
	
	timeSecond: function(oInstance, oData) {
		if ((oData.t % PERIOD) === 0) {
			// calculate how many mobs are in the arena
			var nEntities = oInstance.getEntities().reduce(function(nPrev, oCurr) {
				if (!!oCurr && oCurr.getType() === CONST.ENTITY_TYPE_MOB) {
					return nPrev + 1;
				} else {
					return nPrev;
				}
			}, 0);
			if (nEntities < this.nMaxMob) {
				var sMob = u.choose(ENTITIES);
				var xyPoint = oInstance.getRandomSpawnPoint('p1');
				var oMob = oInstance.createMonsterEntity(sMob, xyPoint.x, xyPoint.y);
				oMob.setData('faction', FACTION);
			}
		} 
	},
	
	/**
	 * Set the appropriate amount of mobs
	 */
	adjustMaxMob: function(oInstance) {
		var nPlayers = oInstance.getClientEntities().length;
		if (nPlayers > 0 && nPlayers <= MAX_MOBS) {
			this.nMaxMob = MAX_MOBS + 1 - nPlayers;
		} else {
			this.nMaxMob = 0;
		}
	}
	
});

module.exports = ModMobLife;
