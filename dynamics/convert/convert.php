<?php
$sJSON = file_get_contents('old/street.json');

$oJSON = json_decode($sJSON);

$aBlueprintIds = array();
$i = 0;
$oBlueprints = array();
foreach ($oJSON->tiles as $k => $v) {
	++$i;
	$aBlueprintIds[$k] = $i;
	$oBlueprints[] = array(
		'id' => $i,
		'width' => $v->width,
		'height' => $v->height,
		'image' => loadImage($v->src),
		'delay' => $v->animations[0][2],
		'frames' => $v->frames,
		'alpha50' => false,
		'noshad' => !!$v->noshading,
		'transl' => false,
		'yoyo' => false
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
	'sky' => loadImage($oJSON->background)
);

$oTiles = array(
	'walls' => array(
		'ids' => array(),
		'tiles' => loadImage($oJSON->walls->src)
	),
	'flats' => array (
		'ids' => array(),
		'tiles' => loadImage($oJSON->flats->src)
	)
);



$oMap = array();
$oBlocks = array(null);
$oBlockDic = array();
$aWallIds = array();
$aFlatIds = array();

foreach ($oJSON->map as $y => $row) {
	$oRow = array();
	foreach ($row as $x => $nLower) {
		$nUpper = $oJSON->uppermap[$y][$x];
		$oMap[$y][$x] = createBlock($nLower) | (createBlock($nUpper) << 8);
	}
}




function createBlock($nCode) {
	if ($nCode === 0) {
		return 0;
	}
	global $oJSON;
	global $oBlocks;
	global $oBlockDic;
	global $aWallIds;
	global $aFlatIds;
	if (!isset($oBlockDic[$nCode])) {
		list($nText, $nPhys, $nOffs) = convertCode($nCode);
		list($nType, $nDoorType) = convertPhys($nPhys);
		$aWall = $oJSON->walls->codes[$nText];
		$aFlat = $oJSON->flats->codes[$nText];
		$sLeft = '';
		$sRight = '';
		$sCeil = '';
		$sFloor = '';
		if (is_array($aWall)) {
			if ($aWall[1] >= 0) {
				$sLeft = 'wall_' . strval($aWall[1] + 1);
				$aWallIds[] = $sLeft;
			}
			if ($aWall[0] >= 0) {
				$sRight = 'wall_' . strval($aWall[0] + 1);
				$aWallIds[] = $sRight;
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
			'frames' => 1,
			'delay' => 80,
			'offset' => $nOffs,
			'yoyo' => false
		);
		$oBlocks[] = $block;
		$oBlockDic[$nCode] = $block['id'];
	}
	return $oBlocks[$oBlockDic[$nCode]]['id'];
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



function loadImage($s) {
	$a = file_get_contents('../../sources/city/' . $s);
	return 'data:image/png;base64,' . base64_encode($a);
}

file_put_contents('new/street.json', json_encode($aOutput));
