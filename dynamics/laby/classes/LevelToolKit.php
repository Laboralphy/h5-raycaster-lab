<?php 

class LevelToolKit {

	public static function getBlockCode($s) {
		if (defined($s)) {
			$b = get_defined_constants();
			return $b[$s];
		} else {
			return null;
		}
	}
	
	public static function getBlockCodes() {
		$a = func_get_args();
		$r = array();
		foreach ($a as $var) {
			$r[] = self::getBlockCode($var);
		}
		return $r;
	}
	
	
	/**
	 * Construit des pièces pour magasins
	 * Ne construit que dans les impasses. En cas de pénurie d'impasse
	 * renvoie le nombre de magasin qui n'ont pas put être construit
	 * @param array of RoomGenerator $aRooms liste des pièce candidates (doivent etre des impasses à une seule issue)
	 * @param int $nShopCount nombre max de shops à construire
	 * @return int Nom de shops non-construit
	 */
	public static function spawnShops(Array $aRooms, $nShopCount) {
		// création des magasins
		while (($nShopCount > 0) && count($aRooms) > 0) {
			$oRoom = array_shift($aRooms);
			$oRoom->setRoomData('type', 'shop');
			$oRoom->setRoomData('helper', 'dungeon/Shop');
			--$nShopCount;
		}
		return $nShopCount;
	}
	
	/** Tenter de placer les derniers shops qui n'ont pas put etre placés avant pour cause d'insuffisance
	 * de deadends.
	 * @param int $nShopCount nombre de shop à placer
	 */
	public static function spawnLastShops(LevelGenerator $oLevel, $nShopCount) {
		if ($nShopCount > 0) {
			list ($BLOCK_TREASURE, $BLOCK_LABO_CLOSET_X, $BLOCK_LABO_CLOSET_Y, $BLOCK_SHOP) = self::getBlockCodes('BLOCK_TREASURE', 'BLOCK_LABO_CLOSET_X', 'BLOCK_LABO_CLOSET_Y', 'BLOCK_SHOP');
			$w = $oLevel->getWidth();
			$h = $oLevel->getHeight();
			// récupérer la liste des coffre
			// on va remplacer certain coffre par des shop
			$aChests = array();
			for ($y = 0; $y < $h; ++$y) {
				for ($x = 0; $x < $w; ++$x) {
					$nCode =  $oLevel->getCell($x, $y);
					if ($nCode == $BLOCK_TREASURE) {
						$aChests[] = array($x, $y);
					}
				}
			}
			$aChests = $oLevel->oRnd->shuffle($aChests);
			while ($nShopCount > 0) {
				list($x, $y) = array_shift($aChests);
				$oLevel->setCell($x, $y, $BLOCK_SHOP);
				--$nShopCount;
			}
		}
	}
	
	
	

