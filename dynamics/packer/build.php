<?php
require_once('ScriptLoader.php');
require_once('JavascriptPacker.php');
require_once('helper.php');

define('PROJECT_PATH', '../../sources/');
define('RESOURCES_PATH', 'resources');
define('MODULE_PATH', '../../modules/');


function deploy($sProject, $aArgOpt) {
	// création répertoire
	print "project $sProject\n";
	
	if (!file_exists(MODULE_PATH)) {
		print "creating module directory...\n";
		mkdir(MODULE_PATH);
	}
	if (!file_exists(MODULE_PATH . $sProject)) {
		print "creating destination directory...\n";
		mkdir(MODULE_PATH . $sProject);
	}
	// copie des fichier ressource
	print "copying resources...\n";
	system('cp -ruv ' . PROJECT_PATH . $sProject . '/' . RESOURCES_PATH . ' ' . MODULE_PATH . $sProject);
	// création du script program
	print "packing scripts...\n";
	$aLoadScript = file("../../sources/$sProject/load");
	if (!in_array('nopack', $aArgOpt)) {
		$aLoadScript[] = "pack";
	}
	file_put_contents(MODULE_PATH . $sProject . '/' . $sProject . '.js', $sOutput = compileScript($aLoadScript));
	// préparation à la génération du fichier HTML
	$aOutputHTML = array();
	print 'copying styles.css' . "\n";
	system('cp -ru ' . PROJECT_PATH . $sProject . '/styles.css ' . MODULE_PATH . $sProject);
	print 'creating index.html' . "\n";
	foreach (file('../../sources/' . $sProject . '/index.html') as $sLine) {
		if (strpos($sLine, 'dynamics/packer/compile.php?f=' . $sProject) !== false) {
			// modifier les balises scripts
			$aOutputHTML[] = '    <script type="text/javascript" src="' . $sProject . '.js"></script>' . "\n";
		} elseif (strpos($sLine, 'build.php') !== false) {
			// ignorer une ligne qui contiendrai une référence à build.php
		} else {
			$aOutputHTML[] = $sLine;
		}
	}
	// écriture du fichier HTML
	file_put_contents(MODULE_PATH . $sProject . '/index.html', implode('', $aOutputHTML));
}

if (isset($argv[1])) {
	deploy($argv[1], array_slice($argv, 2));
} else {
	print "php -f build.php -- [project name] [options...]\n";
}
