/**
 * Created by ralphy on 18/02/17.
 */
/**
 * Created by ralphy on 24/01/17.
 * will cast a random spell
 * @class MANSION.SPELLS.Random
 */

O2.createClass('MANSION.SPELLS.Random', {
    run: function(g) {
        // available spells for the random spell
        var SPELLS = {
            curse: [
                'Horror',
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

        var nMerit = 1;
        var aSpells = [];
        switch (nMerit) {
            case 0:
                aSpells = choose(['curse', 'curse', 'curse']);
                break;
            case 1:
                aSpells = choose(['curse', 'curse']);
                break;
            case 2:
                aSpells = choose(['curse', 'buff']);
                break;
            case 3:
                aSpells = choose(['buff']);
                break;
            case 4:
                aSpells = choose(['buff', 'buff']);
                break;
            case 5:
                aSpells = choose(['buff', 'blessing']);
                break;
            case 6:
                aSpells = choose(['buff', 'buff', 'blessing']);
                break;
        }
        aSpells.forEach(g.castSpell);
    }
});