/**
 * This class deals with thinkers
 * it can produce instance of thinker by giving a thinker name
 */
O2.createClass('O876_Raycaster.ThinkerManager', {
	oGameInstance : null,
	oThinkerAlias : null,

	__construct: function() {
		this.oThinkerAlias = {};
	},

	/**
	 * Permet de créér un alias de thinker utilisable dans les blueprint
	 * @param sThinker
	 * @param pClass
	 */
	defineAlias: function(sThinker, pClass) {
		this.oThinkerAlias[sThinker] = pClass;
	},

	createThinker : function(sThinker) {
		// Les thinkers attaché a un device particulier ne peuvent pas être initialisé
		// transmettre la config du raycaster ? 
		if (sThinker === undefined || sThinker === null) {
			// pas de thinker déclaré
			return null;
		}
		var pThinker = (sThinker in this.oThinkerAlias) ? this.oThinkerAlias[sThinker] : O2.loadObject(sThinker + 'Thinker');
		if (pThinker !== null) {
			var oThinker = new pThinker();
			oThinker.oGame = this.oGameInstance;
			return oThinker;
		} else {
			throw new Error('ThinkerManager : ' + sThinker + ' class not found.');
		}
	}
});
