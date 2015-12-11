O2.createObject('WORLD_DATA', {
	level1: {
		map: [
		    '####################',
		    '#         #        #',
		    '#         #        #',
		    '#                  #',
 		    '#         #        #',
		    '#         #        #',
		    '#      #######     #',
		    '#      #     #     #',
		    '#      #     #     #',
		    '### ####     ### ###',
		    '#      #     #     #',
		    '#      #     #     #',
		    '#      ### ###     #',
		    '#                  #',
		    '#                  #',
		    '### ################',
		    '#      #           #',
		    '#                  #',
		    '#      #           #',
		    '####################'	      
		],
		walls: {
			src : 'resources/gfx/textures/walls.png',
			codes : [
			    null,
			    [0, 1]
			],
			metacodes : {
				' ': [0x000],
				'#': [0x101],
			},
		},
		flats: {
			src : 'resources/gfx/textures/flats.png',
			codes : [
			    [0, 1],
			    null,
			]
		},
		visual: {
			ceilColor : { r : 48, g : 48, b : 48},
			floorColor : { r : 64, g : 64, b : 64 },
			filter : false,
			light : 200,
			fogDistance : 1,
			fogColor : { r : 0, g : 0, b : 0}
		},
	
		startpoint: { x: 256, y: 256, angle: 0 },
		tiles: {
			'o_lootbag' : {
			      src: 'resources/gfx/sprites/o_lootbag.png',
			      width: 22,
			      height: 128,
			      frames: 1,
			      animations: [[[0, 0, 0, 0, 0, 0, 0, 0], 1, 1, 0]]				
			}
		},
		blueprints: {
			o_lootbag: {
		      type: 3,                            // Type logique
		      tile: 'o_lootbag',                         // Référence de la Tile
		      width: 22,                           // Taille physique : longueur
		      height: 30,                          // Taille physique : hauteur
		      thinker: null,                      // Thinker utilisé
		      fx: 0,                              // Flag d'effets spéciaux (0 = pas d'effet. 1 = Lighter le sprite est lumineux translucide. 2 = Le sprite n'est pas affecté par la luminosité)
		      data: null                          // Données supplémentaires
			}
		},
		objects: [{
			blueprint: 'o_lootbag',
			x: 64 * 1.5,
			y: 64 * 1.5,
			angle: 0
		}]
	}
});
