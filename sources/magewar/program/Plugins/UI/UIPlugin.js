/**
 * Plugin d'interface graphique
 */

O2.extendClass('MW.UIPlugin', MW.Plugin, {
	oSystem: null,
	oCanvas: null,
	bOpen: false,
	
	getName: function() {
		return 'UI';
	},
	
	init: function() {
		this.oSystem = new UI.System();
		this.oSystem.setRenderCanvas(this.oCanvas = document.getElementById(CONFIG.raycaster.canvas));
		this.register('ui_open');
		this.register('ui_close');
		this.register('ui_switch');
		this.register('ui_resize');
	},

	render: function() {
		this.oSystem.render();
	},
	
	
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	
	/**
	 * Ouverture de l'interface graphique
	 */
	ui_open: function(w) {
		if (w) {
			this.oSystem.declareWidget(w);
			this.oSystem.centerWidget(w);
		}
		if (this.bOpen) {
			return;
		}
		this.bOpen = true;
		if (this.oGame.getPlayer() && this.oGame.getPlayer().oThinker) {
			// désactivation du thinker de camera
			this.oGame.setPlayerControllable(false);
			// sortie du mode pointerlock
			O876_Raycaster.PointerLock.exitPointerLock();
			O876_Raycaster.PointerLock.bEnabled = false;
		}
		// activation des évènements UI et du système de rendu
		this.oSystem.listenToMouseEvents(this.oCanvas);
		this.register('render');
	},
	
	/**
	 * Fermeture de l'interface graphique
	 */
	ui_close: function() {
		if (!this.bOpen) {
			return;
		}
		this.bOpen = false;
		if (this.oGame.getPlayer() && this.oGame.getPlayer().oThinker) {
			// réactivation du thinker de camera
			this.oGame.setPlayerControllable(true);
			// retour au mode pointerlock
			O876_Raycaster.PointerLock.bEnabled = true;
			O876_Raycaster.PointerLock.requestPointerLock(document.getElementById(CONFIG.raycaster.canvas));
		}
		// désactivation des évènements UI et du système de rendu
		this.oSystem.deafToMouseEvents(this.oCanvas);
		this.unregister('render');
	},
	
	/**
	 * Fermeture / Ouverture de l'interface graphique
	 */
	ui_switch: function() {
		if (this.bOpen) {
			this.ui_close();
		} else {
			this.ui_open();
		}
	},

	ui_resize: function() {
		this.oSystem.setRenderCanvas(this.oCanvas);
	}

});
