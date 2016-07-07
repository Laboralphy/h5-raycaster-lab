<?php

/** Code défini dans le périphérique des rooms **/

define('BLOCK_VOID', 0);
define('BLOCK_WALL', 1);
define('BLOCK_DOOR', 2);
define('BLOCK_DOORWAY_X', 3);
define('BLOCK_DOORWAY_Y', 4);
define('BLOCK_WINDOW', 5);
define('BLOCK_TREASURE', 6);
define('BLOCK_SECRET', 7);
define('BLOCK_SECRET_WALL', 8);
define('BLOCK_CURTAIN', 9);
define('BLOCK_WALL_TORCH', 0xA);
define('BLOCK_WALL_GRATE', 0xB);
define('BLOCK_WALL_ALCOVE', 0xC);
define('BLOCK_RELIC_CHEST', 0xD);
define('BLOCK_SHOP', 0xE);

define('BLOCK_KEY_0', 0x10);
define('BLOCK_KEY_1', 0x11);
define('BLOCK_KEY_2', 0x12);
define('BLOCK_KEY_3', 0x13);
define('BLOCK_EMPTY_KEY', 0x14);
define('BLOCK_LOCKEDDOOR_0', 0x18);
define('BLOCK_LOCKEDDOOR_1', 0x19);
define('BLOCK_LOCKEDDOOR_2', 0x1A);
define('BLOCK_LOCKEDDOOR_3', 0x1B);
define('BLOCK_UNLOCKEDDOOR', 0x1C);

define('BLOCK_LIBRARY_BOOK', 0x20);
define('BLOCK_CHURCH_STAINED_GLASS', 0x2A);
define('BLOCK_CHURCH_DEATH_IDOL', 0x2B);
define('BLOCK_CHURCH_RUNES', 0x2C);

define('BLOCK_JAIL_WALL_SHACKLES_X', 0x30);
define('BLOCK_JAIL_WALL_SHACKLES_Y', 0x31);
define('BLOCK_JAIL_BARS', 0x32);
define('BLOCK_JAIL_DOOR', 0x33);

define('BLOCK_WATCH_WALL', 0x40);
define('BLOCK_WATCH_DOORWAY_X', 0x41);
define('BLOCK_WATCH_DOORWAY_Y', 0x42);
define('BLOCK_WATCH_WALL_2_X', 0x43);
define('BLOCK_WATCH_WALL_2_Y', 0x44);
define('BLOCK_WATCH_DOOR_LOCKED', 0x45);
define('BLOCK_WATCH_WINDOW', 0x46);

// crafty places
define('BLOCK_LABO_WALL', 0x50);
define('BLOCK_LABO_CLOSET_X', 0x51);
define('BLOCK_LABO_CLOSET_Y', 0x52);
define('BLOCK_LABO_BOOK', 0x53);
define('BLOCK_LABO_ALCHEMY', 0x54);
define('BLOCK_FORGE_ANVIL', 0x55);
define('BLOCK_FORGE_TOOLS', 0x56);
define('BLOCK_KITCHEN_TABLE', 0x5A);
define('BLOCK_KITCHEN_FOOD', 0x5B);



define('BLOCK_LIVING_WALL', 0x60);
define('BLOCK_LIVING_FIREPLACE', 0x61);
define('BLOCK_LIVING_PICTURE', 0x62);
define('BLOCK_LIVING_BOOK', 0x63);
define('BLOCK_LIVING_TAPESTRY', 0x64);


define('BLOCK_ELEVATOR_WALL', 0x80);
define('BLOCK_ELEVATOR_DOOR_PREV', 0x81);
define('BLOCK_ELEVATOR_DOOR_NEXT_SEALED', 0x82);
define('BLOCK_ELEVATOR_SWITCH_NEXT', 0x83);
define('BLOCK_ELEVATOR_EXIT', 0x84);
define('BLOCK_ELEVATOR_ENTRANCE', 0x85);
define('BLOCK_ELEVATOR_DOORWAY_X', 0x86);
define('BLOCK_ELEVATOR_DOORWAY_Y', 0x87);
define('BLOCK_ELEVATOR_SWITCH_PREV', 0x88);
define('BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED', 0x89);
define('BLOCK_ELEVATOR_SWITCH_PORTAL', 0x8A);
define('BLOCK_ELEVATOR_PORTAL', 0x8B);




