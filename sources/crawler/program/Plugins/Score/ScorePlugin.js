O2.createClass('ScorePlugin', {

	oGame: null,
	oMonsters: null,
	
	POINTS_INVENTORY: 5,
	POINTS_CRAFT_PER_LEVEL: 25,
	POINTS_SECRET: 50,
	POINTS_COLOR_KEY: 50,

	/**
	 * Fonction appelée par le Game Instance.
	 * On se sert de cette fonction pour déclarer les évènements
	 * que le plugin suivra.
	 * @param g instance de Game
	 */
	setGame: function(g) {
		this.oGame = g;
		this.oMonsters = {};
		this.oGame.registerPluginSignal('kill', this);
		this.oGame.registerPluginSignal('block', this);
		this.oGame.registerPluginSignal('craft', this);
	},
	
	/**
	 * Recuperer la valeur d'un mob
	 * regle de calcul
	 * hp * speed * valeur de l'arme
	 * @param oMonster Mobile
	 * @return int
	 */
	getMonsterValue: function(oMonster) {
		var sMonsterId = oMonster.getBlueprint().sId;
		if (sMonsterId in this.oMonsters) {
			return this.oMonsters[sMonsterId]; 
		}
		return this.oMonsters[sMonsterId] = oMonster.getData('score');
	},
	
	givePoints: function(oMob, nAmount) {
		var oCreature = oMob.getData('creature');
		oCreature.modifyAttribute('score', nAmount);
	},
	
	getInventoryValue: function(oWho) {
		var d = this.oGame.oDungeon;
		var oCreature = oWho.getData('creature');
		var oInv = d.getCreatureInventory(oCreature);
		var aItems = oInv.getAllObjects();
		var nItemCount = aItems.length;
		var oItem, nItemValue;
		var nScore = 0;
		for (var iItem = 0; iItem < nItemCount; iItem++) {
			oItem = aItems[iItem];
			if (oItem.resref === 'gold') {
				nItemValue = oItem.stackcount; 
			} else {
				nItemValue = oItem.stackcount * d.getItemLevel(oItem);
			}
			if (!isNaN(nItemValue)) {
				nScore += nItemValue;
			}
		}
		return nScore;
	},
	
	getScore: function(oWho) {
		var oCreature = oWho.getData('creature');
		return this.getInventoryValue(oWho) * this.POINTS_INVENTORY + 
			oCreature.getAttribute('score');
	},
	
	/** 
	 * Fonction évènementielle comme
	 * time, timesecond, key, block, ....
	 */
	
	kill: function(oKiller, oVictim) {
		this.givePoints(oKiller, this.getMonsterValue(oVictim));
	},
	
	block: function(nBlockCode, oMobile, x, y) {
		switch (nBlockCode) {
			case LABY.BLOCK_SECRET:
				this.givePoints(oMobile, this.POINTS_SECRET);
				break;
			
			case LABY.BLOCK_KEY_0:
			case LABY.BLOCK_KEY_1:
			case LABY.BLOCK_KEY_2:
			case LABY.BLOCK_KEY_3:
				this.givePoints(oMobile, this.POINTS_COLOR_KEY);
				break;
		}
	},

	craft: function(oCrafter, oItem) {
		this.givePoints(oCrafter, CRAFT_DATA[oItem.resref].level * this.POINTS_CRAFT_PER_LEVEL);
	}
});
