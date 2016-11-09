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
			g.popupMessage(MANSION.STRINGS_DATA.LEVELS['m090-htp'].hint_ghost_incoming);
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
	},
	
	wraithExit: function(oEvent) {
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		var p = g.getLocator('w-exit-boo'); // w_sadako
		var ps = g.oRaycaster.nPlaneSpacing;
		var ps2 = ps >> 1;
		var oGhost = g.spawnWraith('w_medusa', p.x * ps + ps2, p.y * ps + ps2, 0);
		var gt = oGhost.getThinker();
		gt.setLifespan(2000);
		oEvent.remove = true;
	},
	
	endOfLevel: function(oEvent) {
		var g = oEvent.game;
		var rc = g.oRaycaster;
		var oFade = rc.addGXEffect(O876_Raycaster.GXFade);
		oFade.fadeOut('#000', 1500).neverEnding();
		g.popupMessage('Exiting demonstration level... ... ...');
		setTimeout(function() {
			g.playAmbience('music/manor');
			g._halt();
			O876_Raycaster.PointerLock.disable();
			var xhr = new O876.XHR();
			xhr.get('resources/ui/screens/end.xml', function(data) {
				document.body.innerHTML = data;
			});
		}, 1700);
	}
});
