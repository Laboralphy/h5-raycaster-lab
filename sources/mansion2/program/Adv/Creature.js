/**
 * Created by ralphy on 07/02/17.
 * @class ADV.Creature
 */

O2.createClass('ADV.Creature', {
    _oAttributes: null,
    _oBonuses: null,

    __construct: function() {
        this._oAttributes = {};
        this._oBonuses = {};
    },

    checkAttributeChanged: function(sAttribute, nPrev) {
        var nNew = this.getAttribute(sAttribute);
        if (nNew != nPrev) {
            this.trigger('attributechanged', sAttribute, nNew, nPrev, this);
        }
    },

    setAttribute: function(sAttribute, nValue) {
        var nPrev = this.getAttribute(sAttribute);
        this._oAttributes[sAttribute] = nValue | 0;
        this.checkAttributeChanged(sAttribute, nPrev);
    },

    getAttribute: function(sAttribute) {
        var n = 0;
        n += sAttribute in this._oAttributes ? this._oAttributes[sAttribute] : 0;
        n += sAttribute in this._oBonuses ? this._oBonuses[sAttribute] : 0;
        return n;
    },

    modifyAttribute: function(sAttribute, nValue) {
        var nPrev = this.getAttribute(sAttribute);
        if (!(sAttribute in this._oBonuses)) {
            this._oBonuses[sAttribute] = 0;
        }
        this._oBonuses[sAttribute] += nValue | 0;
        this.checkAttributeChanged(sAttribute, nPrev);
    },



});

O2.mixin(ADV.Creature, O876.Mixin.Events);
O2.mixin(ADV.Creature, O876.Mixin.Data);
