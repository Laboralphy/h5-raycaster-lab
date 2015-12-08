<?php
/**
 * Programme de gestion de fichiers à travers des requete http
 * Permet à un client javascript de créer, supprimer, lire des fichiers sur le serveur.
 * Prévu pour une utilisation simple de sauvegarde de documents. Les fichiers sont tous cantonés à un repertoire.
 * A utiliser pour sauvegarder des documents accompagnés d'une vignette de previsualisation.
 */
define('USER_KEY', 'userkey');
define('FILES_PATH', 'files/save');
define('THUMBNAILS_PATH', 'files/thumbnails');
define('EXPORT_PATH', 'files/exports');

$POST_DATA = null;

/**
 * Renvoie le nom de fichier corrigé de manière et ne jamais sortir du chemin de base
 * @param string $sFile fichier
 * @return string
 */
function getFilename($sFile) {
	return FILES_PATH . '/' . strtr($sFile, array('./' => '__'));
}

/**
 * Renvoie le nom de fichier du thumbnail correspondant au fichier spécifié
 * @param string $sFile fichier
 * @return string
 */
function getThumbnailFilename($sFile) {
	return THUMBNAILS_PATH . '/' . strtr($sFile, array('./' => '__'));
}

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
 * Modifie les données POST
 * @param unknown $s
 */
function setPostData($s) {
	global $POST_DATA;
	$POST_DATA = $s;
}

/**
 * Enregistre un fichier (dont le contenue sera les donnée post)
 * @param string $sFile nom du fichier
 * @return int succès de l'opération
 */
function save($sFile) {
	$sData = getPostData();
	if (false === file_put_contents(getFilename($sFile), $sData)) {
		throw new Exception('could not save the file');
	} else {
		return 1;
	}
}

/**
 * Renvoie la liste des fichiers enregistrés
 * @return liste au format json 
 */
function fileList($sFormat) {
	$aFiles = array();
	foreach (scandir(FILES_PATH) as $sFile) {
		if (substr($sFile, 0, 1) != '.') {
			$sPath = FILES_PATH . '/' . $sFile;
			$aFiles[] = array($sFile, filemtime($sPath));
		}
	}
	header('content-type: application/json');
	return json_encode($aFiles);
}


/**
 * Associe un thumbnail à un fichier.
 * L'image est dans les donnée post
 * @param string $sFile nom du fichier
 */
function thumbnail($sFile) {
	$sData = getPostData();
	if (preg_match('/^data:image\\/([0-9a-z]+);base64,(.*)$/', $sData, $aRegs)) {
		$sExt = $aRegs[1];
		$sData = $aRegs[2];
		$sBinData = base64_decode($sData);
		if (false === file_put_contents(getThumbnailFilename($sFile) . '.png', $sBinData)) {
			return 0;
		} else {
			return 1;
		}
	}
	return 0;
}


function export($sFile) {
	$sData = getPostData();
	if (false === file_put_contents(EXPORT_PATH . '/' . strtr($sFile, array('./' => '__')), $sData)) {
		throw new Exception('could not save the file : ' . $sFile);
	} else {
		return 1;
	}
}

/**
 * Charge un fichier
 * @param string $sFile nom du fichier
 */
function load($sFile) {
	return file_get_contents(getFilename($sFile));
}

/**
 * Calcule un identifiant unique pour l'utilisateur connecté.
 * si le cookie "userkey" existe, on renvoie la valeur de ce cookie.
 * sinon on fabrique un nouvel identifiant unique et on le colle dans le cookie "userkey"
 * @return string (userkey)
 */
function getUserId() {
	$sId = '';
	if (isset($_COOKIE[USER_KEY])) {
		$sId = $_COOKIE[USER_KEY];
	} else {
		$sId = uniqid('', true);
		setcookie(USER_KEY, $sId);
	}
	return $sId;
}


/**
 * Exécution des commandes mono paramètre
 */
function processMonoParamCommands() {
	$aCommands = array(
		'r' => 'load',
		'w' => 'save',
		'l' => 'fileList',
		't' => 'thumbnail',
		'x' => 'export'
	);

	foreach ($aCommands as $sParam => $sFunc) {
		$sValue = getParameter($sParam);
		if ($sValue !== null) {
			echo ($sFunc($sValue));
			break; // une seule commande autorisée (sinon : conflit de l'afficage de sortie)
		}
	}
}

function main() {
	processMonoParamCommands();
}

main();
