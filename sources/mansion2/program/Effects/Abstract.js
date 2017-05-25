/**
 * Created by ralphy on 28/04/17.
 */
/**
 * @class Effect.Abstract
 *
 *
 */

O2.extendClass('Effect.Abstract', ADV.Effect, {

    _nKills: 0,
    _bCombat: false, // les effets "bCombat = true" sont des effet qui se termine lorsque l'on butte un fantome
    _bHidden: false, // les effets "hidden" ne sont pas montré dans l'interface

    combatEffect: function() {
        this._bCombat = true;
        this.setDuration(Infinity);
    },

    setTarget: function(s) {
        __inherited(s);
        this._nKills = this.getTarget().data('kills') || 0;
    },

    isExpired: function(nTimestamp) {
        if (this._bCombat) {
            this._bExpired = this._bExpired || (this._nKills < this.getTarget().data('kills'));
        }
        return __inherited(nTimestamp);
    },

    /**
     * l'effet peut se transformer en texte descriptif
     */
    text: function() {
        return '';
    }
});