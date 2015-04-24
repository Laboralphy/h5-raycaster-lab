<?php
function getLaby($sGenerator, $nSeed) {
	$sSeed = dechex($nSeed & 1023);
	$sFile = "cache/laby.$sGenerator.$sSeed.bin";
	$f = fopen($sFile, 'r');
	fseek($f, 0, SEEK_END);
	$nSize = sqrt(ftell($f));
	rewind($f);
	$aOutput = array();
	for ($y = 0; $y < $nSize; ++$y) {
		$aRowOutput = array();
		for ($x = 0; $x < $nSize; ++$x) {
			$c = fread($f, 1);
			$aRowOutput[] = ord($c);
		}
		$aOutput[] = $aRowOutput;
	}
	fclose($f);
	return json_encode($aOutput);
}

if ($argc) {
	print getLaby($argv[1], $argv[2]);
} else {
	print getLaby($_GET['g'], $_GET['s']);
}