<?php
require_once 'LabyRoomGlade.php';

class LabyRoomEntrance extends LabyRoomGlade {

	public function generate($oRoom) {
		$nDoor = $oRoom->getRoomData('doormask');
		$sType = $oRoom->getRoomData('type');
		$bExit = $sType == 'exit';
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$w2 = $w >> 1;
		$h2 = $h >> 1;
		switch ($nDoor) {
			case 1:
				$x = 0;
				$y = 1;
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 3, 2, 2);
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 2, 2, 2);
				break;
				
			case 2:
				$x = -1;
				$y = 0;
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 3, 2, 2);
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 0, 2, 2);
				break;
				
			case 4:
				$x = 0;
				$y = -1;
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 0, 2, 2);
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 1, 2, 2);
				break;
				
			case 8:
				$x = 1;
				$y = 0;
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 1, 2, 2);
				$oRoom->generateCorner(BLOCK_FOREST_TREE, 2, 2, 2);
				break;
		}
		$oRoom->setCell($w2 + $x, $h2 + $y, $bExit ? BLOCK_ELEVATOR_EXIT : BLOCK_ELEVATOR_ENTRANCE);
		$oRoom->setCell($w2 + 2*$x, $h2 + 2*$y, $bExit ? BLOCK_ELEVATOR_SWITCH_NEXT : BLOCK_ELEVATOR_SWITCH_PREV);
		$oRoom->setCell($w2 + 2*$x + $y, $h2 + 2*$y + $x, BLOCK_FOREST_TREE);
		$oRoom->setCell($w2 + 2*$x - $y, $h2 + 2*$y - $x, BLOCK_FOREST_TREE);
		if ($bExit) {
			$oRoom->setCell($w2 + $x + 2*$y, $h2 + $y + 2*$x, BLOCK_WALL_TORCH);
			$oRoom->setCell($w2 + $x - 2*$y, $h2 + $y - 2*$x, BLOCK_WALL_TORCH);
		}
		try {
			$oRoom->setCell($w2 + 3*$x - $y, $h2 + 3*$y - $x, BLOCK_FOREST_TREE);
			$oRoom->setCell($w2 + 3*$x + $y, $h2 + 3*$y + $x, BLOCK_FOREST_TREE);
			$oRoom->setCell($w2 + 3*$x, $h2 + 3*$y, BLOCK_FOREST_TREE);
		} catch (Exception $e) {
		}
		$oRoom->getPeri()->generateDunHallway(BLOCK_FOREST_TREE, $oRoom->getRoomData('doormask'), $w);
	}
}

