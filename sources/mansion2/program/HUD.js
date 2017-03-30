/**
 * @class MANSION.HUD
 * Created by ralphy on 09/02/17.
 */

O2.extendClass('MANSION.HUD', UI.System, {
    __construct: function () {
        __inherited();
        this.oScreen.fAlpha = 0;
        this.setRenderCanvas(document.getElementById(CONFIG.raycaster.canvas));
        var hpBar = new UI.ProgressBar();
        hpBar.setBarColor('red');
        hpBar.setSize(64, 8);
        hpBar.setMax(100);
        hpBar.setProgress(66);
        this.declareWidget(hpBar);
        this.cornerWidget(hpBar, 7, 4);
        this.oWidgets = {};
        this.oWidgets.hpbar = hpBar;
    },

    update: function(oLogic) {
        var player = oLogic.getPlayerSoul();
        var hp = player.getAttribute('hp');
        var hpmax = player.getAttribute('vitality');
        var hpbar = this.oWidgets.hpbar;
        hpbar.setMax(hpmax);
        hpbar.setProgress(hp);
    }
});