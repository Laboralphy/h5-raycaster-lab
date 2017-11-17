<?php

trait PleaseFilePutContents {
	public function filePutContents($sFile, $sContent) {
	    if (file_exists($sFile) && !is_writable($sFile)) {
	        throw new Exception('could not create this file : "' . basename($sFile) . '". permission denied');
        }
        file_put_contents($sFile, $sContent);
        if (!file_exists($sFile)) {
	        throw new Exception('could not create this file : "' . basename($sFile) . '". : creating file is not permitted in "' . dirname($sFile) . '"');
        }
	}
}