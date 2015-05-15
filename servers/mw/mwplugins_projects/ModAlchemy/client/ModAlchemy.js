O2.extendClass('MW.ModAlchemy', UI.HUDClient, {
	
	aComponents: ['Viridian Leaf', 'Toadstool', 'Ruby Dust', 'Mandrake'],
	
	redraw: function() {
	},
	
	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ici : update(fAcc)  parce que le plugin-serveur appelle Instance::updateHud([entities], "accuracy", fAcc);
	 */
	update: function(action, data) {
		this['action_' + action](data);
	},
	
	action_start: function(data) {
		var w = new MW.WinAlchemy({
			components: data.components,
			onBrew: this.brew.bind(this)
		});
		this.oGame.sendSignal('ui_open', w);
	},
	
	action_loot: function(xData) {
		var nLoot = xData.n;
		var sLoot = this.aComponents[nLoot];
		this.oGame.popupMessage(STRINGS._('~item_pickup', [sLoot]), nLoot, 'alchemy_icons');
	},
	
	action_fail: function(xData) {
		switch (xData.w) {
			case 'invalid' :
				this.oGame.popupMessage('This is not a valid recipe. Try something else.', 6, 'alchemy_icons');
				break;
	
			case 'nocomp':
				this.oGame.popupMessage('You don\'t have the required components to craft this object.', 6, 'alchemy_icons');
				break;
		}
	},
	
	keyPress: function(k) {
		switch (k) {
			case KEYS.ALPHANUM.P:
				this.sendData('start', {});
			break;
		}
	},
	
	brew: function(nRecipe) {
		this.sendData('brew', {r: nRecipe});
		this.oGame.sendSignal('ui_close');
	}
});
