<?php
class RoomGenerator extends Grid {
	/**
	 * Trace un segment horizontal dans la grille
	 * Tous les blocs de ce segment reçoive une nouvelle valeur.
	 * @param $n valeur de chaque bloc du segment
	 * @param $x position du point
	 * @param $y
	 * @param $nLength longueur du segment
	 */
	public function segmentX($n, $x, $y, $nLength) {
		if ($nLength < 0) {
			$this->segmentY($n, $x + $nLength, $y, -$nLength);
		}
		for ($i = 0; $i < $nLength; $i++) {
			$this->setCell($x + $i, $y, $n);
		}
	}

	/**
	 * Trace un segment vertical dans la grille
	 * Tous les blocs de ce segment reçoive une nouvelle valeur.
	 * @param $n valeur de chaque bloc du segment
	 * @param $x position du point
	 * @param $y
	 * @param $nLength longueur du segment
	 */
	public function segmentY($n, $x, $y, $nLength) {
		if ($nLength < 0) {
			$this->segmentY($n, $x, $y + $nLength, -$nLength);
		} else {
			for ($i = 0; $i < $nLength; $i++) {
				$this->setCell($x, $y + $i, $n);
			}
		}
	}


	/** Dessine un pavé de blocs
	 * @param $n code du bloc à écrire
	 * @param $x1, $y1 coordonnée du coin sup gauche du bloc
	 * @param $w, $h Taille du taille
	 */
	public function block($n, $x, $y, $w, $h) {
		if ($h < 0) {
			$this->block($n, $x, $y + $h, $w, -$h);
		} else {
			for ($i = 0; $i < $h; $i++) {
				$this->segmentX($n, $x, $y + $i, $w);
			}
		}
	}

	/** Dessine un cadre de bloc (un pavé de blocs dont il ne reste que la bordure)
	 * @param $n code du bloc à écrire
	 * @param $x1, $y1 coordonnée du coin sup gauche du cadre
	 * @param $w, $h Taille du cadre
	 */
	public function frame($n, $x, $y, $w, $h) {
		$this->segmentX($n, $x, $y, $w);
		$this->segmentX($n, $x, $y + $h - 1, $w);
		$this->segmentY($n, $x, $y, $h);
		$this->segmentY($n, $x + $w - 1, $y, $h);
	}

	/** Comme block() mais avec double coordonées plutot que coordonée + taille
	 * @param $n code du bloc à écrire
	 * @param $x1, $y1 coordonnée du coin sup gauche du bloc
	 * @param $x2, $y2 coordonnée du coin inf droite du bloc
	 */
	public function blockAbs($n, $x1, $y1, $x2, $y2) {
		if ($x2 < $x1) {
			$this->blockAbs($n, $x2, $y1, $x1, $y2);
		} elseif ($y2 < $y1) {
			$this->blockAbs($n, $x1, $y2, $x2, $y1);
		} else {
			$this->block($n, $x1, $y1, $x2 - $x1 + 1, $y2 - $y1 + 1);
		}
	}

	/** Copie la disposition des blocs d'un autre laby
	 *  @param $oLaby RooGenerator, laby source
	 *  @param $x coin sup gauche de la copie
	 *  @param $y "     "     "
	 */
	public function copy(RoomGenerator $oLaby, $x, $y) {
		$h = $oLaby->getHeight();
		$w = $oLaby->getWidth();
		for ($iy = 0; $iy < $h; $iy++) {
			for ($ix = 0; $ix < $w; $ix++) {
				$this->setCell($x + $ix, $y + $iy, $oLaby->getCell($ix, $iy));
			}
		}
	}

	/** Copie la disposition des bloc d'un autre laby
	 * sans ecraser les cellules déja défini définies
	 * (n'écrase que les cellules qui sont à 0) 
	 * @param $oLaby RooGenerator, laby source
	 * @param $x coin sup gauche de la copie
	 * @param $y "     "     "
	 */
	public function copyZero(RoomGenerator $oLaby, $x, $y) {
		$h = $oLaby->getHeight();
		$w = $oLaby->getWidth();
		for ($iy = 0; $iy < $h; $iy++) {
			for ($ix = 0; $ix < $w; $ix++) {
				$n = $oLaby->getCell($ix, $iy);
				$nSrc = $this->getCell($x + $ix, $y + $iy);
				if ($nSrc == 0) {
					$this->setCell($x + $ix, $y + $iy, $n);
				}
			}
		}
	}

