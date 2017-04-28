/**
 * Created by ralphy on 28/04/17.
 */
/**
 * @class Effect.Abstract
 *
 * Lorsqu'on invique combatEffecf() l'effet est temporaire, et prend fin lorsque le joueur flingue un fantome
 */

O2.extendClass('Effect.Abstract', ADV.Effect, {

    _nKills: 0,
    _bCombat: false,

    combatEffect: function() {
        this._bCombat = true;
    },

    setSource: function(s) {
        __inherited(s);
        this._nKills = this.getTarget().data('kills');
    },

    isExpired: function(nTimestamp) {
        if (this._bCombat) {
            this._bExpired |= this._nKills < this.getTarget().data('kills');
        }
        return __inherited(nTimestamp);
    }
});