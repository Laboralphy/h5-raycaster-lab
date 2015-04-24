O2.createObject('MAGIC_DATA_PARAMS', {
	COOLDOWN: {
		SHORT: 5000,
		MEDIUM: 30000,
		LONG: 60000,
		VERYLONG: 120000
	}
});
		
		
O2.createObject('MAGIC_DATA', {
	DrainLife: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.MEDIUM,
		mp: 10,
		visual: [0xFF0000, 66, 7, 0x0000FF, 66, 5],
		sound: 'SPELL_1',
		icon: 'eff_sdrn',
		target: false
	},
	
	Teleport: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.SHORT,
		mp: 5,
		visual: [0x008800, 66, 7, 0x0000FF, 66, 5],
		sound: 'FX_TELEPORT',
		icon: 'spl_tele',
		target: true
	},
	
	Knock: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.LONG,
		mp: 10,
		visual: [0xFF00FF, 66, 7, 0x88FF00, 66, 3],
		sound: 'SPELL_1',
		icon: 'spl_knock',
		target: false
	},
	
	DeathSpell: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.LONG,
		mp: 10,
		visual: [0x000000, 66, 12, 0xCCFFFF, 66, 8],
		sound: 'SPELL_1',
		icon: 'eff_xdth',
		target: true
	},
	
	MagicMapping: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.LONG,
		mp: 10,
		visual: [0x00FF00, 66, 7, 0xFFAA00, 66, 5],
		sound: 'SPELL_1',
		icon: 'spl_mmap',
		target: false
	},
	
	SummonFood: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.LONG,
		mp: 10,
		visual: [0xFFFF00, 66, 7, 0x008800, 66, 5],
		sound: 'SPELL_0',
		icon: 'spl_sfood',
		target: false
	},
	
	Reflect: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.MEDIUM,
		mp: 5,
		visual: [0x00FFFF, 66, 7, 0x0066FF, 66, 5],
		sound: 'SPELL_1',
		icon: 'eff_bref',
		target: false
	},
	
	Light: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.SHORT,
		mp: 0,
		visual: [0xFFFFFF, 66, 5, 0xFFFF88, 66, 2],
		sound: 'SPELL_1',
		icon: 'spl_light',
		target: false
	},
	
	TimeStop: {
		cooldown: MAGIC_DATA_PARAMS.COOLDOWN.LONG,
		mp: 15,
		visual: [0xFFFFFF, 50, 5],
		sound: 'SPELL_1',
		icon: 'spl_stf',
		target: false
	},
});