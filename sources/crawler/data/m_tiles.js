var MONSTERS_TILES = {
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////
	////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS ////// MONSTERS //////

		
	m_myco : {
		src : 'resources/gfx/sprites/m_myco.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
			[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
			[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
			[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
			[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	
	m_myco2 : {
		src : 'resources/gfx/sprites/m_myco2.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
			[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
			[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
			[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
			[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	
	m_myco3 : {
		src : 'resources/gfx/sprites/m_myco3.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
			[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
			[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
			[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
			[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	
	m_bigface : {
		src : 'resources/gfx/sprites/m_bigface.png',
		width : 64,
		height : 96,
		frames : 83,
		animations : [ [ 
				[ 36, 45, 54, 63, 0, 9, 18, 27 ], 1, 0, 0 ], [ // Stand
				[ 37, 46, 55, 64, 1, 10, 19, 28 ], 7, 100, 1 ], [ // Walk
				[ 43, 52, 61, 70, 7, 16, 25, 34 ], 2, 250, 1 ], [ // Attack
				[ 72, 72, 72, 72, 72, 72, 72, 72 ], 11, 50, 0 ] ]// Death
	},
	m_bigface2 : {
		src : 'resources/gfx/sprites/m_bigface2.png',
		width : 64,
		height : 96,
		frames : 83,
		animations : [ [ 
				[ 36, 45, 54, 63, 0, 9, 18, 27 ], 1, 50, 0 ], [ // Stand
				[ 37, 46, 55, 64, 1, 10, 19, 28 ], 7, 100, 1 ], [ // Walk
				[ 43, 52, 61, 70, 7, 16, 25, 34 ], 2, 250, 1 ], [ // Attack
				[ 72, 72, 72, 72, 72, 72, 72, 72 ], 11, 50, 0 ] ]// Death
	},
	m_bigarmor : {
		src : 'resources/gfx/sprites/m_bigarmor.png',
		width : 64,
		height : 96,
		frames : 91,
		animations : [ [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 1, 50, 0 ], [
				[ 41, 51, 61, 71, 1, 11, 21, 31 ], 7, 100, 1 ], [
				[ 48, 58, 68, 78, 8, 18, 28, 38 ], 2, 250, 1 ], [
				[ 80, 80, 80, 80, 80, 80, 80, 80 ], 11, 50, 0 ] ]
	},
	m_bigpirate : {
		src : 'resources/gfx/sprites/m_bigpirate.png',
		width : 64,
		height : 96,
		frames : 83,
		animations : [ [ 
				[ 36, 45, 54, 63, 0, 9, 18, 27 ], 1, 0, 0 ], [ // Stand
				[ 37, 46, 55, 64, 1, 10, 19, 28 ], 7, 100, 1 ], [ // Walk
				[ 43, 52, 61, 70, 7, 16, 25, 34 ], 2, 250, 1 ], [ // Attack
				[ 72, 72, 72, 72, 72, 72, 72, 72 ], 11, 50, 0 ] ]// Death
	},
	m_acidblob : {
		src : 'resources/gfx/sprites/m_blob.png',
		width : 64,
		height : 96,
		frames : 87,
		animations : [ [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 8, 200, 2 ], [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 8, 200, 2 ], [
				[ 48, 58, 68, 78, 8, 18, 28, 38 ], 2, 50, 2 ], [
				[ 80, 80, 80, 80, 80, 80, 80, 80 ], 7, 50, 0 ] ]
	},
	m_fireblob : {
		src : 'resources/gfx/sprites/m_blob2.png',
		width : 64,
		height : 96,
		frames : 87,
		animations : [ [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 8, 200, 2 ], [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 8, 200, 2 ], [
				[ 48, 58, 68, 78, 8, 18, 28, 38 ], 2, 50, 2 ], [
				[ 80, 80, 80, 80, 80, 80, 80, 80 ], 7, 50, 0 ] ]
	},
	m_wasp : {
		src : 'resources/gfx/sprites/m_wasp.png',
		width : 64,
		height : 96,
		frames : 23,
		animations : [ [
				[ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 50, 1 ], [
				[ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 50, 1 ], [
				[ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 50, 1 ], [
				[ 15, 15, 15, 15, 15, 15, 15, 15 ], 7, 50, 0 ] ]
	},
	m_raven : {
		src : 'resources/gfx/sprites/m_raven.png',
		width : 64,
		height : 96,
		frames : 63,
		animations : [ [
				[ 28, 35, 42, 49, 0, 7, 14, 21 ], 1, 0, 0 ], [
				[ 29, 36, 43, 50, 1, 8, 15, 22 ], 6, 200, 1 ], [
				[ 29, 36, 43, 50, 1, 8, 15, 22 ], 6, 100, 1 ], [
				[ 57, 57, 57, 57, 57, 57, 57, 57 ], 7, 50, 0 ] ]
	},
	m_imp1 : {
		src : 'resources/gfx/sprites/m_imp1.png',
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
		src : 'resources/gfx/sprites/m_imp2.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [ // Stand
				[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ // Walk
				[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ // Attack
				[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [ // Death
				[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	m_phanto : {
		src : 'resources/gfx/sprites/m_otto.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 1, 0, 0 ], [
				[ 41, 51, 61, 71, 1, 11, 21, 31 ], 5, 150, 1 ], [ 
				[ 46, 56, 66, 76, 6, 16, 26, 36 ], 4, 100, 0 ], [
				[ 80, 80, 80, 80, 80, 80, 80, 80 ], 7, 50, 0 ] ]
	},
	m_turret : {
		src : 'resources/gfx/sprites/m_roboturret.png',
		width : 64,
		height : 96,
		frames : 15,
		animations : [ [ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ],
				[ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 7, 50, 0 ] ]
	},
	m_spider : {
		src : 'resources/gfx/sprites/m_spider.png',
		width : 64,
		height : 96,
		frames : 71,
		animations : [ [ [ 32, 40, 48, 56, 0, 8, 16, 24 ], 1, 0, 0 ],
				[ [ 33, 41, 49, 57, 1, 9, 17, 25 ], 7, 100, 1 ],
				[ [ 32, 40, 48, 56, 0, 8, 16, 24 ], 1, 0, 0 ],
				[ [ 64, 64, 64, 64, 64, 64, 64, 64 ], 7, 50, 0 ] ]
	},
	m_cube : {
		src : 'resources/gfx/sprites/m_cube.png',
		width : 64,
		height : 96,
		frames : 135,
		animations : [ [ [ 64, 80, 96, 112, 0, 16, 32, 48 ], 1, 0, 0 ],
				[ [ 64, 80, 96, 112, 0, 16, 32, 48 ], 16, 100, 1 ],
				[ [ 76, 92, 108, 124, 12, 28, 44, 60 ], 1, 0, 0 ],
				[ [ 128, 128, 128, 128, 128, 128, 128, 128 ], 7, 50, 0 ] ]

	},
	m_pumpkin : {
		src : 'resources/gfx/sprites/m_pumpkin.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [ [ 24, 30, 36, 42, 0, 6, 12, 18 ], 1, 0, 0 ],
				[ [ 25, 31, 37, 43, 1, 7, 13, 19 ], 4, 200, 1 ],
				[ [ 24, 30, 36, 42, 0, 6, 12, 18 ], 1, 0, 0 ],
				[ [ 48, 48, 48, 48, 48, 48, 48, 48 ], 11, 50, 0 ] ]
	},
	m_warlock : {
		src : 'resources/gfx/sprites/m_warlock.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 100, 1 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ]
	},
	m_warlock2 : {
		src : 'resources/gfx/sprites/m_warlock2.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 100, 1 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ]
	},
	m_pira : {
		src : 'resources/gfx/sprites/m_pira.png',
		width : 64,
		height : 96,
		frames : 23,
		animations : [ [
				[ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ], [    // stand
				[ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 150, 1 ], [  // walk
				[ 9, 11, 13, 15, 1, 3, 5, 7 ], 1, 0, 0 ], [  // attack
				[ 16, 16, 16, 16, 16, 16, 16, 16 ], 7, 50, 0 ] ]   // death
	},
	m_medusa : {
		src : 'resources/gfx/sprites/m_medusa.png',
		width : 64,
		height : 96,
		frames : 71,
		animations : [ [
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [    // stand
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [  // walk
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [  // attack
				[ 64, 64, 64, 64, 64, 64, 64, 64], 7, 50, 0 ] ]   // death
	},
	m_medusaqueen : {
		src : 'resources/gfx/sprites/m_medusaqueen.png',
		width : 64,
		height : 96,
		frames : 71,
		animations : [ [
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [    // stand
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [  // walk
				[ 32, 40, 48, 56, 0, 8, 16, 24 ], 8, 100, 1 ], [  // attack
				[ 64, 64, 64, 64, 64, 64, 64, 64], 7, 50, 0 ] ]   // death
	},
	
	m_adventurer : {
		src : 'resources/gfx/sprites/m_soldier.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 17, 21, 25, 29, 1, 5, 9, 13 ], 1, 0, 0 ],
				[ [ 16, 20, 24, 28, 0, 4, 8, 12 ], 4, 200, 1 ],
				[ [ 17, 21, 25, 29, 1, 5, 9, 13 ], 1, 0, 0 ],
				[ [ 32, 32, 32, 32, 32, 32, 32, 32 ], 11, 50, 0 ] ]
	},
	
	
	
	m_bigfaceboss: {
		src : 'resources/gfx/sprites/m_bigfaceboss.png',
		width: 64,
		height: 96,
		frames : 83,
		animations : [ [ 
				[ 36, 45, 54, 63, 0, 9, 18, 27 ], 1, 0, 0 ], [ // Stand
				[ 37, 46, 55, 64, 1, 10, 19, 28 ], 7, 150, 1 ], [ // Walk
				[ 43, 52, 61, 70, 7, 16, 25, 34 ], 2, 250, 1 ], [ // Attack
				[ 72, 72, 72, 72, 72, 72, 72, 72 ], 11, 50, 0 ] ]// Death
	},
	m_bigarmorboss: {
		src : 'resources/gfx/sprites/m_bigarmorboss.png',
		width: 64,
		height: 96,
		frames : 83,
		animations : [ [
				[ 40, 50, 60, 70, 0, 10, 20, 30 ], 1, 50, 0 ], [
				[ 41, 51, 61, 71, 1, 11, 21, 31 ], 7, 150, 1 ], [
				[ 48, 58, 68, 78, 8, 18, 28, 38 ], 2, 250, 1 ], [
				[ 80, 80, 80, 80, 80, 80, 80, 80 ], 11, 50, 0 ] ]
	},
	m_warlockboss : {
		src : 'resources/gfx/sprites/m_warlockboss.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 150, 1 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],
				[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ]
	}

};
