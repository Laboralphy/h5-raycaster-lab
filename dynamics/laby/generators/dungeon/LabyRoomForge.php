<?php
class LabyRoomForge extends LabyRoomHelper {
	const PROB_CORNER = 77;
	public function generate($oRoom) {
		$cx = floor ( $oRoom->getWidth () / 2 );
		$cy = floor ( $oRoom->getHeight () / 2 );
		$cxy = array (
				max ( 1, $cx ),
				max ( 1, $cy ) 
		);
		$aWalls = array (
				0,
				1,
				2,
				3 
		);
		unset ( $aWalls [$this->oRnd->getRandom ( 0, count ( $aWalls ) - 1 )] );
		foreach ( $aWalls as $c ) {
			$oRoom->generateCorner ( BLOCK_FORGE_TOOLS, $c, 1, $cxy [($c + 1) & 1] );
			$oRoom->generateCorner ( BLOCK_FORGE_TOOLS, $c, $cxy [$c & 1], 1 );
			switch ($this->oRnd->getRandom ( 0, 3 )) {
				case 1 :
					$oRoom->generateCorner ( BLOCK_FORGE_ANVIL, $c, 1, 2 );
					break;
				
				case 2 :
					$oRoom->generateCorner ( BLOCK_FORGE_ANVIL, $c, 2, 1 );
					break;
				
				case 3 :
					$oRoom->generateCorner ( BLOCK_FORGE_ANVIL, $c, 1, 2 );
					$oRoom->generateCorner ( BLOCK_FORGE_ANVIL, $c, 2, 1 );
					break;
			}
			$oRoom->generateCorner ( BLOCK_WALL, $c, 1, 1 );
		}
		$oRoom->generateCentralPillar ( BLOCK_LIVING_FIREPLACE, 1, 1 );
	}
}
