O2.createClass('StubPlugin', {

	oGame: null,

	/**
	 * Fonction appelée par le Game Instance.
	 * On se sert de cette fonction pour déclarer les évènements
	 * que le plugin suivra.
	 * @param g instance de Game
	 */
	setGame: function(g) {
		this.oGame = g;
		this.oGame.registerPluginSignal('block', this);
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
				this.centerWidget(this.declareWidget(new UI.StubWindow(xParams)));
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
	
	
});
