<?php

class LabyGenerator extends Grid {

	protected $oLaby = null;
	protected $oRnd;
	protected $aLongestRoad = null;
	protected $oMapKm;
	
	public function __construct() {
		$this->oRnd = RandomGenerator::getInstance();
	}

	public function getExit() {
		return array('x' => $this->aLongestRoad[0], 'y' => $this->aLongestRoad[1], 'km' => $this->aLongestRoad[2]);
	}

	public function getEntrance() {
		return array('x' => $this->aLongestRoad[3], 'y' => $this->aLongestRoad[4]);
	}

	public function isExit($x, $y) {
		$a = $this->getExit();
		return $x == $a['x'] && $y == $a['y'];
	}

	public function isEntrance($x, $y) {
		$a = $this->getEntrance();
		return $x == $a['x'] && $y == $a['y'];
	}

	public function setSize($x, $y) {
		parent::setSize($x, $y);
		if (is_null($this->oLaby)) {
			$this->oLaby = new Grid();
		}
		if (is_null($this->oMapKm)) {
			$this->oMapKm = new Grid();
		}
		$this->oLaby->setSize($x, $y);
		$this->oMapKm->setSize($x, $y);
		for ($iy = 0; $iy < $y; $iy++) {
			for ($ix = 0; $ix < $x; $ix++) {
				$this->setCell($ix, $iy, 3);
			}
		}
	}

	public function getCellVisited($x, $y) {
		try {
			return $this->oLaby->getCell($x, $y) != 0;
		} catch (Exception $e) {
			return true;
		}
	}

	public function openDoor($x, $y, $nDoor) {
		try {
			$c = $this->getCell($x, $y);
			switch ($nDoor) {
				case 0: // haut;
					if ($y > 0) {
						$this->setCell($x, $y, $c & 2);
					}
					break;

				case 1: // droite;
					$this->openDoor($x + 1, $y, 3);
					break;

				case 2: // Base;
					$this->openDoor($x, $y + 1, 0);
					break;

				case 3: // gauche;
					if ($x > 0) {
						$this->setCell($x, $y, $c & 1);
					}
					break;
			}
		} catch (Exception $e) {
		}
	}

	public function closeDoor($x, $y, $nDoor) {
		try {
			$c = $this->getCell($x, $y);
			switch ($nDoor) {
				case 0: // haut;
					if ($y > 0) {
						$this->setCell($x, $y, $c | 1);
					}
					break;

				case 1: // droite;
					$this->closeDoor($x + 1, $y, 3);
					break;

				case 2: // Base;
					$this->closeDoor($x, $y + 1, 0);
					break;

				case 3: // gauche;
					if ($x > 0) {
						$this->setCell($x, $y, $c | 2);
					}
					break;
			}
		} catch (Exception $e) {
		}
	}

	public function isOpen($x, $y, $nDoor) {
		try {
			$c = $this->getCell($x, $y);
			switch ($nDoor) {
				case 0: // haut;
					return ($y > 0) && ($this->getCell($x, $y) & 1) == 0;
					break;

				case 1: // droite;
					return $this->isOpen($x + 1, $y, 3);
					break;

				case 2: // droite;
					return $this->isOpen($x, $y + 1, 0);
					break;

				case 3: // droite;
					return ($x > 0) && ($this->getCell($x, $y) & 2) == 0;
					break;
			}
		} catch (Exception $e) {
			return false;
		}
		return false;
	}

	public function getDoorMask($x, $y) {
		$nMask = 0;
		for ($i = 0; $i < 4; $i++) {
			if ($this->isOpen($x, $y, $i)) {
				$nMask |= (1 << $i);
			}
		}
		return $nMask;
	}

	public function exploration($x, $y, $nKm = 0) {
		if (is_null($this->aLongestRoad)) {
			$this->aLongestRoad = array($x, $y, $nKm, $x, $y);
		}
		if ($nKm > $this->aLongestRoad[2]) {
			$this->aLongestRoad[0] = $x;
			$this->aLongestRoad[1] = $y;
			$this->aLongestRoad[2] = $nKm;
		}
		$this->oLaby->setCell($x, $y, 1);
		$this->oMapKm->setCell($x, $y, $nKm);
		$aPossibilities = array();
		$aIndices = array(
		array(0, -1, 0),
		array(1, 0, 1),
		array(0, 1, 2),
		array(-1, 0, 3)
		);
		// parcourir chaque voisine
		foreach ($aIndices as $aIndix) {
			if (!$this->getCellVisited($x + $aIndix[0], $y + $aIndix[1])) {
				$aPossibilities[] = $aIndix;
			}
		}
		// y a t il des cellule voisine non visitée 
		if (count($aPossibilities)) {
			// en choisir une au hasard
			$nSide = $this->oRnd->getRandom(0, count($aPossibilities) - 1);
			$this->openDoor($x, $y, $aPossibilities[$nSide][2]);
			$this->exploration($x + $aPossibilities[$nSide][0], $y + $aPossibilities[$nSide][1], $nKm + 1);
			$this->exploration($x, $y, $nKm);
		}
	}

