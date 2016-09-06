<?php

// Theme général
define('BLOCK_VOID', 0);
define('BLOCK_WALL', 1);
define('BLOCK_DOOR', 2);
define('BLOCK_TREASURE', 3);
define('BLOCK_SECRET', 4);
define('BLOCK_EXIT', 5);                        // Block qui se pousse pour révéller un passage secret
define('BLOCK_ENTRANCE', 6);
define('BLOCK_WINDOW', 7);
define('BLOCK_DOOR_X_SIDE', 8);
define('BLOCK_DOOR_Y_SIDE', 9);

// Theme ascenseur
define('BLOCK_ELEVATOR_DOOR_X_SIDE', 10);
define('BLOCK_ELEVATOR_DOOR_Y_SIDE', 11);
define('BLOCK_ELEVATOR_UP_DOOR', 12);
define('BLOCK_ELEVATOR_DOWN_DOOR', 13);
define('BLOCK_ELEVATOR_WALL', 14);                 // Block faisant office de porte d'ascenseur
define('BLOCK_ELEVATOR_SWITCH', 15);               // Block permettant de changer de niveau

// theme secret
define('BLOCK_SECRET_WALL', 20);                   // Block permettant de stopper un BLOCK_SECRET

// theme library
define('BLOCK_WALL_THEME_LIBRARY', 30);            // Theme de mur : bibliotheque

// theme wood
define('BLOCK_WALL_THEME_WOOD', 40);               // Theme de mur : lambris

// theme cell
define('BLOCK_WALL_THEME_CELL', 50);
define('BLOCK_BARS_THEME_CELL', 51);
define('BLOCK_DOOR_THEME_CELL', 52);

// theme living room
define('BLOCK_WALL_THEME_LIVING', 60);
define('BLOCK_FIREPLACE_THEME_LIVING', 61);
define('BLOCK_PICTURE_THEME_LIVING', 62);
define('BLOCK_PORTRAIT_THEME_LIVING', 62);

// theme laboratory
define('BLOCK_WALL_THEME_LABO', 70);
define('BLOCK_ALCHEMY_THEME_LABO', 71);
define('BLOCK_CLOSET_X_THEME_LABO', 72);
define('BLOCK_CLOSET_Y_THEME_LABO', 73);



// mobiles
define('BLOCK_MOB_BASE', 1000);                    // Début des block contenant un Mob

