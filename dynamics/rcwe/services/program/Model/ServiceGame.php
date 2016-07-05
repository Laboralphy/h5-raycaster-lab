<?php
use O876\MVC as M;

require('../../packer/ScriptLoader.php');
require('../../packer/JavascriptPacker.php');

class ServiceGame {

	/**
	 * initialize the game construction
	 * the given script is a long json structure that store all game configuration data
	 * this data are good for the raycaster engine.
	 * 
	 * This method will copy all needed files into the working directory
	 * The files still need to be packed into one file in order to work
	 */
	public function buildGameArchive($sScript, $oOptions) {
		try {
			$oMF = M\Model\Factory::getInstance();
			$oFS = $oMF->getModel('ServiceFs');
			$oData = json_decode($sScript);
			
			// find the new game name
			// $sName = md5($sScript);
			$sName = $oOptions['gamename'];
			$sPath = '../server.storage/exports/work/' . $sName;
			
			// prepare the folder
			if (file_exists($sPath)) {
				$oFS->rmrf($sPath);
				mkdir($sPath);
			} else {
				mkdir($sPath, 0777, true);
			}
			
			// copy stub files
			$oFS->cpr('../games/stub/', $sPath);

			// create an id file used by other program the recognize the game name
			if ($oOptions['gamename']) {
				file_put_contents($sPath . '/gamename', $oOptions['gamename']);
			}
			
			
			// creating resources dir
			mkdir($sPath . '/resources/tiles', 0777, true);
			// go there
			$sPrevPath = getcwd();
			chdir($sPath . '/resources/tiles');
			// generate images
			$oData = $this->saveImages($oData);
			// return to previous dir
			chdir($sPrevPath);
			
			// create data file
			if (!file_exists($sPath . '/data')) {
				mkdir($sPath . '/data');
			}
			file_put_contents($sPath . '/data/world.js', 'O2.createObject(\'WORLD_DATA.level\', ' . json_encode($oData) . ');' . "\n");
			chmod($sPath . '/data/world.js', 0777);
			
			// modify index
			$sFileContent = strtr(file_get_contents($sPath . '/index.html'), array('$PROJECT' => $oOptions['gamename']));
			file_put_contents($sPath . '/index.html', $sFileContent);			

			// modify config
			$sFileContent = strtr(file_get_contents($sPath . '/config/config.js'), array(
				'$FULLSCREEN' => $oOptions['fullscreen'] ? 'true' : 'false',
				'$FPSCONTROL' => $oOptions['fpscontrol'] ? 'true' : 'false',
				'$SMOOTHTEXTURES' => $oOptions['smoothtextures'] ? 'true' : 'false'
			));
			file_put_contents($sPath . '/config/config.js', $sFileContent);			
			
			// script compilation
			$s = $this->compileScript(array(
				$oOptions['pack'] ? 'pack' : '',
				'load ../../../libraries',
				'top ../../../libraries/O876/Mixin/Data.js',
				'top ../../../libraries/O876/Mixin/Events.js',
				'top ../../../libraries/O876/o2.js'
			));
			
			file_put_contents($sPath . '/program/libraycaster.js', $s);

			// pack everything into a zip file
			mkdir('../server.storage/exports/z/', 0777, true);
			$sZipFile = '../server.storage/exports/z/' . $sName . '.zip';
			$oFS->zip($sPath, $sZipFile);
			chmod($sZipFile, 0777);
			
			return $sName;
		} catch (Exception $e) {
			return $e->getMessage();
		}
	}

	
	/**
	 * Simplifie le fichier
	 * Parcoure les donnée arborescente et lorsqu'une clé contient des data-image en base 64
	 * on génère l'image et on Enregistre l'image sous le nom de fichier qui correspond à son md5
	 * puis on remplace la clé par le nom de fichier.
	 * @param $oData données
	 * @return array même données
	 */
	public function saveImages($oData, $sFinalPath = 'resources/tiles/') {
		foreach ($oData as $k => $v) {
			if (is_string($v) && preg_match('/^data:image\\/([0-9a-z]+);base64,(.*)$/', $v, $aRegs)) {
				$sExt = $aRegs[1];
				$sData64 = $aRegs[2];
				$sBinData = base64_decode($sData64);
				$md5 = md5($sBinData);
				$sFile = $md5 . '.' . $sExt;
				file_put_contents($sFile, $sBinData);
				chmod($sFile, 0777);
				$oData->{$k} = $sFinalPath . $sFile;
			} elseif (is_object($v)) {
				$oData->{$k} = $this->saveImages($v, $sFinalPath);
			}
		}
		return $oData;
	}


	function packScript($s, $sComp = 'Normal') {
		$oPacker = new JavaScriptPacker($s, $sComp, true, false);
		return $oPacker->pack();
	}
	
	/**
	 * Compiles files
	 */
	function compileScript($f) {
		if (is_array($f)) {
			$aConfigFile = $f;
		} else {
			$aConfigFile = file($f);
		}
		$oLoader = new ScriptLoader();
		$oLoader->execute($aConfigFile);
		if ($oLoader->getOption('list') !== null) {
			$aList = array();
			foreach ($oLoader->getScriptList() as $sScript) {
				$aList[] = '<script type="text/javascript" src="' . $sScript . '"></script>';				
			}
			return implode("\n", $aList);
		}

		$s = $oLoader->loadScripts();
		$nUSize = strlen($s);

		if ($oLoader->getOption('pack') !== null) {
			$s = $this->packScript($s, 'Normal');
		}
		if ($oLoader->getOption('verbose') !== null) {
			$nSize = strlen($s);
			if ($nSize == $nUSize) {
				$nSize = 'no compression';
			} else {
				$nSize = strval($nSize) . ' (' . strval(round($nSize * 100/ $nUSize)) . '%)';
			}
			$nCount = count($oLoader->getScriptList());
			$sFiles = implode("\n", $oLoader->getScriptList());
			$sInfo = "/* file count: $nCount - uncompressed size: $nUSize - compressed size: $nSize\n * file list\n---------$sFiles\n*/\n";
		} else {
			$sInfo = '';
		}
		return $sInfo . $s;
	}
}
