<?php
class LabyRoomShop extends LabyRoomHelper {

	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(1, $cx), max(1, $cy));
		$nDoors = $oRoom->getRoomData('doormask');
		
		$oRoom->generateDunHallway(BLOCK_WALL, $nDoors, 3);
		$oRoom->generateCentralPillar(BLOCK_WATCH_WALL, 5, 5);
		$oRoom->generateCentralPillar(BLOCK_VOID, 3, 3);
		$oRoom->generateCentralPillar(BLOCK_VOID, 1, 5);
		$oRoom->generateCentralPillar(BLOCK_VOID, 5, 1);
		
		switch ($nDoors) {
			case 1:
				$oRoom->setCell($cx, $cy + 2, BLOCK_SHOP);
				break;

			case 2:
				$oRoom->setCell($cx - 2, $cy, BLOCK_SHOP);
				break;

			case 4:
				$oRoom->setCell($cx, $cy - 2, BLOCK_SHOP);
				break;

			case 8:
				$oRoom->setCell($cx + 2, $cy, BLOCK_SHOP);
				break;

		}
	}
}
