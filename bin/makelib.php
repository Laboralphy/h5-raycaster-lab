#!/usr/bin/php
<?php
define('PROJECT_PATH', dirname(__FILE__));
require_once PROJECT_PATH . '/../dynamics/packer/ScriptLoader.php';
require_once PROJECT_PATH . '/../dynamics/packer/JavascriptPacker.php';
require_once PROJECT_PATH . '/../dynamics/packer/helper.php';
$pwd = getcwd();
chdir(PROJECT_PATH);
print compileScript(array(
	'load ../libraries',
	'top ../libraries/O876/Mixin/Data.js',
	'top ../libraries/O876/Mixin/Events.js',
	'top ../libraries/O876/o2.js'
));
chdir($pwd);

