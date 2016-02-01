<?php
require_once('ScriptLoader.php');
require_once('JavascriptPacker.php');
require_once('helper.php');

if (preg_match('/[-_a-z0-9]+/i', isset($_GET['f']))) {
	if (isset($_GET['f'])) {
		$s = compileScript('../../sources/' . $_GET['f'] . '/load');
		header('Content-type: text/javascript');
		print $s;
	}
}
