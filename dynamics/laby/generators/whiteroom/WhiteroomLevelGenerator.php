<?php

require_once 'blocks.php';


class WhiteroomLevelGenerator extends RoomGenerator {
  protected $nRoomWidth = 7;
  protected $nRoomHeight = 7;
  protected $nMapWidth = 7;
  protected $nMapHeight = 7;

  public $oMap;
  public $oBlox;
  public $aBloxIndex;

  private $aSecretData = array();

  public $aSwitches = array(
    'rooms' => 33,
    'twisted' => 0,
    'corner' => 50
  );

  public $aParams = array(
    'labysize' => array(4, 8),
    'roomsize' => array(1, 1),
    'secret' => array(1, 10)
  );

	public $oRnd;

	public function runLabyRoomHelper($sHelper, $oRoom, $oData) {
		return LabyRoomHelper::run($sHelper, $oRoom, $this->oRnd, $oData);
	}

	public function getOption($x) {
		global $argv, $argc;
		if (isset($_GET['o'])) {
			$s = $_GET['o'];
		} elseif ($argc > 3) {
			$s = $argv[3];
		} else {
			$s = '';
		}
		$n = strlen($s);
		$o = 0;
		for ($i = 0; $i < $n; $i++) {
			$c = substr($s, $i, 1);
			if ($c == $x) {
				$o++;
			}
		}
		return $o;
	}
	
  public function setSize($x, $y) { 
    $this->nMapWidth = $x;
    $this->nMapHeight = $y;
    parent::setSize($x * ($this->nRoomWidth - 1) + 1, $y * ($this->nRoomHeight - 1) + 1);
  }

  public function rollSwitch($s) {
    $n = $this->aSwitches[$s];
    return $this->oRnd->getRandom(0, 99) < $n;
  }

  public function rollParam($s) {
    $a = $this->aParams[$s];
    return $this->oRnd->getRandom($a[0], $a[1]);
  }

