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

class MagetowerLevelGenerator extends LevelGenerator {
	
	protected $_aRoomPalette = array(
		'magetower/Library',
		'magetower/Living',
		'dungeon/Jail',
		'magetower/Corners',
		'magetower/Bank',
		'magetower/Storage',
		'magetower/Bar'
	);
	
	protected $_aTags = array();

	protected $_iRoomPalette = 0;

	public function generate($nSeed = null) {
		$this->_aRoomPalette = $this->oRnd->shuffle($this->_aRoomPalette);
		$this->nDefaultVoid = BLOCK_VOID;
		$this->nDefaultWall = BLOCK_WALL;
		$this->sStyles = file_get_contents('generators/magetower/styles.css');
		$this->oRnd->setRandomSeed($nSeed);

		$rs = $this->getOption('rs') * 2 + 9;
		$ls = $this->getOption('ls') + 3;
		$nLabyCurse = $this->getOption('lc');
		
		
		$this->setSize($ls, $ls, $rs, $rs );

		$oLaby = $this->buildLaby(1);
		
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		
		// réouverture de mur (le laby ne doit pas etre à chemin unique
		for ($l = 0; $l < $nLabyCurse; ++$l) {
			$oLaby2 = $this->buildLaby(1);
			for($y = 0; $y < $h; $y ++) {
				for($x = 0; $x < $w; $x ++) {
					if ($this->oRnd->roll100 ( 25 )) {
						$oLaby->setCell($x, $y, $oLaby->getCell( $x, $y) & $oLaby2->getCell ($x, $y));
					}
				}
			}
		}
		
		$this->setMap($oLaby);
		$this->processRooms();
		$this->postProcessRooms();
		$this->processRooms('prDoorsSpawnPointsChests');
		// Ajouter les portes
		$this->processLevel();
		
		//LevelToolkit::spawnSecretPlaces($this);
		LevelToolkit::spawnWindows($this);
		$oSecret = new SecretGenerator();
		$oSecret->setCorr(array(
	      ' ' => BLOCK_SECRET_CHECK,
	      '*' => BLOCK_WALL,
	      '?' => BLOCK_DOOR_SECRET,
	      '!' => BLOCK_WALL_SECRET,
	      '$' => BLOCK_CHEST,
	      '+' => BLOCK_WINDOW,
		  'd' => BLOCK_DOOR,
		  'c' => BLOCK_CURTAIN
		));
		LevelToolkit::spawnSecretPlaces($this, $oSecret);
		
		for ($y = 0; $y < $this->getHeight(); ++$y) {
			for ($x = 0; $x < $this->getWidth(); ++$x) {
				switch ($this->getCell($x, $y)) {
					case BLOCK_WALL:
						if ($this->oRnd->roll100(75)) {
							$this->setCell($x, $y, $this->oRnd->getRandom(0xA1, 0xA3));
						}
						break;
				}
			}
		}
	}
	
	public function prDoorsSpawnPointsChests($rx, $ry, $oRoom) {
		$this->prDoors($rx, $ry, $oRoom);
		$this->prChests($rx, $ry, $oRoom);
		$this->prSpawnPoints($rx, $ry, $oRoom);
	}
	
	public function prDoors($rx, $ry, $oRoom) {
		// door
		if ($oRoom->getRoomData('type') !== '') {
			LevelToolKit::spawnDoors($oRoom);
		}
	}
	
