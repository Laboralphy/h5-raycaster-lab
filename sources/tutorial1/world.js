var WORLD_DATA = {
	level1: {
		walls: {
			src: 'walls.png',
			codes: [
				null,		// walkable floor
				[0, 0],		// solid wall
				[3, 3]		// happy face
			]
		},
		
		flats: {
			src: 'flats.png',
			codes: [
				[0, 1],		// walkable floor
				null,		// solid wall
				null		// happy face
			]
		},
		
		// the map must be square sized
		map: [
			[0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x1001, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x1001, 0x0000, 0x1001, 0x1001, 0x1001, 0x1001, 0x0000, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x1001, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x0000, 0x0000, 0x0000, 0x1001, 0x0000, 0x0000, 0x0000, 0x1001 ],
			[0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001, 0x1001 ]
		],
		
		visual: {
			ceilColor: {r: 100, g: 100, b: 100},      // ceiling tint
			floorColor: {r: 100, g: 100, b: 100},     // floor tint
			light: 100,                               // brightness (200 = bright, 50 = dark
			fogDistance: 1,                           // fog distance (recommanded value 1)
			fogColor: {r: 0, g: 0, b: 0},             // fog color
			filter: false,							  // color filter for sprites
			diffuse: 0								  // ambient brightness
		},
		
		startpoint: {
			x: 128 + 32,
			y: 128 + 32,
			angle: 0
		},
		
		tiles: {},			// no tile
		blueprints: {},		// no blueprint
		objects: []			// no object
	}
};
