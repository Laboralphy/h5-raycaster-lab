/**
 * @class ADV.Effect
 */
O2.createClass('ADV.Effect', {
	
	/**
	 * Tag apprécié
	 * 
	 * "curse" l'effet est néfaste
	 * "bless" l'effet est bénéfique
	 * "scroll" l'effet est véhiculé par un scroll
	 * "potion" l'effet est véhiculé par une potion
	 * "spell" l'effet est véhiculé par un sort
	 * "wand" l'effet est véhiculé par une baguette
	 */
	__construct: function() {
		this._aTags = null;
		this._nDuration = 0;
		this._nDurationType = 0;
		this._oSource = null;
		this._oTarget = null;
		this._bExpired = false;
		this._nExpirationTime = 0;
		this._nLevel = 0;
		this._bTerm = false ; // quand true cet effet ne doit plus agir

		this.DURATION_TYPE_INSTANT = 0;
		this.DURATION_TYPE_TEMPORARY = 1;
		this.DURATION_TYPE_FOREVER = 2;
		var aArgs = Array.prototype.slice.call(arguments, 0);
		var aTags = [];
		aArgs.forEach(function(t) {
			if (Array.isArray(t)) {
				aTags = aTags.concat(t);
			} else {
				aTags = aTags.concat(t.split(' '));
			}
		});
		this._aTags = aTags;
	},
	
	/**
	 * Getters, Setters, Removers et Hasers pour tous !
	 */
	addTag: function(s) {
		if (Array.isArray(s)) {
			s.forEach(x => { if (!this.hasTag(x)) this._aTags.push(x) });
		} else {
			this.addTag(s.split(' '));
		}
	},
	
	removeTag: function(s) {
		var t = this._aTags;
		var n = t.indexOf(s);
		if (n >= 0) {
			t.splice(n, 1);
		}
	},

	getTags: function() {
		return this._aTags;
	},

	getTag: function(n) {
		return this._aTags[n];
	},

	hasTag: function(s) {
		return this._aTags.indexOf(s) >= 0;
	},

	setLevel: function(n) {
		this._nLevel = n | 0;
	},

	getLevel: function() {
		return this._nLevel;
	},



	setDuration: function(n) {
		if (n === null || n === Infinity) {
			this.setDurationType(this.DURATION_TYPE_FOREVER);
			n = Infinity;
		} else if (n === 0) {
			this.setDurationType(this.DURATION_TYPE_INSTANT);
		} else {
			this.setDurationType(this.DURATION_TYPE_TEMPORARY);
		}
		this._nDuration = n;
	},
	
	getDuration: function() {
		return this._nDuration;
	},
	
	setDurationType: function(n) {
		this._nDurationType = n;
	},
	
	getDurationType: function() {
		return this._nDurationType;
	},
	
	setExpirationTime: function(t) {
		this._nExpirationTime = t;
	},
	
	getExpirationTime: function() {
		return this._nExpirationTime;
	},
	
	
	setSource: function(o) {
		this._oSource = o;
	},
	
	getSource: function() {
		return this._oSource;
	},
	
	setTarget: function(o) {
		this._oTarget = o;
	},

	getTarget: function() {
		return this._oTarget;
	},
	
	/**
	 * Renvoie true si la duration a expiré
	 */
	isExpired: function(nTimeStamp) {
		if (this._bExpired) {
			return true;
		}
		switch (this.getDurationType()) {
			case this.DURATION_TYPE_FOREVER:
				return false;
				
			case this.DURATION_TYPE_INSTANT:
				return this._bExpired = true;
				
			default:
				return this._bExpired = nTimeStamp >= this._nExpirationTime;
		}
	},
	
	dispel: function() {
		this._bExpired = true;
	},
	
	/**
	 * Fonction initialement appelée lors de l'application de leffet
	 */
	cast: function(ep) {
	},
	
	/**
	 * Fonction invoquée a chaque round
	 */
	run: function(ep) {
	},
	
	/**
	 * Fonction invoquée lorsque l'effet prend fin
	 */
	expire: function(ep) {
	},
	
	/**
	 * Fonction invoquée lorsque un nouvel effet est appliqué à la soul
	 * Cette fonction renvoie true ou false pour signifier qu'elle
	 * accepte le nouvel effet ou bien s'il est annulé
	 */
	accept: function() {
		return true;
	}
});
