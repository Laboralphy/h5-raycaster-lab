<?php
/**
 * World processor
 * Permet d'exporter les données de l'éditeur RCWE et de créer des répertoire source à destination du raycaster.
 */
define('EXPORT_PATH', 'files/exports');
$POST_DATA = null;
$PROJECT = '';
$LEVEL = '';

/**
 * Renvoie le paramètre GET spécifié
 * @param $sParam nom du paramètre
 * @return string
 */
function getParameter($sParam) {
	if (isset($_GET[$sParam])) {
		return $_GET[$sParam];
	} else {
		return null;
	}
}

/**
 * Renvoie les données POST
 * @return string
 */
function getPostData() {
	global $POST_DATA;
	if (is_null($POST_DATA)) {
		$POST_DATA = file_get_contents('php://input');
	}
	return $POST_DATA;
}


/**
 * Simplifie le fichier
 * Parcoure les donnée arborescente et lorsqu'une clé contient des data-image en base 64
 * on génère l'image et on Enregistre l'image sous le nom de fichier qui correspond à son md5
 * puis on remplace la clé par le nom de fichier.
 * @param $oData données
 * @return array même données
 */
function saveImages($oData) {
	foreach ($oData as $k => $v) {
		if (is_string($v) && preg_match('/^data:image\\/([0-9a-z]+);base64,(.*)$/', $v, $aRegs)) {
			$sExt = $aRegs[1];
			$sData64 = $aRegs[2];
			$sBinData = base64_decode($sData64);
			$md5 = md5($sBinData);
			$sFile = 'resources/gfx/textures/' . $md5 . '.' . $sExt;
			createFile($sFile, $sBinData);
			$oData->{$k} = "$sFile";
		} elseif (is_object($v)) {
			$oData->{$k} = saveImages($v);
		}
	}
	return $oData;
}

/**
 * Renvoie le chemin du projet
 * @param string $s chemin de completion
 * @return string
 */
function getProjectPath($s) {
	global $PROJECT;
	global $LEVEL;
	return '../../sources/' . $PROJECT . '/' . $s;
}

/**
 * Création d'un répertoire du projet
 * Ignore si le répertoire existe déja
 * @param string $sSubDir
 */
function createFolder($sSubDir) {
	if (file_exists(getProjectPath($sSubDir))) {
		return;
	}
	mkdir(getProjectPath($sSubDir), 0777, true);
} 

/**
 * Création d'un fichier
 * @param unknown $sFile
 * @param unknown $sContent
 */
function createFile($sFile, $sContent) {
	print "create file : $sFile\n";
	createFolder(dirname($sFile));
	file_put_contents(getProjectPath($sFile), $sContent);
	chmod(getProjectPath($sFile), 0777);
}

/**
 * Création d'un fichier de données exportées
 * @param string $sProject nom du projet
 * @param string $sLevel nom du niveau
 * @param string $sData contenu des données
 */
function exportProject($sProject, $sLevel, $sData) {
	mkdir(EXPORT_PATH . "/$sProject", 0777, true);
	$sFile = EXPORT_PATH . "/$sProject/$sLevel.js";
	file_put_contents($sFile, $sData);
	chmod($sFile, 0777);
	if (!file_exists($sFile)) {
		throw new Exception('could not save file ' . $sFile);
	}
}


function setProjectLevel($p, $l) {
	global $PROJECT;
	global $LEVEL;
	$PROJECT = $p;
	$LEVEL = $l;
}

function copyStubFile($sFile, $bOverwrite = false) {
	global $PROJECT;
	global $LEVEL;
	$s = strtr(file_get_contents('wpstub/' . $sFile), array('$PROJECT' => $PROJECT));
	if ($bOverwrite || (!file_exists(getProjectPath($sFile)))) {
		createFile($sFile, $s);
	}
}

function buildProject($aArgs) {
	$sProject = array_shift($aArgs);
	$bStructNotBuilt = true;
	while (count($aArgs)) {
		$sLevel = array_shift($aArgs);
		setProjectLevel($sProject, $sLevel);
		if ($bStructNotBuilt) {
			copyStubFile('load');
			copyStubFile('index.html');
			copyStubFile('config/config.js');
			copyStubFile('program/Game.js');
			copyStubFile('program/RCEngine.js', true);
			copyStubFile('program/main.js');
			$bStructNotBuilt = false;
		}
		$a = file_get_contents(EXPORT_PATH . "/$sProject/$sLevel.js");
		$d = json_decode($a);
		$oData = saveImages($d);
		createFile('data/' . $sLevel . '.js', "O2.createObject('WORLD_DATA.$sLevel', " . strtr(json_encode($oData), array(',' => ",\n")) . ');');
	}
}


function main($argv) {
	if (getPostData()) {
		// web export
		exportProject(getParameter('p'), getParameter('l'), getPostData());
	} elseif (!isset($argv[1])) {
		// console : no project
		print "specify project !\n";
	} else {
		// console : project
		buildProject(array_slice($argv, 1));
	}
}

main($argv);
