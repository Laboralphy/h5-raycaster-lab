/**
 * Created by ralphy on 24/01/17.
 * This spell will frighten the players
 * @class MANSION.SPELLS.Horror
 */

O2.createClass('MANSION.SPELLS.Horror', {


    /**
     * Create a list of horror images
     */
    createList: function() {
        /**
         * Mini function : pad number with zeros
         * @param s initial string or number
         * @param n {int} final length
         * @return {string} left padded string with '0'
         */
        function pad(s, n) {
            s = s.toString();
            while (s.length < n) {
                s = '0' + s;
            }
            return s;
        }

        const NUMBER_OF_IMAGES = 9;

        let aImages = [];
        for (let i = 0; i < NUMBER_OF_IMAGES; ++i) {
            aImages.push('resources/splashes/horror/cx' + pad(i, 2) + '.jpg');
        }
        const r = new O876.Random();
        let a = r.rand(0, NUMBER_OF_IMAGES - 1);
        let b = (r.rand(0, NUMBER_OF_IMAGES - 1) + a) % NUMBER_OF_IMAGES;
        return [aImages[a], aImages[b]];
    },

    run: function(g) {
        const rc = g.oRaycaster;
        let gx = rc.addGXEffect(MANSION.GX.Splash);
        let imageLoader = new O876_Raycaster.ImageListLoader();
        let aImages = this.createList();
        imageLoader.on('load', function (oEvent) {
            g.playSound(MANSION.SOUNDS_DATA.events.stress[4]);
            gx.splash(oEvent);
        });
        aImages.forEach(image => imageLoader.addImage(image));
        imageLoader.loadAll();
        var oSoul = g.oLogic.getPlayerSoul();
        var eDamage = new Effect.Damage();
        eDamage.setSource(oSoul);
        eDamage.setTarget(oSoul);
        eDamage.setLevel(25);
        var ep = g.oLogic.getEffectProcessor();
        ep.applyEffect(eDamage);
    }
});