	/** Fabrique des portes dans les issues d'un périmètre de pièce
	 * @param $oPeri objet perimetre
	 * @param $nDoors masque des issue de la pièces
	 */
	public static function spawnDoors($oRoom) {
		list ($BLOCK_DOOR, $BLOCK_DOORWAY_X, $BLOCK_DOORWAY_Y) = self::getBlockCodes('BLOCK_DOOR', 'BLOCK_DOORWAY_X', 'BLOCK_DOORWAY_Y');
		$nDoors = $oRoom->getRoomData('doormask');
		$oPeri = $oRoom->getPeri();
		$aDoors = array();
		if ($nDoors & 1) {
			$oPeri->setCell($oPeri->getWidth() >> 1, 0, $BLOCK_DOOR);
			$oPeri->setCell(($oPeri->getWidth() >> 1) - 1, 0, $BLOCK_DOORWAY_X);
			$oPeri->setCell(($oPeri->getWidth() >> 1) + 1, 0, $BLOCK_DOORWAY_X);
			$aDoors[0] = array($oPeri->getWidth() >> 1, 0);
		}
		if ($nDoors & 8) {
			$oPeri->setCell(0, $oPeri->getHeight() >> 1, $BLOCK_DOOR);
			$oPeri->setCell(0, ($oPeri->getHeight() >> 1) - 1, $BLOCK_DOORWAY_Y);
			$oPeri->setCell(0, ($oPeri->getHeight() >> 1) + 1, $BLOCK_DOORWAY_Y);
			$aDoors[3] = array(0, $oPeri->getHeight() >> 1);
		}
		if ($nDoors & 4) {
			$oPeri->setCell($oPeri->getWidth() >> 1, $oPeri->getHeight() - 1, $BLOCK_DOOR);
			$oPeri->setCell(($oPeri->getWidth() >> 1) - 1, $oPeri->getHeight() - 1, $BLOCK_DOORWAY_X);
			$oPeri->setCell(($oPeri->getWidth() >> 1) + 1, $oPeri->getHeight() - 1, $BLOCK_DOORWAY_X);
			$aDoors[2] = array($oPeri->getWidth() >> 1, $oPeri->getHeight() - 1);
		}
		if ($nDoors & 2) {
			$oPeri->setCell($oPeri->getWidth() - 1, $oPeri->getHeight() >> 1, $BLOCK_DOOR);
			$oPeri->setCell($oPeri->getWidth() - 1, ($oPeri->getHeight() >> 1) - 1, $BLOCK_DOORWAY_Y);
			$oPeri->setCell($oPeri->getWidth() - 1, ($oPeri->getHeight() >> 1) + 1, $BLOCK_DOORWAY_Y);
			$aDoors[1] = array($oPeri->getWidth() - 1, $oPeri->getHeight() >> 1);
		}
		$oRoom->setRoomData('doors', $aDoors);
		return $aDoors;
	}
	
	
	/** 
	 * Creuse des fenetre sur la bordure extérieur d'un niveau
	 * La fenetre est creusée uniquement en face d'une case accessible par le joueur
	 * (dont le code est spécifiée par $nVoidCode)
	 * 
	 * @param LevelGenerator $oLevel niveau à manipuler
	 * @param int $nVoidCode code nécessaire pour creuser la fenetre (un genre de code vide) 
	 * @param int $nWindowCode code de la fenetre
	 */
	public static function spawnWindows(LevelGenerator $oLevel) {
		list ($nVoidCode, $nWindowCode) = self::getBlockCodes('BLOCK_VOID', 'BLOCK_WINDOW'); 
		$w = $oLevel->getWidth();
		$h = $oLevel->getHeight();
		for ($x = 0; $x < $w; $x += 3) {
			if ($oLevel->getCell($x, 1) == $nVoidCode) {
				$oLevel->setCell($x, 0, $nWindowCode);
			}
			if ($oLevel->getCell($x, $h - 2) == $nVoidCode) {
				$oLevel->setCell($x, $h - 1, $nWindowCode);
			}
		}
		for ($y = 0; $y < $h; $y += 3) {
			if ($oLevel->getCell(1, $y) == $nVoidCode) {
				$oLevel->setCell(0, $y, $nWindowCode);
			}
			if ($oLevel->getCell($w - 2, $y) == $nVoidCode) {
				$oLevel->setCell($w - 1, $y, $nWindowCode);
			}
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	////// LOCKED DOORS SYSTEM ////// LOCKED DOORS SYSTEM //////
	
	public static function spawnLockedDoorsAndKeys(LevelGenerator $oLevel) {
		list($oLockMap, $oKeyMap) = self::spawnLabyKeys($oLevel, min(4, max(1, $oLevel->getMapWidth() - 3)));
		self::lockDoors($oLevel, $oLockMap, $oKeyMap);
	}
	
	/**
	 * Génère des clé de couleur et les positionne dans le laby
	 * @param int $n nombre de clés
	 */
	public static function spawnLabyKeys($oLevel, $n) {
		$oLaby = $oLevel->getMap();
		$aLevelRooms = $oLevel->getRooms();
		$aKeys = array('keys' => array(), 'doors' => array());
		$aRooms = array();
		for ($y = 0; $y < $oLaby->getHeight(); $y++) {
			for ($x = 0; $x < $oLaby->getWidth(); $x++) {
				$oRoom = $aLevelRooms[$y][$x];
				if ($oRoom->getRoomData('type') !== 'corridor') {
					$aRooms[] = array(
							'room' => $oRoom,
							'x' => $x,
							'y' => $y,
							'km' => $oLaby->getCellKm($x, $y)
					);
				}
			}
		}
		// mélanger les pièces
		$aRooms = $oLevel->oRnd->shuffle($aRooms);
		while (count($aRooms) > 1 && $n > 0) {
			// prendre deux pièces au hasard
			$aKeyRoom = array_shift($aRooms);
			$aDoorRoom = array_shift($aRooms);
			// vérifier si la pièce-clé est avant la pièce-porte
			if ($aKeyRoom['km'] > $aDoorRoom['km']) {
				$a = $aKeyRoom;
				$aKeyRoom = $aDoorRoom;
				$aDoorRoom = $a;
			}
			$aKeys['keys'][] = array($aKeyRoom['x'], $aKeyRoom['y']);
			$aKeyRoom['room']->setRoomData('key', count($aKeys['keys']));
			$aKeys['doors'][] = array($aDoorRoom['x'], $aDoorRoom['y']);
			$n--;
		}
		// enregistrement des rooms
		$oLockMap = array();
		foreach ($aKeys['doors'] as $nKey => $aRoom) {
			list($x, $y) = $aRoom;
			if (!isset($oLockMap[$y])) {
				$oLockMap[$y] = array();
			}
			$nDoors = $oLaby->getDoorMask($x, $y);
			try {
				$nKm = $oLaby->getCellKm($x, $y) - 1;
				$nDR = 0;
				if (($nDoors & 1) && ($oLaby->getCellKm($x, $y - 1) == $nKm)) {
					$nDR = 1;
				}
				if (($nDoors & 2) && ($oLaby->getCellKm($x + 1, $y) == $nKm)) {
					$nDR = 2;
				}
				if (($nDoors & 4) && ($oLaby->getCellKm($x, $y + 1) == $nKm)) {
					$nDR = 3;
				}
				if (($nDoors & 8) && ($oLaby->getCellKm($x - 1, $y) == $nKm)) {
					$nDR = 4;
				}
				$oRoom = $aLevelRooms[$y][$x];
				$oRoom->setRoomData('lockeddoor', $nDR);
				$oRoom->setRoomData('lockcode', $nKey + 1);
				$oLockMap[$y][$x] = array($nDR, $nKey);
			} catch (Exception $e) {
				// ca ne devrai pas arriver
			}
		}
		return array($oLockMap, $aKeys['keys']);
	}
	
	public static function lockDoors($oLevel, $oLockMap, $oKeyMap) {
		list ($BLOCK_LOCKEDDOOR_0, $BLOCK_DOOR) = self::getBlockCodes('BLOCK_LOCKEDDOOR_0', 'BLOCK_DOOR');
		$aDoors = array();
		$aRooms = $oLevel->getRooms(); 
		$rw = $oLevel->getRoomWidth();
		$rh = $oLevel->getRoomHeight();
		foreach ($oLockMap as $y => $aY) {
			foreach ($aY as $x => $aDoorKey) {
				list ($nDoor, $nKey) = $aDoorKey;
				$aDoors = $aRooms[$y][$x]->getRoomData('doors');
				list ($xDoor, $yDoor) = $aDoors[$nDoor - 1];
				$xDoor += $x * ($rw - 1);
				$yDoor += $y * ($rh - 1);
				$oLevel->setCell($xDoor, $yDoor, $BLOCK_LOCKEDDOOR_0 + $nKey);
				$aDoors[$nKey] = array($xDoor, $yDoor);
			}
		}
		// placer les clés
		foreach ($oKeyMap as $nKey => $aRoom) {
			list ($x, $y) = $aRoom;
			if (self::buildKeyHolder($oLevel, $x, $y, $nKey) === false) {
				list ($xDoor, $yDoor) = $aDoors[$nKey];
				$oLevel->setCell($xDoor, $yDoor, $BLOCK_DOOR);
			}
		}
	}
	
	public static function buildKeyHolder($oLevel, $xRoom, $yRoom, $nKey) {
		list ($BLOCK_VOID, $BLOCK_WALL, $BLOCK_KEY_0) = self::getBlockCodes('BLOCK_VOID', 'BLOCK_WALL', 'BLOCK_KEY_0');
		$rw = $oLevel->getRoomWidth();
		$rh = $oLevel->getRoomHeight();
		$yRoom *= $rh - 1;
		$xRoom *= $rw - 1;
		$aSquare = array(
				array(-1, -1),
				array(0, -1),
				array(1, -1),
				array(-1, 0),
				array(1, 0),
				array(-1, 1),
				array(0, 1),
				array(1, 1),
		);
		$aXYHolder = array();
		for ($y = 1; $y < $rh - 1; $y++) {
			for ($x = 1; $x < $rw - 1; $x++) {
				// tester si y a un carré de 3*3 vide ou presque vide
				$x0 = $xRoom + $x;
				$y0 = $yRoom + $y;
				$nEmpty = 0;
				foreach ($aSquare as $aXY) {
					if ($oLevel->getCell($x0 + $aXY[0], $y0 + $aXY[1]) == $BLOCK_VOID) {
						$nEmpty += 1;
					}
				}
				if ($nEmpty >= 8) {
					$aXYHolder[] = array($x0, $y0);
				}
			}
		}
		// recherche de cellules accessible
		for ($y = 1; $y < $rh - 1; $y++) {
			for ($x = 1; $x < $rw - 1; $x++) {
				$x0 = $xRoom + $x;
				$y0 = $yRoom + $y;
				if ($oLevel->getCell($x0, $y0) == $BLOCK_WALL) {
					$aNB = $oLevel->getCellNeighborhood($x0, $y0);
					$nMask = 0;
					foreach ($aNB as $n => $c) {
						if ($c != $BLOCK_VOID) {
							$nMask |= 1 << $n;
						}
					}
					if ($nMask !== 15) {
						$aXYHolder[] = array($x0, $y0);
					}
				} 
			}
		}
		// Créationdans la bordure
		for ($x = 1; $x < ($rw - 1); $x++) {
			if (
			$oLevel->getCell($xRoom + $x, $yRoom) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x, max(0, $yRoom - 1)) != $BLOCK_VOID &&
			$oLevel->getCell($xRoom + $x - 1, $yRoom) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x + 1, $yRoom) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x, $yRoom + 1) == $BLOCK_VOID) {
				$aXYHolder[] = array($xRoom + $x, $yRoom);
			}
			if (
			$oLevel->getCell($xRoom + $x, $yRoom + $rh - 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x, min($oLevel->getHeight() - 1, $yRoom + $rh)) != $BLOCK_VOID &&
			$oLevel->getCell($xRoom + $x - 1, $yRoom + $rh - 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x + 1, $yRoom + $rh - 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $x, $yRoom + $rh - 2) == $BLOCK_VOID) {
				$aXYHolder[] = array($xRoom + $x, $yRoom + $rh - 1);
			}
		}
		for ($y = 1; $y < ($rh - 1); $y++) {
			if ($oLevel->getCell($xRoom, $yRoom + $y) == $BLOCK_WALL &&
			$oLevel->getCell(max(0, $xRoom - 1), $yRoom + $y) != $BLOCK_VOID &&
			$oLevel->getCell($xRoom, $yRoom + $y - 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom, $yRoom + $y + 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + 1, $yRoom + $y) == $BLOCK_VOID) {
				$aXYHolder[] = array($xRoom, $yRoom + $y);
			}
			if ($oLevel->getCell($xRoom + $rw - 1, $yRoom + $y) == $BLOCK_WALL &&
			$oLevel->getCell(min($oLevel->getWidth() - 1, $xRoom + $rw), $yRoom + $y) != $BLOCK_VOID &&
			$oLevel->getCell($xRoom + $rw - 1, $yRoom + $y - 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $rw - 1, $yRoom + $y + 1) == $BLOCK_WALL &&
			$oLevel->getCell($xRoom + $rw - 2, $yRoom + $y) == $BLOCK_VOID) {
				$aXYHolder[] = array($xRoom + $rw - 1, $yRoom + $y);
			}
		}
		if (count($aXYHolder)) {
			$nRnd = $oLevel->oRnd->getRandom(0, count($aXYHolder) - 1);
			$oLevel->setCell($aXYHolder[$nRnd][0], $aXYHolder[$nRnd][1], $BLOCK_KEY_0 + $nKey);
			return true;
		} else {
			// échec de la création, la pièce est pourrie
			return false;
		}
	}
	
	
	
	
	
	/**
	 * Placer des passages secrets.
	 */
	public static function spawnSecretPlaces(LevelGenerator $oLevel, $oSecret = null) {
		$oBlox = new Blox();
		if ($oSecret === null) {
			$oSecret = new SecretGenerator();
		}
		$oBlox->buildBlox($oLevel);
		$oBlox->buildSecretRoomSystem($oSecret);
	}
	

	
	
	
	
	
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////
	////// FANCY WALLLS ////// FANCY WALLLS ////// FANCY WALLLS //////

	public static function makeFancyWalls(LevelGenerator $oLevel) {
		list ($BLOCK_WALL, $BLOCK_WALL_TORCH, $BLOCK_WALL_GRATE, $BLOCK_WALL_ALCOVE) = self::getBlockCodes('BLOCK_WALL', 'BLOCK_WALL_TORCH', 'BLOCK_WALL_GRATE', 'BLOCK_WALL_ALCOVE');
		$w = $oLevel->getWidth();
		$h = $oLevel->getHeight();
		for ($y = 1; $y < $h - 1; $y++) {
			for ($x = 1; $x < $w - 1; $x++) {
				if ($oLevel->getCell($x, $y) == $BLOCK_WALL) {
					switch ($oLevel->oRnd->getRandom(0, 10)) {
						case 4: $oLevel->setCell($x, $y, $BLOCK_WALL_TORCH); break;
						case 5: $oLevel->setCell($x, $y, $BLOCK_WALL_TORCH); break;
						case 6: $oLevel->setCell($x, $y, $BLOCK_WALL_GRATE); break;
						case 7: $oLevel->setCell($x, $y, $BLOCK_WALL_ALCOVE); break;
					}
				}
			}
		}
	}

	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS ////// MOBS //////
	
	public static function spawnMobs($oLevel, $nMoreOrLess = 0) {
		list ($BLOCK_VOID, $BLOCK_MOB_LEVEL_0) = self::getBlockCodes('BLOCK_VOID', 'BLOCK_MOB_LEVEL_0');
		$oMap = $oLevel->getMap();
		$mw = $oLevel->getMapWidth();
		$mh = $oLevel->getMapHeight();
		$rw = $oLevel->getRoomWidth();
		$rh = $oLevel->getRoomHeight();
		if ($nMoreOrLess < -3) {
			$nMoreOrLess = -3;
		}
		if ($nMoreOrLess > 3) {
			$nMoreOrLess = 3;
		}
		for ($y = 0; $y < $mh; $y++) {
			for ($x = 0; $x < $mw; $x++) {
				if ($oMap->getCellKm($x, $y) > 1) {
					if (!($oMap->isExit($x, $y) || $oMap->isEntrance($x, $y))) {
						// 10% de km en plus pour avoir du boss vers la fin
						$n100 = min(100, max(0, ($oMap->getCellKm101($x, $y))));
						$nMobs = $oLevel->oRnd->getRandom(1, 4 + $nMoreOrLess);
						$nMaxLoop = 6;
						$xRoom = $x * ($rw - 1);
						$yRoom = $y * ($rh - 1);
						do {
							$xRnd = $oLevel->oRnd->getRandom(0, $rw >> 1) + ($rw >> 2);
							$yRnd = $oLevel->oRnd->getRandom(0, $rh >> 1) + ($rh >> 2);
							if ($oLevel->getCell($xRnd + $xRoom, $yRnd + $yRoom) == $BLOCK_VOID) {
								$oLevel->setCell($xRnd + $xRoom, $yRnd + $yRoom, $BLOCK_MOB_LEVEL_0 + floor($n100 / 10));
								$nMobs--;
							}
							$nMaxLoop--;
						} while ($nMobs > 0 && $nMaxLoop > 0);
					}
				}
			}
		}
	}
	
	public function removeNoSpawn($oLevel) {
		$w = $oLevel->getWidth();
		$h = $oLevel->getHeight();
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $h; ++$x) {
				$oLevel->setCell($x, $y, $oLevel->getCell($x, $y) & 0xFF);
			}	
		}
	} 
}
