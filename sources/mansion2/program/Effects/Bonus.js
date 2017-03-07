/**
 * Created by ralphy on 18/02/17.
 */
/**
 * @class Effect.Bonus
 */

O2.extendClass('Effect.Bonus', ADV.Effect, {
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
    }
});