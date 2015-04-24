<?php
require 'laby.inc.php';

// fabriquer 10000 laby pour un générateur donné

function labyToBin($aLaby, $sFile) {
	$f = fopen($sFile, 'w');
	for ($y = 0; $y < count($aLaby); $y++) {
		for ($x = 0; $x < count($aLaby[$y]); $x++) {
			fwrite($f, chr($aLaby[$y][$x]), 1);		
		}		
	}
	fclose($f);
}

function main() {
	for ($iLaby = 0; $iLaby < 16; ++$iLaby) {
		$nSeed = $iLaby;
		$sLaby = generateLaby(getGenerator(), $nSeed)->renderJSON();
		$aLaby = json_decode($sLaby);
		labyToBin($aLaby, 'maps/laby.' . getGenerator() . '.' . dechex($nSeed) . '.bin');
		echo '.';
	}
	echo "\n";
}

main();
