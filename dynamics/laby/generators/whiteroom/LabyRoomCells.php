<?php
class LabyRoomCells extends LabyRoomHelper {
  public function getBlockData() { return array(); }
  public function generate($oRoom) {
    $cx = floor($oRoom->getWidth() / 2);
    $cy = floor($oRoom->getHeight() / 2);
    $cxy = array(max(0, $cx), max(0, $cy));
    for ($c = 0; $c < 4; $c++) {
      $cx = $this->oRnd->getRandom(2, $cxy[$c & 1]);
      $cy = $this->oRnd->getRandom(2, $cxy[($c + 1) & 1]);
      $cx2 = ($cx - 1) >> 1;
      $cy2 = ($cy - 1) >> 1;
      $oRoom->generateCorner(BLOCK_WALL_THEME_CELL, $c, $cx, $cy);
      $oRoom->generateCorner(BLOCK_VOID, $c, $cx - 1, $cy - 1);
      switch ($c) {
        case 0:
          $oRoom->setCell($cx - 1, $cy2, BLOCK_BARS_THEME_CELL);
          $oRoom->setCell($cx2, $cy - 1, BLOCK_DOOR_THEME_CELL);
        break;

        case 1:
          $oRoom->setCell($oRoom->getWidth() - $cx, $cy2, BLOCK_BARS_THEME_CELL);
          $oRoom->setCell($oRoom->getWidth() - $cx2 - 1, $cy - 1, BLOCK_DOOR_THEME_CELL);
        break;

        case 2:
          $oRoom->setCell($oRoom->getWidth() - $cx, $oRoom->getHeight() - $cy2 - 1, BLOCK_BARS_THEME_CELL);
          $oRoom->setCell($oRoom->getWidth() - $cx2 - 1, $oRoom->getHeight() - $cy, BLOCK_DOOR_THEME_CELL);
        break;

        case 3:
          $oRoom->setCell($cx - 1, $oRoom->getHeight() - $cy2 - 1, BLOCK_BARS_THEME_CELL);
          $oRoom->setCell($cx2, $oRoom->getHeight() - $cy, BLOCK_DOOR_THEME_CELL);
        break;
      }
    }
  }
}

