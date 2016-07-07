<?php
class LabyRoomLibrary extends LabyRoomHelper {

  const PROB_CORNER = 77;

  public function getBlockData() { return array(); }
  public function generate($oRoom) {
    $cx = floor($oRoom->getWidth() / 2);
    $cy = floor($oRoom->getHeight() / 2);
    $cxy = array(max(1, $cx), max(1, $cy));
    $aWalls = array();
    for ($c = 0; $c < 4; $c++) {
      if ($this->oRnd->roll100(self::PROB_CORNER)) {
        $oRoom->generateCorner(BLOCK_WALL_THEME_LIBRARY, $c, $this->oRnd->getRandom(2, $cxy[$c & 1]), $this->oRnd->getRandom(2, $cxy[($c + 1) & 1]));
      } else {
        $aWalls[] = $c;
      }
    }
    $oRoom->frame(BLOCK_VOID, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
    foreach ($aWalls as $c) {
      $oRoom->generateCorner(BLOCK_WALL_THEME_LIBRARY, $c, 1, $cxy[($c + 1) & 1]);
      $oRoom->generateCorner(BLOCK_WALL_THEME_LIBRARY, $c, $cxy[$c & 1], 1);
    }
  }
}
