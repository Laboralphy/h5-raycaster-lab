/**
 * This class deals with thinkers
 * it can produce instance of thinker by giving a thinker name
 */
O2.createClass('O876_Raycaster.ThinkerManager', {
	oGameInstance : null,

	createThinker : function(sThinker) {
		// Les thinkers attaché a un device particulier ne peuvent pas être initialisé
		// transmettre la config du raycaster ? 
		if (sThinker === undefined || sThinker === null) {
			return null;
		}
		var pThinker = O2._loadObject(sThinker + 'Thinker');
		if (pThinker !== null) {
			var oThinker = new pThinker();
			oThinker.oGame = this.oGameInstance;
			return oThinker;
		} else {
			throw new Error('ThinkerManager : ' + sThinker + ' class not found.');
		}
	}
});
