<?php
class LabyRoomChurch extends LabyRoomHelper {

	const PROB_CORNER = 77;

	public function generate($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(1, $cx), max(1, $cy));
		$aWalls = array();
		for ($c = 0; $c < 4; $c++) {
			if ($this->oRnd->roll100(self::PROB_CORNER)) {
				$oRoom->generateCorner(BLOCK_CHURCH_STAINED_GLASS, $c, $this->oRnd->getRandom(2, $cxy[$c & 1]), $this->oRnd->getRandom(2, $cxy[($c + 1) & 1]));
			} else {
				$aWalls[] = $c;
			}
		}
		$oRoom->frame(BLOCK_VOID, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
		foreach ($aWalls as $c) {
			$oRoom->generateCorner(BLOCK_CHURCH_STAINED_GLASS, $c, 1, $cxy[($c + 1) & 1]);
			$oRoom->generateCorner(BLOCK_CHURCH_STAINED_GLASS, $c, $cxy[$c & 1], 1);
		}
		$w = $oRoom->getHeight() - 1;
		$h = $oRoom->getWidth() - 1;
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$nCell = $oRoom->getCell($x, $y);
				$bCellLeft = true;
				$bCellRight = true;
				$bCellTop = true;
				$bCellBottom = true;
				if ($x > 0) {
					$bCellLeft = $oRoom->getCell($x - 1, $y) == BLOCK_CHURCH_STAINED_GLASS;
				}
				if ($y > 0) {
					$bCellTop = $oRoom->getCell($x, $y - 1) == BLOCK_CHURCH_STAINED_GLASS;
				}
				if ($x < $w) {
					$bCellRight = $oRoom->getCell($x + 1, $y) == BLOCK_CHURCH_STAINED_GLASS;
				}
				if ($y < $h) {
					$bCellBottom = $oRoom->getCell($x, $y + 1) == BLOCK_CHURCH_STAINED_GLASS;
				}
				if ($nCell == BLOCK_CHURCH_STAINED_GLASS && (($bCellRight && $bCellLeft) || ($bCellTop && $bCellBottom))) {
					$oRoom->setCell($x, $y, $this->oRnd->roll100(50) ? BLOCK_CHURCH_DEATH_IDOL : BLOCK_CHURCH_RUNES);
				}
			}
		}
	}
}
