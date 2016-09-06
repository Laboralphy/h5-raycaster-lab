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


require_once 'generators/dungeon/blocks.php';
require_once 'generators/dungeon/LabyRoomElevator.php';
require_once 'generators/dungeon/LabyRoomShop.php';

/**
 * Cave generator
 * -rsX : room size
 * -lsX : laby size
 * -tX : laby type 0:exploration 1:fusion
 * -sX : add shops
 * -d1 : add decorum
 * -p1 add a portal
 */

class CaveLevelGenerator extends LevelGenerator {
	
	protected $aDeadEnds = array();
	
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/dungeon/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		
		$rs = $this->getOption('rs') * 2 + 7;
		$ls = $this->getOption('ls') + 4;
		$nAlgo = $this->getOption('t');
		$this->setSize ($ls, $ls, $rs, $rs );
		$this->setMap ($this->buildLaby($nAlgo));
		$this->processRooms ();
		$this->spawnPortal();	
		// placer des magasins
		$nShopCount = LevelToolKit::spawnShops($this->aDeadends, $this->getOption('s'));
		
		$this->postProcessRooms();
		if ($this->getOption('d')) {
			$this->spawnDecorum();
		}
		$this->processLevel();
		
		LevelToolKit::spawnSecretPlaces($this);
		LevelToolKit::spawnLastShops($this, $nShopCount);
		LevelToolKit::makeFancyWalls($this);
		LevelToolKit::spawnMobs($this);
		LevelToolKit::removeNoSpawn($this);
	}
	
	public function processRoom($x, $y, $oRoom) {
		$sHelper = '';
		switch ($oRoom->getRoomData('type')) {
			case 'entrance':
			case 'exit':
				$sHelper = 'dungeon/Elevator';
				break;
			
			case 'deadend':
				$this->aDeadends[] = $oRoom;
			
			default:
				$sHelper = 'cave/Cave';
		}
		if ($sHelper) {
			$oRoom->setRoomData('helper', $sHelper);
		}
	}
	
	
	/**
	 * Place un portail
	 */
	public function spawnPortal() {
		// création du portal
		if ($this->getOption('p')) {
			// un seul portal max
			$oRoom = array_shift($this->aDeadends);
			$oRoom->setRoomData('type', 'portal');
			$oRoom->setRoomData('helper', 'dungeon/Elevator');
		}
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

	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}
}
