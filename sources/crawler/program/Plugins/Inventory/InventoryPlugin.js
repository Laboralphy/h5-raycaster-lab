O2.createClass('InventoryPlugin', {

	oGame: null,

	uiController: function(sCommand, xParams) {
		var w;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre / Mise à jour inventaire
				this.clear();
				this.centerWidget(this.declareWidget(new UI.InventoryWindow(xParams)));
				break;
				
			case 'get': //
				w = this.getWidget();
				var n = w.getBagIndex();
				if (n < 0) {
					n -= w.getEquipIndex();
				}
				return n;

			case 'update': //
				w = this.getWidget();
				return w.refreshContent();
		}
	},
	
	/**
	 * Utilisation ou equippemetn d'un objet de l'inventaire
	 */
	useItem: function() {
		var nIndex, oItem, oInv;
		var oPlayer = this.oGame.getPlayer();
		var oPlayerCreature = this.oGame.oDungeon.getPlayerCreature();
		nIndex = this.oGame.ui_command('get');
		if (nIndex >= 0) {
			oInv = this.oGame.oDungeon.getCreatureInventory(oPlayerCreature);
			oItem = oInv.aBagSlots[nIndex];
			if (oItem) {
				switch (oItem.type) {
					// potion : buvage = application d'effet + dropage
					case 'potion':
					case 'scroll':
					case 'ccc':
						this.oGame.gc_useItem(oPlayer, oItem);
						break;
					
					// equipement par défaut : equipe le slot correspondant
					case 'earings':
					case 'amulet':
					case 'ring':
					case 'dagger':
					case 'wand':
						this.oGame.gc_equipItem(oPlayer, oItem);
						break;

						// pas de type = pas d'action
					default:
						break;
								
				}
				this.oGame.ui_command('update');
			}
		}
	},
	
	/**
	 * Larguer l'item actuellement selectionné
	 */
	dropItem: function() {
		var nIndex, oItem, oInv;
		var oPlayer = this.oGame.getPlayer();
		var oPlayerCreature = this.oGame.oDungeon.getPlayerCreature();
		nIndex = this.oGame.ui_command('get');
		if (nIndex >= 0) {
			oInv = this.oGame.oDungeon.getCreatureInventory(oPlayerCreature);
			oItem = oInv.aBagSlots[nIndex];
			if (oItem === null) {
				return;
			}
			// on met en pause car le confirm bloque le
			// processus et on préfère maitriser
			this.oGame.pause();
			if (confirm(STRINGS._('~m_confirmdropitem') + ':' + oItem.name)) {
				this.oGame.gc_dropItem(oPlayer, oItem);
				this.oGame.ui_command('update');
			}
			this.oGame.resume();
		}
	},


	key: function(nKey) {
		if (this.oGame.nIntfMode != UI.INTFMODE_INVENTORY && nKey != KEYS._INT_INVENTORY) {
			return false;
		}
		var oPlayerCreature = this.oGame.oDungeon.getPlayerCreature();
		switch (nKey) {
			case KEYS._INT_INVENTORY:
				if (this.oGame.nIntfMode == UI.INTFMODE_NONE) {
					this.oGame.ui_open('Inventory', {
						inventory: this.oGame.oDungeon.getCreatureInventory(oPlayerCreature)
					});
					return true;
				} else if (this.oGame.nIntfMode == UI.INTFMODE_INVENTORY) {
					this.oGame.ui_close();
					return true;
				}
			break;
		}
		return false;
	},

	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('key', this);
	}
});
	

