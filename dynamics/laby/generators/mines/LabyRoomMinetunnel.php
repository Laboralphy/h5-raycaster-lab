<?php
class LabyRoomMinetunnel extends LabyRoomHelper {

	public function generate($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		if ($oRoom->getRoomData('type') !== '') {
			$oRoom->generateCentralPillar(BLOCK_WALL, $oRoom->getWidth() - 6, $oRoom->getHeight() - 6);
		} else {
			switch ($this->oRnd->getRandom(0, 1)) {
				case 0:
					$this->generateTunnelNormal($oRoom);
					break;
					
				case 1:
					$this->generateTunnelGrate($oRoom);
					break;
					
			}
		}
	}
	
	public function generateTunnelNormal($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$oRoom->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), 3);
		$oRoom->getPeri()->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), 1);
	}

	public function generateTunnelGrate($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$this->generateTunnelNormal($oRoom);

		$oRoom->generatePillarForest(BLOCK_WALL_GRATE, $w, $h, 0, 0, 2, 2);

		$oRoom->generateCorner(BLOCK_WALL, 0, ($w >> 1) - 2, ($h >> 1) - 2);
		$oRoom->generateCorner(BLOCK_WALL, 1, ($w >> 1) - 2, ($h >> 1) - 2);
		$oRoom->generateCorner(BLOCK_WALL, 2, ($w >> 1) - 2, ($h >> 1) - 2);
		$oRoom->generateCorner(BLOCK_WALL, 3, ($w >> 1) - 2, ($h >> 1) - 2);
	}
}

