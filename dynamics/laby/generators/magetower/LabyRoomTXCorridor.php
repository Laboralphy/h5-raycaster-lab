<?php
class LabyRoomTXCorridor extends LabyRoomHelper {

	public function generate($oRoom) {
		$nWidth = 3;
		$nHeight = 3;
		$bRoom = false;
		if ($this->oRnd->roll100(50)) {
			$bRoom = true;
			$nWidth = ($oRoom->getWidth() - 2) | 1;
			$nHeight = ($oRoom->getHeight() - 2) | 1;
		}
		$oRoom->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), $nWidth);
		$oRoom->getPeri()->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), $nHeight);
		// décoration : 1 point ; un + ; un x avec des décorations
		if ($bRoom) {
			switch ($this->oRnd->getRandom(1, 4)) {
				case 1:
					$oRoom->generateCentralPillar(BLOCK_WALL, 1, 1);
				break;
				
				case 2:
					$oRoom->generateCentralPillar(BLOCK_WALL, 1, 3);
					$oRoom->generateCentralPillar(BLOCK_WALL, 3, 1);
				break;
				
				case 3:
					$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 4, $oRoom->getHeight() - 4, 2, 2, 2, 2);
				break;
					
				case 4:
					$oRoom->generateCentralPillar(BLOCK_WALL, $oRoom->getWidth() - 6, $oRoom->getHeight() - 6);
					$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth() - 4, $oRoom->getHeight() - 4, 2, 2, 2, 2);
				break;
					
			}
		}
	}
}