	public function prSpawnPoints($rx, $ry, $oRoom) {
		$rw = $oRoom->getWidth();
		$rh = $oRoom->getHeight();
		
		$a = array();
		
		// spawn point
		do {
			$x = $this->oRnd->getRandom(0, $rw - 1);
			$y = $this->oRnd->getRandom(0, $rh - 1);
			$nCellCode = $oRoom->getCell($x, $y);
		} while ($nCellCode != BLOCK_VOID && $nCellCode != BLOCK_LIVING_FLOOR && $nCellCode != BLOCK_BAR_FLOOR);
		$oRoom->setCell($x, $y, $oRoom->getCell($x, $y) | BLOCK_SPAWN_POINT);
	}
	
	
	public function prChests($rx, $ry, $oRoom) {
		// chest
		// rechercher les endroits ou on peut caser un coffre
		
		$aChests = $oRoom->searchPattern(array(
			'null' => '_',
			'default' => '?',
			BLOCK_WALL => 'X',
			BLOCK_LIVING_WALL => 'X',
			BLOCK_LIVING_DECO => 'X',
			BLOCK_JAIL_WALL => 'X',
			BLOCK_VOID => '.'
		), 
			array ('X.XXX', 'XX.XX', 'XXX.X', 'XXXX.', '..XXX', '.X.XX', '.XX.X', '.XXX.')
		);
		if (count($aChests)) {
			list ($x, $y, $s) = $this->oRnd->choose($aChests);
			$oRoom->setCell($x, $y, BLOCK_CHEST);
		}
	}
	
	public function chooseRoom() {
		$sRoom = $this->_aRoomPalette[$this->_iRoomPalette];
		$this->_iRoomPalette = ($this->_iRoomPalette + 1) % count($this->_aRoomPalette);
		return $sRoom;
	}
	
	public function processRoom($x, $y, $oRoom) {
		switch ($oRoom->getRoomData('type')) {
			
			case 'deadend':
			case 'exit':
			case 'entrance':
				$oRoom->setRoomData('helper', $this->chooseRoom());
				if ($y == 0 || ($y == $this->nMapHeight - 1)) {
					if ($x > 0) {
						$oLastRoom = $this->aRooms[$y][$x - 1];
						$sType = $oLastRoom->getRoomData('type');
						if ($sType == 'deadend' || $sType == 'exit' || $sType == 'entrance' || $sType == 'room') {
							$oLastRoom->setRoomData('doormask', $oLastRoom->getRoomData('doormask') | 2);
							$oRoom->setRoomData('doormask', $oRoom->getRoomData('doormask') | 8);
							$oLastRoom->setRoomData('type', 'room');
							$oLastRoom->setRoomData('helper', $this->chooseRoom());
							$oRoom->setRoomData('type', 'room');
							$oRoom->setRoomData('helper', $this->chooseRoom());
						}
					}
				} elseif ($x == 0 || ($x == $this->nMapWidth - 1)) {
					if ($y > 0) {
						$oLastRoom = $this->aRooms[$y - 1][$x];
						$sType = $oLastRoom->getRoomData('type');
						if ($sType == 'deadend' || $sType == 'exit' || $sType == 'entrance' || $sType == 'room') {
							$oLastRoom->setRoomData('doormask', $oLastRoom->getRoomData('doormask') | 4);
							$oRoom->setRoomData('doormask', $oRoom->getRoomData('doormask') | 1);
							$oLastRoom->setRoomData('type', 'room');
							$oLastRoom->setRoomData('helper', $this->chooseRoom());
							$oRoom->setRoomData('type', 'room');
							$oRoom->setRoomData('helper', $this->chooseRoom());
						}
					}
				}
			break;
				
				
				
			case 'room':
				$oRoom->setRoomData('helper', $this->chooseRoom());
			break;

			default:
				$oRoom->setRoomData('helper', 'magetower/Corridor');
				switch ($oRoom->getRoomData('doormask')) {
					case 15:
						$oRoom->setRoomData('helper', 'magetower/TXCorridor');
						break;
							
					case 7:
					case 11:
					case 13:
					case 14:
						if ($this->oRnd->roll100(50)) {
							$oRoom->setRoomData('helper', $this->chooseRoom());
							$oRoom->setRoomData('type', 'room');
						} else {
							$oRoom->setRoomData('helper', 'magetower/TXCorridor');
						}
						break;
				
					case 5:
					case 10:
						//$oRoom->setRoomData('type', 'I-corridor');
						break;
							
					default:
						if ($this->oRnd->roll100(30)) {
							$oRoom->setRoomData('helper', 'magetower/Corners');
						}
						//$oRoom->setRoomData('type', 'L-corridor');
						break;
				}
			break;
		}
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
	}
	
}
