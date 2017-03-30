/**
 * Created by ralphy on 18/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * @class MANSION.SPELLS.Protect
 */

O2.createClass('MANSION.SPELLS.Protect', {
    run: function(g) {
        var eProtect = new Effect.Bonus('resistance');
        var p = g.oLogic.getPlayerSoul();
        eProtect.setSource(p);
        eProtect.setTarget(p);
        eProtect.setLevel(40);
        eProtect.setDuration(MANSION.CONST.SPELL_DURATION_COMBAT);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(eProtect);
        g.fadeIn('rgba(220, 220, 220, 0.75)', 500);
    }
});