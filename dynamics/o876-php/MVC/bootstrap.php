<?php
use O876\MVC as M;

/**
 * Lance l'application
 * @param string $sFile fichier
 * @param string $sLocation chemin de l'arborescence contenant Controleur, Models, Vue, Plugin Helper et tout le reste
 */
function runApplication($sFile, $sLocation, $oRequest = null) {
	$oLoader = O876\Loader::getInstance ();
	$oLoader->setRoute ( 'O876\MVC', realpath(dirname(__FILE__)) );
	$oApplication = M\Application::getInstance ();
	$oApplication->setApplicationName ( $sFile, $sLocation );
	$oApplication->setConfig ( new Config () );
	if ($oRequest === null) {
		$oRequest = new O876\MVC\Request\Http();
	}
	$oApplication->setRequest ( $oRequest );
	$oApplication->main ();
}

