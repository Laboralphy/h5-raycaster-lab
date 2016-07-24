<?php
use O876\MVC as M;

class ServiceTemplate {
	
	const BASE_PATH = '../server.storage/templates/';
	
	protected function _checkPermissions($s) {
		$sDir = self::BASE_PATH;
		if ($s) {
			$sDir .= '/' . $s;
		}
		if (!file_exists($sDir)) {
			if (!mkdir($sDir, 0777, true)) {
				throw new Exception('could not create template directory, please check permissions');
			}
		}
		$a = array();
		if (!is_readable(self::BASE_PATH)) {
			$a[] = 'reading';
		}
		if (!is_writable($sDir)) {
			$a[] = 'writing';
		}
		if (count($a)) {
			throw new Exception(implode(' and ', $a). ' permission denied');
		}
	}

	
	/**
	 * Store the given template on the file system
	 */
	public function storeTemplate($sType, $oData) {
		$this->_checkPermissions($sType . 's');
		$sName = $oData->name;
		$sThumbnail = $oData->thumbnail;
		unset($oData->name);
		unset($oData->thumbnail);
		$sFileContent = json_encode($oData);
		$sFilePath = self::BASE_PATH . $sType . 's/' . $sName;
		if (!file_exists($sFilePath)) {
			mkdir($sFilePath, 0777, true);
		}
		file_put_contents($sFilePath . '/template.json', $sFileContent);
		if ($sThumbnail) {
			file_put_contents($sFilePath . '/thumbnail.png', base64_decode($sThumbnail));
		}
		if (!file_exists($sFilePath . '/template.json')) {
			throw new Exception('could not write template file');
		}
	}
	
	public function deleteTemplate($sType, $sName) {
		$this->_checkPermissions($sType . 's');
		$sFilePath = self::BASE_PATH . $sType . 's/' . $sName;
		unlink($sFilePath . '/template.json');
		unlink($sFilePath . '/thumbnail.png');
		rmdir($sFilePath);
	}

	public function listTemplates($sType) {
		$this->_checkPermissions($sType . 's');
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
