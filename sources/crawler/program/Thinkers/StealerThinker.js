/** Thinker Stealer
 * 
 * Foncer sur la cible à double vitesse sans ajuster l'angle comme le dasher.
 * A la différence du dasher : on a une probabilité de voler un objet au lieu d'attaquer
 * L'objet volé peut être équipé tout de suite.
 * 
 * Creer les méthode _follow et _attack pour déterminer les comportement à adopter dans ces deux modes
 * Utiliser this.oTarget pour savoir quelle cible est actuellement poursuivie
 */

O2.extendClass('StealerThinker', MobThinker, {
	
	nStealCount: 1,  // Nombre de fois qu'on peut voler
	
	_follow: function(nTime) {
		if ((nTime % this.TIME_REACTIVITY) === 0) {
			// correction de l'angle de recherche
		//	this.chaseTarget(this.getTarget());
		}
		// on bouge deux fois : c'est le dash zooouuu !!!
		for (var i = 0; i < 3; i++) {
			switch(this.move()) {
				case this.COLLISION_TARGET:
				if (this.getTarget() == this.oMobile.oMobileCollision) {
					this.steal(this.oMobile.oMobileCollision);
				}
				this.oGame.gc_attack(this.oMobile, 0);
				this.setAttackMode();
				break;
				
				case this.COLLISION_WALL_X:
				case this.COLLISION_WALL_Y:
				case this.COLLISION_MOBILE:
				this.setWanderMode();
				break;
			}
		}
	},

	_attack: function(nTime) {
		this.oGame.gc_attack(this.oMobile, 0);
		this.steal(this.oMobile.oMobileCollision);
		this.setWanderMode();
	},
	
	
	/** 
	 * Vol de pièces d'or ou plus rarement d'un objet de petite taille
	 * (bague, boucle d'oreille, amulette, pièce d'or)
	 * Pas d'effet sur les créatures sans inventaire
	 * Ne vole pas les objets équippés 
	 */
	steal: function(oMobile) {
		if (this.nStealCount <= 0) {
			return;
		}
		this.nStealCount--;
		var oCreature = oMobile.getData('creature');
		if ('inventory' in oCreature.oExtraData) {
			var nLevel = this.oCreature.oExtraData.level;
			var oInv = oCreature.oExtraData.inventory;
			var nSize = oInv.getSize();
			var oItem;
			var oWantedTypes = {
				ring: [],
				earings: [],
				amulet: [],
				misc: []
			};
			// sélection des objets potentiellement subtilisables
			for (var iItem = 0; iItem < nSize; iItem++) {
				oItem = oInv.aBagSlots[iItem];
				if (oItem) {
					if (oItem.type in oWantedTypes) {
						oWantedTypes[oItem.type].push(oItem);
					}
				}
			}
			// choix de l'objet
			var nChoice = MathTools.rnd(0, 9);
			var sChosenType;
			switch (nChoice) { // choix du type d'item à voler
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6: // choisi de voler des pièces
					sChosenType = 'misc';
					break;
					
				case 7: // choisi de voler un anneau
					sChosenType = 'ring';
					break;
					
				case 8: // choisi de voler des boucle d'oreille
					sChosenType = 'earings';
					break;
					
				case 9: // choisi de voler une amulette
					sChosenType = 'amulet';
					break;
					
				default:
					sChosenType = '';
					
			}
			oItem = MathTools.rndChoose(oWantedTypes[sChosenType]);
			if (oItem) { // on a choisi l'objet à voler
				var nStolen = MathTools.rnd(1, nLevel); // nombre d'exemplaire à voler
				oInv.removeItem(oItem, nStolen);
				if (oItem.isEquippable()) { // objet equippable ?
					this.oCreature.oExtraData.inventory.defineEquipSlot(oItem.slot);
					this.oGame.gc_equipItem(this.oMobile, oItem);
				}
				if (oCreature == G.oDungeon.getPlayerCreature()) {
					var sItem = oItem.getName(nStolen);
					this.oGame.sys_notify('item_steal', [sItem]);
				}
			}
		}
	}
});