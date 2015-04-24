O2.createClass('DataSerializer', {

	save: function(oGame) {
		oGame.buildDungeonData();
		var oData = {};
		var oPlayer = oGame.oDungeon.oData.player;
		var oPlayerMobile = oGame.oRaycaster.oHorde.getMobile(0);
		oData.p = {
			l: {
				a: oPlayer.location.area,
				f: oPlayer.location.floor
			},
			c: this.saveCreature(oPlayer.creature),
			k: oPlayer.keys,
			p: {
				x: oPlayerMobile.x,
				y: oPlayerMobile.y,
				angle: oPlayerMobile.fTheta
			},
			v: oGame.oAdventure.oVariables,
			t: oGame.nTime
		};
		oData.w = {
			c: this.saveCreatures(oGame.oDungeon.getHorde()),
			o: oGame.oDungeon.getObjects(),
			a: oGame.oDungeon.getArea(),
			d: this.saveOpenDoors(oGame.oRaycaster.oDoors),
			r: this.saveDropStacks(oGame.oDungeon.getDropStacks())
		};
		return oData;
	},

	restore: function(oGame, oData) {
		if ('p' in oData) {
			oGame.oDungeon.resetData();			
			oGame.oDungeon.oData.player.creature = this.restoreCreature(oData.p.c, oGame);
			oGame.oDungeon.setPlayerLocation(oData.p.l.a, oData.p.l.f, 0);
			oGame.oDungeon.oData.player.keys = oData.p.k;
			oGame.oWeaponInUse = oGame.oDungeon.getCreatureEquippedWeapon(oGame.oDungeon.oData.player.creature);
			oGame.nTime = oData.p.t;
			oGame.nTimeMs = oData.p.t * oGame.TIME_FACTOR;
			oGame.oAdventure.oVariables = oData.p.v;
		}
		if ('w' in oData) {
			oGame.oDungeon.setHorde(this.restoreCreatures(oData.w.c, oGame));
			oGame.oDungeon.setObjects(oData.w.o);
			oGame.oDungeon.defineArea(oData.w.a);
			oGame.oDungeon.setOpenDoors(oData.w.d);
			oGame.oDungeon.setDropStacks(this.restoreDropStacks(oData.w.r));
		}
	},
	
	saveOpenDoors: function(oRegister) {
		var x = '', y = '', oGX, aDoors = [];
		for (x in oRegister) {
			for (y in oRegister[x]) {
				oGX = oRegister[x][y];
				if (typeof oGX == 'object' && oGX !== null && oGX.sClass == 'Door') { // c'est un Effect non null de porte
					aDoors.push({
						x: x | 0,
						y: y | 0,
						t: oGX.nTime | 0,
						p: oGX.nPhase | 0
					});
				}
			}
		}
		return aDoors;
	},

	/**
	 * Sauvegarde des drops stacks
	 */
	saveDropStacks: function(oRegister) {
		var x = '', y = '', aItems, iStack, aStack, aData = [], aNullEffects = [];
		for (x in oRegister) {
			for (y in oRegister[x]) {
				aStack = oRegister[x][y];
				aItems = [];
				for (iStack = 0; iStack < aStack.length; iStack++) {
					aItems.push(this.saveItem(aStack[iStack], aNullEffects));
				}
				aData.push([x, y, aItems]);
			}
		}
		return aData;
	},
	
	/** 
	 * Restoration des dropstacks
	 */
	restoreDropStacks: function(aData) {
		var x, y, iItem, aItems, oItem, aStack, aNullEffects = [], oRegister = Marker.create();
		for (var iStack = 0; iStack < aData.length; iStack++) {
			x = aData[iStack][0];
			y = aData[iStack][1];
			aItems = aData[iStack][2];
			aStack = [];
			for (iItem = 0; iItem < aItems.length; iItem++) {
				oItem = this.restoreItem(aItems[iItem], aNullEffects);
				aStack.push(oItem);
			}
			Marker.markXY(oRegister, x, y, aStack);
		}
		return oRegister;
	},
	
	saveCreatures: function(oHorde) {
		if (oHorde === null) {
			return null;
		}
		var oData = {};
		for (var i in oHorde) {
			oData[i] = this.saveCreature(oHorde[i]);
		}
		return oData;
	},
	
	restoreCreatures: function(oData, oGame) {
		if (oData === null) {
			return null;
		}
		var oHorde = {};
		for (var i in oData) {
			oHorde[i] = this.restoreCreature(oData[i], oGame);
		}
		return oHorde;
	},
	
	
	/** 
	 * A partir de la créature spécifier, construit la liste au format suivant
	 * #0 : attributs de base (crush)
	 * #1 : attributs modifiés (crush)
	 * #2 : effets appliqués à la créature
	 * #3 : retrigger time
	 * #4 : inventaire
	 * 
	 * La principale difficulté revien a faire correspondre les effets des objets
	 * avec l'effets correspondant appliqué à la créature. 2 pointeurs vers un même effet.
	 */
	saveCreature: function(oCreature) {
		if (oCreature === null) {
			return null;
		}
		var oData = {
			attrb: oCreature.oBaseAttributes,
			attrm: oCreature.oAttributes,
			retrigger: oCreature.oExtraData.retrigger,
			level: oCreature.oExtraData.level,
			craft: oCreature.oExtraData.craft,
			magic: oCreature.oExtraData.magic
		};
		var aCreaEff = [];
		for (var iEff = 0; iEff < oCreature.oEffects.length; iEff++) {
			aCreaEff.push(this.saveEffect(oCreature.oEffects[iEff]));
		}
		oData.effects = aCreaEff;
		oData.inventory = this.saveInventory(oCreature.oExtraData.inventory, oCreature.oEffects);
		return oData;
	},
	
	restoreCreature: function(oData, oGame) {
		if (oData === null) {
			return null;
		}
		var oCreature = new GC.Creature();
		oCreature.setEffectProcessor(oGame.oDungeon.oEffectProcessor);
		oCreature.oBaseAttributes = oData.attrb;
		oCreature.oAttributes = oData.attrm;
		for (var iEff = 0; iEff < oData.effects.length; iEff++) {
			oCreature.oEffects.push(this.restoreEffect(oData.effects[iEff]));
		}
		oCreature.oExtraData.craft = oData.craft;
		oCreature.oExtraData.level = oData.level;
		oCreature.oExtraData.retrigger = oData.retrigger;
		oCreature.oExtraData.magic = oData.magic;
		oCreature.oExtraData.inventory = this.restoreInventory(oData.inventory, oCreature.oEffects);
		return oCreature;
	},
	
	
	/**
	 * A partir de l'effet spécifié
	 * Construit la liste au format suivant :
	 * #0 : Signature de l'effet
	 * #1 : TimeOut
	 * #2 : flag expirable
	 */
	saveEffect: function(oEffect) {
		return [oEffect.sEffect, oEffect.nTimeOut, oEffect.bExpirable];
	},
	
	restoreEffect: function(oData) {
		var oEffect = new GC.Effect();
		oEffect.sEffect = oData[0];
		oEffect.nTimeOut = oData[1];
		oEffect.bExpirable = oData[2];
		return oEffect;
	},


		
	/** 
	 * A partir de l'inventaire spécifie construit la liste
	 * au format suivant :
	 * #0 : taille
	 * #1 : contenu des slot d'equipement (par paire (slot:item))
	 * #2 : contenu du sac
	 */
	saveInventory: function(oInventory, aEffects) {
		var nSize = oInventory.getSize();
		var aEquip = [];
		var aBag = [];
		for (var sSlot in oInventory.oEquipSlots) {
			aEquip.push(sSlot);
			aEquip.push(this.saveItem(oInventory.oEquipSlots[sSlot], aEffects));
		}
		for (var iSlot = 0; iSlot < nSize; iSlot++) {
			if (oInventory.aBagSlots[iSlot] !== null) {
				aBag.push(this.saveItem(oInventory.aBagSlots[iSlot], aEffects));
			} else {
				aBag.push(null);
			}
		}
		return [nSize, aEquip, aBag];
	},

	restoreInventory: function(oData, aEffects) {
		var oInventory = new GC.Inventory();
		var nSize = oData[0];
		var aEquip = oData[1];
		var aBag = oData[2];
		var i;
		oInventory.setSize(nSize);
		for (i = 0; i < aEquip.length; i += 2) {
			oInventory.oEquipSlots[aEquip[i]] = this.restoreItem(aEquip[i + 1], aEffects);
		}
		for (i = 0; i < aBag.length; i++) {
			oInventory.aBagSlots[i] = this.restoreItem(aBag[i], aEffects);
		}
		return oInventory;
	},
	

	/**
	 * A partir de l'Item spécifié, produit un tableau au format suivant
	 * #0 : resref de l'item
	 * #1 : flag identified
	 * #2 : liste des rangs des effets (dans la liste des effets)
	 */
	saveItem: function(oItem, aEffects) {
		if (oItem === null) {
			return null;
		}
		var aDataEffects = [];
		var nEffectRank;
		for (var i = 0; i < oItem.effects.length; i++) {
			nEffectRank = aEffects.indexOf(oItem.effects[i]);
			if (nEffectRank < 0) {
				throw new Error('serializer::saveItem: error in item effect loop');
			}
			aDataEffects.push(nEffectRank);
		}
		return [oItem.resref, oItem.identified, oItem.stackcount, aDataEffects];
	},

	restoreItem: function(oData, aEffects) {
		if (oData === null) {
			return null;
		}
		var sResRef = oData[0];
		var bIdentified = oData[1];
		var nStackCount = oData[2];
		var aDataEffects = oData[3];
		
		var oItem = new Item(sResRef, nStackCount);
		oItem.identified = bIdentified;

		var oItemEffect;
		for (var i = 0; i < aDataEffects.length; i++) {
			oItemEffect = aEffects[aDataEffects[i]];
			oItem.effects.push(oItemEffect);
		}
		return oItem;		
	}	
});
