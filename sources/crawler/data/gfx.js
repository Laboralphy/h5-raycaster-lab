// Code des briques de terrain utilisée dans le générateur de laby
var LABY = {

	// Normal
	BLOCK_VOID : 0,
	BLOCK_WALL : 1,
	BLOCK_DOOR : 2,
	BLOCK_DOORWAY_X : 3,
	BLOCK_DOORWAY_Y : 4,
	BLOCK_WINDOW : 5,
	BLOCK_TREASURE : 6,
	BLOCK_SECRET : 7,
	BLOCK_SECRET_WALL : 8,
	BLOCK_CURTAIN : 9,
	BLOCK_WALL_TORCH : 0xA,
	BLOCK_WALL_GRATE : 0xB,
	BLOCK_WALL_ALCOVE : 0xC,
	BLOCK_RELIC_CHEST : 0xD,
	BLOCK_SHOP : 0xE,

	// Keys and locked doors
	BLOCK_KEY_0 : 0x10,
	BLOCK_KEY_1 : 0x11,
	BLOCK_KEY_2 : 0x12,
	BLOCK_KEY_3 : 0x13,
	BLOCK_EMPTY_KEY : 0x14,
	BLOCK_EMPTY_CHEST : 0x15,
	BLOCK_EMPTY_RELIC_CHEST : 0x16,
	BLOCK_LOCKEDDOOR_0 : 0x18,
	BLOCK_LOCKEDDOOR_1 : 0x19,
	BLOCK_LOCKEDDOOR_2 : 0x1A,
	BLOCK_LOCKEDDOOR_3 : 0x1B,
	BLOCK_UNLOCKEDDOOR : 0x1C,

	// lib
	BLOCK_LIBRARY_BOOK : 0x20,
	BLOCK_CHURCH_STAINED_GLASS : 0x2A,
	BLOCK_CHURCH_DEATH_IDOL : 0x2B,
	BLOCK_CHURCH_RUNES : 0x2C,

	// Jail
	BLOCK_JAIL_WALL_SHACKLES_X : 0x30,
	BLOCK_JAIL_WALL_SHACKLES_Y : 0x31,
	BLOCK_JAIL_BARS : 0x32,
	BLOCK_JAIL_DOOR : 0x33,

	// Watch
	BLOCK_WATCH_WALL : 0x40,
	BLOCK_WATCH_DOORWAY_X : 0x41,
	BLOCK_WATCH_DOORWAY_Y : 0x42,
	BLOCK_WATCH_WALL_2_X : 0x43,
	BLOCK_WATCH_WALL_2_Y : 0x44,
	BLOCK_WATCH_DOOR_LOCKED : 0x45,
	BLOCK_WATCH_WINDOW : 0x46,
	BLOCK_WATCH_TREASURE : 0x47,
	BLOCK_WATCH_WALL_2_X_USED : 0x48,
	BLOCK_WATCH_WALL_2_Y_USED : 0x49,

	// Labo
	BLOCK_LABO_WALL : 0x50,
	BLOCK_LABO_CLOSET_X : 0x51,
	BLOCK_LABO_CLOSET_Y : 0x52,
	BLOCK_LABO_BOOK : 0x53,
	BLOCK_LABO_ALCHEMY : 0x54,
	// forge
	BLOCK_FORGE_ANVIL : 0x55,
	BLOCK_FORGE_TOOLS : 0x56,
	// kitchen
	BLOCK_KITCHEN_TABLE : 0x5A,
	BLOCK_KITCHEN_FOOD : 0x5B,
	// Labo again
	BLOCK_LABO_CLOSET_X_OPEN : 0x5C,
	BLOCK_LABO_CLOSET_Y_OPEN : 0x5D,

	// Living
	BLOCK_LIVING_WALL : 0x60,
	BLOCK_LIVING_FIREPLACE : 0x61,
	BLOCK_LIVING_PICTURE : 0x62,
	BLOCK_LIVING_BOOK : 0x63,
	BLOCK_LIVING_TAPESTRY : 0x64,

	// Elevator 
	BLOCK_ELEVATOR_WALL : 0x80,					// 128
	BLOCK_ELEVATOR_DOOR_PREV : 0x81,			// 129
	BLOCK_ELEVATOR_DOOR_NEXT_SEALED : 0x82,		// 130
	BLOCK_ELEVATOR_SWITCH_NEXT : 0x83,			// 131
	BLOCK_ELEVATOR_EXIT : 0x84,					// 132
	BLOCK_ELEVATOR_ENTRANCE : 0x85,				// 133
	BLOCK_ELEVATOR_DOORWAY_X : 0x86,			// 134
	BLOCK_ELEVATOR_DOORWAY_Y : 0x87,			// 135
	BLOCK_ELEVATOR_SWITCH_PREV : 0x88,			// 136
	BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED : 0x89,	// 137
	BLOCK_ELEVATOR_SWITCH_PORTAL : 0x8A,		// 138
	BLOCK_ELEVATOR_PORTAL : 0x8B,				// 139

	// Décorative : forest
	BLOCK_FOREST_TREE : 0xA0,
	BLOCK_FOREST_WALL : 0xA1,
	BLOCK_FOREST_BUSH : 0xA2,
	BLOCK_FOREST_FENCE : 0xA3,
	BLOCK_FOREST_SHADOW_WALL : 0xA4,
	BLOCK_FOREST_SHADOW_WINDOW : 0xA5,
	BLOCK_FOREST_WALL_IVY : 0xA6,

	//mobs
	BLOCK_MOB_LEVEL_0 : 0xF0,
	BLOCK_MOB_LEVEL_1 : 0xF1,
	BLOCK_MOB_LEVEL_2 : 0xF2,
	BLOCK_MOB_LEVEL_3 : 0xF3,
	BLOCK_MOB_LEVEL_4 : 0xF4,
	BLOCK_MOB_LEVEL_5 : 0xF5,
	BLOCK_MOB_LEVEL_6 : 0xF6,
	BLOCK_MOB_LEVEL_7 : 0xF7,
	BLOCK_MOB_LEVEL_8 : 0xF8,
	BLOCK_MOB_LEVEL_9 : 0xF9,
	BLOCK_MOB_LEVEL_X : 0xFA,
	
	BLOCK_SOB_TYPE_1 : 0xFB,
	BLOCK_SOB_TYPE_2 : 0xFC,
	BLOCK_SOB_TYPE_3 : 0xFD,
	BLOCK_SOB_TYPE_4 : 0xFE,
	BLOCK_SOB_TYPE_5 : 0xFF,

	MAPS : {
		treasure : {
			codes : [
					/* 00 */[ 0, 0 ], // brick wall
					/* 01 */[ 1, 1 ], // trees
					/* 02 */[ 2, 2 ], // trees
					/* 03 */[ 3, 3 ], // trees
					/* 04 */[ 4, 4 ], // trees
					/* 05 */[ [5, 5], 4, 120, 1 ], // torch
					/* 06 */[ 9, 9 ], // hole
					/* 07 */[ 10, 10 ], // grate
					/* 08 */[ 12, 12 ], // door
					/* 09 */[ [13, 13], 3, 120, 2 ], // close chest
					/* 0A */[ 16, 16 ], // open chest
					/* 0B */[ [20, 20], 3, 120, 2 ],
					/* 0C */[ [23, 23], 3, 120, 2 ],
					/* 0D */[ 19, 0 ], // Elevator X side start
					/* 0E */[ 0, 19 ], // Elevator Y side start
					/* 0F */[ 17, 17 ], // Elevator wall
					/* 10 */[ 11, 11 ] // Elevator switch
			],
			metacodes : {
				/* LABY.BLOCK_VOID */0 : 0,
				/* LABY.BLOCK_WALL */1 : [ 0x100, 0x101, 0x102, 0x103, 0x104 ],
				/* LABY.BLOCK_TREASURE */6 : 0x200A09,
				/* LABY.BLOCK_WALL_TORCH */0xA : 0x105,
				/* LABY.BLOCK_WALL_ALCOVE */0xB : 0x106,
				/* LABY.BLOCK_WALL_GRATE */0xC : 0x107,
				/* LABY.BLOCK_RELIC_CHEST */0xD : 0x200A0B,
				/* LABY.BLOCK_EMPTY_CHEST */0x15 : 0x200A0A,
				/* LABY.BLOCK_EMPTY_RELIC_CHEST */0x16 : 0x200A0C,

				/* LABY.BLOCK_ELEVATOR_SWITCH_PREV */0x88 : 0x110,
				/* LABY.BLOCK_ELEVATOR_ENTRANCE */0x85 : 0
			}
		},
		forest : {
			codes : [
					/* 00 */[ 0, 0 ], // brick wall
					/* 01 */[ 1, 1 ], // trees
					/* 02 */[ 2, 2 ], // trees
					/* 03 */[ 3, 3 ], // trees
					/* 04 */[ 4, 4 ], // trees
					/* 05 */[ 5, 5 ], // trees
					/* 06 */[ 6, 6 ], // trees
					/* 07 */[ 7, 7 ], // trees
					/* 08 */[ 8, 8 ], // trees
					/* 09 */[ 9, 9 ], // tree passage
					/* 0A */[ 10, 10 ], // wall ivy
					/* 0B */[ 11, 11 ], // wall ivy
					/* 0C */[ 12, 12 ], // wall ivy
					/* 0D */[ 13, 13 ], // wall ivy
					/* 0E */[ 14, 14 ], // window
					/* 0F */[ 15, 15 ], // shadow window
					/* 10 */[ 16, 16 ], // shadow wall
					/* 11 */[ [17, 17], 3, 120, 2], // Close chest
					/* 12 */[ 20, 20 ], // open chest
					/* 13 */[ 21, 21 ], // stone passage
					/* 14 */[ [22, 22], 4, 120, 1], // torch
					/* 15 */[ 26, 26 ], // fence
					/* 16 */[ 27, 27 ], // bush
					/* 17 */[ 28, 28 ], // panel 1
					/* 18 */[ 29, 29 ] // panel 2
			],
			metacodes : {
				/* LABY.BLOCK_VOID */0 : 0,
				/* LABY.BLOCK_WALL */1 : 0x100,
				/* LABY.BLOCK_WINDOW */5 : 0x100A0E,
				/* LABY.BLOCK_TREASURE */6 : 0x200A11,
				/* LABY.BLOCK_WALL_TORCH */0xA : 0x114,
				/* LABY.BLOCK_EMPTY_CHEST */0x15 : 0x200A12,

				/* LABY.BLOCK_ELEVATOR_SWITCH_NEXT */0x83 : 0x109,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PREV */0x88 : 0x109,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PORTAL */0x8A : 0x14B,
				/* LABY.BLOCK_ELEVATOR_EXIT */0x84 : 0,
				/* LABY.BLOCK_ELEVATOR_ENTRANCE */0x85 : 0,
				/* LABY.BLOCK_ELEVATOR_PORTAL */0x8B : 0,

				/* BLOCK_FOREST_TREE */0xA0 : [ 0x101, 0x102, 0x103, 0x104,
						0x105, 0x106, 0x107, 0x108 ],
				/* BLOCK_FOREST_WALL */0xA1 : 0x100,
				/* BLOCK_FOREST_BUSH */0xA2 : 0x200A16,
				/* BLOCK_FOREST_FENCE */0xA3 : 0x200A15,
				/* BLOCK_FOREST_SHADOW_WALL */0xA4 : 0x110,
				/* BLOCK_FOREST_SHADOW_WINDOW */0xA5 : 0x10F,
				/* BLOCK_FOREST_WALL_IVY */0xA6 : [ 0x10A, 0x10B, 0x10C, 0x10D ]
			}

		},
		forestwall : {
			codes : [
					/* 00 */[ 0, 0 ], // brick wall
					/* 01 */[ 1, 1 ], // trees
					/* 02 */[ 2, 2 ], // trees
					/* 03 */[ 3, 3 ], // trees
					/* 04 */[ 4, 4 ], // trees
					/* 05 */[ 5, 5 ], // trees
					/* 06 */[ 6, 6 ], // trees
					/* 07 */[ 7, 7 ], // trees
					/* 08 */[ 8, 8 ], // trees
					/* 09 */[ 9, 9 ], // tree passage
					/* 0A */[ 10, 10 ], // wall ivy
					/* 0B */[ 11, 11 ], // wall ivy
					/* 0C */[ 12, 12 ], // wall ivy
					/* 0D */[ 13, 13 ], // wall ivy
					/* 0E */[ 14, 14 ], // window
					/* 0F */[ 15, 15 ], // shadow window
					/* 10 */[ 16, 16 ], // shadow wall
					/* 11 */[ [17, 17], 3, 120, 2], // Close chest
					/* 12 */[ 20, 20 ], // open chest
					/* 13 */[ 21, 21 ], // stone passage
					/* 14 */[ [22, 22], 4, 120, 1 ], // torch
					/* 15 */[ 26, 26 ], // fence
					/* 16 */[ 27, 27 ], // bush
					/* 17 */[ 28, 28 ], // panel 1
					/* 18 */[ 29, 29 ] // panel 2
			],
			metacodes : {
				/* LABY.BLOCK_VOID */0 : 0,
				/* LABY.BLOCK_WALL */1 : 0x100,
				/* LABY.BLOCK_WINDOW */5 : 0x100A0E,
				/* LABY.BLOCK_TREASURE */6 : 0x200A11,
				/* LABY.BLOCK_WALL_TORCH */0xA : 0x114,
				/* LABY.BLOCK_EMPTY_CHEST */0x15 : 0x200A12,

				/* LABY.BLOCK_ELEVATOR_SWITCH_NEXT */0x83 : 0x113,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PREV */0x88 : 0x109,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PORTAL */0x8A : 0x14B,
				/* LABY.BLOCK_ELEVATOR_EXIT */0x84 : 0,
				/* LABY.BLOCK_ELEVATOR_ENTRANCE */0x85 : 0,
				/* LABY.BLOCK_ELEVATOR_PORTAL */0x8B : 0,

				/* BLOCK_FOREST_TREE */0xA0 : [ 0x101, 0x102, 0x103, 0x104,
						0x105, 0x106, 0x107, 0x108 ],
				/* BLOCK_FOREST_WALL */0xA1 : 0x100,
				/* BLOCK_FOREST_BUSH */0xA2 : 0x200A16,
				/* BLOCK_FOREST_FENCE */0xA3 : 0x200A15,
				/* BLOCK_FOREST_SHADOW_WALL */0xA4 : 0x110,
				/* BLOCK_FOREST_SHADOW_WINDOW */0xA5 : 0x10F,
				/* BLOCK_FOREST_WALL_IVY */0xA6 : [ 0x10A, 0x10B, 0x10C, 0x10D ]
			}

		},
		normal : {
			// pour les textures qui respectent le format T_ (t_gray, t_blue etc...)
			codes : [
					/* 0 */[ 0, 0 ], // Brick
					/* 01 */[ 8, 8 ], // Torch wall
					/* 02 */[ 9, 9 ], // Alcove wall
					/* 03 */[ 10, 10 ], // Small grate wall

					/* 04 */[ 23, 23 ], // Door unlocked
					/* 05 */[ 28, 28 ], // Door armored

					/* 06 */[ 24, 24 ], // Door locked 1 blue
					/* 07 */[ 27, 27 ], // Door locked 2 red
					/* 08 */[ 26, 26 ], // Door locked 3 green
					/* 09 */[ 25, 25 ], // Door locked 4 yellow

					/* 0A */[ 35, 0 ], // Doorway Brick X
					/* 0B */[ 0, 35 ], // Doorway Brick Y

					/* 11 */[ [44, 44], 3, 120, 2], // Close chest
					/* 0D */[ 47, 47 ], // Open chest

					/* 0E */[ 18, 18 ], // Secret passage
					/* 0F */[ 48, 48 ], // Exit

					/* 10 */[ 17, 17 ], // Window 1

					/* 11 */[ 0, 65 ], // Elevator X side end
					/* 12 */[ 65, 0 ], // Elevator Y side end
					/* 13 */[ 0, 64 ], // Elevator X side start
					/* 14 */[ 64, 0 ], // Elevator Y side start
					/* 15 */[ 63, 63 ], // Elevator wall
					/* 16 */[ 48, 48 ], // Elevator switch 

					/* 17 */[ 79, 79 ], // Shop Block

					/* 18 */[ 18, 18 ], // Secret wall

					/* 19 */[ 16, 16 ], // Blue key
					/* 1A */[ 13, 13 ], // Red key
					/* 1B */[ 15, 15 ], // Green key
					/* 1C */[ 14, 14 ], // Yellow key
					/* 1D */[ 12, 12 ], // Empty key holder

					// LIBRARY
					/* 1E */[ 40, 40 ], // Book shelf 1
					/* 1F */[ 41, 41 ], // Book shelf 2 
					/* 20 */[ 42, 42 ], // Book shelf 3

					// WATCH
					/* 21 */[ 37, 37 ], // wood panel
					/* 24 */[ 37, 40 ], // watch library Y
					/* 25 */[ 37, 41 ], // watch library Y odd
					/* 22 */[ 40, 37 ], // watch library X
					/* 23 */[ 41, 37 ], // watch library X odd

					// JAIL
					/* 27 */[ 0, 43 ], // wall shackles Y
					/* 26 */[ 43, 0 ], // wall shackles X
					/* 28 */[ 39, 39 ], // jail bars
					/* 29 */[ 29, 29 ], // jail door

					// LIVING
					/* 2A */[ 57, 57 ], // living wall
					/* 2B */[ 11, 11 ], // painting
					/* 2C */[ 49, 49 ], // fireplace off ************************ unused
					/* 2D */[ [49, 49], 4, 120, 1 ], // fireplace 1

					// SHOP
					/* 2F */[ 37, 79 ], // ******************** unused shop Y
					/* 2E */[ 79, 37 ], // ******************** unused shop X

					// TAPESTRY
					/* 30 */[ 53, 53 ], // tapestry red 
					/* 31 */[ 54, 54 ], // tapestry blue 
					/* 32 */[ 55, 55 ], // tapestry gray
					/* 33 */[ 56, 56 ], // tapestry redish 

					// LAB
					/* 34 */[ 57, 57 ], // lab wall
					/* 36 */[ 57, 58 ], // closet Y 1
					/* 35 */[ 58, 57 ], // closet X 1
					/* 38 */[ 57, 59 ], // closet Y 1 open
					/* 37 */[ 59, 57 ], // closet X 1 open
					/* 39 */[ 62, 62 ], // alchemy full
					/* 3A */[ 59, 57 ], // ************************ unused
					/* 3B */[ 60, 57 ], // ************************ unused
					/* 3C */[ 61, 57 ], // ************************ unused
					/* 3D */[ 62, 62 ], // ************************ unused
					/* 3E */[ 62, 62 ], // alchemy purple red **************** usused
					/* 3F */[ 62, 62 ], // alchemy blue red   **************** usused
					/* 40 */[ 62, 62 ], // alchemy purple purple ************* usused

					// MISC
					/* 41 */[ 34, 34 ], // Curtain
					/* 43 */[ 36, 37 ], // Watch doorway y
					/* 42 */[ 37, 36 ], // Watch doorway x
					/* 44 */[ 30, 30 ], // door locked gray
					/* 45 */[ 31, 31 ], // door unlocked
					/* 46 */[ 48, 48 ], // Exit archway
					/* 47 */[ 38, 38 ], // Wood window
					/* 48 */[ 31, 31 ], // unlocked door
					/* 49 */[ 32, 32 ], // door next floor unsealed
					/* 4A */[ 33, 33 ], // door next floor sealed
					/* 4B */[ [19, 19], 4, 120, 2 ], // portal

					// MISC
					/* 4C */[ 1, 1 ], // alternate wall 1
					/* 4D */[ 2, 2 ], // alternate wall 2
					/* 4E */[ 3, 3 ], // alternate wall 3
					/* 4F */[ 4, 4 ], // alternate wall 4
					/* 50 */[ 5, 5 ], // alternate wall 5
					/* 51 */[ 6, 6 ], // alternate wall 6
					/* 52 */[ 7, 7 ], // alternate wall 7

					// FORGE
					/* 53 */[ 66, 66 ], // anvil
					/* 54 */[ 67, 67 ], // hammer
					/* 55 */[ 68, 68 ], // blouse
					/* 56 */[ 69, 69 ], // tools

					// KITCHEN
					/* 57 */[ 70, 70 ], // Table
					/* 58 */[ 71, 71 ], // Vegs
					/* 59 */[ 72, 72 ], // cleave and goblet
					/* 5A */[ 73, 73 ], // Ham

					// CHURCH
					/* 5B */[ 74, 74 ], // Stained Glass
					/* 5C */[ 75, 75 ], // Stained Glass
					/* 5D */[ 76, 76 ], // Death idol
					/* 5E */[ 77, 77 ] // Runes

			],
			metacodes : {
				/* LABY.BLOCK_VOID */0 : 0,
				/* LABY.BLOCK_WALL */1 : [ 0x100, 0x14C, 0x14D, 0x14E, 0x14F,
						0x150, 0x151, 0x152 ],
				/* LABY.BLOCK_DOOR */2 : 0x804,
				/* LABY.BLOCK_DOORWAY_X */3 : 0x10A,
				/* LABY.BLOCK_DOORWAY_Y */4 : 0x10B,
				/* LABY.BLOCK_WINDOW */5 : 0x100A10,
				/* LABY.BLOCK_TREASURE */6 : 0x200A0C,
				/* LABY.BLOCK_SECRET */7 : 0x918,
				/* LABY.BLOCK_SECRET_WALL */8 : 0x118,
				/* LABY.BLOCK_CURTAIN */9 : 0x341,
				/* LABY.BLOCK_WALL_TORCH */0xA : 0x101,
				/* LABY.BLOCK_WALL_ALCOVE */0xB : 0x103,
				/* LABY.BLOCK_WALL_GRATE */0xC : 0x102,
				/* LABY.BLOCK_SHOP */0xE : 0x117,
				/* LABY.BLOCK_KEY_0 */0x10 : 0x119,
				/* LABY.BLOCK_KEY_1 */0x11 : 0x11A,
				/* LABY.BLOCK_KEY_2 */0x12 : 0x11B,
				/* LABY.BLOCK_KEY_3 */0x13 : 0x11C,
				/* LABY.BLOCK_EMPTY_KEY */0x14 : 0x11D,
				/* LABY.BLOCK_EMPTY_CHEST */0x15 : 0x200A0D,
				/* LABY.BLOCK_LOCKEDDOOR_0 */0x18 : 0x806,
				/* LABY.BLOCK_LOCKEDDOOR_1 */0x19 : 0x807,
				/* LABY.BLOCK_LOCKEDDOOR_2 */0x1A : 0x808,
				/* LABY.BLOCK_LOCKEDDOOR_3 */0x1B : 0x809,
				/* LABY.BLOCK_UNLOCKEDDOOR */0x1C : 0x845,

				/* LABY.BLOCK_LIBRARY_BOOK */0x20 : [ 0x11E, 0x11F, 0x120 ],
				/* LABY.BLOCK_CHURCH_STAINED_GLASS */0x2A : [ 0x15B, 0x15C ],
				/* LABY.BLOCK_CHURCH_DEATH_IDOL */0x2B : 0x10095D,
				/* LABY.BLOCK_CHURCH_RUNES */0x2C : 0x08095E,

				/* LABY.BLOCK_JAIL_WALL_SHACKLES_X */0x30 : 0x126,
				/* LABY.BLOCK_JAIL_WALL_SHACKLES_Y */0x31 : 0x127,
				/* LABY.BLOCK_JAIL_BARS */0x32 : 0x200A28,
				/* LABY.BLOCK_JAIL_DOOR */0x33 : 0x229,

				/* LABY.BLOCK_WATCH_WALL */0x40 : 0x121,
				/* LABY.BLOCK_WATCH_DOORWAY_X */0x41 : 0x142,
				/* LABY.BLOCK_WATCH_DOORWAY_Y */0x42 : 0x143,
				/* LABY.BLOCK_WATCH_WALL_2_X */0x43 : 0x122,
				/* LABY.BLOCK_WATCH_WALL_2_Y */0x44 : 0x124,
				/* LABY.BLOCK_WATCH_DOOR_LOCKED */0x45 : 0x844,
				/* LABY.BLOCK_WATCH_WINDOW */0x46 : 0x100A47,
				/* LABY.BLOCK_WATCH_TREASURE */0x47 : 0x200A0C,
				/* LABY.BLOCK_WATCH_WALL_2_X_USED */0x48 : 0x122,
				/* LABY.BLOCK_WATCH_WALL_2_Y_USED */0x49 : 0x124,
				/* LABY.BLOCK_LABO_WALL */0x50 : 0x134,
				/* LABY.BLOCK_LABO_CLOSET_X */0x51 : 0x135,
				/* LABY.BLOCK_LABO_CLOSET_Y */0x52 : 0x136,
				/* LABY.BLOCK_LABO_BOOK */0x53 : 0x11E,
				/* LABY.BLOCK_LABO_ALCHEMY */0x54 : 0x200A39,
				/* LABY.BLOCK_FORGE_ANVIL */0x55 : 0x200A53,
				/* LABY.BLOCK_FORGE_TOOLS */0x56 : [ 0x154, 0x155, 0x156 ],
				/* LABY.BLOCK_KITCHEN_TABLE */0x5A : 0x200A57,
				/* LABY.BLOCK_KITCHEN_FOOD */0x5B : [ 0x158, 0x159, 0x15A ],
				/* LABY.BLOCK_LABO_CLOSET_X_OPEN */0x5C : 0x137,
				/* LABY.BLOCK_LABO_CLOSET_Y_OPEN */0x5D : 0x138,

				/* LABY.BLOCK_LIVING_WALL */0x60 : 0x12A,
				/* LABY.BLOCK_LIVING_FIREPLACE */0x61 : 0x12D,
				/* LABY.BLOCK_LIVING_PICTURE */0x62 : 0x12B,
				/* LABY.BLOCK_LIVING_BOOK */0x63 : [ 0x11E, 0x11F, 0x120 ],
				/* LABY.BLOCK_LIVING_TAPESTRY */0x64 : [ 0x130, 0x131, 0x132,
						0x133 ],

				/* LABY.BLOCK_ELEVATOR_WALL */0x80 : 0x115,
				/* LABY.BLOCK_ELEVATOR_DOOR_PREV */0x81 : 0x205,
				/* LABY.BLOCK_ELEVATOR_DOOR_NEXT_SEALED */0x82 : 0x200A4A,
				/* LABY.BLOCK_ELEVATOR_SWITCH_NEXT */0x83 : 0x116,
				/* LABY.BLOCK_ELEVATOR_EXIT */0x84 : 0,
				/* LABY.BLOCK_ELEVATOR_ENTRANCE */0x85 : 0,
				/* LABY.BLOCK_ELEVATOR_DOORWAY_X */0x86 : 0x111,
				/* LABY.BLOCK_ELEVATOR_DOORWAY_Y */0x87 : 0x112,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PREV */0x88 : 0x116,
				/* LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED */0x89 : 0x249,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PORTAL */0x8A : 0x14B,
				/* LABY.BLOCK_ELEVATOR_PORTAL */0x8B : 0
				
			}
		},
		
		underwater: {
			codes: [
					/* 00 */[ 0, 0 ], // Brick

					/* 02 */[ 13, 0 ], // Doorway Brick Y
					/* 01 */[ 0, 13 ], // Doorway Brick X

					/* 03 */[ [23, 23], 3, 120, 2], // Close chest
					/* 04 */[ 26, 26 ], // Open chest

					/* 05 */[ 19, 19 ], // Secret passage

					/* 06 */[ 18, 18 ], // Window 1

					/* 08 */[ 0, 16 ], // Elevator Y side end
					/* 07 */[ 16, 0 ], // Elevator X side end
					/* 0A */[ 0, 15 ], // Elevator Y side start
					/* 09 */[ 15, 0 ], // Elevator X side start
					/* 0B */[ 14, 14 ], // Elevator wall
					/* 0C */[ 13, 13 ], // Elevator switch 

					/* 0D */[ 18, 18 ], // Secret wall

					// MISC
					/* 0E */[ 11, 11 ], // Curtain
					/* 0F */[ 9, 9 ], // door next floor unsealed
					/* 10 */[ 10, 10 ], // door next floor sealed
					/* 11 */[ 8, 8 ],   // door prev floor
					/* 12 */[ [19, 19], 4, 120, 2], // portal

					// MISC
					/* 13 */[ 1, 1 ], // alternate wall 1
					/* 14 */[ 2, 2 ], // alternate wall 2
					/* 15 */[ 3, 3 ], // alternate wall 3
					/* 16 */[ 4, 4 ], // alternate wall 4
					/* 17 */[ 5, 5 ], // alternate wall 5
					/* 18 */[ 6, 6 ], // alternate wall 6
					/* 19 */[ 7, 7 ]  // alternate wall 7
			],
			metacodes: {
				/* LABY.BLOCK_VOID */0 : 0,
				/* LABY.BLOCK_WALL */1 : [ 0x100, 0x113, 0x114, 0x115,
						0x116, 0x117, 0x118, 0x119 ],
				/* LABY.BLOCK_DOORWAY_X */3 : 0x101,
				/* LABY.BLOCK_DOORWAY_Y */4 : 0x102,
				/* LABY.BLOCK_WINDOW */5 : 0x100A06,
				/* LABY.BLOCK_TREASURE */6 : 0x200A03,
				/* LABY.BLOCK_SECRET */7 : 0x90D,
				/* LABY.BLOCK_SECRET_WALL */8 : 0x10D,
				/* LABY.BLOCK_CURTAIN */9 : 0x30E,
				/* LABY.BLOCK_EMPTY_CHEST */0x15 : 0x200A04,

				/* LABY.BLOCK_ELEVATOR_WALL */0x80 : 0x10B,
				/* LABY.BLOCK_ELEVATOR_DOOR_PREV */0x81 : 0x211,
				/* LABY.BLOCK_ELEVATOR_DOOR_NEXT_SEALED */0x82 : 0x200A10,
				/* LABY.BLOCK_ELEVATOR_SWITCH_NEXT */0x83 : 0x10C,
				/* LABY.BLOCK_ELEVATOR_EXIT */0x84 : 0,
				/* LABY.BLOCK_ELEVATOR_ENTRANCE */0x85 : 0,
				/* LABY.BLOCK_ELEVATOR_DOORWAY_X */0x86 : 0x107,
				/* LABY.BLOCK_ELEVATOR_DOORWAY_Y */0x87 : 0x108,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PREV */0x88 : 0x10C,
				/* LABY.BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED */0x89 : 0x20F,
				/* LABY.BLOCK_ELEVATOR_SWITCH_PORTAL */0x8A : 0x116,
				/* LABY.BLOCK_ELEVATOR_PORTAL */0x8B : 0
				
			}
		}
	}
};

