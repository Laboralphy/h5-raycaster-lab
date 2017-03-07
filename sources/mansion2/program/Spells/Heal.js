/**
 * Created by ralphy on 10/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * @class MANSION.SPELLS.Heal
 */

O2.createClass('MANSION.SPELLS.Heal', {


    run: function(g) {
        var eHeal = new Effect.Heal();
        var p = g.oLogic.getPlayerSoul();
        eHeal.setSource(p);
        eHeal.setTarget(p);
        eHeal.setLevel(100);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(eHeal);
        g.fadeIn('rgba(255, 32, 96, 0.75)', 500);
    }
});