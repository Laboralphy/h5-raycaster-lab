<?php
require_once 'classes/ChronoTrigger.php';
require_once 'classes/Grid.php';
require_once 'classes/LabyRoomHelper.php';
require_once 'classes/RoomGenerator.php';
require_once 'classes/LabyRoom.php';
require_once 'classes/Blox.php';
require_once 'classes/SecretGenerator.php';
require_once 'classes/LabyGenerator.php';
require_once 'classes/LevelGenerator.php';
require_once 'classes/LevelToolKit.php';
require_once 'classes/LifeGame.php';
require_once 'classes/Painter.php';

require 'blocks.php';

class TrivialLevelGenerator extends LevelGenerator {
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/trivial/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		$this->setSize ( 5, 5, 7, 7 );
		$this->setMap ( $this->buildLaby ( 0 ) );
		$this->processRooms ();
		$this->postProcessRooms ();
		$this->processLevel();
	}
	
	public function processRoom($x, $y, $oRoom) {
		
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}	
}
