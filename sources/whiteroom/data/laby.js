var LABY = {
  BLOCK_VOID: 0,
  BLOCK_WALL: 1,
  BLOCK_DOOR: 2,
  BLOCK_TREASURE: 3,
  BLOCK_SECRET: 4,
  BLOCK_EXIT: 5,                        // Block qui se pousse pour révéller un passage secret
  BLOCK_ENTRANCE: 6,
  BLOCK_WINDOW: 7,
  BLOCK_DOOR_X_SIDE: 8,
  BLOCK_DOOR_Y_SIDE: 9,

// Theme ascenseur
  BLOCK_ELEVATOR_DOOR_X_SIDE: 10,
  BLOCK_ELEVATOR_DOOR_Y_SIDE: 11,
  BLOCK_ELEVATOR_UP_DOOR: 12,
  BLOCK_ELEVATOR_DOWN_DOOR: 13,
  BLOCK_ELEVATOR_WALL: 14,                 // Block faisant office de porte d'ascenseur
  BLOCK_ELEVATOR_SWITCH: 15,               // Block permettant de changer de niveau

// theme secret
  BLOCK_SECRET_WALL: 20,                   // Block permettant de stopper un BLOCK_SECRET
  BLOCK_LOCKED_DOOR_1: 21,                 // Porte fermée par une clé 1
  BLOCK_LOCKED_DOOR_1: 22,				   // Porte fermée par une clé 2	
  BLOCK_LOCKED_DOOR_1: 23,                 // Porte fermée par une clé 3
  BLOCK_LOCKED_DOOR_1: 24,                 // Porte fermée par une clé 4
  BLOCK_KEY_1: 25,                         // Block supportant clé 1
  BLOCK_KEY_2: 26,                         // Block supportant clé 2
  BLOCK_KEY_3: 27,                         // Block supportant clé 3      
  BLOCK_KEY_4: 28,                         // Block supportant clé 4
  

// theme library
  BLOCK_WALL_THEME_LIBRARY: 30,            // Theme de mur : bibliotheque

// theme wood
  BLOCK_WALL_THEME_WOOD: 40,               // Theme de mur : lambris

// theme cell
  BLOCK_WALL_THEME_CELL: 50,
  BLOCK_BARS_THEME_CELL: 51,
  BLOCK_DOOR_THEME_CELL: 52,

// theme living
  BLOCK_WALL_THEME_LIVING: 60,
  BLOCK_FIREPLACE_THEME_LIVING: 61,
  BLOCK_PICTURE_THEME_LIVING: 62,
  BLOCK_PORTRAIT_THEME_LIVING: 63,

// theme labo
  BLOCK_WALL_THEME_LABO: 70,
  BLOCK_ALCHEMY_THEME_LABO: 71,
  BLOCK_CLOSET_X_THEME_LABO: 72,
  BLOCK_CLOSET_Y_THEME_LABO: 73,


// mobiles
  BLOCK_MOB_BASE: 1000                    // Début des block contenant un Mob
};