	public function fusion($xStart, $yStart) {

		$n = 0;
		$aMap = array();

		for ($y = 0; $y < $this->getHeight(); $y++) {
			$aMap[] = array();
			for ($x = 0; $x < $this->getWidth(); $x++) {
				$aMap[$y][] = $n++;
			}
		}

		while ($nMaxWall = count($aWalls = $this->fusionGetOpenableWalls($aMap))) {
			$nWall = $this->oRnd->getRandom(0, $nMaxWall - 1);
			list ($x, $y, $nDoor, $id1, $id2) = $aWalls[$nWall];
			$idMin = min($id1, $id2);
			$idMax = max($id1, $id2);
			if ($nDoor) {
				$this->openDoor($x, $y, 2);
			} else {
				$this->openDoor($x, $y, 1);
			}
			for ($y = 0; $y < $this->getHeight(); $y++) {
				for ($x = 0; $x < $this->getWidth(); $x++) {
					if ($aMap[$y][$x] == $idMax) {
						$aMap[$y][$x] = $idMin;
					}
				}
			}
		}
		$aNewEntrance = $this->checkFusionEntrance($xStart, $yStart);
		$xStart = $aNewEntrance['x'];
		$yStart = $aNewEntrance['y'];
		$this->fusionCalcLongestRoad($xStart, $yStart);
	}

	private function checkFusionEntrance($xStart, $yStart) {
		if (!$this->isDeadEnd($xStart, $yStart)) {
			$aDE = $this->getDeadEnds();
			if (count($aDE) == 0) {
				throw new Exception('laby has no dead ends');
			}
			return $aDE[$this->oRnd->getRandom(0, count($aDE) - 1)];
		}
		return array('x' => $xStart, 'y' => $yStart);
	}

	public function isDeadEnd($x, $y) {
		switch ($this->getDoorMask($x, $y)) {
			case 1:
			case 2:
			case 4:
			case 8:
				return true;
					
			default:
				return false;
		}
	}

	public function getDeadEnds() {
		$aDeadEnds = array();
		for ($y = 0; $y < $this->getHeight(); $y++) {
			for ($x = 0; $x < $this->getWidth(); $x++) {
				if ($this->isDeadEnd($x, $y)) {
					$aDeadEnds[] = array('x' => $x, 'y' => $y);
				}
			}
		}
		return $aDeadEnds;
	}

	private function fusionGetOpenableWalls($aMap) {
		$aWalls = array();
		$h = count($aMap);
		$w = $h ? count($aMap[0]) : 0;
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				if ($y < $h - 1) {
					if ($aMap[$y][$x] != $aMap[$y + 1][$x]) {
						$aWalls[] = array($x, $y, 1, $aMap[$y][$x], $aMap[$y + 1][$x]);
					}
				}
				if ($x < $w - 1) {
					if ($aMap[$y][$x] != $aMap[$y][$x + 1]) {
						$aWalls[] = array($x, $y, 0, $aMap[$y][$x], $aMap[$y][$x + 1]);
					}
				}
			}
		}
		return $aWalls;
	}
	
	private function fusionCalcLongestRoad($x, $y, $nKm = 0) {
		if ($this->getCellVisited($x, $y)) {
			return;
		}
		if (is_null($this->aLongestRoad)) {
			$this->aLongestRoad = array($x, $y, $nKm, $x, $y);
		}
		if ($nKm > $this->aLongestRoad[2]) {
			$this->aLongestRoad[0] = $x;
			$this->aLongestRoad[1] = $y;
			$this->aLongestRoad[2] = $nKm;
		}
		$this->oLaby->setCell($x, $y, 1);
		$this->oMapKm->setCell($x, $y, $nKm);
		if ($x > 0 && $this->isOpen($x, $y, 3)) {
			$this->fusionCalcLongestRoad($x - 1, $y, $nKm + 1);
		}
		if ($y > 0 && $this->isOpen($x, $y, 0)) {
			$this->fusionCalcLongestRoad($x, $y - 1, $nKm + 1);
		}
		if ($x < $this->getWidth() - 1 && $this->isOpen($x, $y, 1)) {
			$this->fusionCalcLongestRoad($x + 1, $y, $nKm + 1);
		}
		if ($y < $this->getHeight() - 1 && $this->isOpen($x, $y, 2)) {
			$this->fusionCalcLongestRoad($x, $y + 1, $nKm + 1);
		}
	}

	public function getCellKm($x, $y) {
		return $this->oMapKm->getCell($x, $y);
	}

	public function getCellKm100($x, $y) {
		return floor($this->getCellKm($x, $y) * 100 / $this->aLongestRoad[2]);
	}

	/** Renvoie le pourcentage de Km sans compter la dernière pièce
	 * @param $x, $y coordonnées de la pièce
	 * @return entier 
	 *
	 */
	public function getCellKm101($x, $y) {
		return floor($this->getCellKm($x, $y) * 100 / ($this->aLongestRoad[2] - 1));
	}

	public function renderCell($x, $y) {
		if ($x == $this->aLongestRoad[0] && $y == $this->aLongestRoad[1]) {
			return array('text' => 'X');
		}
		if ($x == $this->aLongestRoad[3] && $y == $this->aLongestRoad[4]) {
			return array('text' => 's');
		}
		return array('text' => $this->getCellKm($x, $y));
	}

	public function render(array $aRender = array()) {
		$this->sClass = 'laby2';
		return parent::render(array(
		0 => array('class' => 'laby0', 'text' => ''),
		1 => array('class' => 'laby1', 'text' => ''),
		2 => array('class' => 'laby2', 'text' => ''),
		3 => array('class' => 'laby3', 'text' => '')
		));
	}
}

