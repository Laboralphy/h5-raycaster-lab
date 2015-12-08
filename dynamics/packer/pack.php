<?php
require_once('JavascriptPacker.php');
require_once('helper.php');

$a = file_get_contents($argv[1]);
file_put_contents($argv[2], packScript($a));