  public function generate($nSeed = null) {
    if (!is_null($nSeed)) {
      $this->oRnd->setRandomSeed($nSeed);
    }
    $nSize = $this->rollParam('labysize');                      // nombre de cellule entre 2 et 12
    $this->nRoomWidth = $this->rollParam('roomsize') * 2 + 7;   // taille des cellules 7, 9 ou 11
    $this->nRoomHeight = $this->nRoomWidth;                     // la cellule inclu le perimètre de 1
    $this->setSize($nSize, $nSize);

    $oLaby = new LabyGenerator();                     // Instancier le laby
    $w = $this->nMapWidth;
    $h = $this->nMapHeight;
    $oLaby->setSize($w, $h);
    $xStart = $this->oRnd->getRandom(0, $w - 1);
    $yStart = $this->oRnd->getRandom(0, $h - 1);

    $oLaby->exploration($xStart, $yStart);            // générer l'itinéraire

    // Passe 1 choix des type de pièce
    $oRooms = new Grid();
    $oRooms->setSize($w, $h);
/* Type de cellules

0: couloir
1: piece
2: piece petite
3: pièce avec un coin
4: pièce avec deux coins
5: pièce avec trois coins


*/
    for ($y = 0; $y < $h; $y++) {
      for ($x = 0; $x < $w; $x++) {
        $nDoors = $oLaby->getDoorMask($x, $y);
        $aRoomData = array(
          'type' =>  0
        );

        // pièce
        $b = ($nDoors == 1 || $nDoors == 2 || $nDoors == 4 || $nDoors == 8);
        if (!$b) {
          $b = $this->rollSwitch('rooms');
        }
        $aRoomData['type'] = $b ? 0x10 : 0x00;

        // couloirs
        if ($aRoomData['type'] == 0x00) {
          $aRoomData['type'] = $this->oRnd->getRandom(0, 5);
        }

        $oRooms->setCell($x, $y, $aRoomData);
      }
    }


    $aRoomFunctions = array(
      0x00 => 'Cross',
      0x01 => 'TinyCross',
      0x02 => 'PillCross',
      0x03 => 'PillCross2',

      0x04 => 'Cross',
      0x05 => 'Cross',

      0x10 => 'Normal'
    );

    for ($y = 0; $y < $h; $y++) {
      for ($x = 0; $x < $w; $x++) {
        $aRoomData = $oRooms->getCell($x, $y);
        $oRG = new RoomGenerator();
        $oRG->setSize($this->nRoomWidth - 2, $this->nRoomHeight - 2);
        $oPeri = new RoomGenerator();
        $oPeri->setSize($this->nRoomWidth, $this->nRoomHeight);
        $sFunc = 'room' . $aRoomFunctions[$aRoomData['type']];
        $this->$sFunc($x, $y, $oRG, $oPeri, $oLaby);
        if ($oLaby->getCellKm($x, $y) > 2) { 
          $this->populate($x, $y, $oRG, $oLaby->getCellKm100($x, $y));
        }
        $oPeri->copy($oRG, 1, 1);
        $this->copyZero($oPeri, $x * ($this->nRoomWidth - 1), $y * ($this->nRoomHeight - 1));
      }
    }

    // Post traitement des valeurs posées lors de la première phase
    // rafinement des valeurs
    // les murs adjacents aux portes portes (2) se vois enrichir d'une information concernant l'orientation x y de la porte (pour l'embrasure)
    //
    $xMax = ($this->nRoomHeight - 1) * $this->nMapHeight + 1;
    $yMax = ($this->nRoomWidth - 1) * $this->nMapWidth + 1;
    for ($y = 0; $y < $yMax; $y++) {
      for ($x = 0; $x < $xMax; $x++) {
        $nCell = $this->getCell($x, $y);
        switch ($nCell) {
          case BLOCK_WALL: 
            if ($x == 0 && ($y % 3) == 2 && $this->getCell(1, $y) == BLOCK_VOID) {
              $this->setCell($x, $y, BLOCK_WINDOW);
            }
            if ($y == 0 && ($x % 3) == 2 && $this->getCell($x, 1) == BLOCK_VOID) {
              $this->setCell($x, $y, BLOCK_WINDOW);
            }
            if ($x == ($xMax - 1) && ($y % 3) == 2 && $this->getCell($x - 1, $y) == BLOCK_VOID) {
              $this->setCell($x, $y, BLOCK_WINDOW);
            }
            if ($y == ($yMax - 1) && ($x % 3) == 2 && $this->getCell($x, $y - 1) == BLOCK_VOID) {
              $this->setCell($x, $y, BLOCK_WINDOW);
            }
          break;

          case BLOCK_DOOR: 
            if ($this->getCell($x, $y + 1) == 0 || $this->getCell($x, $y - 1) == BLOCK_VOID) {
              $this->setCell($x + 1, $y, BLOCK_DOOR_X_SIDE);
              $this->setCell($x - 1, $y, BLOCK_DOOR_X_SIDE);
            }
            if ($this->getCell($x + 1, $y) == 0 || $this->getCell($x - 1, $y) == BLOCK_VOID) {
              $this->setCell($x, $y + 1, BLOCK_DOOR_Y_SIDE);
              $this->setCell($x, $y - 1, BLOCK_DOOR_Y_SIDE);
            }
          break;

          case BLOCK_ELEVATOR_UP_DOOR: 
            if ($this->getCell($x, $y + 1) == 0 || $this->getCell($x, $y - 1) == BLOCK_VOID) {
              $this->setCell($x + 1, $y, BLOCK_ELEVATOR_DOOR_X_SIDE);
              $this->setCell($x - 1, $y, BLOCK_ELEVATOR_DOOR_X_SIDE);
            }
            if ($this->getCell($x + 1, $y) == 0 || $this->getCell($x - 1, $y) == BLOCK_VOID) {
              $this->setCell($x, $y + 1, BLOCK_ELEVATOR_DOOR_Y_SIDE);
              $this->setCell($x, $y - 1, BLOCK_ELEVATOR_DOOR_Y_SIDE);
            }
          break;

          case BLOCK_ELEVATOR_DOWN_DOOR: 
            if ($this->getCell($x, $y + 1) == 0 || $this->getCell($x, $y - 1) == BLOCK_VOID) {
              $this->setCell($x + 1, $y, BLOCK_ELEVATOR_DOOR_X_SIDE);
              $this->setCell($x - 1, $y, BLOCK_ELEVATOR_DOOR_X_SIDE);
            }
            if ($this->getCell($x + 1, $y) == 0 || $this->getCell($x - 1, $y) == BLOCK_VOID) {
              $this->setCell($x, $y + 1, BLOCK_ELEVATOR_DOOR_Y_SIDE);
              $this->setCell($x, $y - 1, BLOCK_ELEVATOR_DOOR_Y_SIDE);
            }
          break;
        }
      }
    }
    $this->buildBlox();
    // Placer quelques passages secrets
    $this->roomSecretHalls($this);
    $this->oMap = $oLaby;
  }


