/** World Data définition du monde
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

var GFX_DATA = {
  textures: {
    white: {
      src: 'resources/tiles/textures_white.png',
      image: 'resources/tiles/textures_white.png',
      codes: [
        [0, 0],     // 0 mur normal
        [2, 0],     // 1 mur / embrasure
        [1, 1],     // 2 porte
        [3, 3],     // 3 tableau
        [0, 2],     // 4 embrasure / mur
        [4, 4],     // 5 grille
        [8, 8],     // 6 window
        [6, 6],     // 7 chest
        [5, 5],     // 8 Elev Pr Door
        [9, 9],     // 9 Elev Nx Door
        [10, 10],   // 10 Elev Interior
        [11, 11],   // 11 Elev Switch
        [7, 7],     // 12 Open Chest 
        [12, 12],   // 13 library theme wall

        // prison
        [4, 4],     // 14 bars
        [14, 14],   // 15 prison door
        [0, 15],    // 16 Mur prison 

        // living
        [16, 16],    // 17 Fireplace 
        [17, 17],    // 18 Curtain
        [18, 19],    // 19 Painting
        [19, 18],    // 20 Portrait

        // labo
        [23, 22],    // 21 Closet X
        [22, 23],    // 22 Closet Y
        [20, 20]     // 23 Alchemy
        
      ],
      metacodes: {
        /* LABY.BLOCK_VOID*/                    0:0,           
        /* LABY.BLOCK_WALL*/                    1:0x1000,       
        /* LABY.BLOCK_DOOR*/                    2:0x8002,       
        /* LABY.BLOCK_TREASURE*/                3:0x20A007,  
        /* LABY.BLOCK_SECRET*/                  4:0x9003,       
        /* LABY.BLOCK_EXIT*/                    5:0,                   
        /* LABY.BLOCK_ENTRANCE*/                6:0,               
        /* LABY.BLOCK_WINDOW*/                  7:0x10A006,          
        /* LABY.BLOCK_DOOR_X_SIDE*/             8:0x1001,
        /* LABY.BLOCK_DOOR_Y_SIDE*/             9:0x1004,
        /* LABY.BLOCK_ELEVATOR_DOOR_X_SIDE*/   10:0x1000,  
        /* LABY.BLOCK_ELEVATOR_DOOR_Y_SIDE*/   11:0x1000,  
        /* LABY.BLOCK_ELEVATOR_UP_DOOR*/       12:0x2008,  
        /* LABY.BLOCK_ELEVATOR_DOWN_DOOR*/     13:0x2009,
        /* LABY.BLOCK_ELEVATOR_WALL*/          14:0x100A,
        /* LABY.BLOCK_ELEVATOR_SWITCH*/        15:0x100B,
        
        /* LABY.BLOCK_SECRET_WALL*/            20:0x1003,

        /* LABY_WALL_THEME_LIBRARY */          30:0x100D,

        /* LABY.BLOCK_WALL_THEME_CELL*/        50:0x1010,
        /* LABY.BLOCK_BARS_THEME_CELL*/        51:0x20A00E,
        /* LABY.BLOCK_DOOR_THEME_CELL*/        52:0x200F,

        /* LABY.BLOCK_WALL_THEME_LIVING*/      60:0x1012,
        /* LABY.BLOCK_FIREPLACE_THEME_LIVING*/ 61:0x1011,
        /* LABY.BLOCK_PICTURE_THEME_LIVING*/   62:0x1013,
        /* LABY.BLOCK_PORTRAIT_THEME_LIVING*/  63:0x1014,

        /* LABY.BLOCK_WALL_THEME_LABO*/        70:0x1000,
        /* LABY.BLOCK_ALCHEMY_THEME_LABO*/     71:0x20A017,
        /* LABY.BLOCK_CLOSET_X_THEME_LABO*/    72:0x1015,
        /* LABY.BLOCK_CLOSET_Y_THEME_LABO*/    73:0x1016,


        /* LABY.BLOCK_MOB_BASE*/               1000:0
      }
    }
  },

  tiles: {
    l1: {
      src: 'resources/tiles/laser1.png',
      width: 64,
      height: 64,
      frames: 7,
      animations:  [
        [[3, 3, 3, 3, 3, 3, 3, 3], 4, 100, 0], // die
        [[2, 1, 0, 1, 2, 1, 0, 1], 1, 1, 0]  // go
      ]
    },
    l3: {
      src: 'resources/tiles/laser3.png',
      width: 64,
      height: 64,
      frames: 7,
      animations:  [
        [[3, 3, 3, 3, 3, 3, 3, 3], 4, 100, 0], // die
        [[2, 1, 0, 1, 2, 1, 0, 1], 1, 1, 0]  // go
      ]
    },
    skull: {
      src: 'resources/tiles/skull.png',
      width: 64,
      height: 64,
      frames: 46,
      animations: [
        [[0, 0, 0, 0, 0, 0, 0, 0], 6, 150, 0],        // die
        [[26, 21, 16, 11, 06, 31, 36, 41], 1, 0, 1], // walk
        [[27, 22, 17, 12, 07, 32, 37, 42], 4, 100, 0]  // attack
      ]
    }
  }
};

var BLUEPRINTS = {
      l1: {
        type: GEN_DATA.blueprintTypes.missile,
        tile: 'l1',
        width: 1,
        height: 1,
        thinker: 'Laser',
        fx: 0,
        data: {
          mindamage: 5,
          maxdamage: 7,
          speed: 12
        }
      },
      l3: {
        type: GEN_DATA.blueprintTypes.missile,
        tile: 'l3',
        width: 1,
        height: 1,
        thinker: 'Laser',
        fx: 0,
        data: {
          mindamage: 5,
          maxdamage: 7,
          speed: 5
        }
      },
      skull: {
        type: GEN_DATA.blueprintTypes.mob,
        tile: 'skull',
        width: 32 ,
        height: 32,
        thinker: 'Skull',
        fx: 0,
        data: {
          hitpoints: 15,
          score: 1,
          speed: 4
        }
      }    
    };

var WORLDS_DATA = [73, 70, 80, 79, 83, 82, 84, 78, 81, 88];
var LEVEL_DATA = {
};

