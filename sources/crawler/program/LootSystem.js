/** Système de distribution de loot
 * 
 */

O2.createClass('LootSystem', {
	
	/**
	 * La table est composé de "loot type"
	 * chaque loot type possède une structure comme ceci :
	 * {
	 *		chances: [x0, x1, x2, x3],   // on pioche un élément au hasard dans ce tableau pour connaitre le nombre d'item à générer pour le loot
	 *		items: {
	 *			item1: prob1,
	 *			....
	 *		}
	 * }
	 */
	_oTable: null,
	
	__construct: function() {
		this._oTable = {};
	},
	
	getLoot: function(sType) {
		var aLoot = [];
		if (!(sType in this._oTable)) {
			if (sType in LOOT_DATA) {
				this._oTable[sType] = {
					chances: this.generateDistribution(LOOT_DATA[sType].chances),
					items: this.generateDistribution(LOOT_DATA[sType].items)
				};
			} else {
				return aLoot;
			}
		}
		var oData = this._oTable[sType];
		// choix du nombre d'objets
		var nItemCount = MathTools.rndChoose(oData.chances);
		while (nItemCount > 0) {
			aLoot.push(MathTools.rndChoose(oData.items));
			nItemCount--;
		}
		return aLoot;
	},
	
	/**
	 * Génère un tableau de distribution à partir des valueur contenue dans la table loot
	 * la table loot est une table associative associant une clé de loot a une probabilité de drop
	 * la fonction renvoie un object contenant : 
	 * - un tableau pour préparer le choix du loot.
	 * - un tableau de distribution de chance
	 */
	generateDistribution: function(oData) {
		var x, a = [];
		var t = oData;
		for (var i in t) {
			// empile x fois l'indice i (id du loot)
			for (x = 0; x < t[i]; x++) {
				a.push(i);
			}
		}
		return ArrayTools.shuffle(a);
	},
	
	test: function(sType, n) {
		if (n === undefined) {
			n = 100;
		}
		var oItems = {};
		var aLoot, iLoot;
		for (var i = 0; i < n; i++) {
			aLoot = this.getLoot(sType);
			for (iLoot = 0; iLoot < aLoot.length; iLoot++) {
				if (!(aLoot[iLoot] in oItems)) {
					oItems[aLoot[iLoot]] = 0;
				}
				oItems[aLoot[iLoot]]++;
			}
		}
		return oItems;
	},
	
	runTests: function(sType) {
		var oItems = {};
		var sItem = '', o;
		for (sItem in LOOT_DATA[sType].items) {
			oItems[sItem] = [];
		}
		for (var iTest = 0; iTest < 10000; iTest++) {
			o = this.test(sType);
			for (sItem in o) {
				oItems[sItem].push(o[sItem]);
			}
		}
		var oResult = {};
		var avg = function(aTab) {
			var n = 0;
			for (var i = 0; i < aTab.length; i++) {
				n += aTab[i];
			}
			return n / aTab.length;
		};
		for (sItem in oItems) {
			oResult[sItem] = avg(oItems[sItem]); 
		}
		var aResult = [];
		for (sItem in oResult) {
			aResult.push([sItem, oResult[sItem]]); 
		}
		aResult.sort(function(a, b) {
			return b[1] - a[1];
		});
		return aResult;
	},
	
	runDungeonTest: function(oTypes) {
		var oItems = {}, sItem = '', o;
		for (var sType in oTypes) {
			o = this.test(sType, oTypes[sType]);
			for (sItem in o) {
				if (!(sItem in oItems)) {
					oItems[sItem] = o[sItem];
				} else {
					oItems[sItem] += o[sItem];
				}
			}
		}
		return oItems;
	}
});