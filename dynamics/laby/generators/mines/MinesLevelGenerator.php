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

/**
 * Options : 
 * -rs taille des pieces
 * -ls taille du labyrinthe
 * -s nombre de magasin
 * 
 * @author raphael.marandet
 *
 */
class MinesLevelGenerator extends LevelGenerator {
	protected $aHelpers = array(
			'dungeon/Corners',
			'dungeon/Jail',
			'dungeon/Labo',
			'dungeon/Forge',
			'dungeon/Storage'
	);
	
	protected $aDeadends;
	
	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/dungeon/styles.css');
		$this->oRnd->setRandomSeed($nSeed);

		// lectures des options
		$rs = $this->getOption('rs') * 4 + 13;
		$ls = $this->getOption('ls') + 4;
		$nAlgo = 0;

		// dimensionnement, création carte
		$this->setSize ($ls, $ls, $rs, $rs);
		$this->setMap ($this->buildLaby($nAlgo));
		$this->processRooms();
		$this->aDeadends = array();
		$nShopCount = LevelToolKit::spawnShops($this->aDeadends, $this->getOption('s'));
		
		$this->postProcessRooms();
		
		// Ajouter les portes
		foreach ($this->aRooms as $r1) {
			foreach ($r1 as $oRoom) {
				LevelToolKit::spawnDoors($oRoom);
			}
		}
				
		$this->processLevel();
		
