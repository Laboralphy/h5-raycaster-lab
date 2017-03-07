/**
 * @const MANSION
 * @property {object} MANSION.BLUEPRINTS_DATA
 * Mansion common blueprints loaded in all level
 */

O2.createObject('MANSION.GGB', function (
	sResRef,  // res ref
	nLevel,   // classe d, c, b, a
	sThinker,
	sSpecs,	  // spécialisation de stat
	sSound   // pack de son
) {
	function hasSpec(s) {
		return aSpecs.indexOf(s) >= 0;
	}
	var nHP = nLevel * 200 | 0;
	var aSpecs = sSpecs.split(' ');
    if (hasSpec('life')) {
        nHP += 100;
    }
    var nPower = nLevel * 10 | 0;
    if (hasSpec('power')) {
        nPower += 5;
    }
    var fSpeed = nLevel * 0.2 + 1;
    if (hasSpec('speed')) {
        fSpeed += 1;
    }
    var oThinkers = {
    	c: 'Chaser',
		e: 'Evader',
		r: 'Retaliater',
		tr: 'TeleRusher',
		zr: 'ZigZagRusher',
		ztr: 'ZigZagTeleRusher',
		z: 'ZigZag'
	};
    if (!(sThinker in oThinkers)) {
    	throw new Error('no thinker alias found : "' + sThinker + '" in list : "' + Object.keys(oThinkers).join(', ') + '"');
	}
	var a = {
        type: RC.OBJECT_TYPE_MOB,
        width: 32,
        height: 96,
        fx: 3,
        data: {
            subtype: 'ghost',
            sounds: {
                hit: 'ghosts/specific/' + sSound + '-hit',
                die: 'ghosts/specific/' + sSound + '-die',
                attack: 'ghosts/generic/ghost-attack'
			},
        	speed: fSpeed,
            power: nPower,
            life: nHP,
	        name: sResRef,
        },
	    tile: sResRef,
        thinker: 'MANSION.G' + oThinkers[sThinker],
	};
    MANSION.BLUEPRINTS_DATA[sResRef] = a;
});




O2.createObject('MANSION.BLUEPRINTS_DATA', {

	//////// MISSILES ////////
	p_ecto: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_ecto',
		width: 20,
		height: 96,
		thinker: 'MANSION.Missile',
		fx: 3,
		data: {
			name: 'ectomissile',
			speed: 3,
			sounds: {
				fire: 'fire1',
				explode: 'impact1'
			}
		}
	},
	
	o_flame: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_flame',
		width: 62,
		height: 62,
		thinker: 'MANSION.Timed',
		fx: 3,
		data: {
			name: 'ectoflame',
			speed: 0,
			sounds: {
				spawn: 'bluefire'
				//fire: 'fire1',
				//explode: 'impact1'
			}
		}
	}
});


MANSION.GGB('g_bashed_boy',		1, 'c', '', 'b50');
MANSION.GGB('g_white_teeth',	1, 'z', 'power', 'f20');
MANSION.GGB('g_decaying',		1, 'c', 'life', 'f45');
MANSION.GGB('g_severed_jaw',	1, 'c', 'power speed', 'm60');

MANSION.GGB('g_aging_girl',		2, 'c', '', 'f40');
MANSION.GGB('g_dark_tears',		2, 'z', 'power', 'f30');
MANSION.GGB('g_dementia',		2, 'zr', 'power life', 'f50');
MANSION.GGB('g_half_skull',		2, 'zr', '', 'm50');
MANSION.GGB('g_spooky_doll',	2, 'tr', '', 'doll');

MANSION.GGB('g_blond_child',	3, 'zr', 'speed', 'f10');
MANSION.GGB('g_eyeball',		3.4, 'tr', 'life', 'b40');
MANSION.GGB('g_old_ghoul',		3, 'c', 'power life', 'm80');

MANSION.GGB('g_hardy',			4, 'z', '', 'm40');
MANSION.GGB('g_triple',			5, 'ztr', '', 'triple');

