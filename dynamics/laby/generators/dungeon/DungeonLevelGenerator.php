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

/**
 * Options : 
 * -rs taille des pieces
 * -ls taille du labyrinthe
 * -t type d'algo 0=explo 1=fusion
 * -s nombre de magasin
 * -p présence d'un portail
 * -rl -10% de pièces par unité
 * -rm +10% de pièces par unité
 * 
 * @author raphael.marandet
 *
 */
class DungeonLevelGenerator extends LevelGenerator {

	protected $aDeadends = array();
	protected $nRoomProb = 50;
	protected $oLockMap; // liste des portes fermées à clé
	protected $oKeyMap; // carte de l'emplacement des clés

	public function generate($nSeed = null) {
		$this->sStyles = file_get_contents('generators/dungeon/styles.css');
		$this->oRnd->setRandomSeed($nSeed);
		
		// lectures des options
		$rs = $this->getOption('rs') * 2 + 9;
		$ls = $this->getOption('ls') + 4;
		$nAlgo = $this->getOption('t');
		$this->nRoomProb -= $this->getOption('rl') * 10;
		$this->nRoomProb += $this->getOption('rm') * 10;
		
		// dimensionnement, création carte
		$this->setSize ($ls, $ls, $rs, $rs );
		$this->setMap ($this->buildLaby($nAlgo));
		$this->processRooms();

		// mélanger les deadends afin de créer les pièce spéciale
		$this->aDeadends = $this->oRnd->shuffle($this->aDeadends);
		
		$this->spawnPortal();
		
		// placer des magasins
		$nShopCount = LevelToolKit::spawnShops($this->aDeadends, $this->getOption('s'));
		
		// finalisation des pièces
		$this->postProcessRooms();
		
		
		// Ajouter les portes
		foreach ($this->aRooms as $r1) {
			foreach ($r1 as $oRoom) {
				LevelToolKit::spawnDoors($oRoom);
			}
		}
				
		$this->processLevel();
		
		LevelToolKit::spawnWindows($this, BLOCK_VOID, BLOCK_WINDOW);
		LevelToolKit::spawnLockedDoorsAndKeys($this);
		LevelToolKit::spawnSecretPlaces($this);
		LevelToolKit::spawnLastShops($this, $nShopCount);
		LevelToolKit::makeFancyWalls($this);	
		LevelToolKit::removeNoSpawn($this);
		LevelToolKit::spawnMobs($this);	
	}
	
	public function processRoom($x, $y, $oRoom) {
		$nType = 0;
		$sType = $oRoom->getRoomData('type');
		$aHelpers = array(
			'dungeon/Corners',
			'dungeon/Corners',
			'dungeon/Corners',
			'dungeon/Corners',
			'dungeon/Library',
			'dungeon/Living',
			'dungeon/Jail',
			'dungeon/Watch',
			'dungeon/Labo',
			'dungeon/Kitchen',
			'dungeon/Forge',
			'dungeon/Church',
			'dungeon/Storage'
		);
		$sHelper = '';
		switch ($sType) {
			case 'entrance':
			case 'exit':
				$sHelper = 'dungeon/Elevator';
				break;
				
			case 'deadend':
				$this->aDeadends[] = $oRoom;
				$sHelper = $this->oRnd->choose($aHelpers);
				break;
				
			default: 
				if ($this->oRnd->roll100($this->nRoomProb)) {
					$sHelper = $this->oRnd->choose($aHelpers);
					$oRoom->setRoomData('type', 'room');
				} else {
					$this->spawnIntersection($oRoom, $this->oRnd->getRandom(0, 3));
					$oRoom->setRoomData('type', 'corridor');
				}
				break;
		}
		if ($sHelper) {
			$oRoom->setRoomData('helper', $sHelper);
		}
	}
	
	public function render() {
		global $aSTYLES;
		return parent::render($aSTYLES);
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
	
	
	/** Fabrique une intersection de corridor
	 * @param $oRoom pièce concernée
	 * @param $nType type d'intersection 0: large, 1: étroite, 2: large avec des pilliers, 3: large avec des alcôves
	 */
	public function spawnIntersection($oRoom, $nType) {
	
		$nDoors = $oRoom->getRoomData('doormask');
		$oPeri = $oRoom->getPeri();
		switch ($nType) {
			case 0:
				$oRoom->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				$oPeri->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				break;
	
			case 1:
				$oRoom->generateDunHallway(BLOCK_WALL, $nDoors, 1);
				$oPeri->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				break;
	
			case 2:
				$oRoom->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				$oPeri->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 1, $oRoom->getHeight() - 1, 1, 1, 2, 2);
				break;
	
			case 3:
				$oRoom->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				$oPeri->generateDunHallway(BLOCK_WALL, $nDoors, 3);
				$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 3, $oRoom->getHeight() - 3, 2, 2, 2, 2);
				break;
		}
	}
	
}