		list ($aKeys, $aKeyHolders) = $this->buildMineKeyHolders();
		$aDoors = $this->buildMineRooms();
		$this->buildMineLockedDoors($aKeys, $aKeyHolders, $aDoors);

		
		LevelToolKit::spawnSecretPlaces($this);
		LevelToolKit::spawnLastShops($this, $nShopCount);
		LevelToolKit::makeFancyWalls($this);
		LevelToolKit::removeNoSpawn($this);
		LevelToolKit::spawnMobs($this);
	}
	
	public function processRoom($x, $y, $oRoom) {
		$sType = $oRoom->getRoomData('type');
		
		switch ($sType) {
			case 'entrance':
			case 'exit':
				$sHelper = 'dungeon/Elevator';
				break;
				
			case 'deadend':
				$this->aDeadends[] = $oRoom;
				$sHelper = $this->oRnd->choose($this->aHelpers);
				break;
		
			default:
				$sHelper = 'mines/Minetunnel';
		}
		$oRoom->setRoomData('helper', $sHelper);
	}
	
	
	public function buildMineKeyHolders() {
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		$aKH = array();
		
		$x = $this->oRnd->getRandom(0, $w - 1);
		$y = $this->oRnd->getRandom(0, $h - 1);
		$aKH[] = LevelToolKit::buildKeyHolder($this, $x, $y, 0);
		$nKeys = 1;
		$aKeys = array();
		$aKeys[] = 0;
		
		if ($w * $h > 9) {
			$x = $this->oRnd->getRandom(0, $w - 1);
			$y = $this->oRnd->getRandom(0, $h - 1);
			$aKH[] = LevelToolKit::buildKeyHolder($this, $x, $y, 1);
			$nKeys++;
			$aKeys[] = 1;
		}
		if ($w * $h > 16) {
			$x = $this->oRnd->getRandom(0, $w - 1);
			$y = $this->oRnd->getRandom(0, $h - 1);
			$aKH[] = LevelToolKit::buildKeyHolder($this, $x, $y, 2);
			$nKeys++;
			$aKeys[] = 2;
		}
		
		if ($w * $h > 25) {
			$x = $this->oRnd->getRandom(0, $w - 1);
			$y = $this->oRnd->getRandom(0, $h - 1);
			$aKH[] = LevelToolKit::buildKeyHolder($this, $x, $y, 3);
			$nKeys++;
			$aKeys[] = 3;
		}
		return array($aKeys, $aKH);
	}
	
	
	public function buildMineLockedDoors($aKeys, $aKeyHolders, $aDoors) {
		$aUsedKeys = array(false, false, false, false);
		
		$aDoors = $this->oRnd->shuffle($aDoors);
		foreach ($aKeys as $nKey) {
			$aRoomDoors = array_shift($aDoors);
			foreach ($aRoomDoors as $aDoor) {
				list ($xDoor, $yDoor) = $aDoor;
				$this->setCell($xDoor, $yDoor, BLOCK_LOCKEDDOOR_0 + $nKey);
				$aUsedKeys[$nKey] = true;
			}
		}
		foreach ($aUsedKeys as $nKey => $bUsed) {
			if (!$bUsed) {
				list ($xKey, $yKey) = $aKeyHolders[$nKey];
				$this->setCell($xKey, $yKey, BLOCK_EMPTY_KEY);
			}
		}
	}
	
	
	public function buildMineRooms() {
		
		
		// create key holders
		
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		

		
		// create rooms		
		$rw = $this->nRoomWidth;
		$rh = $this->nRoomHeight;
		$wl = $this->getWidth();
		$hl = $this->getHeight();
		
		$rw2 = $this->nRoomWidth >> 1;
		$rh2 = $this->nRoomHeight >> 1;
		
		$wMesh = $rw2 + 2;
		$hMesh = $rh2 + 2;
		
		
		$xDIR = array(0, 1, 0, -1);
		$yDIR = array(-1, 0, 1, 0);
		$y = 0;
		$aRooms = $this->getRooms();
		$aDoors = array();
		while ($y < ($h - 1))  {
			$x = 0;
			while ($x < ($w - 1))  {
				if ($aRooms[$y][$x]->getRoomData('type') === '' &&
					$aRooms[$y][$x + 1]->getRoomData('type') === '' &&
					$aRooms[$y + 1][$x]->getRoomData('type') === '' &&
					$aRooms[$y + 1][$x + 1]->getRoomData('type') === '') {
					$oRoom = new RoomGenerator();
					$aRoomDoors = array();
					$oRoom->setSize($rw - 6, $rh - 6);
					$nMask = 0;
					$wDir = $rw2; 
					$hDir = $rh2; 
					$xBase = $x * ($rw - 1) + $rw2 + $wDir;
					$yBase = $y * ($rh - 1) + $rh2 + $hDir;
					foreach ($xDIR as $nDir => $xDir) {
						$yDir = $yDIR[$nDir];
						$nCode = $this->getCell($xBase + $xDir * $wDir, $yBase + $yDir * $hDir);
						if ($nCode === BLOCK_DOOR || $nCode === BLOCK_VOID) {
							$nMask |= 1 << $nDir;
							$this->setCell($xBase + $xDir * $wDir, $yBase + $yDir * $hDir, BLOCK_VOID);
							$this->setCell($xBase + $xDir * ($wDir + 1), $yBase + $yDir * ($hDir + 1), BLOCK_VOID);
							$this->setCell($xBase + $xDir * ($wDir - 1), $yBase + $yDir * ($hDir - 1), BLOCK_VOID);
							$this->setCell($xBase + $xDir * ($wDir - 2), $yBase + $yDir * ($hDir - 2), BLOCK_DOOR);
							$aRoomDoors[] = array($xBase + $xDir * ($wDir - 2), $yBase + $yDir * ($hDir - 2));
							$this->setCell($xBase + $xDir * ($wDir - 2) + $yDir, $yBase + $yDir * ($hDir - 2) + $xDir, $xDir === 0 ? BLOCK_DOORWAY_X : BLOCK_DOORWAY_Y);
							$this->setCell($xBase + $xDir * ($wDir - 2) - $yDir, $yBase + $yDir * ($hDir - 2) - $xDir, $xDir === 0 ? BLOCK_DOORWAY_X : BLOCK_DOORWAY_Y);
						}
					}
					$oRoom = new LabyRoom();
					$oRoom->setSize($rw - 4, $rh - 4);
					$oRoom->setRoomData('doormask', $nMask);
					$this->block(BLOCK_VOID, $x * ($rw - 1) + $rw2 + 3, $y * ($rh - 1) + $rh2 + 3, $rw - 6, $rh - 6);
					$this->runLabyroomHelper($this->oRnd->choose($this->aHelpers), $oRoom);
					$this->copy($oRoom, $x * ($rw - 1) + $rw2 + 3, $y * ($rh - 1) + $rh2 + 3);
					$aDoors[] = $aRoomDoors;				
				}
				$x += 1;
			}
			$y += 1;
		}
		return $aDoors;
	}
		
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}
}