  public function populate($x, $y, $oRoom, $n100) {
    $aMobs = array(0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 3, 2, 3, 2, 3, 3, 4, 4);
    $nMin = floor($n100 / 10);
    $iMobs = $this->oRnd->getRandom($nMin, count($aMobs) - (10 - $nMin) - 1);
    $nMobs = $aMobs[$iMobs];
    $nMaxLoop = 6;
    do {
      $xRnd = $this->oRnd->getRandom(0, $oRoom->getWidth() >> 1) + ($oRoom->getWidth() >> 2);
      $yRnd = $this->oRnd->getRandom(0, $oRoom->getHeight() >> 1) + ($oRoom->getHeight() >> 2);
      if ($oRoom->getCell($xRnd, $yRnd) == BLOCK_VOID) {
        $oRoom->setCell($xRnd, $yRnd, BLOCK_MOB_BASE);
        $nMobs--;
      }
      $nMaxLoop--;
    } while ($nMobs > 0 && $nMaxLoop > 0);
  }

  public function roomSecretHalls($oLaby) {
    $n = $this->rollParam('secret');
    for ($i = 0; $i < $n; $i++) {
      $this->roomSecrets($this, 30, 6);
      $this->roomSecrets($this, 10, 5);
      $this->roomSecrets($this, 20, 5);
      $this->roomSecrets($this, 0, 4);
    }
  }

  public function roomSecrets($oLaby, $nType, $nSize) {
    if (!isset($this->aBloxIndex[$nSize])) {
      return;
    }
    $o = $this->aBloxIndex[$nSize][$this->oRnd->getRandom(0, count($this->aBloxIndex[$nSize]) - 1)];
    $this->roomSecret($o[0], $o[1], $oLaby, $nType);
  }

  public function roomCross($x, $y, $oRoom, $oPeri, $oLaby) {
    $oRoom->generateDunHallway(BLOCK_WALL, $oLaby->getDoorMask($x, $y), 3);
    $oPeri->generateDunHallway(BLOCK_WALL, $oLaby->getDoorMask($x, $y), 3);
  }

  public function roomTinyCross($x, $y, $oRoom, $oPeri, $oLaby) {
    $oRoom->generateDunHallway(BLOCK_WALL, $oLaby->getDoorMask($x, $y), 1);
    $oPeri->generateDunHallway(BLOCK_WALL, $oLaby->getDoorMask($x, $y), 1);
  }

