/**
 * Created by ralphy on 29/03/17.
 */
/**
 * this spell will permanantly increase player vitality
 * by 10 points
 * @class MANSION.SPELLS.PermaVitality
 */

O2.createClass('MANSION.SPELLS.PermaVitality', {
    run: function(g) {
        var ePerma = new Effect.PermaBonus('vitality');
        var p = g.oLogic.getPlayerSoul();
        ePerma.setSource(p);
        ePerma.setTarget(p);
        ePerma.setLevel(MANSION.CONST.SPELL_POWER_UP);
        ePerma.setDuration(10);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(ePerma);
        g.castSpell('Heal');
    }
});