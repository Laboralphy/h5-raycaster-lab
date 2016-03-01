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
		return $this->getDirectoryLevels($sSource . '/data/levels');
	}
	
	public function getDirectoryLevels($sDataPath) {
		$a = array();
		$aFiles = scandir(self::BASE_PATH . '/' . $sDataPath);
		if (is_array($aFiles)) {
			foreach (scandir(self::BASE_PATH . '/' . $sDataPath) as $sFile) {
				if (substr($sFile, 0, 1) != '.') {
					$sEntry = $sDataPath . '/' . $sFile;
					if (is_dir(self::BASE_PATH . '/' . $sEntry)) {
						$a = array_merge($a, $this->getDirectoryLevels($sEntry));
					} elseif (substr($sFile, -7) == '.lvl.js') {
						$a[] = basename($sEntry, '.lvl.js');
					}
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
	
	/**
	 * The given base 64 encoded data is an image to be save inn the resources dir
	 * @returns name of the images
	 */
	public function saveImage($sBasePath, $sData64) {
		$xData = base64_decode($sData64);
		$sName = md5($xData);
		$sRelPath = 'resources/gfx';
		$sPath = $sBasePath . '/' . $sRelPath; // mkdir($structure, 0777, true)
		if (!file_exists($sPath)) {
			mkdir($sPath, 0777, true);
		}
		file_put_contents("$sPath/$sName.png", $xData);
		return "$sRelPath/$sName.png";
	}

	public function saveResources($sBasePath, $o) {
		foreach($o as $k => $v) {
			if (is_string($v)) {
				if (preg_match('/^data:image\/png;base64,/i', $v)) {
					$sPNGData = substr($v, 22);
					$o->$k = $this->saveImage($sBasePath, $sPNGData);
				}
			} elseif (is_object($v)) {
				$o->$k = $this->saveResources($sBasePath, $v);
			}
		}
		return $o;
	}
	
	public function import($sProject, $sFile) {
		$s = trim(file_get_contents(self::BASE_PATH . "/$sProject/data/levels/$sFile.lvl.js"));
		$sData = trim($s, ');');
		$n = strpos($sData, '{');
		if ($n !== false) {
			$sData = substr($sData, $n);
		}
		$oLevel = $this->loadResources($sProject, json_decode($sData));
		return $this->convert($oLevel);
	}
	
	public function export($sProject, $sFile, $oData) {
		try {
			$oNewData = $this->saveResources(self::BASE_PATH . '/' . $sProject, $oData);
			$s = self::BASE_PATH . "/$sProject/data/levels/$sFile.lvl.js";
			if (!is_writable(dirname($s)) || (file_exists($s) && !is_writable($s))) {
				throw new Exception('Permission to write file ' . $s . ' is denied');
			}
			$sData = json_encode($oData);
			file_put_contents($s, "O2.createObject('WORLD_DATA.$sFile', $sData);");
			chmod($s, 0777);
		} catch (Exception $e) {
			throw new Exception('Could not export level ' . $sFile . ' in project ' . $sProject . ' : ' . $e->getMessage());
		}
	}


	public function convert($oJSON) {
		return RaycasterConverter::convert($oJSON);
	}
}
