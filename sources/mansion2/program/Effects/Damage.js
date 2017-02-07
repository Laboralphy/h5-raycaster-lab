/**
 * Created by ralphy on 07/02/17.
 * @class Effect.Damage
 */

O2.extendClass('Effect.Damage', ADV.Effect, {
    __construct: function() {
        __inherited('Damage');
    },

    cast: function(ep) {
        var oTarget = this.getTarget();
        var oSource = this.getSource();
        var nResist = oTarget.getAttribute('resistance');
        var nPower = oSource.getAttribute('power');
        var nDamage = this.getLevel() * ((100 + nPower - nResist) / 100) | 0;
        var nHP = oTarget.getAttribute('hp');
        var nHPMax = oTarget.getAttribute('hpmax');
        oTarget.setAttribute('hp', MathTools.bound(0, nHP - nDamage, nHPMax));
    },

    run: function(ep) {
        this.cast(ep);
    }
});