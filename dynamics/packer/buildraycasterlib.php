<?php
require_once('ScriptLoader.php');
require_once('JavascriptPacker.php');
require_once('helper.php');

$a = array(
	'load ../../libraries',
	'top ../../libraries/o2.js'
);

if ($argc > 0) {
	if ($argv[1] === 'pack') {
		$a[] = 'pack';
	}
}

print compileScript($a);
