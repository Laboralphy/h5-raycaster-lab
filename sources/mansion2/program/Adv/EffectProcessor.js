/**
 * @class ADV.EffectProcessor
 */
O2.createClass('ADV.EffectProcessor', {
	
	
	__construct: function() {
		this._aEffects = null;
		this._nTime = 0;
		this.reset();
	},

	/**
	 * L'effet doit etre supprimé de la target
	 */
	doRemoveEffect: function(oEffect) {
		this.trigger('effectremoved', oEffect);
	},
	
	/**
	 * L'effet doit etre appliqué sur la Target de l'effet
	 */
	doAddEffect: function(oEffect) {
		this.trigger('effectadded', oEffect);
	},
	
	/**
	 * Applique un effet
	 * l'effet doit etre renseigné au niveau de la cible et de la source
	 * et tous le reste
	 */
	applyEffect: function(oEffect) {
		if (oEffect.accept(this)) {
			if (oEffect.getDurationType() >= 1) {
				oEffect.setExpirationTime(this._nTime + oEffect.getDuration());
				this._aEffects.push(oEffect);
			}
			this.doAddEffect(oEffect);
			oEffect.cast(this);
			return true;
		} else {
			this.trigger('effectrejected', oEffect);
			return false;
		}
	},
	
	/**
	 * Joue l'expiration d'un effet
	 * @param e Effet
	 */
	expireEffect: function(e) {
		if (e._bTerm) {
			return;
		}
		e._bTerm = true;
		e.expire(this);
		this.doRemoveEffect(e);
	},
	
	/**
	 * Suppression de tous les effets
	 */
	reset: function() {
		this._aEffects = [];
		this._nTime = 0;
	},
	
	/**
	 * Elimine immédiatement tous les effets qui ont expiré
	 * utilise expireEffect pour que l'effet se termine proprement
	 */
	removeDeadEffects: function() {
		var nTime = this._nTime;
		this._aEffects = this._aEffects.filter(function(e) {
			if (e.isExpired(nTime)) {
				this.expireEffect(e);
				return false;
			} else {
				return true;
			}
		}, this);
	},
	
	/**
	 * Elimine les effets d'une entité qui va etre détruite,
	 * Ainsi que ceux d'une entité dont la source est l'entité qui va être détruite
	 * de manière a ce que l'expiration de ces effets ne se fasse pas alors que l'entité target est détruite
	 */
	removeEffectsFromEntity: function(oTarget) {
		this._aEffects = this._aEffects.filter(function(e) {
			if (e.getTarget() == oTarget || e.getSource() == oTarget) {
				this.expireEffect(e);
				return false;
			} else {
				return true;
			}
		}, this);
	},

	/**
	 * Joue periodiquement la methode run de chaque effet
	 * Elimine les effets qui ont expiré
	 */
	processEffects: function() {
		++this._nTime;
		this._aEffects.forEach(function(e) {
			e.run(this);
		}, this);
		this.removeDeadEffects();
	},
	
	selectEffects: function(p) {
		return this._aEffects.filter(p);
	}
});

O2.mixin(ADV.EffectProcessor, O876.Mixin.Events);
