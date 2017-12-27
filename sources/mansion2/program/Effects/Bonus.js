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
		var sAttr = this.getTag(1);
        oTarget.modifyAttribute(sAttr, this.getLevel());
    },

    expire: function(ep) {
        var oTarget = this.getTarget();
        oTarget.modifyAttribute(this.getTag(1), -this.getLevel());
    },

    display: function() {
        var sAttr = MANSION.STRINGS_DATA.ATTRIBUTES[this.getTag(1)];
        var oResult = __inherited();
		var nLevel = this.getLevel();
		var sLevel = nLevel.toString();
        oResult.label = sAttr;
        oResult.amp = (nLevel > 0 ? '+' : '') + sLevel;
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
                    break;
            }
        }
        oResult.dur = sUntil;
        return oResult;
    }
});