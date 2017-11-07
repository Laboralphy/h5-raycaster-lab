O2.createClass('MANSION.Script.LevHtp', {

    /**
	 * Dalle : activation du fantome de stray dancer
     */
    wraithStrayDancer: function(oEvent) {
        var g = oEvent.game;
        var oPlayer = g.getPlayer();
        // est-ce qu'on a bien la clé de la porte d'entrée ?
        if (oPlayer.data('item-key_')) {
            var p = g.getLocator('w_skull_monk');
            var oGhost = g.spawnWraith('w_cowled_skull', p.x, p.y, 0);
            var gt = oGhost.getThinker();
            gt.setLifespan(3000);
            gt.move('n', 1);
            g.unlockSecretBlock('sp_n');
            oEvent.remove = true;
        }
    },
});
