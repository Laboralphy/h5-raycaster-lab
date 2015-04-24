<?php
require_once 'LabyRoomGlade.php';

class LabyRoomTrack extends LabyRoomGlade {

	public function generate($oRoom) {
		parent::generate($oRoom);
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$oRoom->generateCentralPillar(BLOCK_FOREST_TREE, 1, 1);
		if ($w === 5) {
			return;
		}
		for ($y = 0; $y < 3; $y++) {
			for ($x = 0; $x < 3; $x++) {
				if ($x !== 1 && $y !== 1) {
					if (($x & 1) == ($y & 1)) {
						$oRoom->setCell(($w >> 1) - 1 + $x, ($h >> 1) - 1 + $y, BLOCK_FOREST_TREE);
					}
				}				
			}
		}
	}
}