  public function roomPillCross($x, $y, $oRoom, $oPeri, $oLaby) {
    $this->roomCross($x, $y, $oRoom, $oPeri, $oLaby);
    $oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 1, $oRoom->getHeight() - 1, 1, 1, 2, 2);
  }

  public function roomPillCross2($x, $y, $oRoom, $oPeri, $oLaby) {
    $this->roomCross($x, $y, $oRoom, $oPeri, $oLaby);
    $oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 3, $oRoom->getHeight() - 3, 2, 2, 2, 2);
  }

  public function roomNormal($x, $y, $oRoom, $oPeri, $oLaby) {
    $oPeri->generateDunHallway(BLOCK_WALL, $nDoors = $oLaby->getDoorMask($x, $y), 1);
    if ($nDoors & 1) {
      $oPeri->setCell($oPeri->getWidth() >> 1, 0, BLOCK_DOOR);
    }
    if ($nDoors & 8) {
      $oPeri->setCell(0, $oPeri->getHeight() >> 1, BLOCK_DOOR);
    }
    if ($nDoors & 4) {
      $oPeri->setCell($oPeri->getWidth() >> 1, $oPeri->getHeight() - 1, BLOCK_DOOR);
    }
    if ($nDoors & 2) {
      $oPeri->setCell($oPeri->getWidth() - 1, $oPeri->getHeight() >> 1, BLOCK_DOOR);
    }

    if ($oLaby->isExit($x, $y)) {
      $this->roomElevator($x, $y, $oRoom, $oPeri, $oLaby, true);
      return;
    }

    if ($oLaby->isEntrance($x, $y)) {
      $this->roomElevator($x, $y, $oRoom, $oPeri, $oLaby, false);
      return;
    }

    $nTheme = $this->oRnd->getRandom(1, 6);
    switch ($nTheme) {
      case 1: // room corner
        $this->runLabyRoomHelper('whiteroom/Corners', $oRoom, null);
      break;

      case 2: // room lib
        $this->runLabyRoomHelper('whiteroom/Library', $oRoom, null);
      break;

      case 3: // room cell
        $this->runLabyRoomHelper('whiteroom/Cells', $oRoom, null);
      break;

      case 4: // room watch
        $this->runLabyRoomHelper('whiteroom/Watch', $oRoom, null);
      break;

      case 5: // room living
        $this->runLabyRoomHelper('whiteroom/Living', $oRoom, null);
      break;

      case 6: // room living
        $this->runLabyRoomHelper('whiteroom/Labo', $oRoom, null);
      break;
    }
  }


  public function roomElevator($x, $y, $oRoom, $oPeri, $oLaby, $bExit) {
    $w2 = $oRoom->getWidth() >> 1;
    $h2 = $oRoom->getHeight() >> 1;
    $oRoom->generateCentralPillar(BLOCK_WALL, 3, 3);
    $nDoors = $oLaby->getDoorMask($x, $y);
    if ($nDoors & 1) {
      $nSide = 0; 
      $oRoom->generateCorner(BLOCK_WALL, 2, 5, 4);
      $oRoom->generateCorner(BLOCK_WALL, 3, 5, 4);
      $oRoom->setCell($w2, $h2 - 1, $bExit ? BLOCK_ELEVATOR_DOWN_DOOR : BLOCK_ELEVATOR_UP_DOOR);
      $oRoom->setCell($w2 - 2, $h2, BLOCK_WALL);
      $oRoom->setCell($w2 + 2, $h2, BLOCK_WALL);
      $oRoom->setCell($w2, $h2 + 1, $bExit ? BLOCK_ELEVATOR_SWITCH : BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2 - 1, $h2, BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2 + 1, $h2, BLOCK_ELEVATOR_WALL);
    }
    if ($nDoors & 2) {
      $nSide = 3;
      $oRoom->generateCorner(BLOCK_WALL, 0, 4, 5);
      $oRoom->generateCorner(BLOCK_WALL, 3, 4, 5);
      $oRoom->setCell($w2 + 1, $h2, $bExit ? BLOCK_ELEVATOR_DOWN_DOOR : BLOCK_ELEVATOR_UP_DOOR);
      $oRoom->setCell($w2, $h2 - 2, BLOCK_WALL);
      $oRoom->setCell($w2, $h2 + 2, BLOCK_WALL);
      $oRoom->setCell($w2 - 1, $h2, $bExit ? BLOCK_ELEVATOR_SWITCH : BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2, $h2 - 1, BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2, $h2 + 1, BLOCK_ELEVATOR_WALL);
    }
    if ($nDoors & 4) {
      $nSide = 2;
      $oRoom->generateCorner(BLOCK_WALL, 1, 5, 4);
      $oRoom->generateCorner(BLOCK_WALL, 0, 5, 4);
      $oRoom->setCell($w2, $h2 + 1, $bExit ? BLOCK_ELEVATOR_DOWN_DOOR : BLOCK_ELEVATOR_UP_DOOR);
      $oRoom->setCell($w2 - 2, $h2, BLOCK_WALL);
      $oRoom->setCell($w2 + 2, $h2, BLOCK_WALL);
      $oRoom->setCell($w2, $h2 - 1, $bExit ? BLOCK_ELEVATOR_SWITCH : BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2 - 1, $h2, BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2 + 1, $h2, BLOCK_ELEVATOR_WALL);
    }
    if ($nDoors & 8) {
      $nSide = 1;
      $oRoom->generateCorner(BLOCK_WALL, 1, 4, 5);
      $oRoom->generateCorner(BLOCK_WALL, 2, 4, 5);
      $oRoom->setCell($w2 - 1, $h2, $bExit ? BLOCK_ELEVATOR_DOWN_DOOR : BLOCK_ELEVATOR_UP_DOOR);
      $oRoom->setCell($w2, $h2 - 2, BLOCK_WALL);
      $oRoom->setCell($w2, $h2 + 2, BLOCK_WALL);
      $oRoom->setCell($w2 + 1, $h2, $bExit ? BLOCK_ELEVATOR_SWITCH : BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2, $h2 - 1, BLOCK_ELEVATOR_WALL);
      $oRoom->setCell($w2, $h2 + 1, BLOCK_ELEVATOR_WALL);
    }
    $oRoom->generateCentralPillar($bExit ? BLOCK_EXIT : BLOCK_ENTRANCE, 1, 1);
  }

  private function rotateMap($aMap) {
    $aRotate = array();
    $ySize = count($aMap);
    $xSize = strlen($aMap[0]);
    for ($y = 0; $y < $ySize; $y++) {
      $sRow = '';
      for ($x = 0; $x < $xSize; $x++) {
        $sRow .= $aMap[$ySize - 1 - $x][$y];
      }
      $aRotate[] = $sRow;
    }
    return $aRotate;
  }

  public function getSecretData() {
    if (count($this->aSecretData) == 0) {
      $this->aSecretData = array(
        0 => array(
          'x' => 1,
          'y' => -1,
          'data' => array(
            '*x**',
            '*x *',
            '*#$*',
            '****'
          )
        ),
        10 => array(
          'x' => 2,
          'y' => -1,
          'data' => array(
            '**x**',
            '* x *',
            '* # *',
            '*$*$*',
            '*****',
          )
        ),
        20 => array(
          'x' => 1,
          'y' => -1,
          'data' => array(
            '*x***',
            '*x $*',
            '*# **',
            '*$ $*',
            '*****',
          )
        ),
        30 => array(
          'x' => 1,
          'y' => -1,
          'data' => array(
            '*x**+*',
            '*x * *',
            '*# *$*',
            '*$   *',
            '**$*$*',
            '******'
          )
        )
      );
      $aKeys = array_keys($this->aSecretData);
      foreach ($aKeys as $nKey) {
        $ySize = count($this->aSecretData[$nKey]['data']);
        $xSize = strlen($this->aSecretData[$nKey]['data'][0]);
        $aData = array(
          'x' => $xSize - 1 - $this->aSecretData[$nKey]['x'],
          'y' => $ySize - 1 - $this->aSecretData[$nKey]['y'],
          'data' => array()
        );
        $this->aSecretData[$nKey + 1] = array(
          'x' => $aData['y'],
          'y' => $this->aSecretData[$nKey]['x'],
          'data' => $this->rotateMap($this->aSecretData[$nKey]['data'])
        );
        $this->aSecretData[$nKey + 2] = array(
          'x' => $aData['x'],
          'y' => $aData['y'],
          'data' => $this->rotateMap($this->aSecretData[$nKey + 1]['data'])
        );
        $this->aSecretData[$nKey + 3] = array(
          'x' => $this->aSecretData[$nKey]['y'],
          'y' => $aData['x'],
          'data' => $this->rotateMap($this->aSecretData[$nKey + 2]['data'])
        );
      }
    }
    return $this->aSecretData;
  }

  public function roomSecret($x, $y, $oLaby, $nType) {
    $aData = $oLaby->getSecretData();
    $aCorr = array(
      ' ' => BLOCK_VOID,
      '*' => BLOCK_WALL,
      'x' => BLOCK_SECRET,
      '#' => BLOCK_SECRET_WALL,
      '$' => BLOCK_TREASURE,
      '+' => BLOCK_WINDOW
    );

    for ($nSubType = 0; $nSubType < 4; $nSubType++) {
      $aRoomSecret = $aData[$nType + $nSubType];
      $ySize = count($aRoomSecret['data']);
      $xSize = strlen($aRoomSecret['data'][0]);
      $xExit = $aRoomSecret['x'] + $x;
      $yExit = $aRoomSecret['y'] + $y;
      try {
        $bExit = ($this->getCell($xExit, $yExit) == BLOCK_VOID) || ($this->getCell($xExit, $yExit) >= BLOCK_MOB_BASE);
      } catch (Exception $e) {
        $bExit = false;
      }
      if ($bExit) {
        break;
      }
    }
    if ($nSubType >= 4) {
      return;
    }
    try {
      for ($iy = 0; $iy < $ySize; $iy++) {
        for ($ix = 0; $ix < $xSize; $ix++) {
          if ($oLaby->getCell($x + $ix, $y + $iy) != BLOCK_WALL) {
            return; // Le bloc n'est pas vide : annulation
          }
        }
      }
    } catch (Exception $e) {
      return;
    }
    for ($iy = 0; $iy < $ySize; $iy++) {
      for ($ix = 0; $ix < $xSize; $ix++) {
        // ne transformer que les mur de base (pas les murs décorés)
        if ($oLaby->getCell($x + $ix, $y + $iy) == BLOCK_WALL) {
          $oLaby->setCell($x + $ix, $y + $iy, $aCorr[$aRoomSecret['data'][$iy][$ix]]);
        }
      }
    }
  }

  public function buildBlox() {
    $B = new Grid();
    $B->setSize($w = $this->getWidth(), $h = $this->getHeight());
    for ($y = 0; $y < $h; $y++) {
      for ($x = 0; $x < $w; $x++) {
        switch ($this->getCell($x, $y)) {
          case BLOCK_WALL:
          case BLOCK_WALL_THEME_LIBRARY:
          case BLOCK_WALL_THEME_WOOD:
          case BLOCK_WALL_THEME_CELL:
          case BLOCK_WALL_THEME_LIVING:
          case BLOCK_FIREPLACE_THEME_LIVING:
          case BLOCK_PICTURE_THEME_LIVING:
          case BLOCK_PORTRAIT_THEME_LIVING:
          case BLOCK_WALL_THEME_LABO:
            $B->setCell($x, $y,  1);
          break;

          default:
            $B->setCell($x, $y,  0);
          break;
        }
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

  public function testRenderBlox() {
    for ($n = 5; $n <= max(array_keys($this->aBloxIndex)); $n++) {
      foreach ($this->aBloxIndex[$n] as $aBlox) {
        for ($y = 0; $y < $n; $y++) {
          for ($x = 0; $x < $n; $x++) {
            $this->setCell($x + $aBlox[0], $y + $aBlox[1], BLOCK_SECRET);
          }
        }
      }
    }
  }

  public function render() {
   $this->sClass = 'laby';
   return $this->oMap->render() . parent::render(array(
     BLOCK_VOID => array('class' => '',     'text' => ''),
     BLOCK_WALL => array('class' => 'wall', 'text' => '.'),  
     BLOCK_DOOR => array('class' => 'door', 'text' => 'd', 'legend' => 'door'),
     BLOCK_TREASURE => array('class' => 'treasure', 'text' => 'O', 'legend' => 'chest'),
     BLOCK_SECRET => array('class' => 'secret', 'text' => '?', 'legend' => 'secret'),
     BLOCK_EXIT => array('class' => 'exit', 'text' => 'x', 'legend' => 'exit'),
     BLOCK_ENTRANCE => array('class' => 'entrance', 'text' => '.'),
     BLOCK_WINDOW => array('class' => 'window', 'text' => '#', 'legend' => 'window'),

     BLOCK_DOOR_X_SIDE => array('class' => 'doorxside', 'text' => '--', 'legend' => 'doorway'),
     BLOCK_DOOR_Y_SIDE => array('class' => 'dooryside', 'text' => '|', 'legend' => 'doorway'),
     BLOCK_ELEVATOR_DOOR_X_SIDE => array('class' => 'elevatordoorxside', 'text' => '--', 'legend' => 'elev. doorway'),
     BLOCK_ELEVATOR_DOOR_Y_SIDE => array('class' => 'elevatordooryside', 'text' => '|', 'legend' => 'elev. doorway'),
     BLOCK_ELEVATOR_UP_DOOR => array('class' => 'elevatorupdoor', 'text' => 'd', 'legend' => 'elev. up door'),
     BLOCK_ELEVATOR_DOWN_DOOR => array('class' => 'elevatordowndoor', 'text' => 'd', 'legend' => 'elev. down door'),
     BLOCK_ELEVATOR_WALL => array('class' => 'elevatorwall', 'text' => 'w', 'legend' => 'elev. inner wall'),
     BLOCK_ELEVATOR_SWITCH => array('class' => 'elevatorswitch', 'text' => 's', 'legend' => 'elev. switch'),

     BLOCK_SECRET_WALL => array('class' => 'secret', 'text' => '.'),

     BLOCK_WALL_THEME_LIBRARY => array('class' => 'libwall', 'text' => 'b', 'legend' => 'bookshelf'),

     BLOCK_WALL_THEME_CELL => array('class' => 'wall', 'text' => 'w', 'legend' => 'cell wall'),
     BLOCK_BARS_THEME_CELL => array('class' => 'window', 'text' => '||', 'legend' => 'bars'),
     BLOCK_DOOR_THEME_CELL => array('class' => 'door', 'text' => 'd', 'legend' => 'cell door'),

     BLOCK_WALL_THEME_LIVING => array('class' => 'livwall', 'text' => 'w', 'legend' => 'living room wall'),
     BLOCK_FIREPLACE_THEME_LIVING => array('class' => 'livfire', 'text' => 'f', 'legend' => 'fireplace'),
     BLOCK_PICTURE_THEME_LIVING => array('class' => 'livpaint', 'text' => 'p', 'legend' => 'picture'),
     BLOCK_PORTRAIT_THEME_LIVING => array('class' => 'livpaint', 'text' => 'P', 'legend' => 'portrait'),

     BLOCK_WALL_THEME_LABO =>  array('class' => 'wall', 'text' => 'w', 'legend' => 'lab. wall'),
     BLOCK_ALCHEMY_THEME_LABO =>  array('class' => 'treasure', 'text' => 'u', 'legend' => 'alchemy'),
     BLOCK_CLOSET_X_THEME_LABO =>  array('class' => 'libwall', 'text' => '--', 'legend' => 'closet'),
     BLOCK_CLOSET_Y_THEME_LABO =>  array('class' => 'libwall', 'text' => '|', 'legend' => 'closet'),


     BLOCK_MOB_BASE => array('class' => 'mob', 'text' => '1', 'legend' => 'monster')
     

/*
  wall
  door
  doorxside
  dooryside
  elevatorcage
  elevatorupdoor
  elevatordowndoor
  elevatorupswitch
  elevatordownswitch
*/
    ));
  }


  public function renderJSON() {
    $xMax = ($this->nRoomHeight - 1) * $this->nMapHeight + 1;
    $yMax = ($this->nRoomWidth - 1) * $this->nMapWidth + 1;
    $aMap = array();
    for ($y = 0; $y < $yMax; $y++) {
      $aMapRow = array();
      for ($x = 0; $x < $xMax; $x++) {
        $aMapRow[] = $this->getCell($x, $y);
      }
      $aMap[] = $aMapRow;
    }
    return json_encode($aMap);
  }

  public function renderCSS() {
    return 
'table tr > td {
  font-family: courier;
  font-size: 10px;
  text-align: center;
  border: solid thin black;
  width: 16px;
  height: 16px;
  padding: 0px;
  margin: 0px;
}




table.laby tr > td.wall {
  background-color: #888;
}

table.laby tr > td.libwall {
  background-color: #A98;
}

table.laby tr > td.door {
  background-color: #8F8;
}

table.laby tr > td.treasure {
  background-color: #FC0;
}

table.laby tr > td.secret {
  background-color: #0CF;
}

table.laby tr > td.exit {
  font-weight: bold;
  background-color: #08F;
}

table.laby tr > td.entrance {
  font-weight: bold;
  background-color: #F80;
}

table.laby tr > td.doorxside {
  font-weight: bold;
  background-color: #AAA;
}

table.laby tr > td.dooryside {
  font-weight: bold;
  background-color: #AAA;
}

table.laby tr > td.elevatordoorxside {
  font-weight: bold;
  background-color: #666;
}

table.laby tr > td.elevatordooryside {
  font-weight: bold;
  background-color: #666;
}

table.laby tr > td.elevatorupdoor {
  background-color: #F88;
}

table.laby tr > td.elevatordowndoor {
  background-color: #88F;
}

table.laby tr > td.window {
  background-color: #CCC;
}

table.laby tr > td.elevatorwall {
  background-color: #CCC;
}

table.laby tr > td.elevatorswitch {
  background-color: #CCC;
}



table.laby tr > td.mob {
  background-color: #F00;
}



/* Living */
table.laby tr > td.livwall {
  background-color: #89A;
}

table.laby tr > td.livfire {
  background-color: #89A;
}

table.laby tr > td.livpaint {
  background-color: #89A;
}



/* MINI MAP */
table.laby2 tr > td.laby3 {
  border-bottom: none;
  border-right: none;
}

table.laby2 tr > td.laby2 {
  border-top: none;
  border-bottom: none;
  border-right: none;
}

table.laby2 tr > td.laby1 {
  border-left: none;
  border-bottom: none;
  border-right: none;
}

table.laby2 tr > td.laby0 {
  border-top: none;
  border-left: none;
  border-bottom: none;
  border-right: none;
}

table.laby2 tr:last-child > td {
  border-bottom: solid thin;
}

table.laby2 tr > td:last-child {
  border-right: solid thin;
}';
  }
}


