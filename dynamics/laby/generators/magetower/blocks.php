<?php 

define('BLOCK_VOID', 				0x00);
define('BLOCK_FLOOR_WOOD',			0x01);

define('BLOCK_SPAWN_POINT', 		0x100);
define('BLOCK_SECRET_CHECK',		0x200);



// Normal theme
define('BLOCK_WALL', 				0x10);
define('BLOCK_DOORWAY_X', 			0x11); 
define('BLOCK_DOORWAY_Y', 			0x12);
define('BLOCK_WINDOW',	 			0x13);
define('BLOCK_WALL_SECRET', 		0x14);
define('BLOCK_CHEST', 				0x15);

define('BLOCK_LIVING_WALL', 		0x20);
define('BLOCK_LIVING_DECO', 		0x21);
define('BLOCK_LIVING_BOOKS',		0x22);
define('BLOCK_LIVING_FIRE',			0x23);
define('BLOCK_LIVING_FLOOR', 		0x24);

define('BLOCK_STORE_FULLCRATE', 	0x30);
define('BLOCK_STORE_HALFCRATE',		0x31);
define('BLOCK_STORE_WOOD', 			0x32);
// BAR
define('BLOCK_BAR_WALL', 			0x40);
define('BLOCK_BAR_DESK', 			0x41);
define('BLOCK_BAR_C2H4OH_X', 		0x42);
define('BLOCK_BAR_C2H4OH_Y', 		0x43);
define('BLOCK_BAR_TABLE', 			0x44);
define('BLOCK_BAR_FLOOR', 			0x45);


define('BLOCK_JAIL_WALL',			0x60);
define('BLOCK_JAIL_BARS',			0x61);

define('BLOCK_BANK_CHEST', 			0x68);
define('BLOCK_BANK_HALFBAR',		0x69);

define('BLOCK_SPECIAL_POSTER',		0x70);

define('BLOCK_DOOR', 				0x80);
define('BLOCK_DOOR_JAIL',			0x81);
define('BLOCK_DOOR_CURTAIN',		0x82);

define('BLOCK_DOOR_SECRET',			0x8F);

define('BLOCK_WALL_A1',				0xA1);
define('BLOCK_WALL_A2',				0xA2);
define('BLOCK_WALL_A3',				0xA3);

define('BLOCK_EXT_FLOOR',			0xB0);
define('BLOCK_EXT_ROOFSTEP',		0xB1);
define('BLOCK_EXT_GRID_X',			0xB2);
define('BLOCK_EXT_GRID_Y',			0xB3);
define('BLOCK_EXT_UPPER_SOFT_WALL',	0xB4);
define('BLOCK_EXT_UPPER_HARD_WALL',	0xB5);

// ALIASES

define('BLOCK_LIBRARY_BOOK', 		BLOCK_LIVING_BOOKS);
define('BLOCK_JAIL_DOOR',			BLOCK_DOOR_JAIL);
define('BLOCK_JAIL_WALL_SHACKLES_Y',BLOCK_JAIL_WALL);
define('BLOCK_JAIL_WALL_SHACKLES_X',BLOCK_JAIL_WALL);

define('BLOCK_SECRET', BLOCK_DOOR_SECRET);
define('BLOCK_SECRET_WALL', BLOCK_WALL_SECRET);
define('BLOCK_TREASURE', BLOCK_CHEST);
define('BLOCK_CURTAIN', BLOCK_DOOR_CURTAIN);



