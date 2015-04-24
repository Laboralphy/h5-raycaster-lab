O2.extendClass('Item', GC.Item, {
	name: '',					// nom affichable
	uname: '',                  // nom affiché tant que l'objet n'est pas identifié
	slot: '',					// slot d'équipement
	type: '',					// type d'objet (wand, dagger, ring...)
	icon: '',					// icone de représentation inventaire
	speed: 0,                   // vitesse de tir en rafale pour une arme
	level: 0,
	// statics properties
	properties: null,			// propriétés de l'objet (-> Effets) 
	effects: null,				// Effets appliqués ne convient pas pour les stackables
	spells: null,
	
	// dynamic properties
	identified: true,			// ne convient pas pour les stack

	__construct: function(sResRef, nStack) {
		__inherited(sResRef);
		if (!(sResRef in ITEMS_DATA)) {
			throw new Error('item blueprint not found: ' + sResRef);
		}
		var oRef = ITEMS_DATA[sResRef];
		this.name = STRINGS._(oRef.name);		// nom affichable
		this.type = oRef.type;					// type d'objet (wand, dagger, ring...)
		this.icon = oRef.icon;					// icone de représentation inventaire
		this.effects = [];						// Effets appliqués
		this.properties = [];
		switch (oRef.type) {
			case 'dagger':
			case 'wand':
				this.model = oRef.model;			// Model affiché à l'écran
				this.speed = oRef.speed;			// Delai entre deux attaques
				this.spells =  oRef.spells;			// Liste des sorts
				this.slot = oRef.slot;				// slote d'équipement
				break;
				
			case 'potion':
			case 'ccc':
				this.properties = oRef.properties;		// propriétés de l'objet (-> Effets) 
				this.stacksize = oRef.stack;			// capacité du stack
				break;
				
				
			case 'earings':
			case 'amulet':
			case 'ring':
				this.properties = oRef.properties;		// propriétés de l'objet (-> Effets) 
				this.slot = oRef.slot;					// slot d'équipement
				break;
				
			case 'misc': 
				this.stacksize = oRef.stack;
				break;
				
		}
		if (nStack !== undefined && !isNaN(nStack) && nStack > 1) {
			this.setStackCount(nStack);
		}
	},
	
	/** 
	 * Compose un tableau avec les effets que véhicule l'objet lorsqu'on l'utilise pour attaquer
	 * @return array
	 */
	getSpellProperties: function() {
		var aProperties = [];
		var i, n, oSpell;
		if (this.spells) {
			n = this.spells.length;
			for (i = 0; i < n; i++) {
				oSpell = SPELLS_DATA[this.spells[i].ref];
				aProperties = aProperties.concat(oSpell.effects);
			}
		}
		return aProperties;
	},
	
	/** 
	 * Compose un tableau avec tous les effets que véhicule l'objet
	 * C'est une fusion des effets porté, et des effets transmis lors d'une attaque
	 * @return array
	 */
	getProperties: function() {
		var aProperties = this.getSpellProperties();
		return aProperties.concat(this.properties);
	},
	
	/**
	 * Renvoie le nom affichable de l'objet
	 * @param nStack int si l'objet est stackable renvoie le nom suivie de cette quantité de stack
	 * @return string
	 */
	getName: function(nStack) {
		if (this.identified) {
			return this.name + this.getStackString(nStack);
		} else {
			return this.uname + this.getStackString(nStack);
		}
	},
	
	/**
	 * Renvoie une chaine de caractère représentant la taille du stack
	 * @param x int optionnel force à utiliser ce nombre plutot que la propriété stackcount
	 * @return string 
	 */
	getStackString: function(x) {
		if (!this.isStackable()) {
			return '';
		}
		if (x !== undefined) {
			return ' x ' + x.toString();
		} else if (this.stackcount) {
			return ' x ' + this.stackcount.toString();
		} else {
			return '';
		}
	},
	
	isEquippable: function() {
		return this.slot !== '';
	}
});
