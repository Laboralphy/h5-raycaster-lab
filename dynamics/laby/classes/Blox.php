<?php 

class Blox {
	
	////// SECRET ROOMS GENERATION ////// SECRET ROOMS GENERATION ////// SECRET ROOMS GENERATION //////
	
	protected $oLevel;
	
	protected $oBlox;
	protected $aBloxIndex = array();
	protected $nBloxMaxSize = 8;
	protected $nBloxInc = 5;
	
	
	
	/** Construction de blox
	 * Zone de mur solide contigu, de manière à déterminer d'éventuelle construction de cache secrete 
	 */
	public function buildBlox($l) {
		$this->oLevel = $l;
		$B = new Grid();
		$B->setSize($w = $this->oLevel->getWidth(), $h = $this->oLevel->getHeight());
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$B->setCell($x, $y, $this->oLevel->getCell($x, $y) == BLOCK_WALL ? 1 : 0);
			}
		}
		$nIter = 0;
		do {
			$bChanged = false;
			for ($y = 0; $y < $h - 1; $y++) {
				for ($x = 0; $x < $w - 1; $x++) {
					$xy = $B->getCell($x, $y);
					$x1y = $B->getCell($x + 1, $y);
					$xy1 = $B->getCell($x, $y + 1);
					$x1y1 = $B->getCell($x + 1, $y + 1);
					if ($xy > 0) {
						$nMin = min($x1y, $xy1, $x1y1);
						if ($xy <= $nMin) {
							$B->setCell($x, $y, $nMin + 1);
							$bChanged = true;
						}
					}
				}
			}
			$nIter++;
		} while ($bChanged && $nIter < 10);
		for ($y = 0; $y < $h - 1; $y++) {
			for ($x = 0; $x < $w - 1; $x++) {
				$nMin = $B->getCell($x, $y);
				if ($nMin > 2) {
					if (!isset($this->aBloxIndex[$nMin])) {
						$this->aBloxIndex[$nMin] = array();
					}
					$this->aBloxIndex[$nMin][] = array($x, $y);
				}
			}
		}
		$this->oBlox = $B;
	}


	/** Construction d'une pièce secrète à la position spécifiée
	 * @param $nSize taille de la zone
	 *
	 */
	public function buildSecretRoom($nSize, $nBlox, $oSecret = null) {
		if (
			isset($this->aBloxIndex[$nSize]) &&
			isset($this->aBloxIndex[$nSize][$nBlox]) &&
			$this->checkBlox(
				$this->oLevel,
				$this->aBloxIndex[$nSize][$nBlox][0],
				$this->aBloxIndex[$nSize][$nBlox][1],
				$nSize,
				$nSize
			)
		) {
			list($x, $y) = $this->aBloxIndex[$nSize][$nBlox];
			if ($oSecret === null) {
				$oSecret = new SecretGenerator();
			}
			if ($oSecret->getMapCount($nSize)) {
				$aData = $oSecret->generate($nSize, $this->oLevel->oRnd->getRandom(0, $oSecret->getMapCount($nSize) - 1));
				if ($oSecret->rotateUntilValidExit($this->oLevel, $x, $y)) {
					$oRG = new RoomGenerator();
					$oRG->setSize($nSize, $nSize);
					$oSecret->render($oRG);
					$this->oLevel->copy($oRG, $x, $y);
					$this->eraseBlox($x, $y, $nSize);
				}
			}
		}
	}


	public function buildSecretRoomSystem($oSecret = null) {
		if ($oSecret === null) {
			$oSecret = new SecretGenerator();
		}
		$nIter = 0;
		if (count($this->aBloxIndex) === 0) {
			return;
		}
		for ($nSize = max(array_keys($this->aBloxIndex)); $nSize > 2; $nSize--) {
			$nInc = ($this->nBloxMaxSize - $nSize) * $this->nBloxInc;
			if ($nInc < 1) {
				continue;
			}
			for ($nBlox = 0; $nBlox < count($this->aBloxIndex[$nSize]); $nBlox += $nInc) {
				$this->buildSecretRoom($nSize, $this->oLevel->oRnd->getRandom(0, count($this->aBloxIndex[$nSize]) - 1), $oSecret);
				$nIter++;
			}
		}
	}

	/** Indique si le blox est encore valide (tous ses block sont des WALL)
	 * @return boolean true: valide
	 */
	public function checkBlox($oLaby, $x, $y, $xSize, $ySize) {
		try {
			for ($iy = 0; $iy < $ySize; $iy++) {
				for ($ix = 0; $ix < $xSize; $ix++) {
					if ($oLaby->getCell($x + $ix, $y + $iy) != BLOCK_WALL) {
						return false; // Le bloc n'est pas vide : annulation
					}
				}
			}
		} catch (Exception $e) {
			return false;
		}
		return true;
	}

	public function eraseBlox($x, $y, $nSize) {
		$aToErase = array();
		if ($nSize) {
			for ($iy = 0; $iy < $nSize; $iy++) {
				for ($ix = 0; $ix < $nSize; $ix++) {
					foreach ($this->aBloxIndex as $nBlox => $aBlox) {
						foreach ($aBlox as $nBlox2 => $b) {
							if ($b[0] + $nSize - 1 == $x + $ix && $b[1] + $nSize - 1 == $y + $iy) {
								$aToErase[] = array($nBlox, $nBlox2);
							}
						}
					}
				}
			}
		}
		foreach ($aToErase as $a) {
			unset($this->aBloxIndex[$a[0]][$a[1]]);
		}
		foreach ($this->aBloxIndex as $n => $a) {
			if (count($this->aBloxIndex)) {
				$this->aBloxIndex[$n] = array_values($a);
			}
		}
	}
	
	public function testRenderBlox() {
		for ($n = 3; $n <= max(array_keys($this->aBloxIndex)); $n++) {
			foreach ($this->aBloxIndex[$n] as $aBlox) {
				for ($y = 0; $y < $n; $y++) {
					for ($x = 0; $x < $n; $x++) {
						$this->oLevel->setCell($x + $aBlox[0], $y + $aBlox[1], BLOCK_SECRET);
					}
				}
			}
		}
	}
	
}
