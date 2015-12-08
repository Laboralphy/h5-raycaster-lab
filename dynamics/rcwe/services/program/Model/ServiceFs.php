<?php
use O876\MVC as M;

class ServiceFs {
	
	/**
	 * Will enumerate all regular files recursively inside a directory
	 * Will call a callback function for each files found
	 * Will not enumerate folders
	 */
	public function findFiles($sDir, $pCallback) {
		$aFiles = scandir($sDir);
		foreach ($aFiles as $sFile) {
			if ($sFile !== '.' && $sFile !== '..') {
				if (is_dir($sDir . '/' . $sFile)) {
					$this->findFiles($sDir . '/' . $sFile, $pCallback);
				} else {
					$pCallback($sDir . '/' . $sFile);
				}
			}
		}
	}

	/**
	 * Will enumerate all folders recursively inside a directory
	 * Will call a callback function for each folders found
	 * Will not enumerate files other than folders
	 * if param bCallbackFirst is true, the callback will be called prior to 
	 * subsequent recursive calls
	 */
	public function findFolders($sDir, $pCallback, $bCallbackFirst = false) {
		$aFiles = scandir($sDir);
		foreach ($aFiles as $sFile) {
			if ($sFile !== '.' && $sFile !== '..') {
				if (is_dir($sDir . '/' . $sFile)) {
					if ($bCallbackFirst) {
						$pCallback($sDir . '/' . $sFile);
						$this->findFolders($sDir . '/' . $sFile, $pCallback, $bCallbackFirst);
					} else {
						$this->findFolders($sDir . '/' . $sFile, $pCallback, $bCallbackFirst);
						$pCallback($sDir . '/' . $sFile);
					}
				}
			}
		}
	}
	
	/**
	 * Will erase a folder and anything inside
	 */
	public function rmrf($sDir) {
		$this->findFiles($sDir, function($s) {
			unlink($s);
		});
		$this->findFolders($sDir, function($s) {
			rmdir($s);
		}, false);
		rmdir($sDir);
	}
		
	/**
	 * Will do a recursive copy
	 */
	public function cpr($sDirSrc, $sDirDest) {
		if (substr($sDirSrc, -1) === '/') {
			$sDirSrc = substr($sDirSrc, 0, -1);
		}
		if (substr($sDirDest, -1) === '/') {
			$sDirDest = substr($sDirDest, 0, -1);
		}
		$this->findFolders($sDirSrc, function($s) use($sDirSrc, $sDirDest) {
			$sDestFile = $sDirDest . substr($s, strlen($sDirSrc));
			if (!file_exists($sDestFile)) {
				mkdir($sDestFile, 0777, true);
			}
		}, true);
		$this->findFiles($sDirSrc, function($s) use($sDirSrc, $sDirDest) {
			$sDestFile = $sDirDest . substr($s, strlen($sDirSrc));
			copy($s, $sDestFile);
		});
	}
	
	public function zip($sDirSrc, $sZipFilename) {
		$zip = new ZipArchive();
		if ($zip->open($sZipFilename, ZipArchive::OVERWRITE) !== true) {
			throw new Exception('cannot create zip file ' . $sZipFilename);
		}
		$this->findFiles($sDirSrc, function($s) use($zip, $sDirSrc) {
			$sDestFile = substr($s, strlen($sDirSrc));
			$zip->addFromString($sDestFile, file_get_contents($s));
		});
		$zip->close();
	}
}
