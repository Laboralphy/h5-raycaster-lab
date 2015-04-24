/** World Data définition du monde
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */
// options : p : portal ; b : bigrooms ; f : fusion ; 0, 1, 2, 3: room size
O2.createObject('WORLD_DATA.dungeons', {
	/* dungeon flags : 
		L: Last floor : exit elevator room is treasure room, X is Boss !
	 */
	forest : [ {
		generator : 'forest',
		options : '-ls1',
		textures : 't_forest',
		flats: 'resources/gfx/textures/f_forest1.png',
		visual: 'forest',
		music: 'MUSIC_FOREST',
		level : 1,
		transit: { 
			entrance : false
		},
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_myco: {
				levels: [0, 1, 2, 3, 4, 5, 6, 7, 8]
			},
			m_myco2: {
				levels: [5, 6, 7, 8, 9, 10]
			}
		},
		statics : {
			o_tree1 : {
				levels : [ 0, 1 ]
			},
			o_tree2 : {
				levels : [ 0, 1 ]
			}
		},
		shops: []
	}, {
		generator : 'forest',
		options : '-w1',
		textures : 't_darkwoods',
		flats: 'resources/gfx/textures/f_forest2.png',
		visual: 'darkfall',
		music: 'MUSIC_FOREST',
		level : 1,
		transit: { 
			exit : ['d1', 0]
		},
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
		},
		statics : {
			o_tree1b : {
				levels : [ 0, 1 ]
			},
			o_tree2b : {
				levels : [ 0, 1 ]
			}
		},
		shops: []
	} ], 
	d1 : [ {
		generator : 'dungeon',
		options : '',
		textures : 't_gray',
		flats: 'resources/gfx/textures/f_gray.png',
		visual: 'dark',
		music: 'MUSIC_DUNGEON',
		level : 1,
		transit: { entrance : ['forest', 1, 2] },
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_bigface : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_wasp : {
				levels : [ 4, 5, 6, 7, 8, 9 ]
			},
			m_madface : {
				levels : [ 7, 8, 9, 10 ]
			}
		},
		shops: []
	}, {
		generator : 'dungeon',
		options : '-rs1-ls1',
		textures : 't_blue',
		flats: 'resources/gfx/textures/f_blue.png',
		visual: 'darkblue',
		music: 'MUSIC_DUNGEON',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_bigface : {
				levels : [ 0, 1, 2, 3, 4, 5, 6 ]
			},
			m_madface : {
				levels : [ 3, 4, 5, 6, 7, 8, 9, 10 ]
			},
			m_acidblob : {
				levels : [ 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_wasp : {
				levels : [ 7, 8, 9 ]
			}
		},
		shops: [WORLD_DATA.shops.firstaid_2, WORLD_DATA.shops.magic_2]
	}, {
		generator : 'dungeon',
		options : '-ls2',
		textures : 't_green',
		flats: 'resources/gfx/textures/f_green.png',
		visual: 'darkgreen',
		music: 'MUSIC_DUNGEON',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde: {
			m_myco3 : {
				levels : [ 0, 1, 2, 3, 4, 5, 6 ]
			},
			m_wasp : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
			},
			m_acidblob : {
				levels : [ 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_imp1 : {
				levels : [ 7, 8, 9, 10 ]
			},
			m_imp2 : {
				levels : [ 7, 8, 9, 10 ]
			}
		},
		shops: [WORLD_DATA.shops.jewels_2, WORLD_DATA.shops.potions_1]
	}, {
		generator : 'dungeon',
		options : '-ls2-rs1',
		textures : 't_iron',
		flats: 'resources/gfx/textures/f_gray.png',
		visual: 'dark',
		music: 'MUSIC_DUNGEON',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde: {
			m_raven : {
				levels : [ 0, 1, 2, 3, 4, 5, 6 ]
			},
			m_fireblob : {
				levels : [ 7, 8, 9 ]
			},
			m_turret : {
				levels : [ 3, 4, 5, 6 ]
			},
			m_cube : {
				levels : [ 7, 8, 9, 10 ]
			}
		},
		shops: [WORLD_DATA.shops.potions_2, WORLD_DATA.shops.jewels_2r]
	}, {
		generator : 'dungeon',
		options : '-ts3-rs1-t1',
		textures : 't_crimson',
		flats: 'resources/gfx/textures/f_red.png',
		visual: 'hellish',
		music: 'MUSIC_DUNGEON',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde: {
			m_bigarmor : {
				levels : [ 0, 1, 2, 3, 4, 5, 6 ]
			},
			m_spider : {
				levels : [ 0, 1, 2, 3, 4, 5, 6 ]
			},
			m_fireblob : {
				levels : [ 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_warlock : {
				levels : [ 7, 8, 9, 10 ]
			},
			m_pumpkin: {
				levels : [ 9, 10 ]
			}
		},
		shops: [WORLD_DATA.shops.potions_3, WORLD_DATA.shops.firstaid_2, WORLD_DATA.shops.firstaid_2]
	}, {
		generator : 'boss',
		options : '',
		textures : 't_crimson',
		flats: 'resources/gfx/textures/f_red.png',
		visual: 'hellish',
		music: 'MUSIC_BOSS',
		transit: {
			exit: ['treasure', 0, 0]
		},
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde: {
			m_warlock : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_warlock2 : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_warlockboss : {
				levels : [ 10 ]
			}
		},
		shops: []
	}], 
	
	treasure: [{
		generator : 'special',
		options : '',
		textures : 't_treasure',
		visual: 'darkbrown',
		music: 'MUSIC_TREASURE',
		transit: {
			entrance: ['d1', 5, 1],
			exit: false
		},
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde: {
		},
		shops: []
	}],

	mines : [ {
		generator : 'mines',
		options : '',
		textures : 't_mines3',
		visual: 'deeper',
		music: 'MUSIC_MINES',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_spider : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_madface : {
				levels : [ 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_imp1 : {
				levels : [ 7, 8, 9, 10 ]
			}
		},
		shops: [WORLD_DATA.shops.potions_1, WORLD_DATA.shops.jewels_2b]
	}, {
		generator : 'mines',
		options : '-ls1',
		textures : 't_mines2',
		visual: 'deeper',
		music: 'MUSIC_MINES',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_madface : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_imp1 : {
				levels : [ 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_cube : {
				levels : [ 7, 8, 9, 10 ]
			},
			m_imp2 : {
				levels : [ 7, 8, 9, 10 ]
			}
		},
		shops: [WORLD_DATA.shops.firstaid_2, WORLD_DATA.shops.blacksmith_2]
	}, {
		generator : 'boss',
		options : '',
		textures : 't_mines',
		visual: 'deeper',
		music: 'MUSIC_BOSS',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_bigface : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_madface : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_bigfaceboss : {
				levels : [ 10 ]
			}
		},
		shops: []
	}],
	
	medusa: [{
		generator : 'cave',
		map: O876.MapTranslater.process(		
		[
			'#########################', 
			'####################..###', 
			'###########..o#####....##', 
			'####<#####..............#', 
			'###waw###....###?###.o..#', 
			'#..-[-..##..###.?.##....#', 
			'#.......###o###$!.#....##', 
			'#.......###.#####$#...###', 
			'####.######[########.####', 
			'####[####.......####...##', 
			'####...##.......##......#', 
			'####....#..-]-..#o......#', 
			'###.....###wbw###.......#', 
			'###.#.o#####>####.......#', 
			'###o#.############.....##', 
			'###.#.$############..####', 
			'###.#.#############..####', 
			'##..#######...#####...###', 
			'#....#####.....###.....##', 
			'#....#####.....o........#', 
			'#..o..####.........o....#', 
			'#...............#.......#', 
			'#......###......##......#', 
			'##.....####....####....##', 
			'#########################'
		],
		{
			'.': LABY.BLOCK_VOID,
			'#': LABY.BLOCK_WALL,
			'$': LABY.BLOCK_TREASURE,
			'?': LABY.BLOCK_SECRET,
			'!': LABY.BLOCK_SECRET_WALL,
			'w': LABY.BLOCK_ELEVATOR_WALL,
			'[': LABY.BLOCK_ELEVATOR_DOOR_PREV,
			'<': LABY.BLOCK_ELEVATOR_SWITCH_PREV,
			'b': LABY.BLOCK_ELEVATOR_EXIT,
			'a': LABY.BLOCK_ELEVATOR_ENTRANCE,
			'-': LABY.BLOCK_ELEVATOR_DOORWAY_X,
			']': LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED,
			'>': LABY.BLOCK_ELEVATOR_SWITCH_NEXT,
			'o': LABY.BLOCK_SOB_TYPE_1
		}),
		options : '',
		textures : 't_graywater',
		visual: 'valvewater',
		music: 'MUSIC_DUNGEON',
		level : 1,
		transit: {
			entrance : false
		},
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
		},
		statics : {
			o_bubbles : {
				levels : [ 0, 1, 2, 3, 4 ]
			}
		},
		shops: []
	},{
		generator : 'cave',
		options : '-ls1-d1',
		textures : 't_water',
		visual: 'underwater',
		music: 'MUSIC_UNDERWATER',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_pira : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
			},
			m_bigpirate : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
			},
			m_medusa : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
			}
		},
		statics : {
			o_bubbles : {
				levels : [ 0, 1, 2, 3, 4 ]
			}
		},
		shops: []
	},{
		generator : 'boss',
		options : '-d1',
		textures : 't_water',
		visual: 'underwater',
		music: 'MUSIC_BOSS',
		level : 1,
		loot: {
			chest: 'basic_chest',
			closet: 'basic_closet',
			bigchest: 'basic_bigchest'
		},
		horde : {
			m_medusa : {
				levels : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
			},
			m_medusaqueen : {
				levels : [ 10 ]
			}
		},
		statics : {
			o_bubbles : {
				levels : [ 0, 1, 2, 3, 4 ]
			}
		},
		shops: []
	}]
});
