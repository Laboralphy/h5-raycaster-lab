/**
 * Created by ralphy on 19/05/17.
 */

O2.extendClass('UI.EffectPad', H5UI.Text, {
    _sClass: 'UI.EffectPad',
    _sLastUpdateString: '',

    __construct: function() {
        __inherited();
        this.setSize(320, 320);
        this.setFontColor('#FFF');
        this.setFontFace('monospace');
        this.setFontSize(UI.FONT_SIZE * 0.75 | 0);
        this.setAutosize(true);
        this.setWordWrap(true);
    },

    update: function(ep) {
        var sRender = ep.selectEffects(
            function() {
                return true;
            }).map(function(e) {
                return e.text();
            }
        ).join('\n');
        if (sRender != this._sLastUpdateString) {
            this._sLastUpdateString = sRender;
            this.setCaption(sRender);
        }
    }
});
