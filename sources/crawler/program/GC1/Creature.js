O2.createClass('GC.Creature', {
	oBaseAttributes: null,		// Base attributes
	oAttributes: null,			// Attributes
	oEffects: null,				// Horde of effects
	oEffectProcessor: null,		// instance of effect processor
	onAttributeChanged: null,	// WeirEvent of attribute changed
	oExtraData: null,			// simple object
	
	__construct: function() {
		this.oExtraData = {};
		this.oBaseAttributes = {};
		this.oAttributes = {};
		// goodbye horde
		// this.oEffects = new O876.Horde();
		this.oEffects = [];
	},
	
	/**
	 * défini le processeur d"effets pour traiter les effets contenus dans oEffects
	 * @param ep Processeur d'Effets (EffectProcessor)
	 */
	setEffectProcessor: function(ep) {
		this.oEffectProcessor = ep;
	},
	
	/**
	 * Procède au traitement des effets
	 * @param nClock timestamps utile au traitement des effets
	 */
	processEffects: function() {
		if (this.oEffectProcessor) {
			this.oEffectProcessor.processEffects(this);
		} else {
			throw new Error('effect processor is not defined');
		}
	},
	
	/** Retourne la valeur d'un Attribute modifié par son éventuel bonus
	 * @param sAttribute nom de l'attribut
	 * @return int renvoie 0 si l'attribut n'existe pas
	 */
	getAttribute: function(sAttribute) {
		var nBonus;
		if (sAttribute in this.oAttributes) {
			nBonus = this.oAttributes[sAttribute];
		} else {
			nBonus = 0;
		}
		if (sAttribute in this.oBaseAttributes) {
			return this.oBaseAttributes[sAttribute] + nBonus;
		} else {
			return nBonus;
		}
	},
	
	/**
	 * Retourne un objet associant les attributs et leurs valeur ainsi que leur bonus
	 * @return object  attr -> [base, bonus]
	 */
	getAttributes: function() {
		var sAttr = '', oResult = {};
		// récup les clés
		for (sAttr in this.oBaseAttributes) {
			oResult[sAttr] = [0, 0];
		}
		for (sAttr in this.oAttributes) {
			if (!(sAttr in oResult)) {
				oResult[sAttr] = [0, 0];
			}
		}
		// Remplir les valeurs
		for (sAttr in oResult) {
			if (sAttr in this.oBaseAttributes) {
				oResult[sAttr][0] = this.oBaseAttributes[sAttr];
			}
			if (sAttr in this.oAttributes) {
				oResult[sAttr][1] = this.oAttributes[sAttr];
			}
		}
		return oResult;
	},
	
	/** 
	 * Obtenir la valeur de base d'un attribut sans modificateur
	 * @param sAttribute nom de l'attribut
	 * @return int
	 */
	getBaseAttribute: function(sAttribute) {
		if (sAttribute in this.oBaseAttributes) {
			return this.oBaseAttributes[sAttribute];
		} else {
			return 0;
		}
	},

	/** Modifier la valeur d'un Attribute
	 * @param sAttribute nom de l'attribut
	 * @param nValue valeur de l'attribut
	 */
	setBaseAttribute: function(sAttribute, nValue) {
		var nPreviousValue = 0;
		var bAttrPresent = sAttribute in this.oBaseAttributes;
		if (bAttrPresent) {
			nPreviousValue = this.oBaseAttributes[sAttribute];
		}
		if (nValue) {
			this.oBaseAttributes[sAttribute] = nValue;
		} else {
			if (bAttrPresent) {
				delete this.oBaseAttributes[sAttribute];
			}
		}
		this.doAttributeChanged(sAttribute, nValue, nPreviousValue);
	},
	
	/** Modifier la valeur bonus d'un Attribute (données par les effets)
	 * @param sAttribute nom de l'attribut
	 * @param nValue valeur de l'attribut
	 */
	modifyAttribute: function(sAttribute, nValue) {
		var nNewValue = 0;
		var nPreviousValue = 0;
		if (nValue === 0) {
			return;
		}
		if (sAttribute in this.oAttributes) {
			nPreviousValue = this.oAttributes[sAttribute];
			nNewValue = nPreviousValue + nValue;
			if (nNewValue === 0) {
				delete this.oAttributes[sAttribute];
			} else {
				this.oAttributes[sAttribute] = nNewValue;
			}
		} else {
			this.oAttributes[sAttribute] = nNewValue = nValue;
		}
		this.doAttributeChanged(sAttribute, nNewValue, nPreviousValue);
	},
	
	setOnAttributeChanged: function(oFunc) {
		this.onAttributeChanged = oFunc;
		var sAttr = '', oAttr = {};
		for (sAttr in this.oBaseAttributes) {
			oAttr[sAttr] = true;
		}
		for (sAttr in this.oAttributes) {
			oAttr[sAttr] = true;
		}
		for (sAttr in oAttr) {
			this.doAttributeChanged(sAttr, this.getAttribute(sAttr), 0);
		}
	},
	
	doAttributeChanged: function(sAttribute, nNewValue, nPreviousValue) {
		if (this.onAttributeChanged && nNewValue != nPreviousValue) {
			this.onAttributeChanged(this, sAttribute, nNewValue, nPreviousValue);
		}
	}
});
