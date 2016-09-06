<?php
class LabyRoomLibrary extends LabyRoomHelper {

	const PROB_CORNER = 77;

	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(1, $cx), max(1, $cy));
		$aWalls = array();
		for ($c = 0; $c < 4; $c++) {
			if ($this->oRnd->roll100(self::PROB_CORNER)) {
				$oRoom->generateCorner(BLOCK_LIBRARY_BOOK, $c, $this->oRnd->getRandom(2, $cxy[$c & 1]), $this->oRnd->getRandom(2, $cxy[($c + 1) & 1]));
			} else {
				$aWalls[] = $c;
			}
		}
		$oRoom->frame(BLOCK_BAR_FLOOR, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
		foreach ($aWalls as $c) {
			$oRoom->generateCorner(BLOCK_LIBRARY_BOOK, $c, 1, $cxy[($c + 1) & 1]);
			$oRoom->generateCorner(BLOCK_LIBRARY_BOOK, $c, $cxy[$c & 1], 1);
		}
		switch ($this->oRnd->getRandom(0, 3)) {
			case 1:
				$oRoom->generateCentralPillar(BLOCK_VOID, 4, 4);
				$oRoom->generateCentralPillar(BLOCK_LIBRARY_BOOK, 3, 3);
			break;
			
			case 2:
				$oRoom->generateCentralPillar(BLOCK_VOID, 4, 4);
				$oRoom->generateCentralPillar(BLOCK_LIBRARY_BOOK, 1, 3);
				$oRoom->generateCentralPillar(BLOCK_LIBRARY_BOOK, 3, 1);
			break;
			
			case 3:
				$oRoom->generateCentralPillar(BLOCK_VOID, 4, 4);
				$oRoom->generateCentralPillar(BLOCK_WALL, 3, 3);
				$oRoom->generateCentralPillar(BLOCK_LIBRARY_BOOK, 1, 3);
				$oRoom->generateCentralPillar(BLOCK_LIBRARY_BOOK, 3, 1);
			break;
		}
		$oRoom->replace(BLOCK_VOID, BLOCK_BAR_FLOOR);
	}
}
