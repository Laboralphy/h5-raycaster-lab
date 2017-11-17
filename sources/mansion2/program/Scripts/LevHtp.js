O2.createClass('MANSION.Script.LevHtp', {

	/**
	 * dalle : si la page du necronomicon a été rammassée on lache un fantome
	 */
	pickupNecPage1: function() {
        var oEvent = this._event;
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		if (oPlayer.data('item-book_sigils')) {
			oEvent.remove = true;
			var oGhost = g.spawnGhost('g_bashed_boy');
			var oDoor = g.getLocator('door_ghost');
			oGhost.data('hold-door', 'door_ghost');
			g.lockDoor(oDoor.x, oDoor.y);	
			g.popupMessage(MANSION.STRINGS_DATA.LEVELS['tutorial'].hint_ghost_incoming);
		}
	},

	/**
	 * porte : ouverture de la porte = apparition de spectre
	 * s'active si on est a coté ouest et si on a photographié le sujet
	 * p_skull_monk
	 */
	wraithSkullMonk: function() {
		var oEvent = this._event;
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		// est-ce qu'on est bien à gauche de la porte ?
		if (oPlayer.xSector < oEvent.x && oPlayer.data('subject-p_skull_monk')) {
			var p = g.getLocator('w_skull_monk');
			var oGhost = g.spawnWraith('w_cowled_skull', p.x, p.y, 0);
			var gt = oGhost.getThinker();
			gt.setLifespan(3000);
			gt.move('n', 1);
			g.unlockSecretBlock('sp_n');
			oEvent.remove = true;
		}
	},

	/**
	 * dalle : apparition de medusa à l'approche de la sortie
	 */
	wraithExit: function() {
        var oEvent = this._event;
		var g = oEvent.game;
		var oPlayer = g.getPlayer();
		var p = g.getLocator('w_exit_boo'); // w_sadako
		var oGhost = g.spawnWraith('w_petrified_medusa', p.x, p.y, 0);
		var gt = oGhost.getThinker();
		gt.setLifespan(2000);
		oEvent.remove = true;
	},

	/**
	 * porte : sortie du niveau
	 */
	endOfLevel: function() {
        var oEvent = this._event;
		var g = oEvent.game;
		var rc = g.oRaycaster;
		var oFade = rc.addGXEffect(O876_Raycaster.GXFade);
		oFade.fadeOut('#000', 1500).neverEnding();
		g.popupMessage('Exiting demonstration level... ... ...');
		setTimeout(function() {
			g.playAmbiance('music/manor');
			g._halt();
			O876_Raycaster.PointerLock.disable();
			var xhr = new O876.XHR();
			xhr.get('resources/ui/screens/end.xml', function(data) {
				document.body.innerHTML = data;
			});
		}, 1700);
	},

    /**
	 * sigil de la derniere pièce
	 * le photographier fait apparaitre un indice
     * @param oEvent
     */
	sigilExit: function() {
        var oEvent = this._event;
		var g = oEvent.game;
		g.takeLocatorPhoto('c_sigil_exit', 'c_sigil_exit_0', 'c_sigil_exit_1');
		oEvent.remove = true;
	}
});