	/** Génère une pièce vide rectangulaire fermée de quatre murs. La pièce ferme la totalité de l'espace disponible
	 * $nWall texture des murs
	 */
	public function generateEmptyRoom($nWall) {
		$h = $this->getHeight();
		$w = $this->getWidth();
		$this->block(0, 1, 1, $w - 3, $h - 3);
		$this->segmentX($nWall, 0, 0, $w);
		$this->segmentX($nWall, 0, $h - 1, $w);
		$this->segmentY($nWall, 0, 0, $h);
		$this->segmentY($nWall, $w - 1, 0, $h);
	}
	
	public function fillRoom($n) {
		$h = $this->getHeight();
		$w = $this->getWidth();
		$this->block($n, 0, 0, $w, $h);
	}

	/** Génère un pillier central
	 * @param $nWall texture du pillier
	 * @param $w largeur
	 * @param $w hauteur
	 */
	public function generateCentralPillar($nWall, $w, $h) {
		$this->block($nWall, ($this->getWidth() - $w) >> 1, ($this->getHeight() - $h) >> 1, $w, $h);
	}
	
	
	/** 
	 * Renvoie les cellule voisine de celles spécifiée
	 * @param x coordonée de la cellule visée
	 * @param y
	 * @return tableau indicé de 0 à 4 correspondant aux cellules voisines (0 = nord, 1 = est, 2 = sud, 3 = ouest)
	 */
	public function getCellNeighborhood($x, $y) {
		$aResult = array(null, null, null, null);
		if ($y > 0) {
			$aResult[0] = $this->getCell($x, $y - 1); 
		}
		if ($x < ($this->getWidth() - 1)) {
			$aResult[1] = $this->getCell($x + 1, $y); 
		}
		if ($y < ($this->getHeight() - 1)) {
			$aResult[2] = $this->getCell($x, $y + 1); 
		}
		if ($x > 0) {
			$aResult[3] = $this->getCell($x - 1, $y); 
		}
		return $aResult;
	}


	/** Génère un coin
	 * @param $nWall texture du mur
	 * @param $nCorner numéro du coin, 0:haut-gauche 1:haut-droite 2:bas-droite 3:bas-droite
	 * @param $w largeur du coin
	 * @param $w hauteur du coin
	 */
	public function generateCorner($nWall, $nCorner, $w, $h) {
		switch ($nCorner) {
			case 0: // coin 0 0
				$this->block($nWall, 0, 0, $w, $h);
				break;

			case 1: // coin w 0
				$this->block($nWall, $this->getWidth() - $w, 0, $w, $h);
				break;

			case 2: // coin w h
				$this->block($nWall, $this->getWidth() - $w, $this->getHeight() - $h, $w, $h);
				break;

			case 3: // coin 0 h
				$this->block($nWall, 0, $this->getHeight() - $h, $w, $h);
				break;
		}
	}

	/** Génère un ensemble de pillier
	 * @param $nWall texture des pilliers
	 * @param $w largeur totale de l'ensemble
	 * @param $h hauteur totale de l'ensemble
	 * @param $x position x de l'ensemble (coin haut-gauche)
	 * @param $y position y de l'ensemble (coin haut-gauche)
	 * @param $xn espacement des pilliers en largeur
	 * @param $yn espacement des pilliers en hauteur
	 */
	public function generatePillarForest($aWalls, $w, $h, $x, $y, $xn, $yn) {
		$iWall = 0;
		if (!is_array($aWalls)) {
			$nWall = $aWalls;
		}
		for ($iy = 0; $iy < $h; $iy += $yn) {
			for ($ix = 0; $ix < $w; $ix += $xn) {
				if (is_array($aWalls)) {
					$nWall = $aWalls[$iWall];
					$iWall = ($iWall + 1) % count($aWalls);
				}
				$this->setCell($x + $ix, $y + $iy, $nWall);
			}
		}
	}

	public function generateChestboard($aWalls, $x, $y, $w, $h) {
		$iWall = 0;
		for ($iy = 0; $iy < $h; $iy++) {
			for ($ix = 0; $ix < $w; $ix++) {
				$this->setCell($x + $ix, $y + $iy, $aWalls[$iWall]);
				$iWall = ($iWall + 1) % count($aWalls); 
			}
		}
	}

