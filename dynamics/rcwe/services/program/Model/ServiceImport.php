<?php
use O876\MVC as M;

class ServiceImport {
	
	const BASE_PATH = '../../../sources';
	
	/**
	 * Builds the level list
	 */
	public function listLevels() {
		$a = array();
		foreach (scandir(self::BASE_PATH) as $sFile) {
			if (substr($sFile, 0, 1) != '.') {
				$a[$sFile] = $this->getSourceLevels($sFile);
			}
		}
		return $a;
	}
	
	public function getSourceLevels($sSource) {
		return $this->getDirectoryLevels($sSource . '/data');
	}
	
	public function getDirectoryLevels($sDataPath) {
		$a = array();
		foreach (scandir(self::BASE_PATH . '/' . $sDataPath) as $sFile) {
			if (substr($sFile, 0, 1) != '.') {
				$sEntry = $sDataPath . '/' . $sFile;
				if (is_dir(self::BASE_PATH . '/' . $sEntry)) {
					$a = array_merge($a, $this->getDirectoryLevels($sEntry));
				} elseif (substr($sFile, -7) == '.lvl.js') {
					$a[] = $sEntry;
				}
			}
		}
		return $a;
	}
	
	public function loadResources($sBasePath, $o) {
		foreach($o as $k => $v) {
			if (is_string($v)) {
				if (preg_match('/^resources.*[0-9a-f]{32}\.png$/i', $v)) {
					$sImageData = 'data:image/png;base64,' . base64_encode(file_get_contents(self::BASE_PATH . '/' . $sBasePath . '/' . $v));
					$o->$k = $sImageData;
				}
			} elseif (is_object($v)) {
				$o->$k = $this->loadResources($sBasePath, $v);
			}
		}
		return $o;
	}
	
