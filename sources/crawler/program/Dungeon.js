/**
 * Classe de controle du déroulement d'une parie
 */

O2.createClass('Dungeon', {
	
	// Taille initiale de l'inventaire du joueur
	INVENTORY_SIZE_PLAYER: 32,

	// Taille initiale de l'inventaire d'une créature
	INVENTORY_SIZE_CREATURE: 4,
	
	
	
	// Données persistante du jeu
        // Voir le constructeur pour le détail de la structure
	oData: null,

	// Pointer vers la zone actuellement explorée par le joueur
	oArea: null,  

	// Objet de stockage des définitions de projectiles
	oWeapons: null, 

	// objet Effect Processor, traite les cycle de vie des effet appliqués aux créatures
	oEffectProcessor: null,
	
	// Point de départ après une resturation de sauvegarde
	oSpawnPoint: null,
	
	//Equipement de départ
	aStartingStuff: null,
	
	


	/** 
	 * Constructeur de la classe
	 */
	__construct: function() {
		this.oWeapons = {};
		this.resetData();
		this.oData.player.creature = this.setupPlayerCreature(this.newCreature(1));
		this.oSpawnPoint = {
			x: 0,
			y: 0,
			angle: 0
		};
	},
	
	/** 
	 * Remise à zero des données du monde
	 * (avant restauration de sauvegarde)
	 */
	resetData: function() {
		this.oData = {
			player: {
				// position
				location: { 
					area: '',
					floor: 0,
					startpoint: 0
				},
				// Trousseau
				// Un trousseau de clé par donjon et par niveau
				// Les clés génériques sont stockées dans l'élément "generic"
				// Les quatre clés sont combinée dans un masque binaire
				keys: {
					generic: 0,
					special: {} 
				},
				// Creature
				creature: null
			},
			world: { // contient des tableaux d'entiers
			},
			hordes: { // contient des GC.Creatures
			},
			objects: { // contient des définition d'objets				
			},
			opendoors: { // contient la liste des portes automatiques ouvertes
			},
			drops: {
			}
		};
		this.oEffectProcessor = new EffectProcessor();
	},
	
	
	/** 
	 * Instancie une nouvelle créature et son inventaire.
	 * @param nLevel niveau de la créature : influe sur les statistiques générées
	 * @return GC.Creature
	 */
	newCreature: function(nLevel) {
		var oCreature = new GC.Creature();
		oCreature.setEffectProcessor(this.oEffectProcessor);
		if (nLevel === undefined) {
			nLevel = 1;
		}
		oCreature.oExtraData = {
			retrigger: 0,  // dernier time de mise à feu
			inventory: new GC.Inventory(),
			level: nLevel,
			magic: {
				cooldown: {},
				book: ['DrainLife', 'Teleport', 'Knock', 'DeathSpell', 'MagicMapping', 'SummonFood', 'Reflect', 'Light', 'TimeStop']
			}
		};
		return oCreature;
	},
	
	setupPlayerCreature: function(oCreature) {
		var c = oCreature;
		var i = c.oExtraData.inventory;
		c.setBaseAttribute('vitality', 100);
		c.setBaseAttribute('energy', 100);
		c.setBaseAttribute('speed', 160);
		c.setBaseAttribute('foodmax', 1000);
		c.setBaseAttribute('foodc',   10);
		c.modifyAttribute('foodp', 1000);
		i.setSize(this.INVENTORY_SIZE_PLAYER);
		i.defineEquipSlot('hand');
		i.defineEquipSlot('neck');
		i.defineEquipSlot('finger');
		i.defineEquipSlot('ears');
		this.aStartingStuff = [
			'wand_yce_1', // will be equipped
			'dag_steel',
			'pot_heal_3',
			'pot_heal_3',
			'pot_heal_3',
			'pot_ether_3',
			'pot_ether_3',
			'pot_ether_3',
			'ccc_herb0',
			'ccc_herb1',
			'ccc_h2o',
			'ccc_vegs',
			'ccc_meat'
		];
		var oItem = null;
		for (var iStuff = 0; iStuff < this.aStartingStuff.length; iStuff++) {
			oItem = new Item(this.aStartingStuff[iStuff]);
			this.pickupItem(c, oItem);
			if (oItem.slot && i.oEquipSlots[oItem.slot] === null) {
				this.equipItem(c, oItem);
			}
		}
		c.oExtraData.craft = ['pot_heal_1', 'pot_ether_1', 'ccc_meal']; 
		return oCreature;
	},
	
	learnCraft: function(oCreature, sCraftRecipe) {
		if (oCreature.oExtraData.craft.indexOf(sCraftRecipe) < 0) {
			oCreature.oExtraData.craft.push(sCraftRecipe);
		}
	},
	
	/** 
	 * Renvoie le niveau d'un objet (le niveau du plus puissant effet)
	 */
	getItemLevel: function(oItem) {
		var aProperties = oItem.getProperties();
		return this.oEffectProcessor.getLevelFromEffects(aProperties);
	},
	
	setupMobCreature: function(oCreature, oMobile) {
		// Arme
		var sWeapon = oMobile.getData('weapon');
		var oWeapon = new Item(sWeapon);

		// Définition inventaire
		var oInv = oCreature.oExtraData.inventory;
		oInv.setSize(this.INVENTORY_SIZE_CREATURE);
		oInv.defineEquipSlot('hand');
		oInv.addItem(oWeapon);
		oInv.equipItem(oWeapon, 'hand');


		var nLevel = oCreature.oExtraData.level;
		
		// propriété de la creature
		var aProp = oMobile.getData('properties');
		if (aProp) {
			var nPropCount = aProp.length;
			var sProp;
			var ep = this.oEffectProcessor;
			for (var iProp = 0; iProp < nPropCount; iProp++) {
				sProp = aProp[iProp];
				sProp = ep.setEffectLevel(sProp, ep.getEffectLevel(sProp) + nLevel);
				this.oEffectProcessor.applyEffect(oCreature, sProp, null);
			}
		}
		
		// traitement des flags
		var iFlag;
		var sFlags = oMobile.getData('flags');
		for (iFlag = 0; iFlag < sFlags.length; iFlag++) {
			switch (sFlags[iFlag]) {
				case 'B': // boss
					oCreature.setBaseAttribute('f_boss', 1);
					break;
			}
		}
		
		// leveled attributes
		oCreature.setBaseAttribute('vitality', nLevel * oMobile.getData('vitality'));
		oCreature.setBaseAttribute('power', nLevel * oMobile.getData('power'));
		// attributes
		oCreature.setBaseAttribute('speed', oMobile.getData('speed'));
		// default attributes
		oCreature.setBaseAttribute('hp', 0);
		return oCreature;
	},
	
	
	
	
	
	/** 
	 * Copie les données de la map dans un tableau associatif permettant de sauvegarder l'état d'un labyrinthe
	 * après l'avoir quitté et de restaurer son état lorsque le joueur y revient faire un tour.
	 * @param aMap carte de la zone
	 */
	defineArea: function(aMap) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		this.oArea = this.oData.world[sArea][nFloor] = aMap;
	},
	
	/**
	 * renvoie un bloc de la zone actuellement visitée.
	 * c'est une des constante LABY.BLOCK_* qui est renvoyée
	 * contrairement à la fonction de l'engin getMapXYPhysical qui renvoie un
	 * code de mécanisme (1 pour mur, 8 pour porte de type double battants etc...)
	 * @param absice coordonnée du bloc
	 * @param ordonnée du bloc
	 * @return int Ce que contient le bloc : LABY.BLOCK_*
	 */
	getAreaBlockProperty: function(x, y) {
		return this.oArea[y][x];
	},
	
	/**
	 * Défini la propriété d'un bloc de la zone actuellement visitée.
	 * @param absice coordonnée du bloc
	 * @param ordonnée du bloc
	 * @param nProperty int nouvelle propriété du bloc
	 */
	setAreaBlockProperty: function(x, y, nProperty) {
		this.oArea[y][x] = nProperty;
	},
	
	/** 
	 * Renvoi une référence à la zone actuelle.
	 * @return array
	 */
	getArea: function() {
		return this.oArea;
	},
	
	/** 
	 * Retourne la horde de créature du niveau actuellement exploré
	 * @return tableau of creature
	 */
	getHorde: function() {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.hordes)) {
			return null;
		}
		if (this.oData.hordes[sArea][nFloor] === undefined) {
			return null;
		}
		return this.oData.hordes[sArea][nFloor];
	},

	/** 
	 * Défini la horde de créature du niveau actuellement exploré
	 * @param h tableau of creature
	 */
	setHorde: function(h) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.hordes)) {
			this.oData.hordes[sArea] = [];
		}
		this.oData.hordes[sArea][nFloor] = h;
	},
	
	
	/** 
	 * Renvoie la définition des objets d'un niveau
	 * @return array of objects
	 */
	getObjects: function() {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.objects)) {
			this.oData.objects[sArea] = [];
		}
		return this.oData.objects[sArea][nFloor];
	},
	
	setObjects: function(o) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.objects)) {
			this.oData.objects[sArea] = [];
		}
		this.oData.objects[sArea][nFloor] = o;
	},
	
	getOpenDoors: function() {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.opendoors)) {
			this.oData.opendoors[sArea] = [];
		}
		if (this.oData.opendoors[sArea][nFloor] === undefined) {
			this.oData.opendoors[sArea][nFloor] = [];
		}
		return this.oData.opendoors[sArea][nFloor];
	},
	
	setOpenDoors: function(oRegister) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.opendoors)) {
			this.oData.opendoors[sArea] = [];
		}
		this.oData.opendoors[sArea][nFloor] = oRegister;
	},
	
	
	
	////// DROPPED OBJECTS ON THE FLOOR //////
	////// DROPPED OBJECTS ON THE FLOOR //////
	////// DROPPED OBJECTS ON THE FLOOR //////
	////// DROPPED OBJECTS ON THE FLOOR //////
	////// DROPPED OBJECTS ON THE FLOOR //////
	////// DROPPED OBJECTS ON THE FLOOR //////
	
	/**
	 * Renvoie la liste des objets largués sur le sol à la position spécifiée
	 * @param x position 
	 * @param y position
	 * @return object
	 */
	getDropStack: function(x, y) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.drops)) {
			this.oData.drops[sArea] = [];
		}
		if (this.oData.drops[sArea][nFloor] === undefined) {
			this.oData.drops[sArea][nFloor] = Marker.create();
		}
		return Marker.getMarkXY(this.oData.drops[sArea][nFloor], x, y);
	},
	
	/** Renvoie toutes les drop stack du niveau pour une sauvegarde
	 * @return gros objet
	 */
	getDropStacks: function() {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.drops)) {
			this.oData.drops[sArea] = [];
		}
		if (this.oData.drops[sArea][nFloor] === undefined) {
			this.oData.drops[sArea][nFloor] = [];
		}
		return this.oData.drops[sArea][nFloor];
	},
	
	setDropStacks: function(oData) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.drops)) {
			this.oData.drops[sArea] = [];
		}
		this.oData.drops[sArea][nFloor] = oData;
	},
	
	/** renvoie true s'il y a une drop stack à l'endroit spécifié
	 * @param x position
	 * @param y position
	 * @return bool
	 */
	isDropStack: function(x, y) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.drops)) {
			return false;
		}
		if (this.oData.drops[sArea][nFloor] === undefined) {
			return false;
		}
		return Marker.isMarked(this.oData.drops[sArea][nFloor], x, y);
	},
	
	
	/** 
	 * Lache un objet à terre à la case spécifiée
	 * @param x position 
	 * @param y position
	 * @param oItem object à lacher
	 */
	addDrop: function(x, y, oItem) {
		if (typeof oItem == 'string') {
			oItem = new Item(oItem);
		}
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		var oDrops = this.getDropStack(x, y);
		if (!oDrops) {
			oDrops = [];
			Marker.markXY(this.oData.drops[sArea][nFloor], x, y, oDrops);
		}
		oDrops.push(oItem);
	},
	
	/** Permet de savoir si on est sur une case ou ya un drop
	 * @param x
	 * @param y
	 * @return object
	 */
	peekDrop: function(x, y) {
		var aDrops = this.getDropStack(x, y);
		if (!aDrops) {
			return null;
		}
		if (aDrops.length) {
			return aDrops[0];
		}
		return null;
	},
	
	/**
	 * La créature rammasse un objet de la pile (celui du sommet)
	 * renvoie true l'objet à été rammassé, false si l'inventaire de la creature est plein
	 * @return item récupéré
	 */
	pickupDrop: function(oCreature, x, y) {
		var aDrops = this.getDropStack(x, y);
		if (!aDrops) {
			return null;
		}
		if (aDrops.length) {
			var oItem = aDrops[0];
			if (this.pickupItem(oCreature, oItem)) {
				aDrops.shift();
				return oItem;
			}
		}
		return null;
	},
	
	
	
	
	
	
	
	
	
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////
	////// DROPPED OBJECTS INSIDE CHEST (or walls) //////

	
	
	
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////
	////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS ////// EVENTS //////

	
	
	
	
	
	
	
	
	
	
	
	

	
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////
	////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION ////// LOCATION //////

	/** 
	 * Enregistre la nouvelle position du joueur.
	 * Une zone se compose de plusieur niveau (de 0 à N)
	 * @param sArea nom de la zone
	 * @param nFloor numero du niveau de la zone
	 * @param bExit le joueur se place à la sortie du laby plutot qu'à l'entrée
	 */  
	setPlayerLocation: function(sArea, nFloor, nStartPoint) {
		this.oData.player.location.area = sArea;
		this.oData.player.location.floor = nFloor;
		this.oData.player.location.startpoint = nStartPoint;
		if (!(sArea in this.oData.world)) {
			this.oData.world[sArea] = [];
		}
		if (nFloor < this.oData.world[sArea].length && nFloor >= 0) {
			this.oArea = this.oData.world[sArea][nFloor];
		} else {
			this.oArea = null;
		}
	},
	
	/**
	 * Enregistre les coordonnées de départ du joueur
	 * Ces coordonnées sont lues lors du chargement du niveau pour
	 * placer le joueur sur la carte en cas de restauration d'une
	 * sauvegarde
	 * @param x float 
	 * @param y float
	 * @param fAngle float
	 */
	setPlayerSpawnPoint: function(x, y, fAngle) {
		this.oSpawnPoint.x = x;
		this.oSpawnPoint.y = y;
		this.oSpawnPoint.angle = fAngle;
	},

	/** 
	 * Renvoie le point de spawn préalablement enregistré avec
	 * setPlayerSpawnPoint()
	 * Le spawnpoint est exploité si on entre dans le niveau
	 * par l'entrée 0
	 * @return object {x y angle}
	 */
	getPlayerSpawnPoint: function() {
		return this.oSpawnPoint;
	},

	/** 
	 * Renvoie le nom de la zone dans laquelle se trouve le joueur
	 * @return str nom de la zone
	 */
	getPlayerLocationArea: function() {
		return this.oData.player.location.area;
	},

	/** Renvoie le numero du floor dans lequel se trouve le joueur
	 * @return int numero du floor
	 */
	getPlayerLocationFloor: function() {
		return this.oData.player.location.floor;
	},
	
	/** Renvoie le numero du startpoint sur lequel apparait le joueur
	 * 0: debut du niveau
	 * 1: fin du niveau
	 * 2: premier point d'apparition spécial
	 * 3: second point d'apparition spécial
	 * 
	 * @return int numero du startpoint
	 */
	getPlayerLocationStartPoint: function() {
		return this.oData.player.location.startpoint;
	},
	
	
	
	
	
	
	
	
	
	
	
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////
	////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS ////// ITEMS //////

	/**
	 * Le joueur vient de ramasser un item : enregistrement dans l'inventaire
	 * @param oItem Objet
	 */
	pickupItem: function(oCreature, oItem) {
		return this.getCreatureInventory(oCreature).addItem(oItem);
	},

	/**
	 * La creature vient de s'equipper d'un objet
	 * @param oItem Objet
	 */
	equipItem: function(oCreature, oItem) {
		var iEff, nEffCount, oEffect;
		var oRemovedItem = this.getCreatureInventory(oCreature).equipItem(oItem, oItem.slot);
		if (oRemovedItem) {
			// supprimer les effet de cet objet
			nEffCount = oRemovedItem.effects.length;
			for (iEff = 0; iEff < nEffCount; iEff++) {
				oRemovedItem.effects[iEff].expire();
			}
			oRemovedItem.effects = [];
			// déclenche le processuer d'effet pour virer les effets expirés par
			// le changement d'equipement 
			this.oEffectProcessor.removeExpiredEffects(oCreature);
		}
		if (oItem) {
			// ajouter les effets du nouvel objet
			if (oItem.properties) {
				nEffCount = oItem.properties.length;
				for (iEff = 0; iEff < nEffCount; iEff++) {
					oEffect = this.oEffectProcessor.applyEffect(oCreature, oItem.properties[iEff], null);
					if (oEffect) {
						oItem.effects.push(oEffect);
					}
				}
			}
		}
	},
	

	/**
	 * La creature vient d'abandonner un objet
	 * @param oItem Objet
	 */
	dropItem: function(oCreature, oItem) {
		this.getCreatureInventory(oCreature).removeItem(oItem);
	},
	
	
	
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// SKILLS ////// 
	
	
	
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES ////// ATTRIBUTES //////
	

	
	
	
	
	
	
	
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS ////// KEYS //////
	
	// Ces fonctions n'ont de sens que pour le joueur
	
	/** 
	 * Ajoute une clé colorée dans l'inventaire du joueur
	 * @param nKey int code de la clé colorée. 0: rouge, 1: bleue, 2: verte, 3: jaune
	 */
	pickupAreaKey: function(nKey) {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (!(sArea in this.oData.player.keys.special)) {
			this.oData.player.keys.special[sArea] = [];
		}
		var nKeyMask = 1 << nKey;
		this.oData.player.keys.special[sArea][nFloor] |= nKeyMask; 
	},
	
	/**
	 * Renvoie la liste des clés de couleur possédées par le joueur, dans le niveau actuel
	 * (une clé de couleur ne fonction que dans le niveau dans lequelle elle à été trouvée)
	 * la fonction renvoie un entier dont les bits correspondant à la présence ou non des clé
	 * bit 0 : clé rouge
	 * bit 1 : clé bleue
	 * bit 2 : clé verte
	 * bit 3 : clé jaune
	 * @return entier
	 */
	getPossessedKeys: function() {
		var sArea = this.getPlayerLocationArea();
		var nFloor = this.getPlayerLocationFloor();
		if (sArea in this.oData.player.keys.special && nFloor < this.oData.player.keys.special[sArea].length) {
			return this.oData.player.keys.special[sArea][nFloor];
		}
		else {
			return 0;
		}
	},
	
	/** 
	 * Renvoie true si le joueur à trouvée la clé coloré spécifiée de ce niveau
	 * @param nKey int code de la clé colorée. 0: rouge, 1: bleue, 2: verte, 3: jaune
	 * @return bool
	 */
	hasKey: function(nKey) {
		var nPossessedKeys = this.getPossessedKeys();
		var nKeyMask = 1 << nKey;
		return (nPossessedKeys & nKeyMask) !== 0;
	},
	
	
	/** Renvoie le nombre de clé génériques possédées par le joueur
	 * @return int
	 * 
	 */
	getGenericKeyCount: function() {
		return this.oData.player.keys.generic;
	},
	
	/** Ajoute une clé générique à l'inventaire du joueur
	 */
	addGenericKey: function(n) {
		if (n === undefined) {
			n = 1;
		}
		this.oData.player.keys.generic += n;
	},
	
	/** 
	 * Renvoie true si le joueur possède une clé générique (outil de crochetage)
	 * @return bool, renvoie true si le joueur possede une telle clé. false sinon.
	 */
	hasGenericKey: function() {
		return this.oData.player.keys.generic > 0;
	},
	
	/** 
	 * Utilise une clé générique. Si le joueur n'en a pas, la fonction renvoie false
	 * Si le joueur possède un talent suffisant, la clé n'est pas consommée
	 * @return bool, renvoie true si le joueur possedait une clé. false sinon.
	 */
	useGenericKey: function() {
		if (this.oData.player.keys.generic > 0) {
			this.oData.player.keys.generic--;
			return true;
		} else {
			return false;
		}
	},
	
	
	
	
	
	
	
	
	
	
	
	
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////
	////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA ////// RETRIEVE DATA //////

	
	/** 
	 * Renvoie l'instance de l'inventaire d'une créature
	 * @return GC.Inventory
	 */
	getCreatureInventory: function(oCreature) {
		return oCreature.oExtraData.inventory;
	},
	
	/** Renvoi la référence de la creature du joueur
	 * @return GC.Creature
	 */
	getPlayerCreature: function() {
		return this.oData.player.creature;
	},

	/** Renvoie une liste d'éléments de l'inventaire filtré selon leur
	 * usabilité, cette liste est destiné à l'affichage de l'inventaire
	 * @return object
	 */
	getInventoryDigest: function(oInv) {
		var oItem, aDigest =  [oInv.oEquipSlots.hand];
		for (var iSlot = 0; iSlot < oInv.getSize(); iSlot++) {
			oItem = oInv.aBagSlots[iSlot];
			if (oItem) {
				aDigest.push(oItem);
			}
		}
		return aDigest;
	},

	/** Renvoie la référence de l'arme actuellement equipé par la creature
	 * @return string
	 */
	getCreatureEquippedWeapon: function(oCreature) {
		var aWeapons = this.getCreatureInventory(oCreature).oEquipSlots.hand;
		return aWeapons;
	},
	

	/** Analyse le code d'une arme pour en récupérer la liste des missiles
	 * et les effets associé à chaque missile
	 */
	getWeaponMissileDefinition: function(oDef) {
		if ('missiles' in oDef) {
			return oDef.missiles;
		}
		var m = [];
		var sBP = oDef.blueprint;
		var s2 = oDef.options.substr(0, 2);
		var sOptions = oDef.options.substr(2);
		switch (s2) {
			case 'l5':  // Linear 5 ways = 3 ways + 2 
				m.push({
					blueprint: sBP,
					angle: 0.4,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				m.push({
					blueprint: sBP,
					angle: -0.4,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				}); /** no break here */
				// no break
				
			case 'l3':  // Linear 3 ways = 1 way + 2
				m.push({
					blueprint: sBP,
					angle: 0.2,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				m.push({
					blueprint: sBP,
					angle: -0.2,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				}); /** no break here */
				// no break 
				
			case 'l1':  // Linear 1 way
				m.push({
					blueprint: sBP,
					angle: 0,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				break;
				
			case 'w2':  // wave 2 ways
				m.push({
					blueprint: sBP,
					angle: 0,
					options: 's' + sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				m.push({
					blueprint: sBP,
					angle: 0,
					options: 'c' + sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				break;

			case 'w3':  // wave 3 ways = 1 way + 2 
				m.push({
					blueprint: sBP,
					angle: 0,
					options: 's' + sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				m.push({
					blueprint: sBP,
					angle: 0,
					options: 'c' + sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				}); /** no break here */
				m.push({
					blueprint: sBP,
					angle: 0,
					options: sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				break;
				
			case 'w1':  // wave 1 way
				m.push({
					blueprint: sBP,
					angle: 0,
					options: 's' + sOptions,
					effects: oDef.effects,
					chances: oDef.chances
				});
				break;
		}
		oDef.missiles = m;
		return m;
	},
	
	
	
	/**
	 * Renvoie la vitesse de déplacement d'une créature
	 * @param oCreature GC.Creature
	 * @return float
	 */
	getCreatureMoveSpeed: function(oCreature) {
		var fSpeed = oCreature.getAttribute('speed');
		if (oCreature.getAttribute('rooted') > 0) {
			fSpeed = 0;
		} else {
			fSpeed = this.oEffectProcessor.getBuffProcessedValue(oCreature, oCreature.getAttribute('speed'), 'hasted', 'snared');
			//fSpeed = Math.min(20, Math.max(0.1, fSpeed));
		}
		return fSpeed;
	},
	
	



	
	
	
	
	
	
	
	
	
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	////// CREATURES ACTIONS ////// CREATURES ACTIONS ////// CREATURES ACTIONS //////
	
	
	/** Une creature (le joueur) consome de la nouriture
	 * Si le joueur peut consomer la fonction renvoi true
	 * Si le joueur a trop mangé, la fonction renvoi false
	 * @param oCreature
	 * @param nPoints nombre de points de bouffe gagnés
	 */
	actionEat: function(oCreature, nPoints) {
		if (oCreature.getAttribute('foodp') < oCreature.getAttribute('foodmax')) {
			oCreature.modifyAttribute('foodp', nPoints);
			return true;
		} else {
			return false;
		}
	},
	
	/** Bien que ce ne soit pas une action, cette fonction
	 * permet de gérer la faim.
	 * @param oCreature
	 */
	actionStarve: function(oCreature) {
		if (oCreature.getAttribute('dead')) {
			return;
		}
		if (oCreature.getAttribute('foodp') <= 0) {
			// crevage de faim
			oCreature.modifyAttribute('hp', oCreature.getAttribute('foodc'));
			this.oEffectProcessor.checkCreatureAlive(oCreature);
		} else {
			oCreature.modifyAttribute('foodp', -oCreature.getAttribute('foodc'));
		}
	},
	
	/** Une creature effectue une attaque basique avec son arme principale
	 * @param oCreature GC.Creature effecrtuant l'attaque
	 * @param nChargeTime Temps de charge consacré à l'attaque
	 * @param nTime temps actuel (pour vérifier le retrigger delay
	 * @return object/int
	 * le code de retour int peut etre
	 * 
	 */
	actionAttack: function(oCreature, nChargeTime, nTime) {
		// identifier l'arme et produire les projectiles correspondant
		// Verifier retrigger
		// Modifier le re-trigger de la creature pour l'empecher de re-tirer trop vite
		// Modifier la quantité de MP  ou autre ressource
		
		// objet renvoyé :
		// Tableau conteant une liste de déclaration de projectile
		// pour chaque projectile
		// { 
		//    type: string, // blueprint du projectile 
		//    d_angle: float, // differentiel d'angle pour les tirs multiples ou les déterioration de précision
		//    d_speed: int, // differentiel de vitesse pour exprimer les bonus de vitesse
		if (nChargeTime === 0 && oCreature.oExtraData.retrigger >= nTime) {
			// Tir déclenché trop tôt, temps de latence non respecté
			return null;
		}
		// wEC
		// E: Elemental type (visual)
		//   
		// C: Energy consumption
		// R: Retrigger time
		
		var oWeapon = this.getCreatureEquippedWeapon(oCreature);
		if (oWeapon === null) { 
			// pas d'arme équippée
			return 'no_weapon';
		}
		var iSpell = 0;
		if (nChargeTime > 0) {
			iSpell = oWeapon.spells.length - 1;
			while (iSpell > 0) {
				if (oWeapon.spells[iSpell].time < nChargeTime ) {
					break;
				}
				iSpell--;
			}
			if (iSpell === 0) {
				// aucun spell correspondant à la charge donnée
				return null;
			}
		}
		oCreature.oExtraData.retrigger = nTime + oWeapon.speed;
		var oSpell = SPELLS_DATA[oWeapon.spells[iSpell].ref];
		if (oSpell.cost <= (oCreature.getAttribute('energy') - oCreature.getAttribute('mp'))) {
			oCreature.modifyAttribute('mp', oSpell.cost);
		} else {
			// quantité d'energie insuffisante pour lancer le projectile
			// pénalité rettriger
			oCreature.oExtraData.retrigger += oWeapon.speed;
			return 'no_energy';
		}
		return this.getWeaponMissileDefinition(oSpell);
	}
});
