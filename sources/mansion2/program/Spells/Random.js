/**
 * Created by ralphy on 18/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * will cast a random spell
 * @class MANSION.SPELLS.Random
 */

O2.createClass('MANSION.SPELLS.Random', {

    run: function(g, aTypes) {
        // available spells for the random spell
        var SPELLS = {
            curse: [
                'Weakness',
                'Darkness',
                'Slow'
            ],
            buff: [
                'Light',
                'Haste',
                'Protect',
                'Power',
                'Heal',
            ],
            blessing: [
                'PermaResist',
                'PermaPower',
                'PermaVitality',
            ]
        };

        function uniq(a) {
            var x = {};
            a.forEach(function(s) {
                x[s] = true;
            });
            return Object.keys(x);
        }

        function choose(sType) {
            if (typeof sType === 'string') {
                return MathTools.rndChoose(SPELLS[sType]);
            } else if (Array.isArray(sType)) {
                return uniq(sType.map(choose));
            }
        }

        choose(aTypes).forEach(g.castSpell);
    }
});