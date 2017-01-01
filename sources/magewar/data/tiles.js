O2.createObject('MW.TILES_DATA', {
	m_warlock_b : {
		src : 'resources/tiles/sprites/m_warlock_b.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],	// stand
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 166, 1 ],		// walk
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],			// attack
				[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ] // death
	},

	m_succubus : {
		src : 'resources/tiles/sprites/m_succubus.png',
		width : 64,
		height : 96,
		frames : 67,
		animations : [ [ [ 17, 21, 25, 29, 0, 5, 9, 13 ], 1, 0, 0 ],	// stand
				[ [ 16, 20, 24, 28, 0, 4, 8, 12 ], 4, 166, 1 ],			// walk
				[ [ 44, 47, 50, 53, 32, 35, 38, 41 ], 3, 100, 2 ],		// attack
				[ [ 56, 56, 56, 56, 56, 56, 56, 56 ], 11, 50, 0 ] ] 	// death
	},
	
	m_imp1 : {
		src : 'resources/tiles/sprites/m_imp1.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
				[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
				[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
				[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
				[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	
	m_imp2 : {
		src : 'resources/tiles/sprites/m_imp2.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [ 
				[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
				[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
				[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [ 
				[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},

	m_pumpkin : {
		src : 'resources/tiles/sprites/m_pumpkin.png',
		width : 64,
		height : 96,
		frames : 19,
		noshading: true,
		animations : [ [ 
				[ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ], [
				[ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ], [
				[ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ], [
				[ 8, 8, 8, 8, 8, 8, 8, 8 ], 11, 50, 0 ] ]
	},

	m_bigknight : {
		src : 'resources/tiles/sprites/m_bigknight.png',
		width : 64,
		height : 96,
		frames : 51,
		animations : [ 
				[ [ 21, 26, 31, 36, 1, 6, 11, 16 ], 1, 0, 0 ],			// stand
				[ [ 20, 25, 30, 35, 0, 5, 10, 15 ], 3, 166, 2 ],		// walk
				[ [ 23, 28, 33, 38, 3, 8, 13, 18 ], 2, 100, 1 ],		// attack
				[ [ 40, 40, 40, 40, 40, 40, 40, 40 ], 11, 50, 0 ] ] 	// death
	},

	p_fireball : {
		src : 'resources/tiles/sprites/p_fireball.png',
		width : 50,
		height : 64,
		frames : 20,
		noshading: true,
		animations : [ [ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 4, 100, 0 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 100, 1 ] ]
	},

	p_magbolt : {
		src : 'resources/tiles/sprites/p_magbolt.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c2 : {
		src : 'resources/tiles/sprites/p_magbolt_c2.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c3 : {
		src : 'resources/tiles/sprites/p_magbolt_c3.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c4 : {
		src : 'resources/tiles/sprites/p_magbolt_c4.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c5 : {
		src : 'resources/tiles/sprites/p_magbolt_c5.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c6 : {
		src : 'resources/tiles/sprites/p_magbolt_c6.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c7 : {
		src : 'resources/tiles/sprites/p_magbolt_c7.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c8 : {
		src : 'resources/tiles/sprites/p_magbolt_c8.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	
	p_lightbolt : {
		src : 'resources/tiles/sprites/p_lightbolt.png',
		width : 64,
		height : 96,
		frames : 6,
		animations : [ [ [ 4, 4, 4, 4, 4, 4, 4, 4 ], 3, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 3, 50, 1 ] ]
	},

	p_spell: {
		src : 'resources/tiles/sprites/p_spell.png',
		width : 64,
		height : 51,
		frames : 8,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 6, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ] ]
	},
	
	p_spell_c2: {
		src : 'resources/tiles/sprites/p_spell_c2.png',
		width : 64,
		height : 51,
		frames : 8,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 6, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ] ]
	},
	
	p_bouncing: {
		src : 'resources/tiles/sprites/p_bouncing.png',
		width : 45,
		height : 45,
		frames : 5,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 3, 100, 0 ] ]
	},

	p_icebolt : {
		src : 'resources/tiles/sprites/p_icebolt.png',
		width : 48,
		height : 64,
		frames : 30,
		noshading: true,
		animations : [ [ [ 24, 24, 24, 24, 24, 24, 24, 24 ], 6, 100, 0 ],
				[ [ 12, 15, 18, 21, 0, 3, 6, 9 ], 3, 150, 1 ] ]
	},
	
	p_slash : {
		src : 'resources/tiles/sprites/p_slash.png',
		width : 64,
		height : 96,
		frames : 4,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 3, 100, 0 ],
				       [ [ 3, 3, 3, 3, 3, 3, 3, 3 ], 1, 0, 0 ] ]
	},
	

	e_hazes: {
		src : 'resources/tiles/sprites/e_hazes.png',
		width : 16,
		height : 24,
		frames : 16,
		noshading: true,
		animations : null
	},
	
	// objects
	o_smoke_white : {
		src : 'resources/tiles/sprites/o_smoke_white.png',
		width : 64,
		height : 96,
		frames : 10,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 9, 100, 0 ],
				[ [ 9, 9, 9, 9, 9, 9, 9, 9 ], 1, 1, 0 ] ]
	},
	
	o_teleport : {
		src : 'resources/tiles/sprites/o_teleport.png',
		width : 64,
		height : 96,
		frames : 8,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 100, 0 ],
				[ [ 7, 7, 7, 7, 7, 7, 7, 7 ], 1, 1, 0 ] ]
	},
	
	o_boom : {
		src : 'resources/tiles/sprites/o_boom.png',
		width : 64,
		height : 96,
		frames : 7,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 7, 100, 0 ] ]
	},
	
	o_expfire : {
		src : 'resources/tiles/sprites/o_expfire.png',
		width : 64,
		height : 96,
		frames : 8,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 100, 0 ] ]
	},
	
	o_bumporb : {
		src : 'resources/tiles/sprites/p_bouncing.png',
		width : 45,
		height : 45,
		frames : 5,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 3, 100, 0 ] ]
	},
	
	// icones
	i_icons32 : {
		src : 'resources/tiles/icons/icons32.png',
		width : 32,
		height : 32,
		frames : 64,
		noshading: true,
		animations : null
	},
	
	// icones 16
	i_icons16 : {
		src : 'resources/tiles/icons/icons16.png',
		width : 16,
		height : 32,
		frames : 64,
		noshading: true,
		animations : null
	}
});
