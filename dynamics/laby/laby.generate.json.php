<?php
require 'laby.inc.php';


function packLaby($aLaby) {
	$aPack = array();
	foreach ($aLaby as $aRow) {
		$aPackRow = array();
		$nLast = array_shift($aRow);
		$nCount = 1;
		while (count($aRow)) {
			$nCur = array_shift($aRow);
			if ($nCur == $nLast) {
				++$nCount;
			} else {
				$aPackRow[] = $nCount;
				$aPackRow[] = $nLast;
				$nLast = $nCur;
				$nCount = 1;
			}
		}
		$aPackRow[] = $nCount;
		$aPackRow[] = $nLast;
		$aPack[] = $aPackRow;
	}
	return $aPack;
}


function unpackLaby($aLaby) {
	$aUnpack = array();
	foreach ($aLaby as $aRow) {
		$aUnpackRow = array();
		while (count($aRow)) {
			$n = array_shift($aRow);
			$c = array_shift($aRow);
			for ($i = 0; $i < $n; ++$i) {
				$aUnpackRow[] = $c;
			}
		}
		$aUnpack[] = $aUnpackRow;
	}
	return $aUnpack;
}


function main() {
	for ($iLaby = 0; $iLaby < 256; ++$iLaby) {
		$nSeed = $iLaby;
		$sLaby = generateLaby(getGenerator(), $nSeed)->renderJSON();
		$sLaby2 = json_encode(packLaby(json_decode($sLaby)));
		$sLaby3 = json_encode(unpackLaby(json_decode($sLaby2)));
		file_put_contents('maps/laby.' . getGenerator() . '.' . dechex($nSeed) . '.json', $sLaby);
		if ($sLaby != $sLaby3) {
			echo 'X';
		}
		echo '.';
	}
	echo "\n";
}

main();
