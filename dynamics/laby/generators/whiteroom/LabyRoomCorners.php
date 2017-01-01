<?php

class LabyRoomCorners extends LabyRoomHelper {

  const PROB_CORNER = 50;

  public function getBlockData() { return array(); }
  public function generate($oRoom) {
    $cx = floor($oRoom->getWidth() / 2);
    $cy = floor($oRoom->getHeight() / 2);
    $cxy = array(max(0, $cx), max(0, $cy));
    for ($c = 0; $c < 4; $c++) {
      if ($this->oRnd->roll100(self::PROB_CORNER)) {
        $oRoom->generateCorner(BLOCK_WALL, $c, $this->oRnd->getRandom(0, $cxy[$c & 1]), $this->oRnd->getRandom(0, $cxy[($c + 1) & 1]));
      }
    }
  }
}

