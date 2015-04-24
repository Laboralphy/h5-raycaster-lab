<?php
abstract class LevelGenerator extends RoomGenerator {

	public $oRnd;
	
	protected $sStyles;
	
	protected $nRoomWidth = 11;
	protected $nRoomHeight = 11;
	protected $nMapWidth = 4;
	protected $nMapHeight = 4;
	protected $oMap;
	protected $aRooms = array();
	
	protected $nDefaultVoid = 0;
	protected $nDefaultWall = 1;
	
	protected $aOptions = null;
	
	public function getRoomWidth() {
		return $this->nRoomWidth;
	}

	public function getRoomHeight() {
		return $this->nRoomHeight;
	}

	public function getMapWidth() {
		return $this->nMapWidth;
	}
	
	public function getMapHeight() {
		return $this->nMapHeight;
	}
	
	public function getRooms() {
		return $this->aRooms;
	}
	
	/**
	 * Modifie la taille de la carte du niveau
	 * @param int $x
	 * @param int $y
	 */
	public function setSize($x, $y, $rw, $rh) {
		$this->nMapWidth = $x;
		$this->nMapHeight = $y;
		$this->nRoomWidth = $rw;
		$this->nRoomHeight = $rh;
		parent::setSize($x * ($this->nRoomWidth - 1) + 1, $y * ($this->nRoomHeight - 1) + 1);
	}
	
	/**
	 * Appelle un helper de constrution de pièce
	 * @param string $sHelper nom du helper (avec chemin)
	 * @param RoomGenerator $oRoom instance de la room 
	 * @param Array $oData Tableau d'options
	 */
	public function runLabyRoomHelper($sHelper, RoomGenerator $oRoom) {
		return LabyRoomHelper::run($sHelper, $oRoom, $this->oRnd);
	}

	/**
	 * Renvoie la valeur de l'option ou 0 si l'option n'est pas présente
	 * @param char $x option
	 * @return int
	 */
	public function getOption($x) {
		global $argv, $argc;
		if ($this->aOptions === null) {
			$this->aOptions = array();
			if (isset($_GET['o'])) {
				$s = $_GET['o'];
			} elseif ($argc > 3) {
				$s = $argv[3];
			} else {
				$s = '';
			}
			if (preg_match_all('/-([a-zA-Z]+)([0-9]+)/', $s, $aRegs)) {
				foreach ($aRegs[1] as $nOption => $sOption) {
					$this->aOptions[$sOption] = $aRegs[2][$nOption];
				}
			}
		}
		if (isset($this->aOptions[$x])) {
			return $this->aOptions[$x];
		} else {
			return 0;
		}
	}
	
	/**
	 * Construction d'un labyrinthe
	 * @param int $nAlgo type d'algorythme 0:exploration 1:fusion
	 * @return LabyGenerator
	 */
	public function buildLaby($nAlgo, $xStart = null, $yStart = null) {
		$oLaby = new LabyGenerator(); // Instancier le laby
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		$oLaby->setSize ($w, $h);
		$xStart = $xStart ? $xStart : $this->oRnd->getRandom (0, $w - 1);
		$yStart = $yStart ? $yStart : $this->oRnd->getRandom (0, $h - 1);
		switch ($nAlgo) {
			case 0:
				$oLaby->exploration($xStart, $yStart);
				break;
	
			case 1:
				$oLaby->fusion($xStart, $yStart);
				break;
		}
		return $oLaby;
	}
	
