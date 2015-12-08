O2.createClass('MANSION.Script.Ayako', {
	
	ayako: null,
	
	/**
	 * Fait apparaitre ayako
	 */
	spawn: function(data) {
		if (this.ayako === null) {
			var g = data.game;
			var ps = g.oRaycaster.nPlaneSpacing;
			var ps2 = ps >> 1;
			this.ayako = g.spawnMobile('g_ayako', data.x * ps + ps2, (data.y + 2) * ps, 0);
			data.remove = true;
		}
	},
	
	vanish: function(data) {
		if (this.ayako) {
			this.ayako.oThinker.vanish();
			this.ayako = null;
			data.remove = true;
		}
	},
	
});
