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
        var p = g.oLogic.getPlayerSoul();
        var nVitality = p.getAttribute('vitality');
        p.setAttribute('vitality', nVitality + MANSION.CONST.SPELL_VITALITY_UP);
        g.castSpell('Heal');
    }
});