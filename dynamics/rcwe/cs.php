<?php
/**
 * Script compiler
 */
require_once('../packer/ScriptLoader.php');
require_once('../packer/JavascriptPacker.php');
require_once('../packer/helper.php');

header('Content-type: text/javascript');
print compileScript(array(
	'load ../../libraries',
	'top ../../libraries/o2.js'
));
