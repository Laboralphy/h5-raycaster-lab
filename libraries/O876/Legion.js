/** Collection à clés recyclables
 * les éléments sont identifiés par leur clé
 * les clés sont des indice numériques
 * la suppression d'un élément ne provoque pas de décalage
 * Les clés supprimées sont réutilisées lors de l'ajout de nouveaux éléments
 * Les trous sont peu fréquents et rapidement comblés
 */
O2.createClass('O876.Legion', {
	aItems: null,
	aRecycler: null,
	
	__construct: function() {
		this.aItems = [];
		this.aRecycler = [];
	},
	
	/** Ajoute un élément à la legion
	 * @param oItem élément à ajouter
	 * @return indice de l'élément
	 */
	link: function(oItem) {
		var nKey;
		if (this.aRecycler.length) {
			nKey = this.aRecycler.shift();
			this.aItems[nKey] = oItem;
		} else {
			nKey = this.aItems.length;
			this.aItems.push(oItem);
		}
		return nKey;
	},
	
	indexOf: function(oItem) {
		return this.aItems.index(oItem);
	},
	
	getItem: function(nKey) {
		if (nKey < this.aItems.length) {
			return this.aItems[nKey];
		} else {
			return null;
		}
	},
	
	unlink: function(xKey) {
		var nKey;
		if (typeof xKey == 'object') {
			nKey = this.indexOf(xKey);
		} else {
			nKey = xKey;
		}
		this.aItems[nKey] = null;
		this.aRecycler.push(nKey);
	}
});