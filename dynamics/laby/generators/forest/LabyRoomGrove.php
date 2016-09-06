<?php
class LabyRoomGrove extends LabyRoomHelper {
	public function generate($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		for ($x = 0; $x < $w; ++$x) {
			$oRoom->setCell($this->oRnd->getRandom(0, $w - 1), $this->oRnd->getRandom(0, $h - 1), BLOCK_SOB_TYPE_1);
		}
		$oRoom->getPeri()->generateDunHallway(BLOCK_FOREST_TREE, $oRoom->getRoomData('doormask'), $w);
		return;
	}
}

