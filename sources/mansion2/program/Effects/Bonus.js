/**
 * Created by ralphy on 18/02/17.
 */
/**
 * @class Effect.Bonus
 */

O2.extendClass('Effect.Bonus', Effect.Abstract, {
    __construct: function(sBonus) {
        __inherited('Bonus');
        this.addTag(sBonus);
    },

    cast: function(ep) {
        var oTarget = this.getTarget();
        console.log(oTarget);
        oTarget.modifyAttribute(this.getTag(1), this.getLevel());
    },

    expire: function(ep) {
        var oTarget = this.getTarget();
        oTarget.modifyAttribute(this.getTag(1), -this.getLevel());
    },

    text: function() {
        var sAttr = MANSION.STRINGS_DATA.attributes(this.getTag(1));
        var sUntil = this._bCombat ? '--' : this._nTime;
        return ([sAttr, this.getLevel().toString(), sUntil]).join(' ');
    }
});