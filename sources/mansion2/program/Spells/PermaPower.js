/**
 * Created by ralphy on 29/03/17.
 */
/**
 * this spell will permanantly increase player fire power
 * by 10 points
 * @class MANSION.SPELLS.PermaLife
 */

O2.createClass('MANSION.SPELLS.PermaLife', {
    run: function(g) {
        var p = g.oLogic.getPlayerSoul();
        var nPower = p.getAttribute('power');
        p.setAttribute('vitality', nPower + MANSION.CONST.SPELL_POWER_UP);
        g.fadeIn('rgba(250, 100, 100, 0.5)', 1500);
        g.fadeIn('rgba(250, 200, 100, 0.75)', 750);
    }
});