<?php
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
