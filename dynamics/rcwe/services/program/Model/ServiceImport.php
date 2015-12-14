<?php
use O876\MVC as M;

require_once('RaycasterConverter.php');

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
				} elseif (preg_match('/^resources.*\.png$/i', $v)) {
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
		return RaycasterConverter::convert($oJSON);
	}
}
