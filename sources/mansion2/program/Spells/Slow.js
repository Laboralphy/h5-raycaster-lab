/**
 * Created by ralphy on 18/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * @class MANSION.SPELLS.Slow
 */

O2.createClass('MANSION.SPELLS.Slow', {
    run: function(g) {
        var eSlow = new Effect.Bonus('speed');
        var p = g.oLogic.getPlayerSoul();
        eSlow.setSource(p);
        eSlow.setTarget(p);
        eSlow.setLevel(-25);
        eSlow.setDuration(30);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(eSlow);
        g.fadeIn('rgba(180, 180, 128, 0.75)', 500);
    }
});