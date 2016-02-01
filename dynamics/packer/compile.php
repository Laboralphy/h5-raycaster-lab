<?php
require_once('ScriptLoader.php');
require_once('JavascriptPacker.php');
require_once('helper.php');

if (isset($_GET['f']) && preg_match('/[-_a-z0-9]+/i', $_GET['f'])) {
	$sInput = $_GET['f'];
	header('Content-type: text/javascript');
	print compileScript('../../sources/' . $sInput . '/load');
}

