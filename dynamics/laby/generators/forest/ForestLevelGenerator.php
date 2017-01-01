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

require_once 'blocks.php';

class ForestLevelGenerator extends LevelGenerator {
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/forest/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		
		$rs = $this->getOption('rs') * 2 + 7;
		$ls = $this->getOption('ls') + 3;
		
		$this->setSize($ls, $ls, $rs, $rs );
		$this->setMap($this->buildLaby($nAlgo, null, $ls - 1));
		$this->processRooms();
		$this->postProcessRooms ();
		$this->processLevel();
		$this->fillGroove();

		LevelToolKit::removeNoSpawn($this);
		
		if ($this->getOption('w')) {
			$this->spawnKeep();
		} else {
			LevelToolKit::spawnMobs($this, -3);
		}
	}
	
	public function spawnKeep() {
		$w2 = $this->getWidth() >> 1;
		for ($x = 2; $x < $w2; ++$x) {
			$nWall = $x % 3 == 1 ? BLOCK_FOREST_SHADOW_WINDOW : BLOCK_FOREST_SHADOW_WALL;
			$nIvy = $x % 3 == 1 ? BLOCK_WINDOW : BLOCK_FOREST_WALL_IVY;
			$this->setCell($x + $w2, 0, $nWall);
			$this->setCell($x + $w2, 1, BLOCK_VOID);
			$this->setCell($x + $w2, 2, $nIvy);
			$this->setCell($w2 - $x, 0, $nWall);
			$this->setCell($w2 - $x, 1, BLOCK_VOID);
			$this->setCell($w2 - $x, 2, $nIvy);
		}
		$this->block(BLOCK_WALL, $w2 - 1, 0, 3, 3);
		$this->setCell($w2, 1, BLOCK_ELEVATOR_SWITCH_NEXT);
		$this->setCell($w2, 2, BLOCK_ELEVATOR_EXIT);
		$this->block(BLOCK_VOID, $w2 - 1, 3, 3, 3);
		$this->setCell($w2 - 1, 3, BLOCK_WALL_TORCH);
		$this->setCell($w2 + 1, 3, BLOCK_WALL_TORCH);
	}
	
	public function processRoom($x, $y, $oRoom) {
		$aHelpers = array('forest/Track', 'forest/Glade', 'forest/Grove');
		if ($this->oMap->isEntrance($x, $y) || (($this->oMap->isExit($x, $y) && !$this->getOption('w')))) {
			$oRoom->setRoomData('helper', 'forest/Entrance');
		} else {
			$oRoom->setRoomData('helper', $this->oRnd->choose($aHelpers));
		}
	}
	
	public function fillGroove() {
		$w = $this->getWidth();
		$h = $this->getHeight();
		// détecter les creux
		$aCreux = array(
			BLOCK_FOREST_BUSH,
			BLOCK_FOREST_FENCE
		);
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$nBlock = $this->getCell($x, $y);
				$cn = $this->getCellNeighborhood($x, $y);
				$n = 0;
				foreach ($cn as $k => $c) {
					$n |= ($c == BLOCK_FOREST_TREE ? 1 : 0) << $k;
				}
				if ($nBlock === BLOCK_VOID) {
					switch ($n) {
						case 7:
						case 11:
						case 13:
						case 14:
							$this->setCell($x, $y, $this->oRnd->choose($aCreux));
							break;
					}
				}
			}
		}
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$nBlock = $this->getCell($x, $y);
				$cn = $this->getCellNeighborhood($x, $y);
				$n = 0;
				foreach ($cn as $k => $c) {
					$n |= ($c == BLOCK_VOID ? 1 : 0) << $k;
				}
				if ($nBlock === BLOCK_FOREST_TREE && $n === 15) {
					$this->setCell($x, $y, BLOCK_SOB_TYPE_1);
				}
			}
		}
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}	
}
