<?php
class LabyRoomElevator extends LabyRoomHelper {
	
	public function generate($oRoom) {
		$sType = $oRoom->getRoomData('type'); // exit entrance portal
		$nDoors = $oRoom->getRoomData('doormask');
		switch ($sType) {
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
		$w2 = $oRoom->getWidth() >> 1;
		$h2 = $oRoom->getHeight() >> 1;
		$oRoom->generateCentralPillar(BLOCK_WALL, 3, 3);
		if ($nDoors & 1) {
			$nSide = 0;
			$oRoom->generateCorner(BLOCK_WALL, 2, $w2 + 1, $h2);
			$oRoom->generateCorner(BLOCK_WALL, 3, $w2, $h2);
			$oRoom->setCell($w2, $h2 - 1, $nDoorCode);
			$oRoom->setCell($w2 - 1, $h2 - 1, BLOCK_ELEVATOR_DOORWAY_X);
			$oRoom->setCell($w2 + 1, $h2 - 1, BLOCK_ELEVATOR_DOORWAY_X);
			$oRoom->setCell($w2 - 2, $h2, BLOCK_WALL);
			$oRoom->setCell($w2 + 2, $h2, BLOCK_WALL);
			$oRoom->setCell($w2, $h2 + 1, $nSwitchCode);
			$oRoom->setCell($w2 - 1, $h2, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2 + 1, $h2, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2, $h2 + 2, BLOCK_WALL);
		}
		if ($nDoors & 2) {
			$nSide = 3;
			$oRoom->generateCorner(BLOCK_WALL, 0, $w2, $h2 + 1);
			$oRoom->generateCorner(BLOCK_WALL, 3, $w2, $h2);
			$oRoom->setCell($w2 + 1, $h2, $nDoorCode);
			$oRoom->setCell($w2 + 1, $h2 - 1, BLOCK_ELEVATOR_DOORWAY_Y);
			$oRoom->setCell($w2 + 1, $h2 + 1, BLOCK_ELEVATOR_DOORWAY_Y);
			$oRoom->setCell($w2, $h2 - 2, BLOCK_WALL);
			$oRoom->setCell($w2, $h2 + 2, BLOCK_WALL);
			$oRoom->setCell($w2 - 1, $h2, $nSwitchCode);
			$oRoom->setCell($w2, $h2 - 1, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2, $h2 + 1, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2 - 2, $h2, BLOCK_WALL);
		}
		if ($nDoors & 4) {
			$nSide = 2;
			$oRoom->generateCorner(BLOCK_WALL, 1, $w2 + 1, $h2);
			$oRoom->generateCorner(BLOCK_WALL, 0, $w2, $h2);
			$oRoom->setCell($w2, $h2 + 1, $nDoorCode);
			$oRoom->setCell($w2 - 1, $h2 + 1, BLOCK_ELEVATOR_DOORWAY_X);
			$oRoom->setCell($w2 + 1, $h2 + 1, BLOCK_ELEVATOR_DOORWAY_X);
			$oRoom->setCell($w2 - 2, $h2, BLOCK_WALL);
			$oRoom->setCell($w2 + 2, $h2, BLOCK_WALL);
			$oRoom->setCell($w2, $h2 - 1, $nSwitchCode);
			$oRoom->setCell($w2 - 1, $h2, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2 + 1, $h2, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2, $h2 - 2, BLOCK_WALL);
		}
		if ($nDoors & 8) {
			$nSide = 1;
			$oRoom->generateCorner(BLOCK_WALL, 1, $w2, $h2 + 1);
			$oRoom->generateCorner(BLOCK_WALL, 2, $w2, $h2);
			$oRoom->setCell($w2 - 1, $h2, $nDoorCode);
			$oRoom->setCell($w2 - 1, $h2 + 1, BLOCK_ELEVATOR_DOORWAY_Y);
			$oRoom->setCell($w2 - 1, $h2 - 1, BLOCK_ELEVATOR_DOORWAY_Y);
			$oRoom->setCell($w2, $h2 - 2, BLOCK_WALL);
			$oRoom->setCell($w2, $h2 + 2, BLOCK_WALL);
			$oRoom->setCell($w2 + 1, $h2, $nSwitchCode);
			$oRoom->setCell($w2, $h2 - 1, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2, $h2 + 1, BLOCK_ELEVATOR_WALL);
			$oRoom->setCell($w2 + 2, $h2, BLOCK_WALL);
		}
		$oRoom->generateCentralPillar($nPillarCode, 1, 1);
	}
}
