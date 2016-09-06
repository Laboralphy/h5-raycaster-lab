<?php
class LabyRoomCorners extends LabyRoomHelper {

	const PROB_CORNER = 50;

	public function typeCorners($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(0, $cx), max(0, $cy));
		for ($c = 0; $c < 4; $c++) {
			if ($this->oRnd->roll100(self::PROB_CORNER)) {
				$oRoom->generateCorner(BLOCK_WALL, $c, $this->oRnd->getRandom(1, $cxy[$c & 1]), $this->oRnd->getRandom(1, $cxy[($c + 1) & 1]));
			}
		}
	}

	public function typeHorn($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$cxy = array(max(0, $cx), max(0, $cy));
		$c = $this->oRnd->getRandom(0, 3);
		$oRoom->generateCorner(BLOCK_WALL, $c, $this->oRnd->getRandom(1, $cxy[$c & 1]), $this->oRnd->getRandom(1, $cxy[($c + 1) & 1]));
		$oRoom->generateCentralPillar(BLOCK_WALL, $this->oRnd->getRandom(1, $cx), $this->oRnd->getRandom(1, $cy));
	}
	
	public function typeCornersAndPillar($oRoom) {
		$cx = floor($oRoom->getWidth() / 2);
		$cy = floor($oRoom->getHeight() / 2);
		$this->typeCorners($oRoom);
		$xSize = $this->oRnd->getRandom($cx >> 1, $cx);
		$ySize = $this->oRnd->getRandom($cy >> 1, $cy);
		$oRoom->generateCentralPillar(BLOCK_VOID, $xSize + 2, $ySize + 2);
		$oRoom->generateCentralPillar(BLOCK_WALL, $xSize, $ySize);
	}
	
	public function typePillar($oRoom) {
		$cx = floor($oRoom->getWidth() * 0.75);
		$cy = floor($oRoom->getHeight() * 0.75);
		$xSize = $this->oRnd->getRandom($cx >> 1, $cx);
		$ySize = $this->oRnd->getRandom($cy >> 1, $cy);
		$oRoom->generateCentralPillar(BLOCK_WALL, $xSize, $ySize);
	}

	public function typeRiggedPillar($oRoom) {
		$cx = $oRoom->getWidth();
		$cy = $oRoom->getHeight();
		$xSize = $cx - 2;
		$ySize = $cy - 2;
		$oRoom->generateCentralPillar(BLOCK_WALL, $xSize, $ySize);
		$oRoom->generatePillarForest(BLOCK_VOID, $xSize, $ySize, 1, 1, 2, 2); 
		$oRoom->generateCentralPillar(BLOCK_WALL, $xSize - 2, $ySize - 2);
	}

	public function typeForestOfPillars($oRoom) {
		$aWalls = $this->oRnd->shuffle(
			array(
				BLOCK_WALL, BLOCK_LIVING_WALL, BLOCK_LIVING_DECO, BLOCK_LIVING_DECO,
				BLOCK_WALL, BLOCK_LIVING_WALL, BLOCK_LIVING_DECO, BLOCK_LIVING_DECO,
				BLOCK_WALL, BLOCK_LIVING_WALL, BLOCK_LIVING_DECO, BLOCK_LIVING_DECO
			)
		);
		$cx = $oRoom->getWidth() - 2;
		$cy = $oRoom->getHeight() - 2;
		$oRoom->generatePillarForest($aWalls, $cx, $cy, 1, 1, 2, 2);
		$nSubType = $this->oRnd->getRandom(0, 2);
		switch ($nSubType) {
			case 1:
				$oRoom->generateCentralPillar(BLOCK_VOID, 3, 3);
			break;
			
			case 2:
				$oRoom->generateCentralPillar(BLOCK_WALL, 3, 3);
			break;
		} 
	}

	
	public function generate($oRoom) {
		switch ($this->oRnd->getRandom(0, 5)) {
			case 0:
				$this->typeCorners($oRoom);
				break;
				
			case 1:
				$this->typeCornersAndPillar($oRoom);
				break;
				
			case 2:
				$this->typeHorn($oRoom);
				break;
				
			case 3:
				$this->typePillar($oRoom);
				break;
				
			case 4:
				$this->typeForestOfPillars($oRoom);
				break;
				
			case 5:
				$this->typeRiggedPillar($oRoom);
				break;
				
		}
	}
}

