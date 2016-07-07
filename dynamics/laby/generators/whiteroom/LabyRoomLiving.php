<?php
class LabyRoomLiving extends LabyRoomHelper {

  const PROB_CORNER = 77;

  public function getBlockData() { return array(); }
  public function generate($oRoom) {
    $cx = floor($oRoom->getWidth() / 2);
    $cy = floor($oRoom->getHeight() / 2);
    $cxy = array(max(1, $cx), max(1, $cy));
    $aWalls = array(0, 1, 2, 3);
    foreach ($aWalls as $c) {
      $oRoom->generateCorner(BLOCK_WALL_THEME_LIBRARY, $c, 1, $cxy[($c + 1) & 1]);
      $oRoom->generateCorner(BLOCK_WALL_THEME_LIBRARY, $c, $cxy[$c & 1], 1);
    }

    $aTiles = array(
      BLOCK_FIREPLACE_THEME_LIVING,
      BLOCK_WALL_THEME_LIVING,
      BLOCK_WALL_THEME_LIVING,
      BLOCK_WALL_THEME_LIVING,
      BLOCK_PICTURE_THEME_LIVING,
      BLOCK_PORTRAIT_THEME_LIVING,
      BLOCK_WALL_THEME_LIBRARY,
      BLOCK_VOID,
      BLOCK_VOID,
    );
    $bFireplace = false;
    $nTile = 0;
    $iTile = 0;
    for ($y = 0; $y < $oRoom->getHeight(); $y++) {
      for ($x = 0; $x < $oRoom->getWidth(); $x++) {
        if ($oRoom->getCell($x, $y) != BLOCK_VOID) {
          $iTile = $this->oRnd->getRandom(0, count($aTiles) - 1);
          if ($iTile == 0) {
            if ($bFireplace) {
              $iTile += $this->oRnd->getRandom(1, count($aTiles) - 1);
            } else {
              $bFireplace = true;
            }
          }
          $nTile = $aTiles[$iTile];
          $oRoom->setCell($x, $y, $nTile);
        }
      }
    }
  }
}
