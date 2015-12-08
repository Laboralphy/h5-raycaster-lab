var O2 = require('o2');	// requis car le module hérite de la classe Plugin
var Plugin = require('mediator').Plugin; // requis : la classe parente
var u = require('mwgame/Utils.js');
var Alchemy = require('./alchemy_recipes.js');

var ModAlchemy = O2.extendClass(Plugin, {
	
	oPlayerData: null,
	aComponents: null,
	
	LOOT_PROB : 10,
	
	getName: function() {
		return 'ModAlchemy';
	},

	init: function() {
		this.oPlayerData = {};
		this.aComponents = Object.keys(Alchemy.data.components);
		this.register('ModAlchemy_brew');
		this.register('ModAlchemy_start');
		this.register('entityPickUpItem');
		this.register('playerIn');
	},
	
	playerIn: function(oInstance, oData) {
		var oPlayer = oData.c;
		var id = oPlayer.getId();
		this.oPlayerData[id] = {
			components: { leaf: 0, mush: 0, dust: 0, root: 0 }
		};
	},
	
	entityPickUpItem: function(oInstance, xData) {
		if (xData.noAlchemy) {
			return;
		}
		var oEntity = xData.e;
		var id = oEntity.getData('idClient');
		var oInventory = oEntity.getData('inventory');
		var nChance = this.LOOT_PROB + oEntity.getSoul().getAttribute('luck');
		if ((!oInventory.isFull()) && u.prob(nChance)) {
			var nLoot = u.rand(0, 3);
			++this.oPlayerData[id].components[this.aComponents[nLoot]];
			oInstance.updateHud([xData.e], 'ModAlchemy', 'loot', {n : nLoot});
		}
	},
	
	/**
	 * Affichage de la fenetre de craft
	 */
	ModAlchemy_start: function(oInstance, xData) {
		var oClient = xData.client;
		var oData = this.oPlayerData[oClient.getId()];
		oInstance.logMessage('starting alchemy : ' + oClient.getName());
		oInstance.updateHud([oClient.getEntity()], 'ModAlchemy', 'start', {
			components: oData.components
		});
	},

	ModAlchemy_brew: function(oInstance, xData) {
		var oClient = xData.client;
		var nRecipe = xData.r;
		var sItem = Alchemy.data.recipes[nRecipe];
		var oEntity = xData.client.getEntity();
		if (sItem) {
			if (!Alchemy.test(nRecipe, this.oPlayerData[oClient.getId()].components)) {
				oInstance.updateHud([oClient.getEntity()], 'ModAlchemy', 'fail', {w: 'nocomp'});
			}
			var oPickup = {
				e: oEntity,
				i: [sItem],
				f: false,
				noAlchemy: true
			};
			oInstance.sendSignal('entityPickUpItem', oPickup);
			if (!oPickup.f) {
				oInstance.logMessage('alchemy brewing : ' + oClient.getName() + ' - recipe : ' + nRecipe);
				Alchemy.update(nRecipe, this.oPlayerData[oClient.getId()].components);
			}
		} else {
			oInstance.updateHud([oClient.getEntity()], 'ModAlchemy', 'fail', {w: 'invalid'});
		}
	}
});

module.exports = ModAlchemy;
