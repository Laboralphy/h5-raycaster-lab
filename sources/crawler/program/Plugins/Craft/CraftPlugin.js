O2.createClass('CraftPlugin', {

	oGame: null,
	bCrafting: false,
	oCraftRecipes: null,
	oRecipeList: null,
	
	uiController: function(sCommand, xParams) {
		var w;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre / Mise à jour inventaire
				this.clear();
				this.centerWidget(this.declareWidget(new UI.CraftWindow(xParams)));
				break;
				
			case 'up': // Déplacement curseur : haut
				w = this.getWidget();
				if (!w.oPopup._bVisible) {
					w.selectUp();
				}
				break;
				
			case 'down': // Déplacement curseur : base
				w = this.getWidget();
				if (!w.oPopup._bVisible) {
					w.selectDown();
				}
				break;
				
			case 'get':
				w = this.getWidget();
				return w.getSelectedRecipe();
				
			case 'craft':
				w = this.getWidget();
				w.resetProgress();
				w.oPopup.show();
				w.setCraftItem(xParams);
				break;

			case 'progress':
				w = this.getWidget();
				return w.progress(xParams);

			case 'reclaim':
				w = this.getWidget();
				w.displayMessage(STRINGS._('~m_craft_success'));
				return w.getCraftItem(xParams);
				
			case 'fail':
				w = this.getWidget();
				w.displayMessage(STRINGS._('~m_craft_more') + '\n' + xParams.join(', ') + '.');
				break;
				
			case 'abort':
				w = this.getWidget();
				w.oPopup.hide();
				break;

			case 'off':
				w = this.getWidget();
				if (w.oPopup._bVisible) {
					w.oPopup.hide();
					return false;
				} else {
					this.oScreen.hide();
				}
				return true;
				
			case 'update':
				w = this.getWidget();
				w.updateCraftableFlag(xParams);
				break;
		}
	},
	
	time: function() {
		if (this.oGame.nIntfMode == UI.INTFMODE_CRAFT && this.bCrafting) {
			if (this.oGame.ui_command('progress')) {
				// fini de crafter
				var oCraftedItem = this.oGame.ui_command('reclaim');
				this.oGame.oDungeon.pickupItem(this.oGame.oDungeon.getPlayerCreature(), oCraftedItem);
				this.bCrafting = false;
				this.updateCraftWindow(this.oGame.oDungeon.getPlayerCreature());
				this.oGame.unregisterPluginSignal('time', this);
				// indique le succes du craft
				this.oGame.sendPluginSignal('craft', this.oGame.getPlayer(), oCraftedItem);
			}
		}
	},
	
	block: function(nBlock, oMobile, x, y) {
		if (oMobile == this.oGame.getPlayer()) {
			switch (nBlock) {
				case LABY.BLOCK_LIVING_FIREPLACE:
					this.openCraft(this.oGame.oDungeon.getPlayerCreature(), 'cook');
					return true;
					
				case LABY.BLOCK_LABO_ALCHEMY:
					this.openCraft(this.oGame.oDungeon.getPlayerCreature(), 'brew');
					return true;
					
				case LABY.BLOCK_LABO_BOOK:
					// lisible qu'une fois
					this.oGame.oDungeon.setAreaBlockProperty(x, y, LABY.BLOCK_LIBRARY_BOOK);
					this.readRandomRecipe('brew', 1, oMobile.getData('creature'));
					return true;
					
				case LABY.BLOCK_WATCH_WALL_2_X:
					this.oGame.oDungeon.setAreaBlockProperty(x, y, LABY.BLOCK_WATCH_WALL_2_X_USED);
					this.readRandomRecipe('brew', 1, oMobile.getData('creature'));
					return true;

				case LABY.BLOCK_WATCH_WALL_2_Y:
					this.oGame.oDungeon.setAreaBlockProperty(x, y, LABY.BLOCK_WATCH_WALL_2_Y_USED);
					this.readRandomRecipe('brew', 1, oMobile.getData('creature'));
					return true;
			}
		}
		return false;

	},
	
	
	readRandomRecipe: function(sType, nLevel, oCreature) {
		var aList = this.getCraftRecipeList(sType, nLevel, oCreature);
		if (aList.length) {
			var sRec = MathTools.rndChoose(aList);
			this.oGame.oBookSystem.read('~craft_' + sType + '_recipe', ['~item_' + sRec]);
			this.oGame.oDungeon.learnCraft(oCreature, sRec);
		}
	},
	

	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('block', this);
	},

	/**
	 * Obtient la liste des recette de craft pour un type et un niveau donné
	 * @param sType string type de craft (chaine vide = 'any') 
	 * @param nLevel int niveau du craft
	 * @param oLearningCreature elimine les recettes qui sont déja connues de cette creature
	 * @return tableau de recette  
	 */
	getCraftRecipeList: function(sType, nLevel, oLearningCreature) {
		var aList = [];
		var aKnown;
		if (oLearningCreature) {
			aKnown = oLearningCreature.oExtraData.craft;
		} else {
			aKnown = [];
		}
		var sRec = '', oRec;
		for (sRec in CRAFT_DATA) {
			oRec = CRAFT_DATA[sRec];
			if (oRec.type == sType && oRec.level <= nLevel && aKnown.indexOf(sRec) < 0) {
				aList.push(sRec);					
			}
		}
		return aList;
	},
	
	getCraftRecipe: function(sRecipe) {
		var r, q, oItem;
		if (this.oCraftRecipes === null) {
			this.oCraftRecipes = {
				brew: {},
				cook: {}
			};
		}
		var sType = CRAFT_DATA[sRecipe].type;
		if (!(sRecipe in this.oCraftRecipes[sType])) {
			var aRec = [new Item(sRecipe, 1)];
			for (var i = 0; i < CRAFT_DATA[sRecipe].reagents.length; i++) {
				r = CRAFT_DATA[sRecipe].reagents[i][0];
				q = CRAFT_DATA[sRecipe].reagents[i][1];
				oItem = new Item(r, q);
				aRec.push(oItem);
			}
			this.oCraftRecipes[sType][sRecipe] = aRec;
		}
		return this.oCraftRecipes[sType][sRecipe];
	},

	/**
	 * Ouverture de l'écran de craft
	 * @param sType : type de craft 'brew', 'cook'
	 */
	openCraft: function(oCreature, sType) {
		var aCraft = oCreature.oExtraData.craft;
		var aCD = [];
		var aRec;
		var sRec;
		var aAble = [];
		// lister les recettes
		// et déterminer celles qui sont possibles à faire
		// Composants requies présent dans l'inventaire 
		for (var iCraft = 0; iCraft < aCraft.length; iCraft++) {
			sRec = aCraft[iCraft];
			aRec = this.getCraftRecipe(sRec);
			if (CRAFT_DATA[sRec].type == sType) {
				aCD.push(aRec);
				if (this.craftItem(oCreature, sRec, true)) {
					aAble.push(sRec);
				}
			}
		}
		this.oGame.ui_open('Craft', {
			title: 'Brewing potion',
			message: 'What will you brew ?',
			recipes: aCD,
			able: aAble,
			image: this.oGame.oRaycaster.oHorde.oTiles.i_icons.oImage
		});
	},
	
	updateCraftWindow: function(oCreature) {
		var oCS = this;
		this.oGame.oUI.command('Craft', 'update', function(sRec) {
			return oCS.craftItem(oCreature, sRec, true);
		});
	},
	
	/**
	 * Lancement d'un craft pour le mobile spécifié
	 * @param oMobile, mobile qui efectue l'action
	 * @param sRecipeId identifiant de l'objet à crafter
	 * @param bTest n'effectue pas le craft, teste seulement si les composants
	 * requis sont présent dans l'inventaire de la créature.
	 * @return boolean, succes de l'opération
	 */
	craftItem: function(oCreature, sRecipeId, bTest) {
		if (bTest === undefined) {
			bTest = false;
		}
		var oComp, iComp, nNeed, nItemGot, bFailed = false;
		var aRec = this.getCraftRecipe(sRecipeId);
		var oInv = this.oGame.oDungeon.getCreatureInventory(oCreature);
		var aMissingComps = [];
		for (iComp = 1; iComp < aRec.length; iComp++) {
			oComp = aRec[iComp];
			nNeed = oComp.stackcount;
			nItemGot = oInv.countItemStacks(oComp.resref);
			if (nNeed > nItemGot) {
				aMissingComps.push(oComp.name);
				bFailed = true;
				if (bTest) {
					return false;
				}
			}
		}
		if (bTest) {
			return true;
		}
		if (bFailed) {
			this.oGame.ui_command('fail', aMissingComps);
			return false;
		}
		for (iComp = 1; iComp < aRec.length; iComp++) {
			oComp = aRec[iComp];
			nNeed = oComp.stackcount;
			oInv.removeItemStack(oComp.resref, nNeed);
		}
		this.bCrafting = true;
		this.oGame.ui_command('craft', new Item(sRecipeId, aRec[0].stackcount));
		this.oGame.registerPluginSignal('time', this);
		return true;
	},
	
	
	craftSelectedItem: function() {
		var sRecipeId = this.oGame.oUI.command('Craft', 'get');
		if (sRecipeId !== null) {
			this.craftItem(this.oGame.oDungeon.getPlayerCreature(), sRecipeId);
		}
	},
	
	abort: function() {
		if (this.bCrafting) {
			this.oGame.ui_command('abort');
			this.bCrafting = false;
			this.oGame.unregisterPluginSignal('time', this);
			this.updateCraftWindow(this.oGame.oDungeon.getPlayerCreature());
			return true;
		} else {
			if (this.oGame.oUI.command('', 'off')) {
				this.oGame.getPlayer().oThinker.bActive = true;
				this.oGame.nIntfMode = UI.INTFMODE_NONE;
				return true;
			}
		}
		return false;
	}
});
