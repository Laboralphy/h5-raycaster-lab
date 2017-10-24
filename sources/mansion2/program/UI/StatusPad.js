/**
 * Created by ralphy on 18/10/17.
 */



O2.extendClass('UI.StatusPad', UI.Window, {
    WINDOW_WIDTH: 128,
    WINDOW_HEIGHT: 192,

    oIndicators: null,

    /**
     * Création du widget de l'ecran de sttatus
     */
    __construct: function(ui) {
        __inherited({caption: MANSION.STRINGS_DATA.UI.statuspad_title});
        this.setSize(this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
        this.setBackgroundImage('resources/ui/windows/bg-statuspad.png');
        var BASE_Y = 36;
        this.oIndicators = {};
        this.oIndicators.vitality = this.createIndicator(
            16, BASE_Y,
            'resources/ui/windows/i-stat-sanity.png',
            MANSION.STRINGS_DATA.ATTRIBUTES.vitality
        );
        this.oIndicators.power = this.createIndicator(
            16, BASE_Y + 40,
            'resources/ui/windows/i-stat-power.png',
            MANSION.STRINGS_DATA.ATTRIBUTES.power,
        );
        this.oIndicators.resistance = this.createIndicator(
            16, BASE_Y + 80,
            'resources/ui/windows/i-stat-defense.png',
            MANSION.STRINGS_DATA.ATTRIBUTES.resistance
        );
		var S = MANSION.STRINGS_DATA.UI;
		this.setCommands([
			[S.back, ui.commandFunction('main'), 0]
        ]);
	},

    setIndicatorValue: function(sIndic, nValue) {
        var oValue = this.oIndicators[sIndic].value;
        if (nValue < 0) {
            oValue.setCaption(nValue);
            oValue.setFontColor('#F88');
        } else if (nValue === 0) {
            oValue.setCaption('+' + nValue);
            oValue.setFontColor('#CCC');
        } else {
            oValue.setCaption('+' + nValue);
            oValue.setFontColor('#8F8');
        }
        oValue.invalidate();
        return this;
    },

    createIndicator: function(x, y, sIcon, sText, nValue) {
        var oIcon = new H5UI.Image();
        oIcon.setSource(sIcon);
        var oText = new H5UI.Text();
        oText.setFontColor('#AAA');
        oText.setCaption(sText);
        var oValue = new H5UI.Text();
        oValue.setCaption('');
        oValue.setFontSize(14);
        oValue.setFontStyle('bold');
        oIcon.moveTo(x, y);
        oText.moveTo(x + 30, y);
        oValue.moveTo(x + 30, y + 12);
        var aWidget = [
            oIcon, oText, oValue
        ];
        aWidget.forEach((function(w) {
            w.invalidate();
            w.render();
            this.linkControl(w);
        }).bind(this));
        return {
            icon: oIcon,
            text: oText,
            value: oValue
        };
    }
});
