/**
 * Created by ralphy on 29/03/17.
 */
/**
 * this spell will permanantly increase player vitality
 * by 10 points
 * @class MANSION.SPELLS.PermaResist
 */

O2.createClass('MANSION.SPELLS.PermaResist', {
    run: function(g) {
        var p = g.oLogic.getPlayerSoul();
        var nResist = p.getAttribute('resistance');
        p.setAttribute('resistance', nResist + MANSION.CONST.SPELL_RESISTANCE_UP);
        g.fadeIn('rgba(220, 220, 220, 0.75)', 750);
    }
});