<?php

class LabyRoomStorage extends LabyRoomHelper {
	protected $_nHoleDensity = 50;
	
	public function generate($oRoom) {
		// la génération peu échouer (zone isolée)
		$nRec = 6; // pas plus de quelques essai
		$aHalf = array(BLOCK_STORE_FULLCRATE, BLOCK_STORE_HALFCRATE, BLOCK_STORE_WOOD, BLOCK_STORE_HALFCRATE);
		do {
			$this->generateRoom($oRoom);
			--$nRec;
			if ($nRec <= 0) {
				// si tous les essais échouent : grande pièce vide
				$oRoom->block(BLOCK_VOID, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
			}
		} while ((!$this->checkRoom($oRoom)) && $nRec > 0);
		foreach ($oRoom->searchPattern(array(
			'null' => '_',
			'default' => '?',
			BLOCK_STORE_FULLCRATE => 'X',
			BLOCK_VOID => '.'
		), array(
			'X.XXX',
			'XX.XX',
			'XXX.X',
			'XXXX.',
			'X..XX',
			'XX..X',
			'XXX..',
			'X.XX.'
		)) as $v) {
			$oRoom->setCell($v[0], $v[1], $this->oRnd->choose($aHalf));
		}
		
	}

	public function generateRoom($oRoom) {
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		$nDoors = $oRoom->getRoomData('doormask');
		$oRoom->generateDunHallway(1, $nDoors, 1);
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				if ($this->oRnd->roll100($this->_nHoleDensity)) {
					$oRoom->setCell($x, $y, BLOCK_VOID);
				}
			}
		}
		
		$oLG = new LifeGame();
		$oLG->setSize($w, $h);
		$oLG->assign($oRoom);
		$oLG->setRules(array(5, 6, 7, 8), array(0, 1, 2, 3));
		for ($x = 0; $x < 2; $x++) {
			$oLG->process();
		}
		$oRoom->generateDunHallway(1, $nDoors, 1);
		for ($y = 0; $y < $h; $y++) {
			for ($x = 0; $x < $w; $x++) {
				$bLGWall = $oLG->getCell($x, $y) !== 0;
				$bPrevWall = $oRoom->getCell($x, $y) == 1;
				$oRoom->setCell($x, $y, $bLGWall && $bPrevWall ? BLOCK_STORE_FULLCRATE : BLOCK_VOID);
			}
		}
	}
	
	public function checkRoom($oRoom) {
		$oPainter = new Painter();
		$oPainter->assign($oRoom);
		$w = $oRoom->getWidth();
		$h = $oRoom->getHeight();
		// trouver une zone libre
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				if ($oRoom->getCell($x, $y) == BLOCK_VOID) {
					$oPainter->paint($x, $y, BLOCK_VOID, 1000);
					break 2;
				}
			}
		}
		// checker s'il reste des zone vide
		//$oRoom->assign($oPainter);
		for ($y = 0; $y < $h; ++$y) {
			for ($x = 0; $x < $w; ++$x) {
				if ($oPainter->getCell($x, $y) == BLOCK_VOID) {
					return false;
				}
			}
		}
		return true;
	}
	
	
}