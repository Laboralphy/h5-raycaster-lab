<?php
use O876\MVC as M;

class ServiceTemplate {
	
	const BASE_PATH = '../templates.storage/';
	
	/**
	 * Store the given template on the file system
	 */
	public function storeTemplate($sType, $oData) {
		$sName = $oData->name;
		$sThumbnail = $oData->thumbnail;
		unset($oData->name);
		unset($oData->thumbnail);
		$sFileContent = json_encode($oData);
		$sFilePath = self::BASE_PATH . $sType . 's/' . $sName;
		mkdir($sFilePath, 0777, true);
		file_put_contents($sFilePath . '/template.json', $sFileContent);
		file_put_contents($sFilePath . '/thumbnail.png', base64_decode($sThumbnail));
		if (!file_exists($sFilePath . '/template.json')) {
			throw new Exception('could not write template file');
		}
		if (!file_exists($sFilePath . '/thumbnail.png')) {
			throw new Exception('could not write thumbnail image');
		}
	}
	
	public function deleteTemplate($sType, $sName) {
		$sFilePath = self::BASE_PATH . $sType . 's/' . $sName;
		unlink($sFilePath . '/template.json');
		unlink($sFilePath . '/thumbnail.png');
		rmdir($sFilePath);
	}

	public function listTemplates($sType) {
		$a = array();
		if (preg_match('/^[a-z]+$/', $sType)) {
			$sFilePath = self::BASE_PATH . $sType . 's/';
			foreach (scandir($sFilePath) as $sFile) {
				if (substr($sFile, 0, 1) != '.' && is_dir($sFilePath . $sFile)) {
					$a[] = $sFile;
				}
			}
		}
		return $a;
	}
}
