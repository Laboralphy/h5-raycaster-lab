O2.createClass('MANSION.Script.LevHtp', {

	/**
	 * si la page du necronomicon a été rammassée on lache un fantome
	 */
	pickupNecPage1: function(oEvent) {
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		if (oPlayer.data('item-book_sigils')) {
			oEvent.remove = true;
			var pos = oPlayer.getFrontCellXY();
			var oGhost = g.spawnGhost('g_bashed_boy', pos.x, pos.y);
			var oDoor = g.getLocator('door_ghost');
			oGhost.data('hold-door', 'door_ghost');
			g.lockDoor(oDoor.x, oDoor.y);		
		}
	},

	wraithSkullMonk: function(oEvent) {
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		// est-ce qu'on est bien à gauche de la porte ?
		if (oPlayer.xSector < oEvent.x && oPlayer.data('subject-p_skull_monk')) {
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
