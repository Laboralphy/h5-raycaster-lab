<?php
/**
 * Script compiler
 * Will concatenate all javascript located at ../../libraries, and in the present working directory
 * Provide a way to build project and store it to ../modules
 */

if (!defined('PROJECT_PATH')) {
	throw new Exception('need PROJECT_PATH define !');
}

define('RESOURCES_PATH', 'resources');
define('MODULE_PATH', '../../modules/');

require_once PROJECT_PATH . '/../../dynamics/packer/ScriptLoader.php';
require_once PROJECT_PATH . '/../../dynamics/packer/JavascriptPacker.php';
require_once PROJECT_PATH . '/../../dynamics/packer/helper.php';



/**
 * Script concatenation
 * @return string
 */
function concatScripts() {
	header('Content-type: text/javascript; charset=UTF-8');
	return compileScript(array(
		'load ../../libraries',
		'load .',
		'top ../../libraries/o2.js'
	));
}

function deploy($aArgOpt) {
	$sProject = basename(getcwd());

	// building destination directories
	print "project $sProject\n";
	
	if (!file_exists(MODULE_PATH)) {
		print "creating module directory...\n";
		mkdir(MODULE_PATH);
	}
	if (!file_exists(MODULE_PATH . $sProject)) {
		print "creating destination directory...\n";
		mkdir(MODULE_PATH . $sProject);
	}

	// copying static files
	print "copying resources...\n";
	system('cp -ruv ' . RESOURCES_PATH . ' ' . MODULE_PATH . $sProject);


	// creating one-file script
	print "packing scripts...\n";
	$aLoadScript = array(
		'load ../../libraries',
		'load .',
		'top ../../libraries/ClassMagic.js',
		'top ../../libraries/o2.js'
	);


	// option "nopack" will not use JsPacker
	if (!in_array('nopack', $aArgOpt)) {
		$aLoadScript[] = "pack";
	}

	// writing output javascript file
	file_put_contents(MODULE_PATH . $sProject . '/' . $sProject . '.js', $sOutput = compileScript($aLoadScript));


	// making index.html
	$aOutputHTML = array();
	print 'creating index.html' . "\n";


	foreach (file(PROJECT_PATH . '/index.html') as $sLine) {
		$nSpaces = strpos($sLine, '<script type="application/javascript" src="cjs.php"></script>');
		if ($nSpaces !== false) {
			// intercepting CJS
			$aOutputHTML[] = substr($sLine, 0, $nSpaces) . '<script type="text/javascript" src="' . $sProject . '.js"></script>' . "\n";
		} else {
			$aOutputHTML[] = $sLine;
		}
	}
	// writing output HTML file
	file_put_contents(MODULE_PATH . $sProject . '/index.html', implode('', $aOutputHTML));
}

function cjs() {
	global $argc, $argv;
	$PWD = getcwd();
	chdir(PROJECT_PATH);
	if (isset($argc) && $argc > 0) {
		switch ($argv[1]) {
			case 'build':
				deploy($argv);
			break;
		}
	} else {
		print concatScripts();
	}
	chdir($PWD);
}

