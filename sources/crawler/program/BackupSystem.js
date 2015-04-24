/**
 * Chaque instance de backup system est lié à un namespace dans le localstorage
 */
O2.createClass('BackupSystem', {
	
	nBackupFormat: 1,

	sNameSpace: '',
	SEPARATOR: '__',
	DATA_KEY: 'data',
	aFiles: null,
	aRatio: null,
	
	__construct: function() {
		this.aRatio = {};
		if (!this.hasLocalStorage()) {
			throw new Error('no localstorage available');
		}
	},
	
	/**
	 * Renvoie true si le localstorage est dispo sur le navigateur
	 * @return bool
	 */
	hasLocalStorage: function() {
		return 'localStorage' in window && localStorage !== null;
	},
	
	/**
	 * Créé le namesapce de stockage
	 */
	init: function(sNameSpace) {
		this.sNameSpace = sNameSpace + this.SEPARATOR;
	},

	/**
	 * Enregistre un nom de donnée de manière à pourvoir
	 * garder une trace de toutes les entrées
	 * et pouvoir les effeacer ou cumuler la taille.
	 * @param sKey
	 * 
	 */
	registerData: function(sKey) {
		if (sKey == this.DATA_KEY) {
			return;
		}
		var f = this.loadData(this.DATA_KEY);
		if (f === null) {
			this.storeData(this.DATA_KEY, [sKey]);
		} else if (f.indexOf(sKey) < 0) {
			f.push(sKey);
			this.storeData(this.DATA_KEY, f);
		}
	},
	
	unregisterData: function(sKey) {
		if (sKey == this.DATA_KEY) {
			return;
		}
		var f = this.loadData(this.DATA_KEY);
		if (f === null) {
			return;
		} else if (f.indexOf(sKey) >= 0) {
			ArrayTools.removeItem(f, f.indexOf(sKey));
			this.storeData(this.DATA_KEY, f);
		}
	},
	
	/**
	 * Vérifie la présence d'une donnée enregistrée dans le localStorage
	 * @param sKey
	 * @return bool
	 */
	isStoredData: function(sKey) {
		var sNSKey = this.sNameSpace + sKey;
		return sNSKey in localStorage; 
	},
	
	/** Sauvegarde de données
	 * @param sKey clé de sauvegarde
	 * @param xData donnée à sauver
	 */
	storeData: function(sKey, xData) {
		var sNSKey = this.sNameSpace + sKey;
		if (xData === null) {
			this.unregisterData(sKey);
			localStorage.removeItem(sNSKey);
		} else {
			this.registerData(sKey);
			localStorage[sNSKey] = O876.LZW.encode(JSON.stringify(xData));
			this.aRatio[sKey] = O876.LZW.nLastRatio;
		}
	},
	
	/** Chargement de données
	 * @param sKey clé de sauvegarde
	 * @return données chargée
	 */
	loadData: function(sKey) {
		var sNSKey = this.sNameSpace + sKey;
		if (sNSKey in localStorage) {
			return JSON.parse(O876.LZW.decode(localStorage[sNSKey]));
		} else {
			return null;
		}
	},
	
	/** Supprime la totalité des entrée pour le namespace en cours
	 */
	clear: function() {
		var f;
		try {
			f = this.loadData(this.DATA_KEY);
			if (f === null) {
				return;
			}
			for (var i = 0; i < f.length; i++) {
				localStorage.removeItem(this.sNameSpace + f[i]);
			}
			localStorage.removeItem(this.sNameSpace + this.DATA_KEY);
		} catch (e) {
			var aToBeRemoved = [];
			for (var i in localStorage) {
				if (i.substr(0, this.sNameSpace.length) == this.sNameSpace) {
					aToBeRemoved.push(i);
				}
			}
			for (i = 0; i < aToBeRemoved.length; i++) {
				localStorage.removeItem(aToBeRemoved[i]);
			}
		}
	},
	
	/**
	 * Extraction et exportation des donnée du name space
	 * @return tableau associatif
	 */
	exportData: function() {
		var oExport = {};
		var f = this.loadData(this.DATA_KEY);
		if (f === null) {
			return null;
		}
		for (var i = 0; i < f.length; i++) {
			oExport[f[i]] = this.loadData(f[i]);
		}
		return oExport;
	}
});