/**
 * Created by ralphy on 19/05/17.
 */

O2.extendClass('UI.EffectPad', H5UI.Text, {
    _sClass: 'UI.EffectPad',
    _sLastUpdateString: '',
	_COLORS: null,

    __construct: function() {
        __inherited();
        this.setSize(320, 320);
        this.setFontColor('#FFF');
        this.setFontFace('monospace');
        this.setFontSize(UI.FONT_SIZE * 0.75 | 0);
        this.setAutosize(true);
        this.setWordWrap(true);
        this._set('_bUseColorCodes', true);
        this._COLORS = {
			gray: '{#CCC}',
			red: '{#F88}',
			green: '{#8F8}',
		};
    },

    update: function(ep) {
    	var COLORS = this._COLORS;
        var sRender = ep.selectEffects(
            function() {
                return true;
            }).map(function(e) {
                var sColor;
                switch (e.goodOrEvil()) {
					case -1:
						sColor = COLORS.red;
						break;
					case 1:
						sColor = COLORS.green;
						break;
					default:
						sColor = COLORS.gray;
						break;
                }
                var d = e.display();
                return '{#CCC}' + d.label + ' ' + sColor + d.amp + '% {#CCC}' + d.dur;
            }
        ).join('\n');
        if (sRender !== this._sLastUpdateString) {
            this._sLastUpdateString = sRender;
            this.setCaption(sRender);
        }
    }
});
