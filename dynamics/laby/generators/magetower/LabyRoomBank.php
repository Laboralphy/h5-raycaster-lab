<?php
class LabyRoomBank extends LabyRoomHelper {

	public function generate($oRoom) {
		$oRoom->generateDunHallway(BLOCK_LIVING_WALL, $oRoom->getRoomData('doormask'), 1);
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$w2 = $w >> 1;
		$h2 = $h >> 1;
		$d = $oRoom->getRoomData('doormask');
		if (($d & 1) == 0) {
			$oRoom->generateCorner(BLOCK_VOID, 0, $w, $h2 - 1);
			$oRoom->setCell($w2, $h2 - 1, BLOCK_DOOR_JAIL);
			$oRoom->setCell($w2, $h2, BLOCK_VOID);
		}
		if (($d & 2) == 0) {
			$oRoom->generateCorner(BLOCK_VOID, 1, $w2 - 1, $h);
			$oRoom->setCell($w2 + 1, $h2, BLOCK_DOOR_JAIL);
			$oRoom->setCell($w2, $h2, BLOCK_VOID);
		}
		if (($d & 4) == 0) {
			$oRoom->generateCorner(BLOCK_VOID, 3, $w, $h2 - 1);
			$oRoom->setCell($w2, $h2 + 1, BLOCK_DOOR_JAIL);
			$oRoom->setCell($w2, $h2, BLOCK_VOID);
		}
		if (($d & 8) == 0) {
			$oRoom->generateCorner(BLOCK_VOID, 0, $w2 - 1, $h);
			$oRoom->setCell($w2 - 1, $h2, BLOCK_DOOR_JAIL);
			$oRoom->setCell($w2, $h2, BLOCK_VOID);
		}

		$i = 0;
		
		do {
			$aBars = $oRoom->searchPattern(array(
				'null' => '_',
				'default' => '?',
				BLOCK_WALL => 'X',
				BLOCK_LIVING_WALL => 'X',
				BLOCK_VOID => '.'
			), array(
				'.....',
				'X.X.X',
				'XX.X.'
			));
			
			
			if (count($aBars)) {
				list ($x, $y, $s) = $aBars[0];
				if ($s == '.....') {
					if (($x % 2 == 1) && ($y % 2 == 1)) {
						$oRoom->setCell($x, $y, BLOCK_BANK_CHEST);
					} else {
						$oRoom->setCell($x, $y, 1000);
					}
				} else {
					$oRoom->setCell($x, $y, BLOCK_BANK_HALFBAR);
				}
			}
			if (++$i > 30) {
				print_r($aBars);
				die();
			
				throw new Exception('searchPattern not ok');
			} 
			
		} while (count($aBars));
		
		$oRoom->replace(1000, BLOCK_VOID);
		
		$aChests = $oRoom->searchPattern(array(
				'null' => '_',
				'default' => '?',
				BLOCK_BANK_CHEST => 'X',
				BLOCK_VOID => '.'
		), array(
				'.X.X.',
				'..X.X'
		));
		$aChests = $this->oRnd->shuffle($aChests);
		$i = $this->oRnd->getRandom(2, 4);
		foreach ($aChests as $v) {
			$oRoom->setCell($v[0], $v[1], BLOCK_CHEST);
			if (--$i <= 0) {
				break;
			}
		}
	}
}

