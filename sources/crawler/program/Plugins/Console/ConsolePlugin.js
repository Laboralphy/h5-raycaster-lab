O2.createClass('ConsolePlugin', {

	oGame: null,
	aLines: null,

	/**
	 * Fonction appelée par le Game Instance.
	 * On se sert de cette fonction pour déclarer les évènements
	 * que le plugin suivra.
	 * @param g instance de Game
	 */
	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('key', this);
		this.oGame.registerPluginSignal('notify', this);
	},

	/**
	 * Cette fonction sera copié dans le gestionnaire de controlleur ui
	 * Elle recois les commandes interface utilisateur
	 * déclenchée par oGame.ui_command('xxxx', param);
	 * les commande les plus commune sont 'on' et 'off'
	 * @param sCommand commande envoyée par l'instance game
	 * @param xParams divers paramètres 
	 */
	uiController: function(sCommand, xParams) {
		var w;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre / Mise à jour inventaire
				this.clear();
				this.centerWidget(this.declareWidget(new UI.ConsoleWindow(xParams)));
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
		}
	},
	
	
	/** 
	 * Fonction évènementielle comme
	 * time, timesecond, key, block, ....
	 */
	
	key: function(nKey) {
		if (this.oGame.nIntfMode != UI.INTFMODE_CONSOLE && nKey != KEYS.ALPHANUM.I) {
			return false;
		}
		switch (nKey) {
			case KEYS.ALPHANUM.I:
				if (this.oGame.nIntfMode == UI.INTFMODE_NONE) {
					this.oGame.ui_open('Console', {lines: this.aLines.join('\n')});
					return true;
				} else if (this.oGame.nIntfMode == UI.INTFMODE_CONSOLE) {
					this.oGame.ui_close();
					return true;
				}
			break;
		}
		return false;
	},

	
	notify: function(sMessage) {
		if (this.aLines === null) {
			this.aLines = [];
		}
		this.aLines.push(sMessage);
		while (this.aLines.length > 16) {
			this.aLines.shift();
		}
	}
});
