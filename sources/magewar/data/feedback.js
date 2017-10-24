/**
 * Décrit les effet de feedback visuel indiquant qu'on a utilisé un objet ou casté un sort.
 */
O2.createObject('MW.FEEDBACK', {
	pot_haste: {
		flash: [0x00FF66, 50, 3],
		sound: 'amb_gloom',
	},
	pot_luck: {
		flash: [0x00AAFF, 50, 4],
		sound: 'amb_gloom',
	},
	pot_energy: {
		flash: [0x00FF00, 75, 5, 0x0088FF, 40, 2],
		sound: 'amb_gloom',
	},
	pot_resist: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'amb_gloom',
	},
	pot_healing: {
		sound: 'amb_gloom',
	},
	pot_healing2: {
		sound: 'amb_gloom',
	},
	pot_healing3: {
		sound: 'amb_gloom',
	},
	pot_invisibility: {
		flash: [0x9900BB, 50, 3],
		sound: 'amb_gloom',
	},
	pot_esp: {
		flash: [0x00BBFF, 50, 2],
		sound: 'amb_gloom',
	},
	pot_remedy: {
		flash: [0xFFFF00, 50, 2],
		sound: 'amb_gloom',
	},
	pot_slowness: {
		flash: [0x880000, 50, 3],
		sound: 'amb_gloom2',
	},
	pot_poison: {
		flash: [0x000066, 30, 3],
		sound: 'amb_gloom2',
	},
	pot_immortal: {
		flash: [0xFFFF00, 50, 4],
		sound: 'amb_gloom'
	},

	scr_blindness: {
		flash: [0xFFFFFF, 50, 10, 0, 66, 3],
		sound: 'm_chant'
	},
	scr_confusion: {
		flash: [0xCC0000, 55, 4],
		sound: 'm_chant'
	},
	scr_drainlife: {
		flash: [0x990000, 50, 10, 0x440088, 50, 4],
		sound: 'amb_gloom'
	},
	scr_hold: {
		flash: [0xFFFFFF, 50, 4],
		sound: 'm_chant'
	},
	scr_power: {
		flash: [0xFFFFFF, 75, 10, 0xFFFF00, 75, 5, 0xFF0000, 75, 2],
		sound: 'amb_gloom',
	},
	scr_reflect: {
		flash: [0x0044FF, 50, 2],
		sound: 'amb_gloom',
	},
	scr_root: {
		flash: [0x00FFFF, 50, 4],
		sound: 'm_chant'
	},
	scr_snare: {
		flash: [0x0000FF, 50, 4],
		sound: 'm_chant'
	},
	scr_teleport: {
		flash: [0xFFFFFF, 100, 10, 0x0088FF, 50, 4],
	},
	scr_fireball: {
		flash: [0xFFFF00, 50, 10, 0xFF8800, 50, 4],
	},
	scr_magnet: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'm_chant'
	},
	scr_dispel: {
		flash: [0xFFFFFF, 50, 5, 0x0000FF, 30, 2],
		sound: 'm_chant'
	},

	book_fireball: {
		flash: [0xFFFF00, 50, 10, 0xFF8800, 50, 4],
	},
	book_bouncingorb: {
		flash: [0xFFFFFF, 50, 10, 0xFFFF00, 50, 5, 0x00FF00, 50, 3],
	},
	book_nullitysphere: {
		flash: [0xFFFF00, 50, 4],
		sound: 'amb_gloom',
	},
	book_deathspell: {
		flash: [0x440088, 40, 10, 0x000000, 50, 3],
		sound: 'm_chant',
	},
	book_charm: {
		flash: [0xFF66AA, 50, 4],
		sound: 'amb_gloom3',
	},
	book_clairvoyance: {
		flash: [0xAAFFAA, 50, 4],
		sound: 'amb_gloom',
	},
	book_amnesia: {
		flash: [0x993355, 50, 4],
		sound: 'm_chant',
	},
	book_remind: {
		flash: [0x00AA55, 50, 4],
		sound: 'amb_gloom',
	},
	book_magicshutdown: {
		flash: [0xAAAAFF, 50, 4],
		sound: 'm_chant',
	},
	book_mkscroll: {
		flash: [0xFFBB66, 50, 4, 0x440088, 75, 2],
		sound: 'amb_gloom'
	},
	book_deflector: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'amb_gloom'
	},
	book_freeze: {
		flash: [0xFFFFFF, 50, 10, 0x00AAFF, 50, 4],
	}


});