$aSTYLES = array(
	BLOCK_VOID => array ('class' => '', 'text' => ''),
	BLOCK_FLOOR_WOOD => array ('class' => '', 'text' => '_'),
	
	BLOCK_WALL => array ('class' => 'wall', 'text' => ' ', 'legend' => 'wall'), 
	BLOCK_DOORWAY_X => array ('class' => 'wall', 'text' => '='),
	BLOCK_DOORWAY_Y => array ('class' => 'wall', 'text' => '||'),
	BLOCK_WINDOW => array('class' => 'wall', 'text' => '#', 'legend' => 'spawnpoint'),
	BLOCK_WALL_SECRET => array('class' => 'secret', 'text' => '!', 'legend' => 'secret wall'),
	BLOCK_CHEST => array('class' => 'treasure', 'text' => '$', 'legend' => 'chest'),

	BLOCK_LIVING_WALL => array('class' => 'wall', 'text' => ' ', 'legend' => 'wall'),
	BLOCK_LIVING_DECO => array('class' => 'wall', 'text' => '[]', 'legend' => 'tapestry'),
	BLOCK_LIVING_BOOKS => array('class' => 'wood', 'text' => 'b', 'legend' => 'bookshelf'),
	BLOCK_LIVING_FIRE => array('class' => 'wall', 'text' => '*', 'legend' => 'fireplace'),
	BLOCK_LIVING_FLOOR => array('class' => '', 'text' => ',', 'legend' => 'living floor'),
		
	BLOCK_STORE_FULLCRATE => array('class' => 'wood', 'text' => 'C', 'legend' => 'full crate'),
	BLOCK_STORE_HALFCRATE => array('class' => 'wood', 'text' => 'c', 'legend' => 'half crate'),
	BLOCK_STORE_WOOD => array('class' => 'wood', 'text' => 'w', 'legend' => 'wood logs'),
		
	BLOCK_BAR_WALL => array('class' => 'wall', 'text' => 'w', 'legend' => 'bar wall'),
	BLOCK_BAR_DESK => array('class' => 'wood', 'text' => 'b', 'legend' => 'bar desk'),
	BLOCK_BAR_C2H4OH_X => array('class' => 'wood', 'text' => '-', 'legend' => 'bar c2h4oh'), 
	BLOCK_BAR_C2H4OH_Y => array('class' => 'wood', 'text' => '|', 'legend' => 'bar c2h4oh'),
	BLOCK_BAR_TABLE => array('class' => 'wood', 'text' => 'T', 'legend' => 'bar table'),
	BLOCK_BAR_FLOOR => array('class' => '', 'text' => ',', 'legend' => 'bar floor'),
		
	BLOCK_JAIL_WALL => array('class' => 'wall', 'text' => ' ', 'legend' => 'wall'),
	BLOCK_JAIL_BARS => array('class' => 'wall', 'text' => '||', 'legend' => 'bars'),
		
	BLOCK_BANK_CHEST => array('class' => 'wall', 'text' => 'o', 'legend' => 'armored chest'),
	BLOCK_BANK_HALFBAR => array('class' => 'wall', 'text' => '#', 'legend' => 'half bars'),
		
	BLOCK_SPECIAL_POSTER => array('class' => 'wall', 'text' => 'p', 'legend' => 'poster'),
	BLOCK_DOOR => array ('class' => 'door', 'text' => 'd', 'legend' => 'door'),
	BLOCK_DOOR_JAIL => array ('class' => 'door', 'text' => 'd', 'legend' => 'jail door'),
	BLOCK_DOOR_CURTAIN => array ('class' => 'door', 'text' => 'c', 'legend' => 'curtain'),
	BLOCK_DOOR_SECRET => array ('class' => 'secret', 'text' => '?', 'legend' => 'secret door'),

	BLOCK_WALL_A1 => array ('class' => 'wall1', 'text' => ' ', 'legend' => 'wall 1'),
	BLOCK_WALL_A2 => array ('class' => 'wall2', 'text' => ' ', 'legend' => 'wall 2'),
	BLOCK_WALL_A3 => array ('class' => 'wall3', 'text' => ' ', 'legend' => 'wall 3'),
	
	BLOCK_EXT_FLOOR => array('class' => '', 'text' => '.'),
	BLOCK_EXT_ROOFSTEP => array('class' => '', 'text' => '.'),
	BLOCK_EXT_GRID_X => array('class' => '', 'text' => '='),
	BLOCK_EXT_GRID_Y => array('class' => '', 'text' => '||'),
	BLOCK_EXT_UPPER_SOFT_WALL => array('class' => '', 'text' => '+'),
	BLOCK_EXT_UPPER_HARD_WALL => array('class' => '', 'text' => ''),
		
	BLOCK_SPAWN_POINT => array('class' => 'spawnpoint', 'text' => '1'),
	BLOCK_SECRET_CHECK => array('class' => '', 'text' => 'x')
);