	/** Création d'un réseau de corridor
	 * @param $nWall Texture à utiliser
	 * @param $nPosNorth position du couloir nord, 0 = pas de porte
	 * @param $nPosEast position du couloir est, 0 = pas de porte
	 * @param $nPosSouth position du couloir sud, 0 = pas de porte
	 * @param $nPosWest position du couloir ouest, 0 = pas de porte
	 * @param $nWidthNorth largeur du couloir nord, 0 = pas de porte
	 * @param $nWidthEast largeur du couloir est, 0 = pas de porte
	 * @param $nWidthSouth largeur du couloir sud, 0 = pas de porte
	 * @param $nWidthWest largeur du couloir ouest, 0 = pas de porte
	 */
	public function generateCrossRoads($nWall, $nPosNorth, $nWidthNorth, $nPosEast, $nWidthEast, $nPosSouth, $nWidthSouth, $nPosWest, $nWidthWest) {
		$w = $this->getWidth();
		$h = $this->getHeight();
		$this->block($nWall, 0, 0, $w, $h);
		$this->generateCrossTunnel($nPosNorth, $nWidthNorth, $nPosEast, $nWidthEast, $nPosSouth, $nWidthSouth, $nPosWest, $nWidthWest);
	}

	public function generateCrossTunnel($nPosNorth, $nWidthNorth, $nPosEast, $nWidthEast, $nPosSouth, $nWidthSouth, $nPosWest, $nWidthWest) {
		$w = $this->getWidth();
		$h = $this->getHeight();
		$w2 = $w >> 1;
		$w2c = $w - $w2;
		$h2 = $h >> 1;
		$h2c = $h - $h2;

		$nMask = 0;
		if ($nPosNorth) {
			$nMask |= 1;
		}
		if ($nPosEast) {
			$nMask |= 2;
		}
		if ($nPosSouth) {
			$nMask |= 4;
		}
		if ($nPosWest) {
			$nMask |= 8;
		}

		switch ($nMask) {
			case 1: // N
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $h2);
				break;

			case 2: // E
				$this->block(0, $w2, $nPosEast, $w2c, $nWidthEast);
				break;

			case 3: // N E
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosEast + $nWidthEast);
				$this->block(0, $nPosNorth, $nPosEast, $w - $nPosNorth, $nWidthEast);
				break;

			case 4: // S
				$this->block(0, $nPosSouth, $h2, $nWidthSouth, $h2c);
				break;

