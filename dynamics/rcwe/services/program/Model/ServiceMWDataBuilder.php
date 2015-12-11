<?php
use O876\MVC as M;

class ServiceMWDataBuilder {	
	public function exportLevel($sScript, $sName) {
		$oMF = M\Model\Factory::getInstance();
		$oFS = $oMF->getModel('ServiceFs');
		$oSG = $oMF->getModel('ServiceGame');
		$oData = json_decode($sScript);
		$sPath = '../server.storage/exports/mw/' . $sName;
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
		file_put_contents($sPath . '/data/map.json', json_encode($oData));
		chmod($sPath . '/data/map.json', 0777);
		return $oData;
	}
}
