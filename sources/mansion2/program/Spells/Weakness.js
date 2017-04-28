/**
 * Created by ralphy on 18/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * @class MANSION.SPELLS.Weakness
 */

O2.createClass('MANSION.SPELLS.Weakness', {
    run: function(g) {
        var ep = g.oLogic.getEffectProcessor();
        var eWeakness = new Effect.Bonus('resistance');
        eWeakness.combatEffect();
        var p = g.oLogic.getPlayerSoul();
        eWeakness.setSource(p);
        eWeakness.setTarget(p);
        eWeakness.setLevel(-25);
        eWeakness.setDuration(MANSION.CONST.SPELL_DURATION_COMBAT);
        ep.applyEffect(eWeakness);

        eWeakness = new Effect.Bonus('power');
        eWeakness.combatEffect();
        eWeakness.setSource(p);
        eWeakness.setTarget(p);
        eWeakness.setLevel(-25);
        eWeakness.setDuration(MANSION.CONST.SPELL_DURATION_COMBAT);
        ep.applyEffect(eWeakness);

        g.fadeIn('rgba(220, 220, 220, 0.75)', 500);
    }
});