			case 5: // N S
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $h2);
				$this->block(0, $nPosSouth, $h2, $nWidthSouth, $h2c);
				$this->blockAbs(0, min($nPosNorth, $nPosSouth), $h2, max($nPosNorth + $nWidthNorth - 1, $nPosSouth + $nWidthSouth - 1), $h2);
				break;

			case 6: // E S
				$this->block(0, $nPosSouth, $nPosEast, $w - $nPosSouth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $nWidthSouth, $h - $nPosEast);
				break;

			case 7: // N E S
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosEast + $nWidthEast);
				$this->block(0, $nPosNorth, $nPosEast, $w - $nPosNorth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $w - $nPosSouth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $nWidthSouth, $h - $nPosEast);
				break;

			case 8: // W
				$this->block(0, 0, $nPosWest, $w2, $nWidthWest);
				break;

			case 9: // N W
				$this->block(0, 0, $nPosWest, $nPosNorth + $nWidthNorth, $nWidthWest);
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosWest);
				break;

			case 10: // E W
				$this->block(0, 0, $nPosWest, $w2, $nWidthWest);
				$this->block(0, $w2, $nPosEast, $w2c, $nWidthEast);
				$this->blockAbs(0, $w2, min($nPosEast, $nPosWest), $w2, max($nPosEast + $nWidthEast - 1, $nPosWest + $nWidthWest - 1));
				break;

			case 11: // N E W
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosEast + $nWidthEast);
				$this->block(0, $nPosNorth, $nPosEast, $w - $nPosNorth, $nWidthEast);
				$this->block(0, 0, $nPosWest, $nPosNorth + $nWidthNorth, $nWidthWest);
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosWest);
				break;

			case 12: // S W
				$this->block(0, 0, $nPosWest, $nPosSouth + $nWidthSouth, $nWidthWest);
				$this->block(0, $nPosSouth, $nPosWest, $nWidthSouth, $h - $nPosWest);
				break;

			case 13: // N S W
				$this->block(0, 0, $nPosWest, $nPosSouth + $nWidthSouth, $nWidthWest);
				$this->block(0, $nPosSouth, $nPosWest, $nWidthSouth, $h - $nPosWest);
				$this->block(0, 0, $nPosWest, $nPosNorth + $nWidthNorth, $nWidthWest);
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosWest);
				break;

			case 14: // S E W
				$this->block(0, $nPosSouth, $nPosEast, $w - $nPosSouth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $nWidthSouth, $h - $nPosEast);
				$this->block(0, 0, $nPosWest, $nPosSouth + $nWidthSouth, $nWidthWest);
				$this->block(0, $nPosSouth, $nPosWest, $nWidthSouth, $h - $nPosWest);
				break;

			case 15: // N E S W
				$this->block(0, $nPosNorth, 0, $nWidthNorth, $nPosEast + $nWidthEast);
				$this->block(0, $nPosNorth, $nPosEast, $w - $nPosNorth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $w - $nPosSouth, $nWidthEast);
				$this->block(0, $nPosSouth, $nPosEast, $nWidthSouth, $h - $nPosEast);
				$this->block(0, 0, $nPosWest, $nPosSouth + $nWidthSouth, $nWidthWest);
				$this->block(0, $nPosSouth, $nPosWest, $nWidthSouth, $h - $nPosWest);
				break;
		}
	}
	
	/** Genere une crossroad particulière uniquement à l'aide du masque des portes
	 * et de l'épaisseur du couloir. Les issue de ce croisement sont centré par
	 * rapport à la pièce
	 * @param $nWall type de mur
	 * @param $nExitMask masque des issues : combinaison OR de 1: nord 2: Est 4: Sud 8: Ouest
	 * @param $nWidth épaisseur du couloir
	 */
	public function generateDunHallway($nWall, $nExitMask, $nWidth) {
		$w = $this->getWidth();
		$h = $this->getHeight();
		$a = array(0, 0, 0, 0);
		for ($i = 0; $i < 4; $i++) {
			if ($nExitMask & (1 << $i)) {
				$a[$i] = ($i & 1) == 0 ? ($w - $nWidth) >> 1  : ($h - $nWidth) >> 1;
			}
		}
		$this->generateCrossRoads($nWall, $a[0], $nWidth,  $a[1], $nWidth,  $a[2], $nWidth,  $a[3], $nWidth);
	}
	
	/**
	 * Cette fonction parcoure les cellules de la pièce à la recherche de pattern.
	 * Pour chaque cellule on fabrique un pattern, une string composé de 4 caractère.
	 * Les cellule dont les patterns sont dans le tableau de recherche sont sélectionnées,
	 * rassemblée dans un tableau et renvoyé par la fonction.
	 * @param RoomGenerator $oRoom la pièce concernée
	 * @param array $aTr tableau de translation : code_block -> symbole de pattern
	 * @param array $aValid liste des patterns recherchés
	 * @return array of (x, y, s)
	 */
	public function searchPattern(array $aTr, array $aValid) {
		$rw = $this->getWidth();
		$rh = $this->getHeight();
		$aChests = array();
		for ($y = 0; $y < $rh; ++$y) {
			for ($x = 0; $x < $rw; ++$x) {
				$a = $this->getCellNeighborhood($x, $y);
				array_unshift($a, $this->getCell($x, $y));
				$s = '';
				foreach ($a as $v) {
					if (is_null($v)) {
						$s .= $aTr['null'];
					} else 	if (array_key_exists($v, $aTr)) {
						$s .= $aTr[$v];
					} else {
						$s .= $aTr['default'];
					}
				}
				if (in_array($s, $aValid)) {
					$aChests[] = array($x, $y, $s);
				}
			}
		}
		return $aChests;
	}
	
	/**
	 * Remplacement de code dans toutes la pièce
	 * @param unknown $a
	 * @param unknown $b
	 */
	public function replace($a, $b) {
		$rw = $this->getWidth();
		$rh = $this->getHeight();
		for ($y = 0; $y < $rh; ++$y) {
			for ($x = 0; $x < $rw; ++$x) {
				if ($this->getCell($x, $y) == $a) {
					$this->setCell($x, $y, $b);
				}
			}
		}
	}
}

