/** Effect Processor gère les effets appliqués aux créatures.
 * 
 */
O2.createClass('GC.EffectProcessor', {
	nTime: 0, // Nombre de cycles écoulés

	BASE64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    //       0    5    10   15   20   25   30   35   40   45   50   55   60
	
	/** 
	 * TSSSSLD
	 * T: type
	 * S: sous-type
	 * L: niveau
	 * D: durée 
	 */
	getEffectType: function(sEffect) {
		return sEffect.charAt(0);
	},
	
	getEffectSubType: function(sEffect) {
		return sEffect.substr(1, 4);
	},
	
	/** Renvoie le niveau de l'effet 0-63
	 * Renvoie -1 en cas de problème de lecture (effet invalide)
	 * @param sEffect Code de l'effet
	 * @return int
	 */
	getEffectLevel: function(sEffect) {
		return this.BASE64.indexOf(sEffect.charAt(5));
	},
	
	getEffectDuration: function(sEffect) {
		return this.BASE64.indexOf(sEffect.charAt(6));
	},

	setEffectLevel: function(sEffect, nLevel) {
		return sEffect.substr(0, 5) + this.BASE64.charAt(nLevel) + sEffect.charAt(6);
	},

	setEffectDuration: function(sEffect, nDuration) {
		return sEffect.substr(0, 6) + this.BASE64.charAt(nDuration);
	},

	makeEffectStr: function(sType, sSubType, nLevel, nDuration) {
		return sType + sSubType + this.BASE64.charAt(nLevel) + this.BASE64.charAt(nDuration);
	},
	
	setTime: function(nTime) {
		this.nTime = nTime;
	},

	// Détermine quels sont les effets qui expirent
	// exécute éventuellement une methode à l'expiration des effets.
	processEffects: function(oCreature) {
		var oEffect;
		var sMeth;
		var sSubType;
		var i = oCreature.oEffects.length - 1;
		while (i >= 0) {
			oEffect = oCreature.oEffects[i];
			sSubType = this.getEffectSubType(oEffect.sEffect);
			sMeth = 'runEffect_' + sSubType;
			if (sMeth in this) {
				this[sMeth](oCreature, oEffect.sEffect);
			}
			if (oEffect.isExpired(this.nTime)) {
				sMeth = 'expireEffect_' + sSubType;
				if (sMeth in this) {
					this[sMeth](oCreature, oEffect.sEffect);
				}
				oCreature.oEffects.splice(i, 1);
			}
			i--;
		}
	},
	
	
	/** 
	 * Supprime immédiatement les effets expirés
	 * 
	 */
	removeExpiredEffects: function(oCreature) {
		var oEffect;
		var i = oCreature.oEffects.length - 1;
		while (i >= 0) {
			oEffect = oCreature.oEffects[i--];
			if (oEffect.hasExpired()) {
				this.killEffect(oCreature, oEffect);
			}
		}
	},
	
	/** 
	 * Expiration immediate d'un effet
	 */
	killEffect: function(oCreature, oEffect) {
		var sMeth;
		var sSubType = this.getEffectSubType(oEffect.sEffect);
		sMeth = 'expireEffect_' + sSubType;
		if (sMeth in this) {
			this[sMeth](oCreature, oEffect.sEffect);
		}
		oCreature.oEffects.splice(oCreature.oEffects.indexOf(oEffect), 1);
	},


	/** Application d'un effet sur une créature.
	 * L'effet est soumis aux attributs 
	 * @param oCreature creature sur laquelle s'applique l'effet
	 * @param sEffect nouvel effet à appliquer
	 * @param nLevelBonus bonus de niveau
	 */
	applyEffect: function(oCreature, sEffect) {
		var sEff2, sAttr, sMeth;
		// Passe 1 : Filtrer par type
		sAttr = this.getEffectType(sEffect);
		sMeth = 'filterEffect_' + sAttr;
		if (sMeth in this) {
			sEff2 = this[sMeth](oCreature, sEffect);
			if (sEff2) {
				sEffect = sEff2;
			}
		}
		// Passe 2 : Traiter le sous type
		sAttr = this.getEffectSubType(sEffect);
		sMeth = 'applyEffect_' + sAttr;
		if (sMeth in this) {
			sEff2 = this[sMeth](oCreature, sEffect);
			if (sEff2) {
				sEffect = sEff2;
			}
		}
		var nDur = this.getEffectDuration(sEffect);
		if (nDur) { 
			return this.bestowEffect(oCreature, sEffect, nDur);
		}
		return null;
	},
	
	/** Installe temporaire l'effet sur la créature
	 * Si la duration de l'effet est nulle, l'effet n'est pas installé
	 * @param oCrature Creature 
	 * @param sEffect string
	 * @param nDuration durée en nombre de cycle 
	 */
	bestowEffect: function(oCreature, sEffect, nDuration) {
		var oEffect = new GC.Effect();
		switch (nDuration) {
			case 63:
				oEffect.bExpirable = false;
				break;
				
			case 62:
				oEffect.setTimeOut(180 + this.nTime);
				break;
				
			case 61:
				oEffect.setTimeOut(120 + this.nTime);
				break;
				
			default:
				oEffect.setTimeOut(nDuration + this.nTime);
				break;
		}
		oEffect.sEffect = sEffect;
		oCreature.oEffects.push(oEffect);
		return oEffect;
	},
	
	dispellEffect: function(oCreature, nEffect) {
		oCreature.oEffects[nEffect].expire();
	},
	
	
	/** Selectionne les effets selon le critère fournis
	 * 
	 */
	selectEffects: function(oCreature, f) {
		var aEffects = [];
		for (var i = 0; i < oCreature.oEffects.length; i++) {
			if (f.apply(this, [oCreature.oEffects[i]])) {
				aEffects.push(oCreature.oEffects[i]);
			}
		}
		return aEffects;
	},
	
	
	
	// Détruits les effets filtrés par la fonction
	dispellEffects: function(oCreature, f) {
		for (var i = 0; i < oCreature.oEffects.length; i++) {
			if (f.apply(this, [oCreature.oEffects[i]])) {
				oCreature.oEffects[i].expire();
			}
		}
	},
	
	// Selecteur d'effet : tous les effets
	selectorAll: function(oEffect) { 
		return true;
	},
	
	// Selecteur d'effet expiré
	selectorExpired: function(oEffect) {
		return oEffect.isExpired(this.nTime);
	}

});
