<?php
define('PROJECT_PATH', dirname(__FILE__));
require_once PROJECT_PATH . '/../../dynamics/packer/ScriptLoader.php';
require_once PROJECT_PATH . '/../../dynamics/packer/JavascriptPacker.php';
require_once PROJECT_PATH . '/../../dynamics/packer/helper.php';

header('Content-type: text/javascript; charset=UTF-8');
print compileScript(array(
	'load ../../libraries',
	'top ../../libraries/O876/Mixin/Data.js',
	'top ../../libraries/O876/Mixin/Events.js',
	'top ../../libraries/O876/o2.js'
));
