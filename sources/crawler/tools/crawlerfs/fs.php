<?php
$bZCOMPRESS = true;

/**
 * Return a valid and secure file name
 * trivial tag replacement
 * @param $sFile filename
 * @return filename with path
 */
function getFileName($sFile) {
	$sFile = strtr($sFile, array(
		'*remote_addr' => strtr($_SERVER['REMOTE_ADDR'], '.', '_')
	));
	$sFile = strtr($sFile, '\\/.*?+', '______');
	return 'files/' . $sFile;
}

/**
 * Write data to a new file
 * Existing files are overwritten (previously writtent data is lost)
 * @param $sFile filename
 * @param $sData data to write
 */
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

/**
 * File read
 * Read content of a file
 * @param $sFile filename
 * @return content
 */
function fr($sFile) {
	$bCOMPRESS = strtolower(substr($sFile, -2)) === '.z';
	if ($bZCOMPRESS) {
		$sData = implode('', gzfile(getFileName($sFile)));
		return $sData;
	} else {
		return file_put_contents(getFileName($sFile), $sData);
	}
}

/**
 * File append
 * appends data to an existing file
 * creates a new file if the file does not exist
 * @param $sFile filename
 * @param $sData data to append
 */
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
