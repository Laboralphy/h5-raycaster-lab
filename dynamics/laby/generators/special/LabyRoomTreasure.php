<?php
class LabyRoomTreasure extends LabyRoomHelper {
	
	public function generate($oRoom) {
		// la case 0, 0 permet d'envoyer un code room type
		// la case 1, 0 permet de signaler le masque de porte
		// afin de tourner la pièce dans le bon sens
		$sRoomType = $oRoom->getRoomData('type');
		// 0: normal treasure
		// 1: dead end treasure
		// 2: final treasure
		$nDoors = $oRoom->getRoomData('doormask');
		$w2 = $oRoom->getWidth() >> 1;
		$h2 = $oRoom->getHeight() >> 1;
		switch ($sRoomType) {
			case 'deadend':
				$this->digNormal($oRoom, $nDoors);
				$this->fillDEChest($oRoom, $nDoors);
				break;
				
			case 'exit':
				$this->digFinal($oRoom, $nDoors);
				break;
				
			default:
				$this->digNormal($oRoom, $nDoors);
				$this->fillNormChest($oRoom, $nDoors);
				break;
		}
	}
	
	public function fillNormChest($oRoom, $nDoors) {
		
		switch ($this->oRnd->getRandom(1, 3)) {
			case 1:
				$a = array(BLOCK_WALL, BLOCK_TREASURE, BLOCK_WALL, BLOCK_VOID, BLOCK_WALL, BLOCK_VOID);
				break;
				
			case 2:
				$a = array(BLOCK_WALL, BLOCK_TREASURE, BLOCK_WALL, BLOCK_VOID);
				break;
				
			case 3:
				$a = array(BLOCK_WALL, BLOCK_TREASURE);
				break;
		}
		$oRoom->generateChestboard($a, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
		$oRoom->generateCentralPillar(BLOCK_VOID, $oRoom->getWidth() - 2, $oRoom->getHeight() - 2);
		
		$w2 = $oRoom->getWidth() >> 1;
		$h2 = $oRoom->getHeight() >> 1;
		
		if ($nDoors & 1) {
			$xDir = 0;
			$yDir = -1;
			$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 + $yDir * 2, $h2 + $yDir * $h2 + $xDir * 2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 - $yDir * 2, $h2 + $yDir * $h2 - $xDir * 2, BLOCK_VOID);
		}
		if ($nDoors & 2) {
			$xDir = 1;
			$yDir = 0;
			$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 + $yDir * 2, $h2 + $yDir * $h2 + $xDir * 2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 - $yDir * 2, $h2 + $yDir * $h2 - $xDir * 2, BLOCK_VOID);
		}
		if ($nDoors & 4) {
			$xDir = 0;
			$yDir = 1;
			$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 + $yDir * 2, $h2 + $yDir * $h2 + $xDir * 2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 - $yDir * 2, $h2 + $yDir * $h2 - $xDir * 2, BLOCK_VOID);
		}
		if ($nDoors & 8) {
			$xDir = -1;
			$yDir = 0;
			$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 + $yDir * 2, $h2 + $yDir * $h2 + $xDir * 2, BLOCK_VOID);
			$oRoom->setCell($w2 + $xDir * $w2 - $yDir * 2, $h2 + $yDir * $h2 - $xDir * 2, BLOCK_VOID);
		}
		
	}
	
	public function fillDEChest($oRoom, $nDoors) {
		switch ($this->oRnd->getRandom(1, 3)) {
			case 1:
				$a = array(BLOCK_WALL, BLOCK_TREASURE, BLOCK_WALL, BLOCK_VOID, BLOCK_WALL, BLOCK_VOID);
				break;
				
			case 2:
				$a = array(BLOCK_WALL, BLOCK_TREASURE, BLOCK_WALL, BLOCK_VOID);
				break;
				
			case 3:
				$a = array(BLOCK_WALL, BLOCK_TREASURE);
				break;
		}
		$oRoom->generateChestboard($a, 0, 0, $oRoom->getWidth(), $oRoom->getHeight());
		$oRoom->generateCentralPillar(BLOCK_VOID, $oRoom->getWidth() - 2, $oRoom->getHeight() - 2);
		if ($nDoors & 1) {
			$xDir = 0;
			$yDir = -1;
		}
		if ($nDoors & 2) {
			$xDir = 1;
			$yDir = 0;
		}
		if ($nDoors & 4) {
			$xDir = 0;
			$yDir = 1;
		}
		if ($nDoors & 8) {
			$xDir = -1;
			$yDir = 0;
		}
		$w2 = $oRoom->getWidth() >> 1;
		$h2 = $oRoom->getHeight() >> 1;
		
		$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_VOID);
	}
	
	public function digNormal($oRoom, $nDoors) {
		$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth(), $oRoom->getHeight(), 0, 0, 2, 2);
		$oRoom->generateCentralPillar(BLOCK_VOID, 3, 3);
	}
	
	public function digFinal($oRoom, $nDoors) {
		$oRoom->generatePillarForest(BLOCK_WALL, $oRoom->getWidth(), $oRoom->getHeight(), 0, 0, 2, 2);
		$oRoom->generateCentralPillar(BLOCK_VOID, $oRoom->getWidth() - 4, $oRoom->getHeight() - 4);
		if ($nDoors & 1) {
			$xDir = 0;
			$yDir = 1;
			$oRoom->generateCorner(BLOCK_WALL, 2, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 3, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 2, 3, 1);
			$oRoom->generateCorner(BLOCK_WALL, 3, 3, 1);
		}
		if ($nDoors & 2) {
			$xDir = -1;
			$yDir = 0;
			$oRoom->generateCorner(BLOCK_WALL, 0, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 3, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 0, 1, 3);
			$oRoom->generateCorner(BLOCK_WALL, 3, 1, 3);
		}
		if ($nDoors & 4) {
			$xDir = 0;
			$yDir = -1;
			$oRoom->generateCorner(BLOCK_WALL, 0, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 1, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 0, 3, 1);
			$oRoom->generateCorner(BLOCK_WALL, 1, 3, 1);
		}
		if ($nDoors & 8) {
			$xDir = 1;
			$yDir = 0;
			$oRoom->generateCorner(BLOCK_WALL, 1, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 2, 2, 2);
			$oRoom->generateCorner(BLOCK_WALL, 1, 1, 3);
			$oRoom->generateCorner(BLOCK_WALL, 2, 1, 3);
		}
		$w2 = $oRoom->getWidth() >> 1; 
		$h2 = $oRoom->getHeight() >> 1;
		// big chest
		$oRoom->setCell($w2 + $xDir * $w2, $h2 + $yDir * $h2, BLOCK_RELIC_CHEST);
		// normal chest
		$oRoom->setCell($w2 + $yDir * $w2, $h2 + $xDir * $h2, BLOCK_TREASURE);
		$oRoom->setCell($w2 - $yDir * $w2, $h2 - $xDir * $h2, BLOCK_TREASURE);

		$oRoom->setCell($w2 + $yDir * $w2 - 2 * $xDir, $h2 + $xDir * $h2 - 2 * $yDir, BLOCK_TREASURE);
		$oRoom->setCell($w2 - $yDir * $w2 - 2 * $xDir, $h2 - $xDir * $h2 - 2 * $yDir, BLOCK_TREASURE);

		$oRoom->setCell($w2 + $yDir * ($w2 - 1) - 3 * $xDir, $h2 + $xDir * ($h2 - 1) - 3 * $yDir, BLOCK_TREASURE);
		$oRoom->setCell($w2 - $yDir * ($w2 - 1) - 3 * $xDir, $h2 - $xDir * ($h2 - 1) - 3 * $yDir, BLOCK_TREASURE);
	}
}
