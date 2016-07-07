<?php
class LabyRoomLabo extends LabyRoomHelper {

  const PROB_CORNER = 77;

  public function generate($oRoom) {
    $cx = floor($oRoom->getWidth() / 2);
    $cy = floor($oRoom->getHeight() / 2);
    $cxy = array(max(1, $cx), max(1, $cy));
    $aWalls = array(0, 1, 2, 3);
    unset($aWalls[$this->oRnd->getRandom(0, count($aWalls) - 1)]);
    foreach ($aWalls as $c) {
      $oRoom->generateCorner($this->oRnd->roll100(50) ? BLOCK_LABO_CLOSET_Y : BLOCK_LABO_WALL, $c, 1, $cxy[($c + 1) & 1]);
      $oRoom->generateCorner($this->oRnd->roll100(50) ? BLOCK_LABO_CLOSET_X : BLOCK_LABO_WALL, $c, $cxy[$c & 1], 1);
      switch ($this->oRnd->getRandom(0, 3)) {
        case 1:
          $oRoom->generateCorner(BLOCK_LABO_ALCHEMY, $c, 1, 2);
        break;
 
        case 2:
          $oRoom->generateCorner(BLOCK_LABO_ALCHEMY, $c, 2, 1);
        break;
 
        case 3:
          $oRoom->generateCorner(BLOCK_LABO_ALCHEMY, $c, 1, 2);
          $oRoom->generateCorner(BLOCK_LABO_ALCHEMY, $c, 2, 1);
        break;
      }
      $oRoom->generateCorner(BLOCK_WALL, $c, 1, 1);
    }
    $aCorr = array(
      BLOCK_LABO_WALL,
      BLOCK_LABO_ALCHEMY,
      BLOCK_LABO_BOOK
    );
    $aPillar = array(
      array(
        'tile' => $this->oRnd->getRandom(0, count($aCorr) - 1),
        'x' => 0,
        'y' => -1
      ),
      array(
        'tile' => $this->oRnd->getRandom(0, count($aCorr) - 1),
        'x' => 1,
        'y' => 0
      ),
      array(
        'tile' => $this->oRnd->getRandom(0, count($aCorr) - 1),
        'x' => 0,
        'y' => 1
      ),
      array(
        'tile' => $this->oRnd->getRandom(0, count($aCorr) - 1),
        'x' => -1,
        'y' => 0
      )
    );
    $xc = $oRoom->getWidth() >> 1;
    $yc = $oRoom->getHeight() >> 1;

    $oRoom->generateCentralPillar(BLOCK_LABO_WALL, 3, 3);
    foreach ($aPillar as $oPillar) {
      $oRoom->setCell($xc + $oPillar['x'], $yc + $oPillar['y'], $aCorr[$oPillar['tile']]);
    }
  }
}
