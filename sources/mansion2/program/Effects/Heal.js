/**
 * Created by ralphy on 07/02/17.
 * @class Effect.Heal
 */

O2.extendClass('Effect.Heal', ADV.Effect, {
    __construct: function() {
        __inherited('Heal');
    },

    cast: function(ep) {
        var oTarget = this.getTarget();
        var oSource = this.getSource();
        var nHeal = this.getLevel();
        var nHP = oTarget.getAttribute('hp');
        var nHPMax = oTarget.getAttribute('hpmax');
        oTarget.setAttribute('hp', MathTools.bound(0, nHP + nHeal, nHPMax));
    },

    run: function(ep) {
        this.cast(ep);
    }
});