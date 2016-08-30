/**
 * Fait apparaitre un fantome
 */
O2.createClass('MANSION.Script.WSkullMonk', {
	spawn: function(oEvent) {
		var g = oEvent.game;
		// est-ce qu'on est bien à gauche de la porte ?
		if (g.getPlayer().xSector < oEvent.x) {
			var p = g.getLocator('w-skull-monk');
			var ps = g.oRaycaster.nPlaneSpacing;
			var ps2 = ps >> 1;
			var oGhost = g.spawnWraith('w_skull_monk', p.x * ps + ps2, p.y * ps + ps2, 0);
			var gt = oGhost.getThinker();
			gt.setLifespan(3000);
			gt.move('n', 1);
			g.unlockSecretBlock('sp-n');
			oEvent.remove = true;
		}
	}
});
