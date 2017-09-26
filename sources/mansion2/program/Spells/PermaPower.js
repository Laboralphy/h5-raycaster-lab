/**
 * Created by ralphy on 29/03/17.
 */
/**
 * this spell will permanantly increase player fire power
 * by 10 points
 * @class MANSION.SPELLS.PermaPower
 */

O2.createClass('MANSION.SPELLS.PermaPower', {
    run: function(g) {
        var ePerma = new Effect.PermaBonus('power');
        var p = g.oLogic.getPlayerSoul();
        ePerma.setSource(p);
        ePerma.setTarget(p);
        ePerma.setLevel(MANSION.CONST.SPELL_POWER_UP);
        ePerma.setDuration(10);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(ePerma);
        g.fadeIn('rgba(250, 100, 100, 0.5)', 1500);
        g.fadeIn('rgba(250, 200, 100, 0.75)', 750);
    }
});