define('BLOCK_FOREST_TREE', 0xA0);
define('BLOCK_FOREST_WALL', 0xA1);
define('BLOCK_FOREST_BUSH', 0xA2);
define('BLOCK_FOREST_FENCE', 0xA3);
define('BLOCK_FOREST_SHADOW_WALL', 0xA4);
define('BLOCK_FOREST_SHADOW_WINDOW', 0xA5);
define('BLOCK_FOREST_WALL_IVY', 0xA6);



define('BLOCK_MOB_LEVEL_0', 0xF0);
define('BLOCK_MOB_LEVEL_1', 0xF1);
define('BLOCK_MOB_LEVEL_2', 0xF2);
define('BLOCK_MOB_LEVEL_3', 0xF3);
define('BLOCK_MOB_LEVEL_4', 0xF4);
define('BLOCK_MOB_LEVEL_5', 0xF5);
define('BLOCK_MOB_LEVEL_6', 0xF6);
define('BLOCK_MOB_LEVEL_7', 0xF7);
define('BLOCK_MOB_LEVEL_8', 0xF8);
define('BLOCK_MOB_LEVEL_9', 0xF9);
define('BLOCK_MOB_LEVEL_X', 0xFA);

define('BLOCK_SOB_TYPE_1', 0xFB);
define('BLOCK_SOB_TYPE_2', 0xFC);
define('BLOCK_SOB_TYPE_3', 0xFD);
define('BLOCK_SOB_TYPE_4', 0xFE);
define('BLOCK_SOB_TYPE_5', 0xFF);



