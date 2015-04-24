O2.createClass('O876.Horde', {
	aItems: null,
	
	__construct: function() {
		this.aItems = [];
	},
	
	/** Ajoute un élément à la legion
	 * @param oItem élément à ajouter
	 * @return int : indice de l'élément
	 */
	link: function(oItem) {
		var nKey = this.aItems.length;
		this.aItems.push(oItem);
		return nKey;
	},
	
	/**
	 * Renvoie le rang d'un élément
	 * @return int ( -1 si non trouvé
	 */
	indexOf: function(oItem) {
		return this.aItems.indexOf(oItem);
	},
	
	/** 
	 * Renvoie l'élément de la horde dont le rang est spécifié en param
	 * @param int rand de l'élément recherché
	 * @return object
	 */
	getItem: function(nKey) {
		if (nKey < this.aItems.length) {
			return this.aItems[nKey];
		} else {
			return null;
		}
	},
	
	/**
	 * Renvoie tous les items
	 * @return array
	 */
	getItems: function() {
		return this.aItems;
	},
	
	/** 
	 * Nombre d'éléments dans la horde
	 * return int
	 */
	count: function() {
		return this.aItems.length;
	},
	
	
	/**
	 * Suppression d'un élément de la horde
	 * La horde ne conserve pas le rang des éléments :
	 * Lorsqu'un élément est supprimé les autres éléments
	 * sont tassé pour combler le vide
	 * 
	 * @param xKey int or object élément ou rang de l'élément
	 */ 
	unlink: function(xKey) {
		var nKey;
		if (typeof xKey == 'object') {
			nKey = this.indexOf(xKey);
		} else {
			nKey = xKey;
		}
		if (nKey < 0 || nKey >= this.aItems.length) {
			return;
		}
		if (nKey == this.aItems.length - 1) {
			this.aItems.pop();
		} else {
			this.aItems[nKey] = this.aItems.pop();
		}
	},
	
	/**
	 * supprime les éléments de la horde
	 */
	clear: function() {
		this.aItems = [];
	}
});
