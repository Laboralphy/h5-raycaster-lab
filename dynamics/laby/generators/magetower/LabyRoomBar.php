<?php
class LabyRoomBar extends LabyRoomHelper {
	
	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(1, $cx), max(1, $cy));
		$nBarCorner = $this->oRnd->getRandom(0, 3);
		$aWalls = array(0, 1, 2, 3);
		
		$oRoom->frame(BLOCK_VOID, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
		foreach ($aWalls as $c) {
			if ($c == $nBarCorner) {
				$oRoom->generateCorner(BLOCK_BAR_DESK, $c, $cxy[$c & 1], 2);
				$oRoom->generateCorner(BLOCK_BAR_WALL, $c, 1, $cxy[($c + 1) & 1]);
				$oRoom->generateCorner(BLOCK_BAR_C2H4OH_X, $c, $cxy[$c & 1], 1);
				$oRoom->generateCorner(BLOCK_BAR_C2H4OH_Y, $c, 1, 2);
			} else {
				$oRoom->generateCorner(BLOCK_BAR_TABLE, $c, 3, 3);
				$oRoom->generateCorner(BLOCK_BAR_FLOOR, $c, 3, 2);
				$oRoom->generateCorner(BLOCK_BAR_FLOOR, $c, 2, 3);
				$oRoom->generateCorner(BLOCK_BAR_WALL, $c, 1, $cxy[($c + 1) & 1]);
				$oRoom->generateCorner(BLOCK_BAR_WALL, $c, $cxy[$c & 1], 1);
			}
		}
		$oRoom->replace(BLOCK_VOID, BLOCK_BAR_FLOOR);
	}
}
