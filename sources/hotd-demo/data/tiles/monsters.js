/**
 * @var HOTD.TILES_MONSTERS
 */
O2.createObject('HOTD.TILES_MONSTERS', {
	m_zomb: {
		src: 'resources/sprites/m_zomb.png',
		width: 128,
		height: 192,
		scale: 2,
		frames: 28,
		animations: [
			[[13, 13, 13, 13, 13, 13, 13, 13], 1, 0, 0],		// stand
			[[0, 0, 0, 0, 0, 0, 0, 0], 5, 100, 1],   			// walk
			[[23, 23, 23, 23, 23, 23, 23, 23], 6, 100, 1],		// attack
			[[14, 14, 14, 14, 14, 14, 14, 14], 9, 100, 0],    	// death
			[[5, 5, 5, 5, 5, 5, 5, 5], 8, 100, 1]				// spawn
		]
	},

	m_skull: {
		src: 'resources/sprites/m_skull.png',
		width: 64,
		height: 96,
		frames: 13,
		animations: [
			[[0, 0, 0, 0, 0, 0, 0, 0], 1, 0, 0],				// stand
			[[0, 0, 0, 0, 0, 0, 0, 0], 3, 100, 1],   			// walk
			[[0, 0, 0, 0, 0, 0, 0, 0], 3, 40, 1],				// attack
			[[3, 3, 3, 3, 3, 3, 3, 3], 10, 100, 1],    			// death
			[[0, 0, 0, 0, 0, 0, 0, 0], 1, 0, 0]					// spawn
		]
	}
});