var GFX_DATA = {
	tiles : {

		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////
		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////
		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////
		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////
		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////
		////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS ////// PLACEABLE OBJECTS //////

		o_lootbag : {
			src : 'resources/gfx/sprites/o_lootbags.png',
			width : 32,
			height : 96,
			frames : 5,
			animations : [
     			[[ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ],
    			[[ 1, 1, 1, 1, 1, 1, 1, 1 ], 1, 1, 0 ],
    			[[ 2, 2, 2, 2, 2, 2, 2, 2 ], 1, 1, 0 ],
    			[[ 3, 3, 3, 3, 3, 3, 3, 3 ], 1, 1, 0 ],
    			[[ 4, 4, 4, 4, 4, 4, 4, 4 ], 1, 1, 0 ]
			]
		},
		o_boom : {
			src : 'resources/gfx/sprites/o_boom.png',
			width : 64,
			height : 96,
			frames : 7,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 7, 120, 0 ] ]
		},
		o_teleport : {
			src : 'resources/gfx/sprites/o_teleport.png',
			width : 64,
			height : 96,
			frames : 8,
			noshading : true,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 120, 0 ] ]
		},
		o_tome : {
			src : 'resources/gfx/sprites/o_tome.png',
			width : 32,
			height : 64,
			frames : 8,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 120, 1 ] ]
		},
		o_chicken : {
			src : 'resources/gfx/sprites/o_chicken.png',
			width : 24,
			height : 96,
			frames : 4,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 500, 1 ],
					[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 250, 1 ],
					[ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 2, 500, 1 ],
					[ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 2, 250, 1 ] ]
		},
		o_bubbles : {
			src : 'resources/gfx/sprites/o_bubbles.png',
			width : 40,
			height : 96,
			frames : 4,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 4, 120, 1 ] ]
		},
		o_tree1: {
			src : 'resources/gfx/sprites/o_tree1.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		o_tree2: {
			src : 'resources/gfx/sprites/o_tree2.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		o_tree1b: {
			src : 'resources/gfx/sprites/o_tree1b.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		o_tree2b: {
			src : 'resources/gfx/sprites/o_tree2b.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		o_tree1v: {
			src : 'resources/gfx/sprites/o_tree1v.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		o_tree2v: {
			src : 'resources/gfx/sprites/o_tree2v.png',
			width : 64,
			height : 96,
			frames : 1,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		e_hazes : {
			src : 'resources/gfx/sprites/e_hazes.png',
			width : 16,
			height : 24,
			frames : 12,
			noshading : true,
			animations : []
		},
		i_icons : { // icones d'items
			src : 'resources/gfx/icons/icons.png',
			width : 48,
			height : 48,
			frames : 1,
			noshading : true,
			animations : []
		},
		i_digits : {
			src : 'resources/gfx/icons/digits.png',
			width : 8,
			height : 8,
			frames : 19,
			noshading : true,
			animations : []
		},
		d_title : {
			src : 'resources/gfx/icons/title_128.png',
			width : 352,
			height : 128,
			frames : 1,
			noshading : true,
			animations : []
		},
		d_pictures : {
			src : 'resources/gfx/textures/d_pictures.png',
			width : 32,
			height : 32,
			frames : 45,
			animations : []
		},

		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////
		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////
		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////
		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////
		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////
		////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES ////// PROJECTILES //////

		p_firebolt : {
			src : 'resources/gfx/sprites/p_firebolt.png',
			width : 48,
			height : 64,
			frames : 11,
			animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 3, 120, 0 ],
					[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 1, 0 ] ]
		},
		p_fireball : {
			src : 'resources/gfx/sprites/p_fireball.png',
			width : 50,
			height : 64,
			frames : 20,
			animations : [ [ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 4, 120, 0 ],
					[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 120, 1 ] ]
		},
		p_toxicbolt : {
			src : 'resources/gfx/sprites/p_toxicbolt.png',
			width : 50,
			height : 64,
			frames : 20,
			animations : [ [ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 4, 120, 0 ],
					[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 120, 1 ] ]
		},
		p_toxicspit : {
			src : 'resources/gfx/sprites/p_toxicspit.png',
			width : 64,
			height : 56,
			frames : 7,
			animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 3, 120, 0 ],
					[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 200, 1 ] ]
		},
		p_thunbolt : {
			src : 'resources/gfx/sprites/p_thunbolt.png',
			width : 64,
			height : 96,
			frames : 15,
			animations : [ [ [ 10, 10, 10, 10, 10, 10, 10, 10 ], 5, 120, 0 ],
					[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 50, 1 ] ]
		},
		p_magbolt : {
			src : 'resources/gfx/sprites/p_magbolt.png',
			width : 48,
			height : 64,
			frames : 14,
			animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 120, 0 ],
					[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
		},
		p_shadbolt : {
			src : 'resources/gfx/sprites/p_shadbolt.png',
			width : 48,
			height : 64,
			frames : 14,
			animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 120, 0 ],
					[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
		},
		p_healbolt : {
			src : 'resources/gfx/sprites/p_healbolt.png',
			width : 48,
			height : 64,
			frames : 14,
			animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 120, 0 ],
					[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 50, 0 ] ]
		},
		p_icebolt : {
			src : 'resources/gfx/sprites/p_icebolt.png',
			width : 48,
			height : 64,
			frames : 30,
			animations : [ [ [ 24, 24, 24, 24, 24, 24, 24, 24 ], 6, 120, 0 ],
					[ [ 12, 15, 18, 21, 0, 3, 6, 9 ], 3, 150, 1 ] ]
		},
		p_medbolt : {
			src : 'resources/gfx/sprites/p_medbolt.png',
			width : 48,
			height : 64,
			frames : 30,
			animations : [ [ [ 24, 24, 24, 24, 24, 24, 24, 24 ], 6, 120, 0 ],
					[ [ 12, 15, 18, 21, 0, 3, 6, 9 ], 3, 150, 1 ] ]
		},
		p_lightbolt : {
			src : 'resources/gfx/sprites/p_lightbolt.png',
			width : 64,
			height : 96,
			frames : 6,
			animations : [ [ [ 4, 4, 4, 4, 4, 4, 4, 4 ], 3, 120, 0 ],
					[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 3, 50, 1 ] ]
		},
		p_iceball : {
			src : 'resources/gfx/sprites/p_iceball.png',
			width : 64,
			height : 80,
			frames : 5,
			animations : [ [ [ 1, 1, 1, 1, 1, 1, 1, 1 ], 4, 120, 0 ],
					[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 1, 0 ] ]
		},
		p_slash : {
			src : 'resources/gfx/sprites/p_slash.png',
			width : 64,
			height : 64,
			frames : 4,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 4, 120, 0 ],
					[ [ 3, 3, 3, 3, 3, 3, 3, 3 ], 1, 0, 0 ] ]
		},
		p_expfire : {
			src : 'resources/gfx/sprites/p_expfire.png',
			width : 64,
			height : 96,
			frames : 9,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 120, 0 ],
					[ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 1, 0, 0 ] ]
		},
		p_exptoxic : {
			src : 'resources/gfx/sprites/p_exptoxic.png',
			width : 64,
			height : 96,
			frames : 9,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 120, 0 ],
					[ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 1, 0, 0 ] ]
		},
		
		p_deathspell : {
			src : 'resources/gfx/sprites/p_deathspell.png',
			width : 64,
			height : 96,
			frames : 10,
			animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 9, 120, 0 ],
					[ [ 9, 9, 9, 9, 9, 9, 9, 9 ], 1, 1, 0 ] ]
		},

		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////
		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////
		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////
		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////
		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////
		////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS ////// WEAPONS //////

		w_wands : {
			src : 'resources/gfx/sprites/w_wands.png',
			width : 32,
			height : 60,
			frames : 18,
			noshading : true,
			animations : []
		},

		w_daggers : {
			src : 'resources/gfx/sprites/w_daggers.png',
			width : 32,
			height : 64,
			frames : 24,
			noshading : true,
			animations : []
		}

	},
	textures : {
		t_intro : {
			src : 'resources/gfx/textures/t_gray.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_forest : {
			src : 'resources/gfx/textures/t_forest1.png',
			codes : LABY.MAPS.forest.codes,
			metacodes : LABY.MAPS.forest.metacodes
		},
		t_darkwoods : {
			src : 'resources/gfx/textures/t_forest2.png',
			codes : LABY.MAPS.forestwall.codes,
			metacodes : LABY.MAPS.forestwall.metacodes
		},
		t_gray : {
			src : 'resources/gfx/textures/t_gray.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_purple : {
			src : 'resources/gfx/textures/t_mozaic.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_brown : {
			src : 'resources/gfx/textures/t_brown.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_blue : {
			src : 'resources/gfx/textures/t_blue.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_green : {
			src : 'resources/gfx/textures/t_green.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_mines : {
			src : 'resources/gfx/textures/t_mines1.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_mines2 : {
			src : 'resources/gfx/textures/t_mines2.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_mines3 : {
			src : 'resources/gfx/textures/t_mines3.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_crimson : {
			src : 'resources/gfx/textures/t_crimson.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_golden : {
			src : 'resources/gfx/textures/t_golden.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_treasure : {
			src : 'resources/gfx/textures/t_treasure.png',
			codes : LABY.MAPS.treasure.codes,
			metacodes : LABY.MAPS.treasure.metacodes
		},
		t_brass : {
			src : 'resources/gfx/textures/t_brass.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_iron : {
			src : 'resources/gfx/textures/t_iron.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_fire : {
			src : 'resources/gfx/textures/t_fire.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_magic : {
			src : 'resources/gfx/textures/t_magic.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_water : {
			src : 'resources/gfx/textures/t_water.png',
			codes : LABY.MAPS.normal.codes,
			metacodes : LABY.MAPS.normal.metacodes
		},
		t_graywater : {
			src : 'resources/gfx/textures/t_graywater.png',
			codes : LABY.MAPS.underwater.codes,
			metacodes : LABY.MAPS.underwater.metacodes
		},
		t_credits : {
			src : 'resources/gfx/textures/t_credits.png',
			codes : [
					/* 00 */[ 0, 0 ],
					/* 01 */[ 1, 1 ],
					/* 02 */[ 6, 6 ],
					/* 03 */[ 7, 7 ],
					/* 04 */[ [2, 2], 4, 120, 1],
					/* 05 */[ 8, 8 ],

					/* 06 */[ 9, 9 ],
					/* 07 */[ 10, 10 ],
					/* 08 */[ 11, 11 ],
					/* 09 */[ 12, 12 ],
					/* 0A */[ 13, 13 ],
					/* 0B */[ 14, 14 ],
					/* 0C */[ 15, 15 ],
					/* 0D */[ 16, 16 ],
					/* 0E */[ 21, 21 ],
					/* 0F */[ 22, 22 ],
					/* 10 */[ [17, 17], 4, 120, 1 ],
					/* 11 */[ 23, 23 ],

					/* 12 */[ 24, 24 ],
					/* 13 */[ 25, 25 ],
					/* 14 */[ 26, 26 ],
					/* 15 */[ 27, 27 ],
					/* 16 */[ 28, 28 ],
					/* 17 */[ 29, 29 ],
					/* 18 */[ 30, 30 ],
					/* 19 */[ 31, 31 ],
					/* 1A */[ 36, 36 ],
					/* 1B */[ 37, 37 ],
					/* 1C */[ [32, 32], 4, 120, 1 ],
					/* 1D */[ 38, 38 ],

					/* 1E */[ 39, 39 ],
					/* 1F */[ 40, 40 ],
					/* 20 */[ 41, 41 ],
					/* 21 */[ 42, 42 ],
					/* 22 */[ 43, 43 ],
					/* 23 */[ 44, 44 ],
					/* 24 */[ 45, 45 ],
					/* 25 */[ 46, 46 ],
					/* 26 */[ 47, 47 ],
					/* 27 */[ 48, 48 ] ],
			metacodes : {
				' ' : 0,

				'A' : [ 0x100, 0x101 ], // 0 mur
				'B' : [ 0x100902, 0x100903 ], // 1 élément mural
				'C' : 0x200A05, // 2 fenetre
				'D' : 0x104, // torche

				'E' : [ 0x106, 0x107, 0x108, 0x109, 0x10A, 0x10B, 0x10C, 0x10D ],
				'F' : [ 0x10090E, 0x10090F ],
				'G' : 0x200A11,
				'H' : 0x110,

				'I' : [ 0x112, 0x113, 0x114, 0x115, 0x116, 0x117, 0x118, 0x119 ],
				'J' : [ 0x10091A, 0x10091B ],
				'K' : 0x200A1D,
				'L' : 0x11C,

				'M' : [ 0x11E, 0x11F, 0x120, 0x121, 0x122, 0x123, 0x124, 0x125 ],
				'N' : [ 0x200A26, 0x200A27 ]
			}
		}

	},

	visuals : {
		dark : {
			ceilColor : {
				r : 64,
				g : 64,
				b : 64
			},
			floorColor : {
				r : 128,
				g : 128,
				b : 128
			},
			filter : false,
			light : 200,
			fogDistance : 1,
			fogColor : {
				r : 0,
				g : 0,
				b : 0
			}
		},
		darkbrown : {
			ceilColor : {
				r : 64,
				g : 48,
				b : 32
			},
			floorColor : {
				r : 128,
				g : 96,
				b : 64
			},
			filter : {
				r : 1.3,
				g : 1,
				b : 0.8
			},
			light : 200,
			fogDistance : 1,
			fogColor : {
				r : 12,
				g : 8,
				b : 4
			}
		},
		darkpurple : {
			ceilColor : {
				r : 48,
				g : 32,
				b : 64
			},
			floorColor : {
				r : 96,
				g : 64,
				b : 128
			},
			filter : {
				r : 1,
				g : 0.8,
				b : 1.3
			},
			light : 200,
			fogDistance : 1,
			fogColor : {
				r : 8,
				g : 4,
				b : 12
			}
		},
		darkblue : {
			ceilColor : {
				b : 64,
				g : 48,
				r : 32
			},
			floorColor : {
				b : 128,
				g : 96,
				r : 64
			},
			filter : {
				b : 1.3,
				g : 1,
				r : 0.8
			},
			light : 200,
			fogDistance : 1,
			fogColor : {
				b : 12,
				g : 8,
				r : 4
			}
		},
		forest : {
			ceilColor : {
				b : 0,
				g : 0,
				r : 0
			},
			floorColor : {
				b : 32,
				g : 48,
				r : 32
			},
			filter : false,
			light : 50,
			fogDistance : 0.7,
			fogColor : {
				b : 10,
				g : 16,
				r : 10
			}
		},
		darkgreen : {
			ceilColor : {
				r : 20,
				g : 48,
				b : 8
			},
			floorColor : {
				b : 64,
				g : 128,
				r : 64
			},
			filter : {
				b : 0.8,
				g : 1.3,
				r : 0.8
			},
			light : 100,
			fogDistance : 1,
			fogColor : {
				b : 5,
				g : 12,
				r : 5
			}
		},
		darkfall : {
			ceilColor : {
				r : 0,
				g : 0,
				b : 0
			},
			floorColor : {
				r : 96,
				g : 96,
				b : 64
			},
			filter : {
				r : 1.3,
				g : 1,
				b : 0.8
			},
			light : 50,
			fogDistance : 0.7,
			fogColor : {
				r : 24,
				g : 20,
				b : 10
			}
		},
		lightgreen : {
			ceilColor : {
				b : 64,
				g : 128,
				r : 64
			},
			floorColor : {
				b : 64,
				g : 128,
				r : 64
			},
			filter : false,
			light : 100,
			fogDistance : 1,
			fogColor : {
				b : 16,
				g : 32,
				r : 16
			}
		},
		darker : {
			ceilColor : {
				r : 64,
				g : 64,
				b : 64
			},
			floorColor : {
				r : 128,
				g : 128,
				b : 128
			},
			filter : false,
			light : 50,
			fogDistance : 0.75,
			fogColor : {
				r : 0,
				g : 0,
				b : 0
			}
		},
		deeper : {
			ceilColor : {
				r : 64,
				g : 48,
				b : 32
			},
			floorColor : {
				r : 128,
				g : 96,
				b : 64
			},
			filter : false,
			light : 50,
			fogDistance : 0.75,
			fogColor : {
				r : 0,
				g : 0,
				b : 0
			}
		},
		hellish : {
			ceilColor : {
				r : 64,
				g : 48,
				b : 32
			},
			floorColor : {
				r : 128,
				g : 96,
				b : 64
			},
			filter : {
				r : 1.2,
				g : 0.8,
				b : 0.8
			},
			light : 100,
			fogDistance : 0.75,
			fogColor : {
				r : 8,
				g : 1,
				b : 1
			}
		},
		darkest : {
			ceilColor : {
				r : 64,
				g : 64,
				b : 64
			},
			floorColor : {
				r : 128,
				g : 128,
				b : 128
			},
			filter : false,
			light : 10,
			fogDistance : 0.05,
			fogColor : {
				r : 0,
				g : 0,
				b : 0
			}
		},

		sunset : {
			ceilColor : {
				r : 100,
				g : 64,
				b : 32
			},
			floorColor : {
				r : 200,
				g : 128,
				b : 64
			},
			filter : false,
			light : 100,
			fogDistance : 1,
			fogColor : {
				r : 96,
				g : 24,
				b : 12
			}
		},

		
		valvewater: {
			ceilColor : {
				r : 100,
				g : 160,
				b : 200
			},
			floorColor : {
				r : 66,
				g : 100,
				b : 100
			},
			filter : {
				r : 0.8,
				g : 1,
				b : 1.2
			},
			light : 100,
			fogDistance : 1,
			fogColor : {
				r : 0,
				g : 33,
				b : 48
			}
		},
		
		underwater: {
			ceilColor : {
				r : 100,
				g : 160,
				b : 200
			},
			floorColor : {
				r : 66,
				g : 100,
				b : 100
			},
			filter : {
				r : 0.8,
				g : 1,
				b : 1.2
			},
			light : 100,
			fogDistance : 1,
			fogColor : {
				r : 0,
				g : 33,
				b : 48
			}
		}
	}
};
