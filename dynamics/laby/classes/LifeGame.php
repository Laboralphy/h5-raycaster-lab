<?php

require_once 'Grid.php';

class LifeGame extends Grid {
	
	private $_aBirth;
	private $_aDeath;
	
	private $_aNeighbours = array(
		array(-1, -1), array(0, -1), array(1, -1),
		array(-1, 0),                array(1, 0),
		array(-1, 1),   array(0, 1), array(1, 1)
	);
	
	/**
	 * Définition des règles X et Y
	 * "Une cellule apparait dans une case vide si elle à X voisine vivante"
	 * "Une cellule disparait si elle à Y voisine vivante"
	 * @param $aBirth tableau d'entier (nombres de voisines permettant la naissance d'une nouvelle cellule)
	 * @param $aDeath tableau d'entier (nombres de voisines entrainant la mort d'une cellule)
	 */
	public function setRules($aBirth, $aDeath) {
		$this->_aBirth = $aBirth;
		$this->_aDeath = $aDeath;
	}
	
	/**
	 * Effectue une génération
	 */
	public function process() {
		$aBirth = $this->_aBirth;
		$aDeath = $this->_aDeath;
		$w = $this->getWidth();
		$h = $this->getHeight();
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$nSum = 0;
				foreach ($this->_aNeighbours as $xy) {
					try {
						$n = $this->getCell($x + $xy[0], $y + $xy[1]) & 1;
					} catch (Exception $e) {
						$n = 1;
					}
					$nSum += $n;
				}
				$nCell = $this->getCell($x, $y) & 1;
				if (in_array($nSum, $aBirth) && $nCell === 0) {
					// cellule vide, doit recevoir une cellule
					$this->setCell($x, $y, 2);
				}
				if (in_array($nSum, $aDeath) && $nCell === 1) {
					// cellule occuper, doit mourrir
					$this->setCell($x, $y, 5);
				}
			}
		}
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$nCell = $this->getCell($x, $y);
				switch ($nCell) {
					case 2:
						$this->setCell($x, $y, 1);
						break;

					case 5:
						$this->setCell($x, $y, 0);
						break;
						
					default:
						$this->setCell($x, $y, $nCell & 1);
						break;
				}
			}
		}
	}
	
	public function render() {
		return parent::render(array(array('text'=>'.', 'class'=>''), array('text' => '#', 'class'=>'')));
	}
}
