<?php
class LabyRoomGlade extends LabyRoomHelper {
	public function generate($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$oRoom->generatePillarForest(BLOCK_FOREST_TREE, $w - 1, $h, 1, 0, 2, 2);
		$oRoom->generateCentralPillar(BLOCK_VOID, $w, $h - 4);
		$oRoom->getPeri()->generateDunHallway(BLOCK_FOREST_TREE, $oRoom->getRoomData('doormask'), $w);
		return;
	}
}

