O2.extendClass('EffectProcessor', GC.EffectProcessor, {

	DAMAGE_FACTOR_PHYSICAL:      6,     // Facteur de dégâts physiques
	DAMAGE_FACTOR_MAGICAL:       6,     // Facteur de dégâts magiques
	DAMAGE_FACTOR_COLD:          6,     // Facteur de dégâts de froid
	DAMAGE_FACTOR_FIRE:          6,     // Facteur de dégâts de feu
	DAMAGE_FACTOR_ELECTRICITY:   6,     // Facteur de dégâts d'électricité
	DAMAGE_FACTOR_TOXIC:         6,     // Facteur de dégâts toxiques
	
	HEAL_FACTOR:                 6,     // Facteur de soin
	ENERGY_FACTOR:               10,    // Facteur d'energie
	VITALITY_FACTOR:             10,    // Facteur de vitalité
	FOOD_FACTOR:                100,    // Facteur de nourriture

	MAX_LEVEL: 63,
	
	BUFF_FACTOR: null,
	VULNER_FACTOR: null,

	DEBUFF_FACTOR: null,
	RESIST_FACTOR: null,

	EFFECT_NULL: 'snullAA',

	EFFECT_TYPE_POTION: 'b',	// effet bénéfique appliqué par une potion (effet non cumulable)
	EFFECT_TYPE_CHARM: 'h',		// effet appliqué par un charme (effet non-cumulable)
	EFFECT_TYPE_MISSILE: 'm',	// effet appliqué à l'impact d'un missile (effet non-cumulable)
	EFFECT_TYPE_ATTACK: 'x',	// effet appliqué à l'impact d'une attaque de contact (effet non-cumulable)

	EFFECT_TYPE_POISON: 'p',	// effet appliqué par un poison (effet cumulable)
	EFFECT_TYPE_CURSE: 'c',		// effet appliqué par une malédiction (effet cumulable)
	EFFECT_TYPE_ITEM: 'i',		// effet appliqué par un objet porté (effet cumulable)
	EFFECT_TYPE_NATURAL: 'n',	// effet naturel (cumulable)
	
	EFFECT_NON_STACKABLE: 'bhmx',
	
	__construct: function() {
		this.buildTables();
	},
	
	buildTables: function() {
		var f1, f2, fLog10 = Math.log(10);

		this.BUFF_FACTOR = [];
		this.VULNER_FACTOR = [];
		this.RESIST_FACTOR = [];
		this.DEBUFF_FACTOR = [];
		
		for (var i = 0; i <= this.MAX_LEVEL; i++) {
			// For BUFF and VULNER factors
			// for info :
			//
			// level 0: 1.0
			// level 1: 1.1
			// level 2: 1.2
			// level 3: 1.3
			// level 4: 1.4
			// level 5: 1.5
			f1 = i * 0.1 + 1;
			
			// For RESIST and DEBUFF factors
			// for info : 
			//
			// level 0: 100%
			// level 1: 85%
			// level 2:	76%
			// level 3: 70%
			// level 4: 65%
			// level 5: 61%
			// ..
			f2 = 1 - (Math.log(i + 1) / (2 * fLog10));
			
			// push values
			this.BUFF_FACTOR.push(f1);
			this.VULNER_FACTOR.push(f1);
			this.RESIST_FACTOR.push(f2);
			this.DEBUFF_FACTOR.push(f2);
		}
	},

	/** 
	 * Permet de calculer l'effet le plus élevé
	 * @param aEffects tableau d'effet
	 * @return int level le plus haut du tableau spécifié
	 */
	getLevelFromEffects: function(aEffects) {
		var n = aEffects.length;
		var nLevel = 0;
		for (var i = 0; i < n; i++) {
			nLevel = Math.max(nLevel, this.getEffectLevel(aEffects[i]));
		}
		return nLevel;
	},

	/** Vérification des fonctions vitales de la créature suite à l'application
	 * de certains effets nocifs ou bénéfiques.
	 * positionne le flag dead en fonction.
	 * @param oCreature créature à vérifier
	 * @return bool true = créature en vie
	 **/
	checkCreatureAlive: function(oCreature) {
		if (oCreature.getAttribute('hp') >= oCreature.getAttribute('vitality')) {
			oCreature.setBaseAttribute('dead', 1);
			return false;
		} else {
			oCreature.setBaseAttribute('dead', 0);
			return true;
		}
	},
	
	/** Renvoie une valeur modifiée par un facteur de resistance ou vulnerabilité 
	 * en fonction d'un différentiel d'attribut
	 * @param oCreature creture sujet
	 * @param nAmount valeur qui doit etre modifiée avant application (dégat généralement)
	 * @param sResAttr nom de l'attribut de résistance
	 * @param sVulAttr nom de l'attribut de vulnerabilité 
	 */
	getResistProcessedValue: function(oCreature, nAmount, sResAttr, sVulAttr) {
		var fResist = 1;
		var nAttr = oCreature.getAttribute(sResAttr) - oCreature.getAttribute(sVulAttr);
		if (nAttr >= 0) {
			fResist = this.RESIST_FACTOR[Math.min(this.MAX_LEVEL, nAttr)];
		} else {
			fResist = this.VULNER_FACTOR[Math.min(this.MAX_LEVEL, -nAttr)];
		}
		if (fResist != 1) {
			nAmount = nAmount * fResist | 0;
		}
		return nAmount;
	},

	/** Renvoie une valeur modifiée par un facteur de buff ou debuff
	 * en fonction d'un différentiel d'attribut
	 * @param oCreature creture sujet
	 * @param nAmount valeur qui doit etre modifiée avant application (bonus)
	 * @param sBuffAttr nom de l'attribut de résistance
	 * @param sDebuffAttr nom de l'attribut de vulnerabilité 
	 */
	getBuffProcessedValue: function(oCreature, nAmount, sBuffAttr, sDebuffAttr) {
		var fBuff = 1;
		var nAttr = oCreature.getAttribute(sBuffAttr);
		if (sDebuffAttr !== undefined) {
			nAttr -= oCreature.getAttribute(sDebuffAttr);
		}
		if (nAttr >= 0) {
			fBuff = this.BUFF_FACTOR[Math.min(this.MAX_LEVEL, nAttr)];
		} else {
			fBuff = this.DEBUFF_FACTOR[Math.min(this.MAX_LEVEL, -nAttr)];
		}
		if (fBuff != 1) {
			nAmount = nAmount * fBuff | 0;
		}
		return nAmount;
	},
	
	
	/** Renvoie une probabilité modifée par deux valeur de chances
	 * une valeur pour et une valeur contre
	 * @param nProb float probabilité initiale (entre 0 et 1)
	 * @param nLuck facteur d'augmentation
	 * @param nJinx facteur de diminution
	 */
	getLuckBalance: function(fProb, nLuck, nJinx) {
		nLuck -= nJinx;
		if (nLuck >= 0) {
			fProb *= this.BUFF_FACTOR[Math.min(this.MAX_LEVEL, nLuck)];
		} else {
			fProb *= this.DEBUFF_FACTOR[Math.min(this.MAX_LEVEL, -nLuck)];
		}
		return fProb;
	},
	
	
	
	/** Endommage les points de vie d'une créature
	 * Les dommages sont caractérisés par un type
	 * La créature tentera de minimiser cette quantité de
	 * dommage grace à la résistance appropriée au type.
	 * @param oCreature créature touchée
	 * @param nAmount quantité de dégâts (valeurs négatives exclues)
	 * @param sAttribute nom de l'attribute de résistance
	 */
	damageCreature: function(oCreature, nAmount, sAttribute) {
		if (oCreature.getAttribute('invulnerable') <= 0) {
			oCreature.modifyAttribute('hp', this.getResistProcessedValue(oCreature, Math.max(0, nAmount), sAttribute, 'vulnerable'));
		}
		// voyons si la créature a clamsé
		this.checkCreatureAlive(oCreature);
	},
	
	/** Diminution du nombre de point de magie d'une créatuire
	 * @param oCreature créature touchée
	 * @param nAmount quantité de dégâts (valeurs négatives exclues)
	 */
	depleteCreatureEnergy: function(oCreature, nAmount) {
		oCreature.modifyAttribute('mp', Math.max(0, nAmount));
	},

	/** Diminution du nombre de point de nourriture d'une créatuire
	 * @param oCreature créature touchée
	 * @param nAmount quantité de dégâts (valeurs négatives exclues)
	 */
	starveCreature: function(oCreature, nAmount) {
		nAmount = Math.max(0, nAmount);
		var nFoodPoints = oCreature.getAttribute('foodp');
		if (nFoodPoints < nAmount) {
			nAmount = nFoodPoints;
		}
		oCreature.modifyAttribute('foodp', -nAmount);
	},
	
	
	/** Soigne la créature
	 * @param oCreature créature touchée
	 * @param nAmount quantité de soins (valeurs négatives exclues)
	 */
	healCreature: function(oCreature, nAmount) {
		oCreature.modifyAttribute('hp', -Math.min(oCreature.getAttribute('hp'), this.getResistProcessedValue(oCreature, Math.max(0, nAmount), 'disease', 'pharma')));
	},
	
	restoreCreatureEnergy: function(oCreature, nAmount) {
		oCreature.modifyAttribute('mp', -this.getResistProcessedValue(oCreature, Math.max(0, nAmount), 'disease', 'pharma'));
		var nMP = oCreature.getAttribute('mp'); 
		if (nMP < 0) {
			oCreature.modifyAttribute('mp', -nMP);
		}
	},

	/** Nourri la créature, ses point de nourriture remontent
	 * les food point peuvent dépasser le niveau max
	 */
	feedCreature: function(oCreature, nAmount) {
		if (oCreature.getAttribute('foodp') < oCreature.getAttribute('foodmax')) {
			oCreature.modifyAttribute('foodp', Math.max(0, nAmount));
		}
	},
	

	/**
	 * Les effets rigoureusement identiques ne sont pas stackables
	 * même durée et même puissance.
	 */
	bestowEffect: function(oCreature, sEffect, nDuration) {
		var sType = this.getEffectType(sEffect);
		if (this.EFFECT_NON_STACKABLE.indexOf(sType) >= 0) {
			var oEffects = oCreature.oEffects;
			var nEffCount = oEffects.length;
			var oEffect;
			for (var iEff = 0; iEff < nEffCount; iEff += 1) {
				oEffect = oEffects[iEff];
				if (oEffect.sEffect == sEffect) {
					this.killEffect(oCreature, oEffect);
					break;
				}
			}
		}
		__inherited(oCreature, sEffect, nDuration);
	},
	
	
	
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	////// EFFECT SELECTORS ////// EFFECT SELECTORS ////// EFFECT SELECTORS //////
	
	// Selecteur de poisons
	selectEffects_poison: function(oEffect) {
		return this.getEffectType(oEffect.sEffect) == this.EFFECT_TYPE_POISON;
	},
	
	// Sélecteur d'affliction magique
	selectEffects_evilCharm: function(oEffect) {
		return this.getEffectType(oEffect.sEffect) == this.EFFECT_TYPE_CHARM && this.getEffectType(oEffect.sEffect).charAt(0) == 'a';
	},
	
	// Sélecteur de malédiction
	selectEffects_curse: function(oEffect) {
		return this.getEffectType(oEffect.sEffect) == this.EFFECT_TYPE_CURSE;
	},

	// SPECIFIC AILMENT SELECTOR : MOVEMENT
	selectEffects_moveAilment: function(oEffect) { ('-ahld-aroo-asnr').indexOf(this.getEffectSubType(oEffect.sEffect)); },
	selectEffects_ahld: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'ahld'; },
	selectEffects_aroo: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'aroo'; },
	selectEffects_asnr: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'asnr'; },
	// SPECIFIC AILMENT SELECTOR : BODY AFFLICTION
	selectEffects_bodyAilment: function(oEffect) {	return ('-avul-awea-aill').indexOf(this.getEffectSubType(oEffect.sEffect)); },
	selectEffects_avul: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'avul'; },
	selectEffects_awea: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'awea'; },
	selectEffects_aill: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'aill'; },
	// SPECIFIC AILMENT SELECTOR : MIND AFFLICTION
	selectEffects_mindAilment: function(oEffect) {	return ('-abld-acnf').indexOf(this.getEffectSubType(oEffect.sEffect)); },
	selectEffects_abld: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'abld'; },
	selectEffects_acnf: function(oEffect) {	return this.getEffectSubType(oEffect.sEffect) == 'acnf'; },
	
	// Sélecteur d'effets temporaires dissipables
	selectEffects_expirable: function(oEffect) {
		return oEffect.bExpirable;
	},
	
	
	
	
	
	
	/**
	 * Filtre les effets de poison pour les annuler en cas d'antidote
	 */
	filterEffect_p: function(oCreature, sEffect) {
		// Recherche d'antidote dans les attributs
		if (oCreature.getAttribute('antidote') > 0) {
			// Annulation de l'effet de poison
			return this.EFFECT_NULL;
		} else {
			return sEffect;
		}
	},
	
	
	
	/**
	 * Ajoute un genstionnaire d'effet
	 * Utilisé par les plugins
	 */
	addEffectManager: function(sEffect, pApply, pRun, pExpire) {
		if (pApply) {
			this['applyEffect_' + sEffect] = pApply;
		}
		if (pRun) {
			this['runEffect_' + sEffect] = pRun;
		}
		if (pExpire) {
			this['expireEffect_' + sEffect] = pExpire;
		}
	},
	


	/** Dégâts physiques.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xphy: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_PHYSICAL, nLevel);
		this.damageCreature(oCreature, nAmount, 'drphysical');
	},

	/** Dégâts magiques non élémentaires.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xmag: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_MAGICAL, nLevel);
		this.damageCreature(oCreature, nAmount, 'drmagical');
	},
	
	/** Dégâts de froid.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xcld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_COLD, nLevel);
		this.damageCreature(oCreature, nAmount, 'drcold');
	},
	
	/** Dégâts de feu.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xfir: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_FIRE, nLevel);
		this.damageCreature(oCreature, nAmount, 'drfire');
	},
	
	/** Dégâts électriques.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xele: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_ELECTRICITY, nLevel);
		this.damageCreature(oCreature, nAmount, 'drelectricity');
	},
	
	/** Dégâts toxiques.
	 * La créature à laquelle s'applique l'effet perd des points de vie
	 */
	applyEffect_xtox: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_TOXIC, nLevel);
		this.damageCreature(oCreature, nAmount, 'drtoxic');
	},
	
	
	/** Magie de mort
	 * Les dégâts de ce type détruisent la cible instantanément si elle
	 * n'est pas immunisée.
	 */
	applyEffect_xdth: function(oCreature, sEffect) {
		if (this.getEffectDuration(sEffect) === 0) {
			this.expireEffect_xdth(oCreature, sEffect);
		}
	},
	
	/** Diminution des point de magie
	 * 
	 */
	applyEffect_xene: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = MathTools.rollDice(this.DAMAGE_FACTOR_MAGICAL, nLevel);
		this.depleteCreatureEnergy(oCreature, nAmount);
	},
	
	/** Diminution des points de nourriture
	 */
	applyEffect_xfdp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = this.FOOD_FACTOR * nLevel;
		this.starveCreature(oCreature, nAmount);
	},
	
	
	
	
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////
	////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT ////// APPLY VULNERABILITY EFFECT //////

	applyEffect_vfir: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drfire', -nLevel);
	},

	applyEffect_vcld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drcold', -nLevel);
	},
	
	applyEffect_vele: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drelectricity', -nLevel);
	},
	
	applyEffect_vtox: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drtoxic', -nLevel);
	},
	
	applyEffect_vphy: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drphysical', -nLevel);
	},
	
	applyEffect_vmag: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drmagical', -nLevel);
	},
	
	
	
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////
	////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS ////// APPLY SPECIAL EFFECTS //////


	
	
	
	
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS ////// APPLY EFFECT AILMENTS //////
	
	/** Snare
	 * Diminution de la vitesse de déplacement
	 */
	applyEffect_asnr: function(oCreature, sEffect) {
		if (oCreature.getAttribute('freedom') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('snared', nLevel);
	},
	
	/** Root
	 * Vitesse de déplacement à zéro
	 */
	applyEffect_aroo: function(oCreature, sEffect) {
		if (oCreature.getAttribute('freedom') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('rooted', nLevel);
	},
	
	/** Vulnerability
	 * Augmentation des dégâts reçus
	 */
	applyEffect_avul: function(oCreature, sEffect) {
		if (oCreature.getAttribute('health') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vulnerable', nLevel);
	},
	
	/** Weakness
	 * Faiblesse : cadence de tir réduite
	 */
	applyEffect_awea: function(oCreature, sEffect) {
		if (oCreature.getAttribute('health') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('power', -nLevel);
	},
	
	/** Maladie 
	 * Réduit l'efficacité des soins
	 */
	applyEffect_aill: function(oCreature, sEffect) {
		if (oCreature.getAttribute('health') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('disease', nLevel);
	},
	
	/** Confusion, la trajectoire des tir est erratique
	 * AI 
	 */
	applyEffect_acnf: function(oCreature, sEffect) {
		if (oCreature.getAttribute('clearmind') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('confused', nLevel);
	},	
	
	/** Cécité, la créature est aveuglée
	 * AI 
	 */
	applyEffect_abld: function(oCreature, sEffect) {
		if (oCreature.getAttribute('clearmind') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('blind', nLevel);
	},
	
	/** Paralysie : la créature n'effectue plus aucune action
	 * AI 
	 */
	applyEffect_ahld: function(oCreature, sEffect) {
		if (oCreature.getAttribute('freedom') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('held', nLevel);
	},
	
	/** Drain de vie
	 * 
	 */
	applyEffect_adhp: function(oCreature, sEffect) {
		if (oCreature.getAttribute('invulnerable') > 0) {
			return;
		}
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vitality', 0 - (nLevel * this.VITALITY_FACTOR));
		this.checkCreatureAlive(oCreature);
	},
	
	/** Malchance
	 * 
	 */
	applyEffect_ajnx: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('luck', -nLevel);
	},

	
	/** Drain de magie
	 * 
	 */
	applyEffect_admp: function(oCreature, sEffect) {
		oCreature.modifyAttribute('energy', -this.getEffectLevel(sEffect) * this.ENERGY_FACTOR);
	},
	
	/** Faim
	 * augmente la consomation de nourriture
	 */
	applyEffect_ahun: function(oCreature, sEffect) {
		oCreature.modifyAttribute('foodc', this.getEffectLevel(sEffect) * this.ENERGY_FACTOR);
	},
	
	
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	////// APPLY RESISTANCE ////// APPLY RESISTANCE ////// APPLY RESISTANCE //////
	
	/** Physical Resistance
	 * Résistance aux dégâts physiques
	 */
	applyEffect_rphy: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drphysical', nLevel);
	},
	
	/** Magical Resistance
	 * Résistance aux dégâts magiques
	 */
	applyEffect_rmag: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drmagical', nLevel);
	},
	
	/** Fire Resistance
	 * Résistance aux dégâts de feu
	 */
	applyEffect_rfir: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drfire', nLevel);
	},
	
	/** Cold Resistance
	 * Résistance aux dégâts de froid
	 */
	applyEffect_rcld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drcold', nLevel);
	},
	
	/** Electgrical Resistance
	 * Résistance aux dégâts electriques
	 */
	applyEffect_rele: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drelectricity', nLevel);
	},
	
	/** Resistance
	 * Résistance aux dégâts toxiques
	 */
	applyEffect_rtox: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drtoxic', nLevel);
	},
	
	/** Resistance
	 * Résistance aux dégâts de mort
	 */
	applyEffect_rdth: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drdeath', nLevel);
	},
	
	
	
	
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	////// APPLY RESTORATION ////// APPLY RESTORATION ////// APPLY RESTORATION //////
	
	/** Soin
	 * Le nombre de point de vie restauré :
	 * 6 + 1d6 par niveau d'effet
	 * (si HEAL_FACTOR à pour valeur 6)  
	 */
	applyEffect_rhea: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = this.HEAL_FACTOR * nLevel;
		this.healCreature(oCreature, nAmount);
	},
	
	/** Antidote
	 * Supprime les effets de poison
	 */
	applyEffect_rant: function(oCreature, sEffect) {
		this.dispellEffects(oCreature, this.selectEffects_poison);
		if (this.getEffectDuration(sEffect)) {
			oCreature.modifyAttribute('antidote', this.getEffectLevel(sEffect));
		}
	},

	/** 
	 * Remede contre les maux du corps
	 * Supprime weakness, illness, vulnerability
	 */
	applyEffect_rbod: function(oCreature, sEffect) {
		this.dispellEffects(oCreature, this.selectEffects_bodyAilment);
		if (this.getEffectDuration(sEffect)) {
			oCreature.modifyAttribute('health', this.getEffectLevel(sEffect));
		}
	},
	
	/** 
	 * Remede contre les maux de l'esprit
	 * Supprime confusion, blindness
	 */
	applyEffect_rmin: function(oCreature, sEffect) {
		this.dispellEffects(oCreature, this.selectEffects_mindAilment);
		if (this.getEffectDuration(sEffect)) {
			oCreature.modifyAttribute('clearmind', this.getEffectLevel(sEffect));
		}
	},
	
	/** 
	 * Remede contre les affliction de déplacement
	 * Supprime snare root et hold
	 */
	applyEffect_rmov: function(oCreature, sEffect) {
		this.dispellEffects(oCreature, this.selectEffects_moveAilment);
		if (this.getEffectDuration(sEffect)) {
			oCreature.modifyAttribute('freedom', this.getEffectLevel(sEffect));
		}
	},
	
	/** Restauration d'energy
	 * 
	 */
	applyEffect_rene: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = this.ENERGY_FACTOR * nLevel;
		this.restoreCreatureEnergy(oCreature, nAmount);
	},		
	
	
	/** Restauration de nourriture
	 * 
	 */
	applyEffect_rfdp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		var nAmount = this.FOOD_FACTOR * nLevel;
		this.feedCreature(oCreature, nAmount);
	},	
	

	
	
	
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	////// APPLY BLESSINGS ////// APPLY BLESSINGS ////// APPLY BLESSINGS //////
	
	/** Pharma 
	 * Augmente l'efficacité des soins
	 */
	applyEffect_bpha: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('pharma', nLevel);
	},
	
	/** 
	 * Haste : augmenter la vitesse de déplacement
	 */
	applyEffect_bhst: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('hasted', nLevel);
	},
	
	/**
	 * Invulnerability : Perte de point de vie impossible
	 */
	applyEffect_binv: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('invulnerable', nLevel);
	},
	
	/**
	 * Power : augmentation de la puissance de feu
	 * 
	 */
	applyEffect_bpow: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('power', nLevel);
	},
	
	/**
	 * Invisibilité
	 */
	applyEffect_bclk: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('invisible', nLevel);
	},
	
	/**
	 * Perception extra sensorielle
	 */
	applyEffect_besp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('esp', nLevel);
	},
	
	/** Gain temporaire de point de vie
	 * 
	 */
	applyEffect_bxhp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vitality', nLevel * this.VITALITY_FACTOR);
	},

	/**
	 * chance
	 */
	applyEffect_blck: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('luck', nLevel);
	},
	
	/**
	 * Energy
	 */
	applyEffect_bxmp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('energy', nLevel * this.ENERGY_FACTOR);
	},
	
	/** Diminution de la consomation de nourriture
	 */
	applyEffect_bsfc: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('foodc', -nLevel);
	},
	
	/** 
	 * Réflexion des missiles encaissé 
	 */
	applyEffect_bref: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('reflect', nLevel);
	},

	
	
	
	
	
	
	
	
	
	
	
	
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////
	////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL ////// APPLY SPECIAL //////

	/** Dispell
	 * Supprime les effets temporaires au hasard
	 * Ne supprime pas d'effets permanents
	 */
	applyEffect_disp: function(oCreature, sEffect) {
		var aEffects = this.selectEffects(oCreature, this.selectEffects_expirable);
		var nLevel = this.getEffectLevel(sEffect);
		var iEffect, oEffToDisp;
		// ne supprime qu'un certain nombre d'effet
		// les effets sont choisis au hasard
		while (nLevel > 0 && aEffects.length > 0) {
			iEffect = MathTools.rnd(0, aEffects.length - 1);
			oEffToDisp = aEffects[iEffect];
			ArrayTools.removeItem(aEffects, i);
			oEffToDisp.expire();
			nLevel--;
		}
	},
	
	
	
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////
	//////APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS ////// APPLY SPELL EFFECTS //////

	applyEffect_sdrn: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vampyre', nLevel);
	},
	
	
	
	
	
	
	
	
	
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES ////// RUN DAMAGES //////
	
	
	/** DoT physiques
	 */
	runEffect_xphy: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drphysical');
	},

	/** DoT magiques
	 */
	runEffect_xmag: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drmagical');
	},
	
	/** DoT fire
	 */
	runEffect_xfir: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drfire');
	},
	
	/** DoT cold
	 */
	runEffect_xcld: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drcold');
	},

	/** DoT elec
	 */
	runEffect_xele: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drelectricity');
	},
	
	/** DoT tox
	 */
	runEffect_xtox: function(oCreature, sEffect) {
		this.damageCreature(oCreature, this.getEffectLevel(sEffect), 'drtoxic');
	},

	/** Dot MP
	 * 
	 */
	runEffect_xene: function(oCreature, sEffect) {
		this.depleteCreatureEnergy(oCreature, this.getEffectLevel(sEffect));
	},	
	
	/** Dot FP
	 * 
	 */
	runEffect_xfdp: function(oCreature, sEffect) {
		this.starveCreature(oCreature, this.getEffectLevel(sEffect));
	},
	
	
	
	
	
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////
	////// RUN RESTORATION ////// RUN RESTORATION ////// RUN RESTORATION //////

	runEffect_rhea: function(oCreature, sEffect) {
		this.healCreature(oCreature, this.getEffectLevel(sEffect));
	},
	
	runEffect_rene: function(oCreature, sEffect) {
		this.restoreCreatureEnergy(oCreature, this.getEffectLevel(sEffect));
	},
	
	runEffect_rfdp: function(oCreature, sEffect) {
		this.feedCreature(oCreature, this.getEffectLevel(sEffect));
	},
	

	
	
	
	
	
	
	
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////
	////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT ////// EXPIRE AILMENT //////

	expireEffect_asnr: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('snared', -nLevel);
	},
	
	expireEffect_aroo: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('rooted', -nLevel);
	},
	
	expireEffect_avul: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vulnerable', -nLevel);
	},
	
	expireEffect_aill: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('disease', -nLevel);
	},
	
	expireEffect_acnf: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('confused', -nLevel);
	},
	
	expireEffect_abld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('blind', -nLevel);
	},
	
	expireEffect_ahld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('held', -nLevel);
	},
	
	expireEffect_awea: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('power', nLevel);
	},
	
	expireEffect_adhp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vitality', nLevel);
	},
	
	expireEffect_admp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('energy', nLevel);
	},

	expireEffect_ahun: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('foodc', -nLevel);
	},
	

	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////
	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////
	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////
	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////
	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////
	////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE ////// EXPIRE RESISTANCE //////

	expireEffect_rphy: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drphysical', -nLevel);
	},
	
	expireEffect_rmag: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drmagical', -nLevel);
	},
	
	expireEffect_rfir: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drfire', -nLevel);
	},
	
	expireEffect_rcld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drcold', -nLevel);
	},
	
	expireEffect_rele: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drelectricity', -nLevel);
	},
	
	expireEffect_rtox: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drtoxic', -nLevel);
	},
	
	exprireEffect_rdth: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drdeath', -nLevel);
	},
	
	
	
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS ////// EXPIRE BLESSINGS //////
	
	expireEffect_bpha: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('pharma', -nLevel);
	},
	
	expireEffect_bhst: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('hasted', -nLevel);
	},
	
	expireEffect_binv: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('invulnerable', -nLevel);
	},
	
	expireEffect_bpow: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('power', -nLevel);
	},
	
	expireEffect_bclk: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('invisible', -nLevel);
	},
	
	expireEffect_besp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('esp', -nLevel);
	},
	
	expireEffect_bxhp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vitality', 0 - (nLevel * this.VITALITY_FACTOR));
		this.checkCreatureAlive(oCreature);
	},
	
	expireEffect_blck: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('luck', -nLevel);
	},

	expireEffect_bxmp: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('energy', 0 - (nLevel * this.ENERGY_FACTOR));
	},
	
	expireEffect_bsfc: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('foodc', nLevel);
	},
	
	expireEffect_bref: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('reflect', -nLevel);
	},

	
	
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	////// EXPIRE RESTORATION ////// EXPIRE RESTORATION ////// EXPIRE RESTORATION //////
	
	expireEffect_rant: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('antidote', -nLevel);
	},
	
	exprireEffect_rbod: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('health', -nLevel);
	},
	
	exprireEffect_rmin: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('clearmind', -nLevel);
	},
	
	exprireEffect_rmov: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('freedom', -nLevel);
	},
	
	
	
	
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////
	////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS ////// DEGÂTS //////

	expireEffect_xdth: function(oCreature, sEffect) {
		this.damageCreature(oCreature, oCreature.getAttribute('vitality'), 'drdeath');
	},
	
	
	////// EXPIRE VULNERABILITY EFFECTS //////
	expireEffect_vfir: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drfire', nLevel);
	},

	expireEffect_vcld: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drcold', nLevel);
	},
	
	expireEffect_vele: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drelectricity', nLevel);
	},
	
	expireEffect_vtox: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drtoxic', nLevel);
	},
	
	expireEffect_vphy: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drphysical', nLevel);
	},
	
	expireEffect_vmag: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('drmagical', nLevel);
	},
	
	

	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////
	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////
	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////
	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////
	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////
	//////EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS ////// EXPIRE SPELL EFFECTS //////

	expireEffect_sdrn: function(oCreature, sEffect) {
		var nLevel = this.getEffectLevel(sEffect);
		oCreature.modifyAttribute('vampyre', -nLevel);
	}
});
