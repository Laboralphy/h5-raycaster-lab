<?php
$bZCOMPRESS = true;

function getFileName($sFile) {
	$sFile = strtr($sFile, array(
		'*remote_addr' => strtr($_SERVER['REMOTE_ADDR'], '.', '_')
	));
	$sFile = strtr($sFile, '\\/.*?+', '______');
	return 'files/' . $sFile;
}

function fw($sFile, $sData) {
	$bCOMPRESS = strtolower(substr($sFile, -2)) === '.z';
	if ($bZCOMPRESS) {
		$z = gzopen(getFileName($sFile), 'w9');
		gzwrite($z, $sData);
		gzclose($z);
	} else {
		file_put_contents(getFileName($sFile), $sData);
	}
}

function fr($sFile) {
	$bCOMPRESS = strtolower(substr($sFile, -2)) === '.z';
	if ($bZCOMPRESS) {
		$sData = implode('', gzfile(getFileName($sFile)));
		return $sData;
	} else {
		return file_put_contents(getFileName($sFile), $sData);
	}
}

function fa($sFile, $sData) {
	$bCOMPRESS = strtolower(substr($sFile, -2)) === '.z';
	if ($bZCOMPRESS) {
		fw($sFile, fr(getFileName($sFile)));
	} else {
		if ($f = fopen(getFileName($sFile), 'a')) {
			fwrite($f, $sData);
			fclose($f);
		} else {
			print 'error - IO access';
		}
	}
}
