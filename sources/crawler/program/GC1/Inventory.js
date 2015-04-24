/**
 * Game Engine System
 * 
 * @author Raphaël Marandet
 * @date 2012-09-20 Inventory : Classe de gestion de l'inventaire d'un objet
 *       plaçable, item ou créature.
 */
O2.createClass('GC.Inventory',  {
	aBagSlots : null, // liste des items transportés
	oEquipSlots : null, // Emplacement d'objets équipés

	__construct : function() {
		this.oEquipSlots = {};
		this.aBagSlots = [];
	},
	
	/**
	 * Renvoie tous les objet sous forme d'un tableau
	 * @return object
	 */
	getAllObjects : function() {
		var oInvExport = [];
		var i = '';
		for (i in this.oEquipSlots) {
			if (this.oEquipSlots[i]) {
				oInvExport.push(this.oEquipSlots[i]);
			}
		}
		for (i = 0; i < this.aBagSlots.length; i++) {
			if (this.aBagSlots[i]) {
				oInvExport.push(this.aBagSlots[i]);
			}
		}
		return oInvExport;
	},

	/**
	 * Définition d'un nouveau Slot d'équipement
	 * 
	 * @param sSlot
	 *            string identifiant du slot is le slot existe déja ->
	 *            pas d'effet
	 */
	defineEquipSlot : function(sSlot) {
		if (!(sSlot in this.oEquipSlots)) {
			this.oEquipSlots[sSlot] = null;
		}
	},

	/**
	 * Définition de la taille de l'inventaire
	 * 
	 * @param nSize
	 *            int nouvelle size si la taille augmente, pas de
	 *            problème si la taille diminue, on vérifie la présence
	 *            d'items, on revois FALSE si le sac n'a pas pu être
	 *            réduit
	 * @return boolean, succès ou échec de l'opération
	 */
	setSize : function(nSize) {
		var i, nPrevSize = this.getSize();
		if (nSize >= nPrevSize) {
			for (i = nPrevSize; i < nSize; i++) {
				this.aBagSlots.push(null);
			}
			return true;
		} else {
			for (i = nSize; i < nPrevSize; i++) {
				if (this.aBagSlots[i] !== null) {
					return false;
				}
			}
			for (i = nSize; i < nPrevSize; i++) {
				this.aBagSlots.pop();
			}
		}
		return true;
	},

	/**
	 * Renvoie la taille de l'inventaire
	 * 
	 * @return int taille de l'inventaire
	 */
	getSize : function() {
		return this.aBagSlots.length;
	},

	/**
	 * Renvoie le rang du premier slot libre renvoie -1 si aucun slot
	 * n'est libre
	 * 
	 * @return int
	 */
	getFreeBagSlot : function() {
		var nSize = this.getSize();
		for ( var i = 0; i < nSize; i++) {
			if (this.aBagSlots[i] === null) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * Ajoute un item à l'inventaire
	 * 
	 * @param oItem
	 * @return bool, succès de l'opération
	 */
	addItem : function(oItem) {
		if (oItem === null) {
			// il y a toujour de la place pour du vide
			return true;
		}
		// l'objet est il stackable. Si oui on change de methode
		if (oItem.isStackable()) {
			return this.addStackableItem(oItem);
		}
		var nSlot = this.getFreeBagSlot();
		if (nSlot < 0) {
			return false;
		}
		this.aBagSlots[nSlot] = oItem;
		return true;
	},
	
	
	/**
	 * Ajoute un item stackable à l'inventaire
	 * @param oItem
	 * @return int : nombre de stack réellement ajouté
	 */
	addStackableItem: function(oStackableItem) {
		// recherche d'un éventuel item du même resref déja présent
		var oItem;
		var nSlot;
		var nAdded;
		oItem = this.findItem(oStackableItem.resref);
		while (oItem) { // potentiellement dangereux mais normalement 
			// impossible de tomber dans une boucle infinie car findNextItem
			// parcoure un tableau fini
			// item trouvé : full stack ?
			if (!oItem.isStackFull()) {	// not full : augmentation de stack
				nAdded = oItem.stackInc(oStackableItem.stackcount);
				oStackableItem.stackDec(nAdded);
				if (oStackableItem.stackcount === 0) { // on a tout casé ?
					return true;
				}
			}
			oItem = this.findNextItem();
		}
		nSlot = this.getFreeBagSlot();
		if (nSlot < 0) { // pas de place pour ajouter l'item
			return false;
		} else { // il reste de la place : ajouter l'item
			this.aBagSlots[nSlot] = oStackableItem;
			return true;
		}
	},

	nFindIndex: 0,
	sFindResRef: '',
	/**
	 * Recherche un item du resref spécifié
	 * Si plusieur item de resref sont présent dans l'inventaire
	 * cette fonction ne renvoi que le premier
	 * @param sResRef
	 * @return Item
	 */
	findItem: function(sResRef) {
		this.nFindIndex = 0;
		this.sFindResRef = sResRef;
		return this.findNextItem();
	},

	/**
	 * Recherche l'item suivant du resref spécifié
	 * Continue la recherche là ou la fonction findItem s'était arrétée
	 * @param sResRef
	 * @return Item
	 */
	findNextItem: function() {
		var sResRef = this.sFindResRef;
		var nSize = this.getSize();
		var oItem = null;
		for (var i = this.nFindIndex; i < nSize; i++) {
			oItem = this.aBagSlots[i];
			if (oItem && oItem.resref == sResRef) {
				this.nFindIndex = i + 1;
				return oItem;
			}
		}
		return null;
	},

	/**
	 * Renvoie true si l'inventaire est plein
	 * @return bool
	 */
	isFull : function() {
		return this.getFreeBagSlot() < 0;
	},

	/**
	 * Renvoie le numéro de slot d'un item renvoie -1 en cas de non
	 * trouvé
	 */
	getItemBagSlot : function(oItem) {
		return this.aBagSlots.indexOf(oItem);
	},

	/**
	 * Retire un item de l'inventaire Si l'élément n'est pas déja dans
	 * l'inventaire = renvoie false; si non renvoi true
	 * 
	 * @param oItem item à virer
	 * @param nCount pour les items stackable: nombre de d'exemplaire a supprimer
	 * ne peut supprimer plus d'exemplaire qu'il n'y en a dans la pile
	 * @return boolean attestant du succès de l'opération.
	 */
	removeItem : function(oItem, nCount) {
		if (oItem === null) {
			return true;
		}
		var nSlot = this.getItemBagSlot(oItem);
		if (nSlot >= 0) { // item trouvé
			if (oItem.isStackable()) { // item stackable : decrémenter le compteur
				if (nCount === undefined) { // on n'a pas spécifié le nombre d'exemplaire
					// pas grave, on prend tous les exemplaires
					nCount = oItem.stackcount;
				}
				oItem.stackDec(nCount);
				if (oItem.stackcount > 0) { // la stack n'est pas vide
					// ne rien faire d'autre
					return true; // travail terminé
				}
				// la stack est vide normalement à ce stade.
				// il va falloir supprimer l'item
			}
			// stack vide ou élément non-stackable
			this.aBagSlots[nSlot] = null; // supprimer l'item
			return true; // travail terminé
		} else {
			// l'item spécifié n'est pas dans l'inventaire
			// on ne peut pas le virer de l'inventaire car il n'y est pas
			return false;
		}
	},
	
	countItemStacks: function(sResRef) {
		var nSum = 0;
		var oItem = this.findItem(sResRef);
		while (oItem) {
			nSum += oItem.stackcount;
			oItem = this.findNextItem();
		}
		return nSum;
	},
	
	/**
	 * Récupère tous les objets correspondant au resref.
	 * Trié par stackcount ascendant
	 * @param sResRef string
	 * @return array of Item;
	 */
	findAllItems: function(sResRef) {
		var oItem = this.findItem(sResRef);
		var aItems = [];
		while (oItem) {
			aItems.push(oItem);
			oItem = this.findNextItem();
		}
		aItems.sort(function(a, b) { return a.stakcount - b.stackcount; });
		return aItems;
	},
	
	
	/**
	 * Retire un certain nombre de l'objet spécifié.
	 * Pioche dans toutes les piles disponnible de l'inventaire.
	 * Pratique pour consommer X pièces d'or
	 * @param sResRef string, resref de l'item à consommer
	 * @param nCount int, nombre d'exemplaires
	 * 
	 */
	removeItemStack: function(sResRef, nCount) {
		var nStackCount, oItem, aItems = this.findAllItems(sResRef);
		while (aItems.length > 0 && nCount > 0) {
			oItem = aItems.pop();
			nStackCount = oItem.stackcount;
			if (nCount <= nStackCount) {
				this.removeItem(oItem, nCount);
				return;
			} else {
				this.removeItem(oItem, nStackCount);
				nCount -= nStackCount;
			}
		}
	},
	
	
	/**
	 * Equipe un item de l'inventaire, déplace l'objet dans l'un des
	 * slots
	 * 
	 * @param oItem
	 *            item à équiper ou null pour dé équiper
	 * @param nSlot
	 *            int numero du slot
	 * @return instance de l'item déséquipé
	 */
	equipItem : function(oItem, sSlot) {
		if (!(sSlot in this.oEquipSlots)) {
			throw new Error(
					'inventory equipItem invalid slot: ' + sSlot);
		}
		var oPrevItem = this.oEquipSlots[sSlot];
		this.oEquipSlots[sSlot] = oItem;
		if (this.removeItem(oItem)) {
			if (this.addItem(oPrevItem)) {
				return oPrevItem;
			} else {
				if (oItem) {
					throw new Error(
							'inventory equipItem panic - already removed bag item, but cannot store previously equiped item : item lost');
				} else { // pas de place pour dé équiper : on remet
							// l'objet
					this.oEquipSlots[sSlot] = oPrevItem;
					return oPrevItem;
				}
			}
		}
		return null;
	}
});
