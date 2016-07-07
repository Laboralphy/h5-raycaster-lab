<?php
class LabyRoomJail extends LabyRoomHelper {

	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(0, $cx), max(0, $cy));
		for ($c = 0; $c < 4; $c++) {
			$cx = $this->oRnd->getRandom(2, $cxy[$c & 1]);
			$cy = $this->oRnd->getRandom(2, $cxy[($c + 1) & 1]);
			$cx2 = ($cx - 1) >> 1;
			$cy2 = ($cy - 1) >> 1;
			$oRoom->generateCorner(BLOCK_WALL, $c, $cx, $cy);
			$oRoom->generateCorner(BLOCK_VOID, $c, $cx - 1, $cy - 1);
			switch ($c) {
				case 0:
					$oRoom->setCell($cx - 1, $cy2, BLOCK_JAIL_BARS);
					$oRoom->setCell($cx2, $cy - 1, BLOCK_JAIL_DOOR);
				break;

				case 1:
					$oRoom->setCell($oRoom->getWidth() - $cx, $cy2, BLOCK_JAIL_BARS);
					$oRoom->setCell($oRoom->getWidth() - $cx2 - 1, $cy - 1, BLOCK_JAIL_DOOR);
				break;

				case 2:
					$oRoom->setCell($oRoom->getWidth() - $cx, $oRoom->getHeight() - $cy2 - 1, BLOCK_JAIL_BARS);
					$oRoom->setCell($oRoom->getWidth() - $cx2 - 1, $oRoom->getHeight() - $cy, BLOCK_JAIL_DOOR);
				break;

				case 3:
					$oRoom->setCell($cx - 1, $oRoom->getHeight() - $cy2 - 1, BLOCK_JAIL_BARS);
					$oRoom->setCell($cx2, $oRoom->getHeight() - $cy, BLOCK_JAIL_DOOR);
				break;
			}
		}
		$this->putShacklesOnWalls($oRoom);
	}
	
	public function putShacklesOnWalls($oRoom) {
		for ($y = 0; $y < $oRoom->getHeight(); $y++) {
			for ($x = 0; $x < $oRoom->getWidth(); $x++) {
				if ($oRoom->getCell($x, $y) == BLOCK_WALL) {
					if ($this->isShackable($oRoom, $x - 1, $y) && $this->isShackable($oRoom, $x + 1, $y)) {
						$oRoom->setCell($x, $y, BLOCK_JAIL_WALL_SHACKLES_Y);
					}
					if ($this->isShackable($oRoom, $x, $y - 1) && $this->isShackable($oRoom, $x, $y + 1)) {
						$oRoom->setCell($x, $y, BLOCK_JAIL_WALL_SHACKLES_X);
					}
				}
			}
		}
	}

	public function isShackable($oRoom, $x, $y) {
		if ($x < 0 || $y < 0 || $x >= $oRoom->getWidth() || $y >= $oRoom->getHeight()) {
			return true;
		}
		return $oRoom->getCell($x, $y) == BLOCK_VOID;
	}
}

