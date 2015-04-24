<?php
class LabyRoomLiving extends LabyRoomHelper {
	
	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(1, $cx), max(1, $cy));
		$aWalls = array(0, 1, 2, 3);
		foreach ($aWalls as $c) {
			$oRoom->generateCorner(BLOCK_LIVING_WALL, $c, 1, $cxy[($c + 1) & 1]);
			$oRoom->generateCorner(BLOCK_LIVING_WALL, $c, $cxy[$c & 1], 1);
		}

		$aTiles = array(
			BLOCK_LIVING_FIREPLACE,
			BLOCK_LIVING_WALL,
			BLOCK_LIVING_WALL,
			BLOCK_LIVING_TAPESTRY,
			BLOCK_LIVING_TAPESTRY,
			BLOCK_LIVING_PICTURE,
			BLOCK_LIVING_BOOK,
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
		for ($c = 0; $c < 4; ++$c) {
			$oRoom->generateCorner(BLOCK_LIVING_WALL, $c, 1, 1);
		}
	}
}
