O2.createClass('O876_Raycaster.ThinkerManager', {
	oGameInstance : null,
	oLoader : null,

	__construct : function() {
		this.oLoader = new O876.ClassLoader();
	},

	createThinker : function(sThinker) {
		// Les thinkers attaché a un device particulier ne peuvent pas être initialisé
		// transmettre la config du raycaster ? 
		if (sThinker === undefined || sThinker === null) {
			return null;
		}
		var pThinker = this.oLoader.loadClass(sThinker + 'Thinker');
		if (pThinker !== null) {
			var oThinker = new pThinker();
			oThinker.oGame = this.oGameInstance;
			return oThinker;
		} else {
			throw new Error('ThinkerManager : ' + sThinker
					+ ' class not found.');
		}
	}
});
