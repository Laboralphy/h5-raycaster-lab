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
                    break;
            }
        }
        var nLevel = this.getLevel();
        var sLevel = nLevel.toString();
        var sColor;
        if (nLevel < 0) {
            sColor = '{#FAA}';
		} else if (nLevel > 0) {
			sColor = '{#AFA}';
		} else {
			sColor = '{#CCC}';
        }
        return '{#CCC}' + sAttr + sColor + (nLevel > 0 ? '+' : '') + sLevel + '%{#CCC} ' + sUntil;
    }
});