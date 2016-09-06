<?php
class SecretGenerator {
	public $aExitPosition;

	private $aCorr = array(
      ' ' => BLOCK_VOID,
      '*' => BLOCK_WALL,
      '?' => BLOCK_SECRET,
      '!' => BLOCK_SECRET_WALL,
      '$' => BLOCK_TREASURE,
      '+' => BLOCK_WINDOW,
	  'd' => BLOCK_DOOR,
	  'c' => BLOCK_CURTAIN
	);
	private $aData = array(
		3 => array(
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*$*',
					'***',
					'***',
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'* *',
					'*$*',
					'***',
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*c*',
					'*$*',
					'***',
				)
			)
		),
		4 => array(
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'* **',
					'* $*',
					'*$**',
					'****'
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'* **',
					'* $*',
					'* **',
					'****'
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*c**',
					'* $*',
					'*$**',
					'****'
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?**',
					'*? *',
					'*!$*',
					'****'
				)
			),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?**',
					'*?$*',
					'*!**',
					'****'
				)
			),
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?*',
					'* ?*',
					'*$!*',
					'****'
				)
			),
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?*',
					'*$?*',
					'**!*',
					'****'
				)
			)
		),
		5 => array(
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'** **',
					'*   *',
					'*   *',
					'*$*$*',
					'*****'
				)
			),
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**c**',
					'*   *',
					'*   *',
					'*$*$*',
					'*****'
				)
			),
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?**',
					'* ? *',
					'* ! *',
					'*$*$*',
					'*****'
				)
        	),		
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?**',
					'* ? *',
					'*$! *',
					'***$*',
					'*****'
				)
        	),		
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?**',
					'* ? *',
					'* !$*',
					'*$***',
					'*****'
				)
        	),		
			array(
				'x' => 2,
				'y' => -1,
				'map' => array(
					'**?**',
					'* ? *',
					'*$!$*',
					'*****',
					'*****'
				)
        	),		
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?***',
					'*? $*',
					'*! **',
					'*$ $*',
					'*****'
				)
        	),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?***',
					'*?  *',
					'*! **',
					'*$ $*',
					'*****'
				)
        	),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?***',
					'*? $*',
					'*! **',
					'** $*',
					'*****'
				)
        	),
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?***',
					'*? $*',
					'*! **',
					'**$**',
					'*****'
				)
        	)
        ),
        6 => array(
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?**+*',
					'*? * *',
					'*! *$*',
					'*$   *',
					'**$*$*',
					'******'
				)
			),
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?**+*',
					'*? * *',
					'*! *$*',
					'*$   +',
					'**$*$*',
					'******'
				)
			),
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?****',
					'*?  $+',
					'*!  **',
					'**  $+',
					'*$  **',
					'******'
				)
			),
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?****',
					'*?  $*',
					'*!  **',
					'+   $*',
					'*$*$**',
					'******'
				)
			),
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?****',
					'*?   *',
					'*!**?*',
					'*   ?*',
					'*$*$!*',
					'******'
				)
			),
        	array(
				'x' => 1,
				'y' => -1,
				'map' => array(
					'*?****',
					'*?   *',
					'*!** *',
					'*$   *',
					'**$*$*',
					'******'
				)
			)
		),
		7 => array(
			array(
				'x' => 1,
				'y' => -1,
				'map' => array(
						'*?*****',
						'*? **$*',
						'*! *$ *',
						'* ??! *',
						'*     *',
						'*$*$*$*',
						'*******'
				)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?    *',
							'*!    *',
							'*     *',
							'*     *',
							'*$*$*$*',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?    *',
							'*! ****',
							'*  *  *',
							'*     *',
							'*$*$*$*',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?    *',
							'*!  ***',
							'*   *$*',
							'*     *',
							'*$*$*$*',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?    *',
							'*!* ***',
							'*$* *$*',
							'*     *',
							'*$*$*$*',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?   $*',
							'*!* ***',
							'*$* *$*',
							'*     *',
							'*$*$*$*',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?   **',
							'*!   $*',
							'**   **',
							'*$   $*',
							'**$*$**',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?   **',
							'*! * $*',
							'** * **',
							'*$   $*',
							'**$*$**',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*? ??!*',
							'*!$* $*',
							'**** **',
							'*$   $*',
							'**$*$**',
							'*******'
					)
			),
			array(
					'x' => 1,
					'y' => -1,
					'map' => array(
							'*?*****',
							'*?   **',
							'*!$* $*',
							'****c**',
							'*$   $*',
							'**$*$**',
							'*******'
					)
			)
				
		)
	);
	
	private $aCurrentData;
	
	public function setCorr($a) {
		$this->aCorr = $a;
	}
	
	public function setData($a) {
		$this->aData = $a;
	}
	
	/** renvoie la taille max des pièce définies
	 * @return int 
	 *	 
	 */
	public function getMaxRoomSize() {
		return max(array_keys($this->aData));
	}
	
	/**
	 * Renvoie le nombre de pattern de taille spécifiée
	 * @param $nSize int, taille dont on souhaite compter les patterns
	 * @return int nombre de pattern comptés
	 */
	public function getMapCount($nSize = 0) {
		if ($nSize) {
			if (isset ($this->aData[$nSize])) {
				return count($this->aData[$nSize]);
			} else {
				return 0;
			}
		} else {
			return count($this->aData);
		}
	}

	/** 
	 * Les pièce secrete sont déclarer une fois, mais il peut y avoir
	 * 4 version différentes de chaque pièce (une pour chque direction)
	 * Cette fonction permet de calculer la position du point d'entrée
	 * de la pièce après une rotation de 90°
	 * @param $x coordonnées du point qui va tourner
	 * @param $y
	 * @param $nSize taille de la pièce
	 */
	public static function rotateXY($x, $y, $nSize) {
		return array($nSize - 1 - $y, $x);
	}

	/**
	 * Effectue la rotation de la pièce entière
	 * @param $aMap tableau
	 * return array, pièce tournée de 90°
	 */
	private static function rotateMap($aMap) {
		$aRotate = array();
		$ySize = count($aMap);
		$xSize = strlen($aMap[0]);
		for ($y = 0; $y < $ySize; $y++) {
			$sRow = '';
			for ($x = 0; $x < $xSize; $x++) {
				list($x2, $y2) = self::rotateXY($x, $y, $ySize);
				$sRow .= $aMap[$ySize - 1 - $x][$y];
			}
			$aRotate[] = $sRow;
		}
		return $aRotate;
	}
	
	/**
	 * Effectue une rotation de la pièceet un nouveau coalcul des
	 * coordonnées d'entrée
	 * @aram $aData
	 * @return array
	 */
	private static function rotateData($aData) {
		list($x, $y) = self::rotateXY($aData['x'], $aData['y'], count($aData['map']));
		return array(
			'x' => $x, 
			'y' => $y,
			'map' => self::rotateMap($aData['map'])
		);
	}
	
	/**
	 * Effectue un certain nombre de rotation
	 * @param $n int, nombre de rotation a faire
	 */
	public function rotateCurrentData($n = 1) {
		while ($n > 0) {
			$this->aCurrentData = $this->rotateData($this->aCurrentData);	
			$n--;
		}
	}

	public function generate($nSize, $nIndex) {
		if (isset($this->aData[$nSize]) && isset($this->aData[$nSize][$nIndex])) {
			$aData = $this->aData[$nSize][$nIndex];
			$this->aCurrentData = $aData;
			return true;
		} else {
			return false;
		}
	}
	
	public function render($oRoom) {
		$aData = $this->aCurrentData;
		$aMap = $aData['map'];
		for ($y = 0; $y < $oRoom->getHeight(); $y++) {
			for ($x = 0; $x < $oRoom->getWidth(); $x++) {
				$nMap = $aMap[$y][$x];
				if ($nMap) {
					$nCorr = $this->aCorr[$nMap];
					$oRoom->setCell($x, $y, $nCorr);
				}
			}
		}
	}
	
	public function isValidExit($oRoom, $x, $y) {
		try {
			return $oRoom->getCell($x + $this->aCurrentData['x'], $y + $this->aCurrentData['y']) == BLOCK_VOID;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function rotateUntilValidExit($oRoom, $x, $y) {
		for ($i = 0; $i < 4; $i++) {
			if ($this->isValidExit($oRoom, $x, $y)) {
				return true;
			}
			$this->rotateCurrentData();
		}
		return false;
	}
	
}
