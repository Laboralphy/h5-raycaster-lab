/**
 * Created by ralphy on 24/01/17.
 * @class MANSION.SPELLS.Horror
 */

O2.createClass('MANSION.SPELLS.Horror', {
    run: function(g) {
        const rc = g.oRaycaster;
        let gx = rc.addEffect(MANSION.GX.IntroSplash);
        gx.splash();
    }
});