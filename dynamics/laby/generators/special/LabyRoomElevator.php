<?php
class LabyRoomElevator extends LabyRoomHelper {
	
	public function generate($oRoom) {
		// la case 0, 0 permet d'envoyer un code Exit
		// la case 1, 0 permet de signaler le masque de porte
		// afin de tourner la pièce dans le bon sens
		switch ($oRoom->getRoomData('type')) {
			case 'entrance':
				$nDoorCode = BLOCK_ELEVATOR_DOOR_PREV;
				$nSwitchCode = BLOCK_ELEVATOR_SWITCH_PREV;
				$nPillarCode = BLOCK_ELEVATOR_ENTRANCE;
				break;
				
			case 'exit':
				$nDoorCode = BLOCK_ELEVATOR_DOOR_NEXT_UNSEALED;
				$nSwitchCode = BLOCK_ELEVATOR_SWITCH_NEXT;
				$nPillarCode = BLOCK_ELEVATOR_EXIT;
				break;
				
			case 'portal':
				$nDoorCode = BLOCK_VOID;
				$nSwitchCode = BLOCK_ELEVATOR_SWITCH_PORTAL;
				$nPillarCode = BLOCK_ELEVATOR_PORTAL;
				break;
		}
		$nDoors = $oRoom->getRoomData('doormask');
		$w2 = $oRoom->getWidth() >> 1;
		$h2 = $oRoom->getHeight() >> 1;
		$w21 = $w2 + 1;
		$h21 = $h2 + 1;
		if ($nDoors & 1) {
			$xDir = 0;
			$yDir = 1;
			$nSideBlock = BLOCK_ELEVATOR_DOORWAY_X;
			$oRoom->generateCorner(BLOCK_WALL, 2, $w21, $h21);
			$oRoom->generateCorner(BLOCK_WALL, 3, $w21, $h21);
		}
		if ($nDoors & 2) {
			$xDir = -1;
			$yDir = 0;
			$nSideBlock = BLOCK_ELEVATOR_DOORWAY_Y;
			$oRoom->generateCorner(BLOCK_WALL, 0, $w21, $h21);
			$oRoom->generateCorner(BLOCK_WALL, 3, $w21, $h21);
		}
		if ($nDoors & 4) {
			$xDir = 0;
			$yDir = -1;
			$nSideBlock = BLOCK_ELEVATOR_DOORWAY_X;
			$oRoom->generateCorner(BLOCK_WALL, 0, $w21, $h21);
			$oRoom->generateCorner(BLOCK_WALL, 1, $w21, $h21);
		}
		if ($nDoors & 8) {
			$xDir = 1;
			$yDir = 0;
			$nSideBlock = BLOCK_ELEVATOR_DOORWAY_Y;
			$oRoom->generateCorner(BLOCK_WALL, 1, $w21, $h21);
			$oRoom->generateCorner(BLOCK_WALL, 2, $w21, $h21);
		}
		$oRoom->setCell($w2 + $xDir, $h2 + $yDir, $nPillarCode);
		$oRoom->setCell($w2 + 2*$xDir, $h2 + 2*$yDir, $nSwitchCode);
		$oRoom->setCell($w2, $h2, $nDoorCode);
		$oRoom->setCell($w2 + $yDir, $h2 + $xDir, $nSideBlock);
		$oRoom->setCell($w2 - $yDir, $h2 - $xDir, $nSideBlock);
		
		$oRoom->setCell($w2 + $yDir + $xDir, $h2 + $xDir + $yDir, BLOCK_ELEVATOR_WALL);
		$oRoom->setCell($w2 - $yDir + $xDir, $h2 - $xDir + $yDir, BLOCK_ELEVATOR_WALL);

	}
}
