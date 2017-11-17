O2.createClass('MANSION.Script.Abstract', {
	removeEvent: function() {
		this._event.remove = true;
	},

	game: function() {
		return this._event.game;
	},

    playerHasItem: function(sKey) {
        return this.game()
            .getPlayer()
            .data('item-' + sKey);
    },


    /**
     * Fait apparaitre un spectre à la position spécifiée
     * le tableau d'otion permet de regler le movement, la vitesse et la durée
     * de l'apparition.
     * @param oEvent
     * @param sWraith
     * @param sLocator
     * @param oOptions
     * les options sont :
     * - duration : durée de l'apparition en ms
     * - direction : direction prise par le wraith (n, s, e, w....)
     * - speed : vitesse de l'apparition
     * - boo : active un son "boo"
     * @return Mobile
     */
    spawnWraithAtLocator: function(sWraith, sLocator, oOptions) {
        var g = this.game();
        var oLoc = g.getLocator(sLocator);
        var oWraith = g.spawnWraith(sWraith, oLoc.x, oLoc.y, 0);
        var gt = oWraith.getThinker();
        oOptions = oOptions || {};
        if ('duration' in oOptions) {
            gt.setLifespan(oOptions.duration);
        }
        if ('direction' in oOptions) {
            var fSpeed = 1;
            if ('speed' in oOptions) {
                fSpeed = oOptions.speed;
            }
            gt.move(oOptions.direction, fSpeed);
        }
        if (('boo' in oOptions) && oOptions.boo) {
            gt.boo();
        }
        return oWraith;
    },

        /**
         * Fait apparaitre un fantome hostile
         * @param sGhost
         * @param oOptions
         * les options sont :
         * - lock : locator de verrouillage d'une porte
         *
         */
    spawnGhost: function(sGhost, oOptions) {
        var g = this.game();
        var oGhost = g.spawnGhost(sGhost);
        oOptions = oOptions || {};
        if ('lock' in oOptions) {
            var oDoor = g.getLocator(oOptions.lock);
            oGhost.data('hold-door', oOptions.lock);
            g.lockDoor(oDoor.x, oDoor.y);
        }
    },
});
