<?php 

define('BLOCK_VOID', 0);
define('BLOCK_WALL', 1);
define('BLOCK_WALL_FANCY', 2);
define('BLOCK_WALL_WOOD', 3);



$aSTYLES = array(
	BLOCK_VOID => array ('class' => '', 'text' => ''),
	BLOCK_WALL => array ('class' => 'wall', 'text' => '.', 'legend' => 'wall'), 
	BLOCK_WALL_FANCY => array ('class' => 'wall', 'text' => '~', 'legend' => 'wall (fancy)'),
	BLOCK_WALL_WOOD => array ('class' => 'wood', 'text' => '~', 'legend' => 'wall (wood)'),
);

