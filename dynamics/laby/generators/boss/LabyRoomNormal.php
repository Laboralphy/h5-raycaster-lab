<?php
class LabyRoomNormal extends LabyRoomHelper {
	
	public function generate($oRoom) {
		$oRoom->getPeri()->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), 3);
		switch ($this->oRnd->getRandom(0, 1)) {
			case 1:
				$oRoom->generateCentralPillar(BLOCK_WALL, ($oRoom->getWidth() >> 1) | 1, ($oRoom->getHeight() >> 1) | 1);
		}
	}
}
