<?php
use O876\MVC as M;

require_once('RaycasterConverter.php');

class ServiceMWDataBuilder {	
	
	const MAPEXP_PATH = '../../../servers/mw/maps_exports';
	const WWW_PATH = '../../../servers/mw/www';
	
	
	public function exportLevel($sScript, $sName) {
		$oMF = M\Model\Factory::getInstance();
		$oFS = $oMF->getModel('ServiceFs');
		$oSG = $oMF->getModel('ServiceGame');
		$oData = json_decode($sScript);
		$sPath = self::MAPEXP_PATH . '/' . $sName;
		// prepare the folder
		if (file_exists($sPath)) {
			$oFS->rmrf($sPath);
		}
		mkdir($sPath);
		mkdir($sPath . '/data');
		mkdir($sPath . '/gfx');
		$sPrevPath = getcwd();
		chdir($sPath . '/gfx');
		// generate images
		$oData = $oSG->saveImages($oData, '/maptiles/');
		// return to previous dir
		chdir($sPrevPath);
		if (!is_writable($sPath . '/data')) {
			throw new Exception('cannot write output file (permission denied)');
		}
		file_put_contents($sPath . '/data/map.json', json_encode($oData));
		chmod($sPath . '/data/map.json', 0777);
		return $oData;
	}

	public function loadResources($sBasePath, $o) {
		foreach($o as $k => $v) {
			if (is_string($v)) {
				if (preg_match('/^\/maptiles\/[0-9a-f]{32}\.png$/i', $v)) {
					$a = explode('/', $v);
					$sImageFile = self::MAPEXP_PATH . "/$sBasePath/gfx/" . array_pop($a);
					$sImageData = 'data:image/png;base64,' . base64_encode(file_get_contents($sImageFile));
					$o->$k = $sImageData;
				}
			} elseif (is_object($v)) {
				$o->$k = $this->loadResources($sBasePath, $v);
			}
		}
		return $o;
	}
	
	public function importLevel($sFile) {
		$sData = file_get_contents(self::MAPEXP_PATH . '/' . $sFile . '/data/map.json');
		$oLevel = $this->loadResources($sFile, json_decode($sData));
		return RaycasterConverter::convert($oLevel);
	}
}
