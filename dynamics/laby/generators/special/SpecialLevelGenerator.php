<?php
require_once('generators/dungeon/blocks.php');
require_once('generators/special/LabyRoomElevator.php');
require_once('generators/special/LabyRoomTreasure.php');

class SpecialLevelGenerator extends LevelGenerator {
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/dungeon/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		if (!is_null($nSeed)) {
			$this->oRnd->setRandomSeed($nSeed);
		}

		// lectures des options
		$rs = $this->getOption('rs') * 2 + 9;
		$ls = $this->getOption('ls') + 4;
		$nAlgo = $this->getOption('t');
		
		// dimensionnement, création carte
		$this->setSize ($ls, $ls, $rs, $rs );
		$this->setMap ($this->buildLaby($nAlgo));
		$this->processRooms();
		
		$this->postProcessRooms();
		$this->processLevel();
		LevelToolKit::removeNoSpawn($this);
	}
	
	public function processRoom($x, $y, $oRoom) {
		$nType = 0;
		$sType = $oRoom->getRoomData('type');
		$sHelper = '';
		switch ($sType) {
			case 'entrance':
				$sHelper = 'dungeon/Elevator';
				break;
	
			default:
				$sHelper = 'special/Treasure';
				break;
		}
		if ($sHelper) {
			$oRoom->setRoomData('helper', $sHelper);
		}
	}
	
	
	public function digLaby($nAlg, $xStart, $yStart) {
		$oLaby = new LabyGenerator();                     // Instancier le laby
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		$oLaby->setSize($w, $h);
		switch ($nAlg) {
			case 0:
				$oLaby->exploration($xStart, $yStart);            // générer l'itinéraire
				break;

			case 1:
				$oLaby->fusion($xStart, $yStart);            // générer l'itinéraire
				break;
		}
		return $oLaby;
	}

	public function generatex($nSeed = null) {
		if (!is_null($nSeed)) {
			$this->oRnd->setRandomSeed($nSeed);
		}
		/* Génération des pièces du labyrinthe */
		$oData = $this->generateTreasure($nSeed);
		$this->oMap = $oData['laby'];
		$oRGs = $oData['rooms'];
		$oPeris = $oData['peris'];
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$oRG = $oRGs[$y][$x];
				$oPeri = $oPeris[$y][$x];

				$oPeri->copy($oRG, 1, 1);
				$this->copyZero($oPeri, $x * ($this->nRoomWidth - 1), $y * ($this->nRoomHeight - 1));
			}
		}
		$this->makeFancyWalls();
	}
	
	public function generateTreasure($nSeed) {
		$this->nRoomWidth = 9;
		$this->nRoomHeight = 9;
		$this->nMapWidth = 3;
		$this->nMapHeight = 3;
		$this->setSize($this->nMapWidth, $this->nMapHeight);
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		$oLaby = $this->digLaby(0, $w >> 1, $h - 1);
		
		$oRGs = array();
		$oPeris = array();
		
		for ($y = 0; $y < $h; $y++) {
			$oRGRow = array();
			$oPeriRow = array();
			for ($x = 0; $x < $w; $x++) {
				$oRG = new RoomGenerator();
				$oRG->setSize($this->nRoomWidth - 2, $this->nRoomHeight - 2);
				$oRG->block(0, 0, 0, $this->nRoomWidth - 2, $this->nRoomHeight - 2);
				if ($oLaby->isEntrance($x, $y)) {
					$oRG->setCell(0, 0, 0);
					$oRG->setCell(1, 0, $oLaby->getDoorMask($x, $y));
        			$this->runLabyRoomHelper('Elevator', $oRG, null);
				} elseif ($oLaby->isExit($x, $y)) {
					$oRG->setCell(0, 0, 2);
					$oRG->setCell(1, 0, $oLaby->getDoorMask($x, $y));
        			$this->runLabyRoomHelper('Treasure', $oRG, null);
				} elseif ($oLaby->isDeadEnd($x, $y)) {
					$oRG->setCell(0, 0, 1);
					$oRG->setCell(1, 0, $oLaby->getDoorMask($x, $y));
        			$this->runLabyRoomHelper('Treasure', $oRG, null);
				} else {
					$oRG->setCell(0, 0, 0);
					$oRG->setCell(1, 0, $oLaby->getDoorMask($x, $y));
        			$this->runLabyRoomHelper('Treasure', $oRG, null);
				}
				
				$oPeri = new RoomGenerator();
				$oPeri->setSize($this->nRoomWidth, $this->nRoomHeight);
				$oPeri->block(1, 0, 0, $this->nRoomWidth, $this->nRoomHeight);
				$oPeri->generateDunHallway(1, $oLaby->getDoorMask($x, $y), $oLaby->isDeadEnd($x, $y) ? 1 : 5);
				
				$oRGRow[] = $oRG;
				$oPeriRow[] = $oPeri;
			}
			$oRGs[] = $oRGRow;
			$oPeris[] = $oPeriRow;
		}
		return array(
			'laby' => $oLaby,
			'rooms' => $oRGs,
			'peris' => $oPeris
		);
	}

	public function makeFancyWalls() {
		for ($y = 1; $y < $this->getHeight() - 1; $y++) {
			for ($x = 1; $x < $this->getWidth() - 1; $x++) {
				if ($this->getCell($x, $y) == BLOCK_WALL) {
					switch ($this->oRnd->getRandom(0, 10)) {
						case 4: $this->setCell($x, $y, BLOCK_WALL_TORCH); break;
						case 5: $this->setCell($x, $y, BLOCK_WALL_TORCH); break;
						case 6: $this->setCell($x, $y, BLOCK_WALL_GRATE); break;
						case 7: $this->setCell($x, $y, BLOCK_WALL_ALCOVE); break;
					}
				}
			}
		}
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}	
	
}
