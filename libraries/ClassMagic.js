/**
 * Cette boite à outil permet d'ajouter des fonctionnalités spéciales
 * à des prototypes
 * @author raphael.marandet
 */

var ClassMagic = {};

/**
 * Créé un gestionnaire d'evenement dans la classe spécifiée
 * La classe se voie dotée de trois fonction
 * on(event, callback) permet de définir un call back pour un event donné
 * off([event, [callback]) permet de supprimer callback pour l'event donné
 * peut aussi supprimer tous les callback, voire tout les callback de tous les event
 * trigger(event, data) permet de déclencher l'evenement avec les données données
 * @param function ProtoClass
 */
ClassMagic.castEventHandler = function(ProtoClass) {
	var WEHName = '_WeirdEventHandlers';
	ProtoClass.prototype[WEHName] = null;
	ProtoClass.prototype.on = function(sEvent, pCallback) {
		if (this[WEHName] === null) {
			this[WEHName] = {};
		};
		var weh = this[WEHName];
		if (!(sEvent in weh)) {
			weh[sEvent] = [];
		}
		weh[sEvent].push(pCallback);
	};
	ProtoClass.prototype.off = function(sEvent, pCallback) {
		if (this[WEHName] === null) {
			throw new Error('no event "' + sEvent + '" defined');
		};
		if (sEvent === undefined) {
			this[WEHName] = {};
		} else if (!(sEvent in this[WEHName])) {
			throw new Error('no event "' + sEvent + '" defined');
		}
		var weh = this[WEHName];
		var wehe, n;
		if (pCallback !== undefined) {
			wehe = weh[sEvent];
			n = wehe.indexOf(pCallback);
			if (n < 0) {
				throw new Error('this handler is not defined for event "' + sEvent + '"');
			} else {
				wehe.splice(n, 1);
			}
		} else {
			weh[sEvent] = [];
		}
	};
	ProtoClass.prototype.trigger = function(sEvent) {
		if (this[WEHName] === null) {
			return;
		};
		var weh = this[WEHName];
		if (!(sEvent in weh)) {
			return;
		}
		var aArgs = Array.prototype.slice.call(arguments, 1);
		weh[sEvent].forEach(function(pCallback) {
			pCallback.apply(this, aArgs);
		}, this);
	}
	return ProtoClass;
};


/**
 * Créé un gestionnaire de Data
 * La classe se voie dotée de deux fonctions
 * setData et getData
 */
ClassMagic.castDataManager = function(ProtoClass) {
	var DCName = '_DataContainer';
	ProtoClass.prototype[DCName] = null;
	ProtoClass.prototype.setData = function(s, v) {
		if (this[DCName] === null) {
			this[DCName] = {};
		}
		if (typeof s === 'object') {
			for (var x in s) {
				this.setData(x, s[x]);
			}
		} else {
			this[DCName][s] = v;
		}
	};
	ProtoClass.prototype.getData = function(s) {
		if (this[DCName] === null) {
			return null;
		} else {
			var D = this[DCName];
			if (s === undefined) {
				return D;
			} else {
				if (s in D) {
					return D[s];
				} else {
					return null;
				}
			}
		}
	};
};
