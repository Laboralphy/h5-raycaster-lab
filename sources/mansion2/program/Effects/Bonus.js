/**
 * Created by ralphy on 18/02/17.
 */
/**
 * @class Effect.Bonus
 */

O2.extendClass('Effect.Bonus', Effect.Abstract, {
    __construct: function(sBonus) {
        __inherited('Bonus');
        this.addTag(sBonus);
    },

    cast: function(ep) {
        var oTarget = this.getTarget();
        oTarget.modifyAttribute(this.getTag(1), this.getLevel());
    },

    expire: function(ep) {
        var oTarget = this.getTarget();
        oTarget.modifyAttribute(this.getTag(1), -this.getLevel());
    },

    text: function() {
        var sAttr = MANSION.STRINGS_DATA.ATTRIBUTES[this.getTag(1)];
        // ⚔ fight
        // ⌚ watch
        // ⌛ hourglass
        // ∞ infinity
        var sUntil = '';
        if (this._bCombat) {
            sUntil += '⚔';
        } else {
            switch (this._nDurationType) {
                case 1:
                    sUntil += '⌛ ' + this.getRemainingTime() + 's.';
                    break;

                case 2:
                    sUntil += '⌛ ∞';
            }
        }
        var nLevel = this.getLevel();
        return ([sAttr, (nLevel >= 0 ? '+' : '') + this.getLevel().toString() + '%', sUntil]).join(' ');
    }
});