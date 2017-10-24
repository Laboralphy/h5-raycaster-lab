/**
 * @class MANSION.HUD
 * Created by ralphy on 09/02/17.
 */

O2.extendClass('MANSION.HUD', UI.System, {

    init: function (oCanvas) {
        this.oScreen.fAlpha = 0;
        this.setRenderCanvas(oCanvas);
        // hp bar
        var hpBar = new UI.ProgressBar();
        hpBar.setBarColor('cyan');
        hpBar.setSize(64, 8);
        hpBar.setMax(100);
        hpBar.setProgress(0);
        this.declareWidget(hpBar);
        this.cornerWidget(hpBar, 7, 7);

        // effects
        var effPad = new UI.EffectPad();
        this.declareWidget(effPad);
        this.cornerWidget(effPad, 7, 4, 20);

        // terror Icon
        var oTerrorIcon = new H5UI.Image();
        oTerrorIcon.setSource('resources/ui/hud/terror.png');
        oTerrorIcon.moveTo(hpBar._x + hpBar.width() - 4, hpBar._y - 3);
		this.declareWidget(oTerrorIcon);

        this.oWidgets = {};
        this.oWidgets.hpbar = hpBar;
        this.oWidgets.effpad = effPad;
		this.oWidgets.terror = oTerrorIcon;
    },

    update: function(oLogic) {

        var player = oLogic.getPlayerSoul();
        if (!player) {
            return;
        }
        var hp = player.getAttribute('hp');
        var hpmax = player.getAttribute('vitality');
        var hpbar = this.oWidgets.hpbar;
        hpbar.setMax(hpmax);
        hpbar.setProgress(hpmax - hp);

        var effpad = this.oWidgets.effpad;
        effpad.update(oLogic.getEffectProcessor());

    }
});
