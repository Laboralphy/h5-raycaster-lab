// m: monster definition
// p: projectile definition
var BLUEPRINTS_DATA = {
		
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////
	////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES ////// PLACEABLES //////

	o_lootbag: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_lootbag',
		width: 32,
		height: 32,
		thinker: null,
		fx: 0,
		data: {
			lootbag: true
		}		
	},
	
	o_boom: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_boom',
		width: 1,
		height: 96,
		thinker: 'Timed',
		fx: 0,
		data: {}
	},
	
	o_teleport: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_teleport',
		width: 1,
		height: 96,
		thinker: 'Timed',
		fx: 2,
		data: {}
	},
	
	o_bubbles: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_bubbles',
		width: 40,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
			bubbles: true
		}
	},
	o_tree1: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree1',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	o_tree2: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree2',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	o_tree1b: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree1b',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	o_tree2b: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree2b',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	o_tree1v: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree1v',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	o_tree2v: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'o_tree2v',
		width: 64,
		height: 96,
		thinker: null,
		fx: 0,
		data: {
		}
	},
	
	
	
	
	
	
	
	
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////
	////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES ////// MISSILES //////

	p_firebolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_firebolt',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 2,
		data: {
			sounds: ['atk_fire', 'hit_fire'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_fireball: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_fireball',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 2,
		data: {
			sounds: ['atk_fire', 'hit_fire'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_toxicbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_toxicbolt',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_toxic', 'hit_toxic'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_toxicspit: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_toxicspit',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_toxic', 'hit_toxic'],
			speed: 80,
			steps: 4,
			range: 16
		}
	},
	
	p_thunbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_thunbolt',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 2,
		data: {
			sounds: ['atk_elec', 'hit_elec'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_magbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_magbolt',
		sounds: ['atk_magic', 'hit_magic'],
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 2,
		data: {
			sounds: ['atk_magic', 'hit_magic'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_shadbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_shadbolt',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_magic', 'hit_magic'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_healbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_healbolt',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_magic', 'hit_magic'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	// missile qui explose directement
	p_exptoxic: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_exptoxic',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_exp', 'hit_toxic'],
			speed: 20,
			steps: 1,
			range: 0
		}
	},	

	p_expfire: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_expfire',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_exp', 'hit_fire'],
			speed: 20,
			steps: 1,
			range: 0
		}
	},
	
	p_icebolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_icebolt',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_ice', 'hit_ice'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_medbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_medbolt',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 2,
		data: {
			sounds: ['atk_ice', 'hit_ice'],
			speed: 100,
			steps: 3,
			range: 30
		}
	},
	
	p_lightbolt: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_lightbolt',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 1,
		data: {
			sounds: ['atk_magic', 'hit_magic'],
			speed: 180,
			steps: 4,
			range: 30
		}
	},
	
	p_iceball: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_iceball',		
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_ice', 'hit_ice'],
			speed: 150,
			steps: 4,
			range: 30
		}
	},
	
	p_slash: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_slash',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_dag', 'hit_dag'],
			speed: 180,
			steps: 4,
			range: 1
		}
	},
	
	p_deathspell: {
		type: RC.OBJECT_TYPE_MISSILE,
		tile: 'p_deathspell',
		width: 1,
		height: 1,
		thinker: 'MagicMissile',
		fx: 0,
		data: {
			sounds: ['atk_magic', 'hit_magic'],
			speed: 360,
			steps: 4,
			range: 90
		}
	}
};
