var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente
var u = require('mwgame/Utils.js');
var CONST = require('mwgame/data/consts.js');

var ENTITIES = ['m_imp1', 'm_imp2'];
var FACTION = 222;

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
		if ((oData.t % 12) === 0) {
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
		switch (nPlayers) {
			case 0:
				this.nMaxMob = 8;
				break;

			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
				this.nMaxMob = 9 - nPlayers;
				break;
				
			default:
				this.nMaxMob = 0;
				break;
		}
	}
	
});

module.exports = ModMobLife;