$aSTYLES = array(
BLOCK_VOID => array('class' => '', 'text' => '', 'legend' => ''),
BLOCK_WALL => array('class' => 'wall', 'text' => '.', 'legend' => ''),
BLOCK_DOOR => array('class' => 'door', 'text' => 'd', 'legend' => 'door'),
BLOCK_DOORWAY_X => array('class' => 'doorxside', 'text' => '--', 'legend' => ''),
BLOCK_DOORWAY_Y => array('class' => 'dooryside', 'text' => '|', 'legend' => ''),
BLOCK_WINDOW => array('class' => 'window', 'text' => '#', 'legend' => 'window'),
BLOCK_TREASURE => array('class' => 'treasure', 'text' => '$', 'legend' => 'treasure'),
BLOCK_SECRET => array('class' => 'secret', 'text' => '?', 'legend' => 'secret passage'),
BLOCK_SECRET_WALL => array('class' => 'secret', 'text' => '!', 'legend' => 'secret passage'),
BLOCK_CURTAIN => array('class' => 'door', 'text' => 'c', 'legend' => 'curtain'),
BLOCK_WALL_TORCH => array('class' => 'wall', 'text' => 'i', 'legend' => 'torch'),
BLOCK_WALL_GRATE => array('class' => 'wall', 'text' => 'm', 'legend' => 'grate'),
BLOCK_WALL_ALCOVE => array('class' => 'wall', 'text' => 'h', 'legend' => 'alcove'),
BLOCK_KEY_0 => array('class' => 'key0', 'text' => '!0', 'legend' => 'Key 0'),
BLOCK_KEY_1 => array('class' => 'key1', 'text' => '!1', 'legend' => 'Key 1'),
BLOCK_KEY_2 => array('class' => 'key2', 'text' => '!2', 'legend' => 'Key 2'),
BLOCK_KEY_3 => array('class' => 'key3', 'text' => '!3', 'legend' => 'Key 3'),
BLOCK_EMPTY_KEY => array('class' => '', 'text' => 'e', 'legend' => 'empty key holder'),
BLOCK_LOCKEDDOOR_0 => array('class' => 'lockeddoor0', 'text' => '0!', 'legend' => 'locked door 0'),
BLOCK_LOCKEDDOOR_1 => array('class' => 'lockeddoor1', 'text' => '1!', 'legend' => 'locked door 1'),
BLOCK_LOCKEDDOOR_2 => array('class' => 'lockeddoor2', 'text' => '2!', 'legend' => 'locked door 2'),
BLOCK_LOCKEDDOOR_3 => array('class' => 'lockeddoor3', 'text' => '3!', 'legend' => 'locked door 3'),
BLOCK_MOB_LEVEL_0 => array('class' => 'mob', 'text' => '0', 'legend' => 'mob lvl 0'),
BLOCK_MOB_LEVEL_1 => array('class' => 'mob', 'text' => '1', 'legend' => 'mob lvl 1'),
BLOCK_MOB_LEVEL_2 => array('class' => 'mob', 'text' => '2', 'legend' => 'mob lvl 2'),
BLOCK_MOB_LEVEL_3 => array('class' => 'mob', 'text' => '3', 'legend' => 'mob lvl 3'),
BLOCK_MOB_LEVEL_4 => array('class' => 'mob', 'text' => '4', 'legend' => 'mob lvl 4'),
BLOCK_MOB_LEVEL_5 => array('class' => 'mob', 'text' => '5', 'legend' => 'mob lvl 5'),
BLOCK_MOB_LEVEL_6 => array('class' => 'mob', 'text' => '6', 'legend' => 'mob lvl 6'),
BLOCK_MOB_LEVEL_7 => array('class' => 'mob', 'text' => '7', 'legend' => 'mob lvl 7'),
BLOCK_MOB_LEVEL_8 => array('class' => 'mob', 'text' => '8', 'legend' => 'mob lvl 8'),
BLOCK_MOB_LEVEL_9 => array('class' => 'mob', 'text' => '9', 'legend' => 'mob lvl 9'),
BLOCK_MOB_LEVEL_X => array('class' => 'mob', 'text' => 'X', 'legend' => 'mob lvl X'),
BLOCK_SOB_TYPE_1 => array('class' => 'sob', 'text' => 'o1', 'legend' => 'sob type 1'),
BLOCK_SOB_TYPE_2 => array('class' => 'sob', 'text' => 'o2', 'legend' => 'sob type 2'),
BLOCK_SOB_TYPE_3 => array('class' => 'sob', 'text' => 'o3', 'legend' => 'sob type 3'),
BLOCK_SOB_TYPE_4 => array('class' => 'sob', 'text' => 'o4', 'legend' => 'sob type 4'),
BLOCK_SOB_TYPE_5 => array('class' => 'sob', 'text' => 'o5', 'legend' => 'sob type 5'),
		
BLOCK_ELEVATOR_WALL => array('class' => 'wall', 'text' => 'e', 'legend' => ''),
BLOCK_ELEVATOR_DOOR_PREV => array('class' => 'door', 'text' => 'd', 'legend' => 'door to prev level'),
BLOCK_ELEVATOR_DOOR_NEXT_SEALED => array('class' => 'door', 'text' => 'd', 'legend' => 'door to next level (sealed)'),
BLOCK_ELEVATOR_SWITCH_NEXT => array('class' => 'object', 'text' => 'l+', 'legend' => 'next level'),
BLOCK_ELEVATOR_EXIT => array('class' => '', 'text' => 'x', 'legend' => 'exit'),
BLOCK_ELEVATOR_ENTRANCE => array('class' => '', 'text' => 's', 'legend' => 'start'),
BLOCK_ELEVATOR_DOORWAY_X => array('class' => 'doorxside', 'text' => '--', 'legend' => ''),
BLOCK_ELEVATOR_DOORWAY_Y => array('class' => 'dooryside', 'text' => '|', 'legend' => ''),
BLOCK_ELEVATOR_SWITCH_PREV => array('class' => 'object', 'text' => 'l-', 'legend' => 'prev level'),
BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED => array('class' => 'door', 'text' => 'd', 'legend' => 'door to next level (unsealed)'),
BLOCK_ELEVATOR_SWITCH_PORTAL => array('class' => 'object', 'text' => 'p+', 'legend' => 'portal'),
BLOCK_ELEVATOR_PORTAL => array('class' => '', 'text' => 'p', 'legend' => 'portal spawnpoint'),

BLOCK_JAIL_WALL_SHACKLES_X => array('class' => 'wall', 'text' => '..', 'legend' => 'shackles'),
BLOCK_JAIL_WALL_SHACKLES_Y => array('class' => 'wall', 'text' => ':', 'legend' => 'shackles'),
BLOCK_JAIL_BARS => array('class' => 'window', 'text' => '||', 'legend' => 'bars'),
BLOCK_JAIL_DOOR => array('class' => 'door', 'text' => '#', 'legend' => 'jaildoor'),

BLOCK_LABO_WALL => array('class' => 'wall', 'text' => 'w', 'legend' => ''),
BLOCK_LABO_CLOSET_X => array('class' => 'woodwall', 'text' => '=', 'legend' => 'closet'),
BLOCK_LABO_CLOSET_Y => array('class' => 'woodwall', 'text' => '||', 'legend' => 'closet'),
BLOCK_LABO_BOOK => array('class' => 'book', 'text' => 'b', 'legend' => 'bookshelf'),
BLOCK_LABO_ALCHEMY => array('class' => 'treasure', 'text' => 'U', 'legend' => 'alchemy'),
BLOCK_FORGE_ANVIL =>  array('class' => 'treasure', 'text' => 'A', 'legend' => 'anvil'),
BLOCK_FORGE_TOOLS => array('class' => 'wall', 'text' => 'f', 'legend' => 'forge tools'),
BLOCK_KITCHEN_TABLE =>  array('class' => 'treasure', 'text' => 'F', 'legend' => 'table food'),
BLOCK_KITCHEN_FOOD => array('class' => 'wall', 'text' => 'k', 'legend' => 'kitchen food'),


BLOCK_LIBRARY_BOOK => array('class' => 'book', 'text' => 'b', 'legend' => 'bookshelf'),

BLOCK_CHURCH_STAINED_GLASS => array('class' => 'book', 'text' => 'g', 'legend' => 'stained glass'),
BLOCK_CHURCH_DEATH_IDOL => array('class' => 'book', 'text' => 'di', 'legend' => 'death idols'),
BLOCK_CHURCH_RUNES => array('class' => 'book', 'text' => 'r', 'legend' => 'runes'),

BLOCK_LIVING_WALL => array('class' => 'wall', 'text' => 'w', 'legend' => ''),
BLOCK_LIVING_FIREPLACE => array('class' => 'object', 'text' => 'f', 'legend' => 'fireplace'),
BLOCK_LIVING_PICTURE => array('class' => 'object', 'text' => 'p', 'legend' => 'portrait'),
BLOCK_LIVING_BOOK => array('class' => 'book', 'text' => 'u', 'legend' => 'bookshelf'),
BLOCK_LIVING_TAPESTRY => array('class' => 'object', 'text' => 't', 'legend' => 'tapestry'),

BLOCK_WATCH_WALL => array('class' => 'woodwall', 'text' => '.', 'legend' => ''),
BLOCK_WATCH_DOORWAY_X => array('class' => 'woodwall', 'text' => '--', 'legend' => ''),
BLOCK_WATCH_DOORWAY_Y => array('class' => 'woodwall', 'text' => '|', 'legend' => ''),
BLOCK_WATCH_WALL_2_X => array('class' => 'woodwall', 'text' => '..', 'legend' => 'poster'),
BLOCK_WATCH_WALL_2_Y => array('class' => 'woodwall', 'text' => ':', 'legend' => 'poster'),
BLOCK_WATCH_DOOR_LOCKED => array('class' => 'door', 'text' => 'd!', 'legend' => 'locked door'),
BLOCK_WATCH_WINDOW => array('class' => 'window', 'text' => '#', 'legend' => 'window'),

BLOCK_FOREST_TREE => array('class' => 'woodwall', 'text' => '.', 'legend' => 'tree'),
BLOCK_FOREST_WALL => array('class' => 'wall', 'text' => '.', 'legend' => 'wall'),
BLOCK_FOREST_BUSH => array('class' => 'woodwall', 'text' => '*', 'legend' => 'bush'),
BLOCK_FOREST_FENCE => array('class' => 'woodwall', 'text' => '#', 'legend' => 'fence'),
BLOCK_FOREST_SHADOW_WALL => array('class' => 'wall', 'text' => '::', 'legend' => 'shadow wall'),
BLOCK_FOREST_SHADOW_WINDOW => array('class' => 'wall', 'text' => '#:', 'legend' => 'shadow window'),
BLOCK_FOREST_WALL_IVY => array('class' => 'woodwall', 'text' => 'v', 'legend' => 'ivy')
);
