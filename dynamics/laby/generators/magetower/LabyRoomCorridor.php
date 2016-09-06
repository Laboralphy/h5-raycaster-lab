<?php
class LabyRoomCorridor extends LabyRoomHelper {

	public function generate($oRoom) {
		$oRoom->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), 3);
		$oRoom->getPeri()->generateDunHallway(BLOCK_WALL, $oRoom->getRoomData('doormask'), 3);
		
		if ($oRoom->getRoomData('y') == 0) {
			$oRoom->generateCrossTunnel($oRoom->getWidth() >> 1, 1, 0, 0, 0, 0, 0, 0);
			$oRoom->getPeri()->setCell($oRoom->getPeri()->getWidth() >> 1, 0, BLOCK_WINDOW);
		}
		if ($oRoom->getRoomData('x') == 0) {
			$oRoom->generateCrossTunnel(0, 0, 0, 0, 0, 0, $oRoom->getHeight() >> 1, 1);
			$oRoom->getPeri()->setCell(0, $oRoom->getPeri()->getHeight() >> 1, BLOCK_WINDOW);
		}
		if ($oRoom->getRoomData('y') == ($oRoom->getRoomData('ymax') - 1)) {
			$oRoom->generateCrossTunnel(0, 0, 0, 0, $oRoom->getWidth() >> 1, 1, 0, 0);
			$oRoom->getPeri()->setCell($oRoom->getPeri()->getWidth() >> 1, $oRoom->getPeri()->getHeight() - 1, BLOCK_WINDOW);
		}
		if ($oRoom->getRoomData('x') == ($oRoom->getRoomData('xmax') - 1)) {
			$oRoom->generateCrossTunnel(0, 0, $oRoom->getHeight() >> 1, 1, 0, 0, 0, 0);
			$oRoom->getPeri()->setCell($oRoom->getPeri()->getWidth() - 1, $oRoom->getPeri()->getHeight() >> 1, BLOCK_WINDOW);
		}
	}
}