	/**
	 * Création des données individuelles pour chaque Room
	 */
	public function processRooms($sProc = 'processRoom') {
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		$oLaby = $this->getMap();
		$nDW = $this->nDefaultWall;
		$nDV = $this->nDefaultVoid;
		/* Génération des pièces du labyrinthe */
		if (count($this->aRooms) == 0) {
			for ($y = 0; $y < $h; ++$y) {
				$aRoomRow = array();
				for ($x = 0; $x < $w; ++$x) {
					$oRoom = new LabyRoom();
					$oRoom->setSize($this->nRoomWidth, $this->nRoomHeight);
					$oRoom->block ($nDV, 0, 0, $this->nRoomWidth - 2, $this->nRoomHeight - 2);
					
					
					$nDoorMask = $oLaby->getDoorMask($x, $y);
			
					$aRoomData = array(
							'doormask' => $nDoorMask,
					);
					$oPeri = $oRoom->getPeri();
					$oPeri->block($nDW , 0, 0, $this->nRoomWidth, $this->nRoomHeight);
					$oPeri->generateDunHallway($nDW , $nDoorMask, 1);
					
					if ($oLaby->isExit($x, $y)) {
						$aRoomData['type'] = 'exit';
					} elseif ($oLaby->isEntrance($x, $y)) {
						$aRoomData['type'] = 'entrance';
					} elseif ($nDoorMask === 1 || $nDoorMask === 2 || $nDoorMask === 4 || $nDoorMask === 8) {
						$aRoomData['type'] = 'deadend';
					} else {
						$aRoomData['type'] = '';
					}
					$aRoomData['x'] = $x;
					$aRoomData['y'] = $y;
					$aRoomData['xmax'] = $w;
					$aRoomData['ymax'] = $h;
					
					$oRoom->setRoomData($aRoomData);
					$aRoomRow[] = $oRoom;
				}
				$this->aRooms[] = $aRoomRow;
			}
		}
		
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				$this->$sProc($x, $y, $this->aRooms[$y][$x]);
			}
		}
	}
	
	/** 
	 * définition de la carte du laby
	 * @param LabyGenerator $a
	 */
	public function setMap($a) {
		$this->oMap = $a;
	}
	
	/**
	 * Renvoie la carte du laby
	 * @return LabyGenerator
	 */
	public function getMap() {
		return $this->oMap;
	}
	
	
	public abstract function generate($nSeed = null);
	
	public abstract function processRoom($x, $y, $oRoom);
	
	/**
	 * Traitement des pièces
	 * Ecriture effective des bloc dans le level
	 */
	public function postProcessRooms() {
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				$oRoom = $this->aRooms[$y][$x];
				$aRoom = $oRoom->getRoomData();
				
				$nDoorMask = $aRoom['doormask'];
	
	
				$oPeri = $oRoom->getPeri();
	
				if (isset($aRoom['helper'])) {
					$this->runLabyRoomHelper($aRoom['helper'], $oRoom);
				}
			}
		}
	}
	
	public function processLevel() {
		$w = $this->nMapWidth;
		$h = $this->nMapHeight;
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				$oRoom = $this->aRooms[$y][$x];
				$oPeri = $oRoom->getPeri();
				$oPeri->copy ($oRoom, 1, 1 );
				$this->copyZero($oPeri, $x * ($this->nRoomWidth - 1), $y * ($this->nRoomHeight - 1));
			}
		}
	}
	
	/**
	 * Rendu du tableau JSON
	 */
	public function renderJSON() {
		$xMax = ($this->nRoomHeight - 1) * $this->nMapHeight + 1;
		$yMax = ($this->nRoomWidth - 1) * $this->nMapWidth + 1;
		$aMap = array ();
		for($y = 0; $y < $yMax; $y ++) {
			$aMapRow = array ();
			for($x = 0; $x < $xMax; $x ++) {
				$aMapRow [] = $this->getCell ( $x, $y );
			}
			$aMap [] = $aMapRow;
		}
		$sJSON = json_encode($aMap);
		return strtr($sJSON, array('],[' => "],\n["));
	}
	
	/**
	 * Rendu graphique
	 * @return string chaine HTML
	 */
	public function render($aStyles) {
		$this->sClass = 'laby';
		return $this->oMap->render() . parent::render($aStyles);
	}
	
	/**
	 * Rendu des style CSS associé au rendu graphique
	 * return string CSS
	 */
	public function renderCSS() {
		return $this->sStyles;
	}
	
}
