/**
 * Created by ralphy on 25/05/17.
 */
/**
 * @class Effect.PermaBonus
 */

O2.extendClass('Effect.PermaBonus', Effect.Abstract, {
    __construct: function(sBonus) {
        __inherited('PermaBonus');
        this.addTag(sBonus);
    },

    cast: function(ep) {
        var sAttr = this.getTag(1);
        var oTarget = this.getTarget();
        var nValue = oTarget.getBaseAttribute(sAttr);
        oTarget.setAttribute(sAttr, nValue + this.getLevel());
    },

    text: function() {
        var sAttr = MANSION.STRINGS_DATA.ATTRIBUTES[this.getTag(1)];
        var sUntil = MANSION.STRINGS_DATA.UI.perm_bonus;
        var nLevel = this.getLevel();
        return ([sAttr, (nLevel >= 0 ? '+' : '') + this.getLevel().toString() + '%', sUntil]).join(' ');
    }
});