	public function import($sFile) {
		$aSrc = explode('/', $sFile);
		$sSource = array_shift($aSrc);
		$s = trim(file_get_contents(self::BASE_PATH . '/' . $sFile));
		$sData = trim($s, ');');
		$n = strpos($sData, '{');
		if ($n !== false) {
			$sData = substr($sData, $n);
		}
		$oLevel = $this->loadResources($sSource, json_decode($sData));
		return $this->convert($oLevel);
	}
	
	
	public function convert($oJSON) {
		function convertCode($n) {
			$nText = $n & 0xFF;
			$nPhys = ($n >> 8) & 0xFF;
			$nOffs = ($n >> 16) & 0xFF;
			return array($nText, $nPhys, $nOffs);
		}

		function convertPhys($nPhys) {
			$nType = 0;
			$nDoorType = 0;
			switch ($nPhys) {
				case 1:
					$nType = 1;
				break;
				
				case 2:
					$nType = 3;
					$nDoorType = 0;
				break;
				
				case 3:
					$nType = 3;
					$nDoorType = 5;
				break;
				
				case 4: 
					$nType = 3;
					$nDoorType = 1;
				break;

				case 6:
					$nType = 3;
					$nDoorType = 2;
				break;
				
				case 7: 
					$nType = 3;
					$nDoorType = 3;
				break;
				
				case 8: 
					$nType = 3;
					$nDoorType = 4;
				break;
				
				case 9:
					$nType = 4;
				break;
				
				case 10:
					$nType = 2;
				break;
				
				case 11:
					$nType = 6;
				break;

				case 12:
					$nType = 5;
				break;
			}
			return array($nType, $nDoorType);
		}
		$aBlueprintIds = array();
		$i = 0;
		$oBlueprints = array();
		foreach ($oJSON->blueprints as $k => $bp) {
			++$i;
			$tile = $oJSON->tiles->{$bp->tile};
			$aBlueprintIds[$k] = $i;
			$oBlueprints[] = array(
				'id' => $i,
				'width' => $tile->width,
				'height' => $tile->height,
				'image' => $tile->src,
				'delay' => $tile->animations[0][2],
				'frames' => $tile->frames,
				'alpha50' => ($bp->fx & 8) ? true : false,
				'noshad' => !!$tile->noshading,
				'transl' => ($bp->fx & 1) ? true : false,
				'yoyo' => $tile->animations[0][3] == 2
			);
		}
		$oThings = array();
		
		
		foreach ($oJSON->objects as $k => $v) {
			$oThings[] = array(
				'x' => floor($v->x * 3 / 64),
				'y' => floor($v->y * 3 / 64),
				'v' => $aBlueprintIds[$v->blueprint]
			);
		}

		/*
		"visual":{"ceilColor":{"r":136,
		"g":136,
		"b":136},
		"floorColor":{"r":102,
		"g":102,
		"b":102},
		"fogColor":{"r":0,
		"g":0,
		"b":0},
		"fogDistance":"1",
		"filter":false,
		"light":"30",
		"diffuse":"0"},
		"startpoint":{"x":224,
		"y":928,
		"angle":-1.54182},
		*/

		$oVisual = array(
			'ceil' => 'rgb(' . $oJSON->visual->ceilColor->r . ', ' . $oJSON->visual->ceilColor->g . ', ' . $oJSON->visual->ceilColor->b . ')',
			'floor' => 'rgb(' . $oJSON->visual->floorColor->r . ', ' . $oJSON->visual->floorColor->g . ', ' . $oJSON->visual->floorColor->b . ')',
			'fog' => 'rgb(' . $oJSON->visual->fogColor->r . ', ' . $oJSON->visual->fogColor->g . ', ' . $oJSON->visual->fogColor->b . ')',
			'filtr' => '#888888',
			'visib' => floor($oJSON->visual->light / 10),
			'diffu' => floor(10 * $oJSON->visual->diffuse),
			'sky' => $oJSON->background
		);

		$oTiles = array(
			'walls' => array(
				'ids' => array(),
				'tiles' => $oJSON->walls->src
			),
			'flats' => array (
				'ids' => array(),
				'tiles' => $oJSON->flats->src
			)
		);



		$oMap = array();
		$oBlocks = array(null);
		$oBlockDic = array();
		$aWallIds = array();
		$aFlatIds = array();
		
		
		$createBlock = function($nCode) use ($oJSON, &$oBlocks, &$oBlockDic, &$aWallIds, &$aFlatIds) {
			if ($nCode === 0) {
				return 0;
			}
			if (!isset($oBlockDic[$nCode])) {
				list($nText, $nPhys, $nOffs) = convertCode($nCode);
				list($nType, $nDoorType) = convertPhys($nPhys);
				$aWall = $oJSON->walls->codes[$nText];
				$aFlat = $oJSON->flats->codes[$nText];
				$sLeft = '';
				$sRight = '';
				$sCeil = '';
				$sFloor = '';
				$nFrameCount = 1;
				$nFrameDuration = 80;
				$bYoyo = false;
				if (is_array($aWall)) {
					if ($aWall[1] >= 0) {
						$sLeft = 'wall_' . strval($aWall[1] + 1);
						$aWallIds[] = $sLeft;
					}
					if ($aWall[0] >= 0) {
						$sRight = 'wall_' . strval($aWall[0] + 1);
						$aWallIds[] = $sRight;
					}
					if (count($aWall) > 2) { 
						// animation
						$nFrameCount = count($aWall) >> 1;
						// les valeurs des indices pairs devraient former
						// une suite U genre U[n+1] = U[n] + 1
						$i = 0;
						while ($i < $nFrameCount) {
							++$i;
							if ($aWall[0] != $aWall[$i << 1]) {
								break;
							}
						}
						// $i = nombre de frames identiques
						$nFrameCount = floor($nFrameCount / $i);
						$nFrameDuration = $i * 40;
						// tenter de déterminer le yoyo
						for ($i = 1; $i < count($aWalls); $i += 2) {
							if ($aWalls[$i] < $aWalls[$i - 2]) {
								$bYoyo = true;
								break;
							}
						}
					}
				}
				if (is_array($aFlat)) {
					if ($aFlat[0] >= 0) {
						$sFloor = 'flat_' . strval($aFlat[0] + 1);
						$aFlatIds[] = $sFloor;
					}
					if ($aFlat[1] >= 0) {
						$sCeil = 'flat_' . strval($aFlat[1] + 1);
						$aFlatIds[] = $sCeil;
					}
				}
				$block = array(
					'id' => count($oBlocks),
					'type' => $nType,
					'doortype' => $nDoorType,
					'left' => $sLeft,
					'right' => $sRight,
					'floor' => $sFloor,
					'ceil' => $sCeil,
					'frames' => $nFrameCount,
					'delay' => $nFrameDuration,
					'offset' => $nOffs,
					'yoyo' => $bYoyo
				);
				$oBlocks[] = $block;
				$oBlockDic[$nCode] = $block['id'];
			}
			return $oBlocks[$oBlockDic[$nCode]]['id'];
		};

		
		

		foreach ($oJSON->map as $y => $row) {
			$oRow = array();
			foreach ($row as $x => $nLower) {
				$nUpper = $oJSON->uppermap[$y][$x];
				$oMap[$y][$x] = $createBlock($nLower) | ($createBlock($nUpper) << 8);
			}
		}






		$pCompare = function($a, $b) {
			$ax = explode('_', $a);
			$bx = explode('_', $b);
			return (int) $ax[1] > (int) $bx[1];
		};

		$oStart = $oJSON->startpoint;
		$oTags = array();
		foreach($oJSON->tags as $t) {
			$oTags[] = array(
				'x' => $t->x,
				'y' => $t->y,
				'v' => $t->tag
			);
		}

		$aWallIds = array_unique($aWallIds);
		usort($aWallIds, $pCompare);
		$aFlatIds = array_unique($aFlatIds);
		usort($aFlatIds, $pCompare);

		end($aWallIds);
		$nMaxWallId = (int)explode('_', current($aWallIds))[1];
		end($aFlatIds);
		$nMaxFlatId = (int)explode('_', current($aFlatIds))[1];

		$aWallIds = array();
		$aFlatIds = array();

		for ($i = 1; $i <= $nMaxWallId; ++$i) {
			$aWallIds[] = "wall_$i";
		}
		for ($i = 1; $i <= $nMaxFlatId; ++$i) {
			$aFlatIds[] = "flat_$i";
		}

		$oTiles['walls']['ids'] = $aWallIds;
		$oTiles['flats']['ids'] = $aFlatIds;

		$aOutput = array(
			'tiles' => $oTiles,
			'blueprints' => $oBlueprints,
			'things' => $oThings,
			'visuals' => $oVisual,
			'grid' => array(
				'start' => array(
					'x' => floor($oStart->x / 64),
					'y' => floor($oStart->y / 64),
					'angle' => $oStart->angle
				),
				'map' => $oMap,
				'tags' => $oTags
			),
			'blocks' => $oBlocks
		);

		return $aOutput;
	}
}
