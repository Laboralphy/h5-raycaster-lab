<?php
define('PROJECT_PATH', dirname(__FILE__));
require_once PROJECT_PATH . '/../../dynamics/packer/ScriptLoader.php';
require_once PROJECT_PATH . '/../../dynamics/packer/JavascriptPacker.php';
require_once PROJECT_PATH . '/../../dynamics/packer/helper.php';

header('Content-type: text/javascript; charset=UTF-8');
print compileScript(array(
	'load ../../libraries',
	'load scripts',
	'top scripts/classes/Window.js',
	'top ../../libraries/ClassMagic.js',
	'top ../../libraries/o2.js'
));
