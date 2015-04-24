<?php
require 'generators/dungeon/blocks.php';


/**
 * Boss room generator
 * -rsX : room size
 * -lsX : laby size
 * -tX : laby type 0:exploration 1:fusion
 * -d1 : add decorum
 */

class BossLevelGenerator extends LevelGenerator {
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/dungeon/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		$rs = $this->getOption('rs') * 2 + 7;
		$ls = $this->getOption('ls') + 4;
		$nAlgo = $this->getOption('t');
		$this->setSize ($ls, $ls, $rs, $rs );
		$this->setMap ($this->buildLaby($nAlgo));
		list ($xBossRoom, $yBossRoom, $wBossRoom, $hBossRoom) = $this->openBossRoom();
		$this->processRooms ();
		if ($this->getOption('d')) {
			$this->spawnDecorum();
		}
		$this->postProcessRooms();
		$this->processLevel();
		$this->buildBossRoom(
				$xBossRoom * ($this->nRoomWidth - 1) + 1,
				$yBossRoom * ($this->nRoomHeight - 1) + 1,
				$wBossRoom * ($this->nRoomWidth - 1) - 1,
				$hBossRoom * ($this->nRoomHeight - 1) - 1
		);
		LevelToolKit::makeFancyWalls($this);	
		LevelToolKit::removeNoSpawn($this);
	}
	
	public function spawnDecorum() {
		foreach ($this->aRooms as $r) {
			foreach ($r as $oRoom) {
				$w = $oRoom->getWidth();
				$h = $oRoom->getHeight();
				$aVoids = array();
				for ($y = 0; $y < $h; ++$y) {
					for ($x = 0; $x < $w; ++$x) {
						$nCell = $oRoom->getCell($x, $y);
						if ($nCell == BLOCK_VOID) {
							$aVoids[] = array($x, $y);
						}
					}
				}
				// bulles
				list($x, $y) = $this->oRnd->choose($aVoids);
				$oRoom->setCell($x, $y, $this->oRnd->getRandom(BLOCK_SOB_TYPE_1, BLOCK_SOB_TYPE_5));
			}
		}
	}

	
	public function processRoom($x, $y, $oRoom) {
		$sType = $oRoom->getRoomData('type');
		$sHelper = '';
		switch ($sType) {
			case 'entrance':
			case 'exit':
				$sHelper = 'boss/Elevator';
				break;
				
			default:
				$sHelper = 'boss/Normal';
				break;
		
		}
		if ($sHelper) {
			$oRoom->setRoomData('helper', $sHelper);
		}		
	}

	public function buildBossRoom($x, $y, $w, $h) {
		$this->block(0, $x, $y,	$w,	$h);
		$this->setCell($x + ($w >> 1), $y + ($h >> 1), BLOCK_MOB_LEVEL_X);
		$aMinions = array(
				array('x' => 0, 'y' => -1,  'n' => 9),
				array('x' => 1, 'y' => -1,  'n' => 8),
				array('x' => 1, 'y' => 0,   'n' => 9),
				array('x' => 1, 'y' => 1,   'n' => 8),
				array('x' => 0, 'y' => 1,   'n' => 9),
				array('x' => -1, 'y' => 1,  'n' => 8),
				array('x' => -1, 'y' => 0,  'n' => 9),
				array('x' => -1, 'y' => -1, 'n' => 8)
		);
		foreach ($aMinions as $xyMinion) {
			$xm = $xyMinion['x'] << 1;
			$ym = $xyMinion['y'] << 1;
			$this->setCell($x + $xm + ($w >> 1), $y + $ym + ($h >> 1), BLOCK_MOB_LEVEL_0 + $xyMinion['n']);
		}
		if ($this->getOption('d')) {
			$this->setCell($x + ($w >> 1), $y, BLOCK_SOB_TYPE_1);
			$this->setCell($x + ($w >> 1), $y + $h - 1, BLOCK_SOB_TYPE_1);
			$this->setCell($x, $y + ($h >> 1), BLOCK_SOB_TYPE_1);
			$this->setCell($x + $w - 1, $y + ($h >> 1), BLOCK_SOB_TYPE_1);
		}
	}
	
	public function openBossRoom() {
		$oLaby = $this->oMap;
		// choix de la pièce centrale
		$wBossRoom = 2;
		$hBossRoom = 2;
		
		$w = $oLaby->getWidth();
		$h = $oLaby->getHeight();
		
		$oXY = new Grid();
		$oXY->setSize($w, $h);

		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$oXY->setCell($x, $y, 0);
				if ($oLaby->isExit($x, $y) || $oLaby->isEntrance($x, $y)) {
					$oXY->setCell($x, $y, 1);
					if ($x > 0) {
						$oXY->setCell($x - 1, $y, 1);
					}
					if ($y > 0) {
						$oXY->setCell($x, $y - 1, 1);
					}
					if ($x > 0 && $y > 0) {
						$oXY->setCell($x - 1, $y - 1, 1);
					}
				}
			}
		}
		
		// creation de la liste des positions possibles
		$aXYBossRoom = array();
		for ($y = 0; $y <= ($h - $hBossRoom); $y++) {
			for ($x = 0; $x <= ($w - $wBossRoom); $x++) {
				if ($oXY->getCell($x, $y) === 0) {
					$aXYBossRoom[] = array($x, $y);
				}
			}
		}
		
		list($xBossRoom, $yBossRoom) = $this->oRnd->choose($aXYBossRoom);
		
		$oLaby->openDoor($xBossRoom, $yBossRoom, 1);
		$oLaby->openDoor($xBossRoom, $yBossRoom, 2);
		$oLaby->openDoor($xBossRoom + 1, $yBossRoom + 1, 0);
		$oLaby->openDoor($xBossRoom + 1, $yBossRoom + 1, 3);
		return array($xBossRoom, $yBossRoom, $wBossRoom, $hBossRoom);
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}	
}
