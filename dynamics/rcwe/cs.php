<?php
/**
 * Compilateur de scripts
 * Charge le fichier load contenant les directive de chargement
 */
require_once('../packer/ScriptLoader.php');
require_once('../packer/class.JavaScriptPacker.php');
require_once('../packer/helper.php');

$s = compileScript('load');
header('Content-type: text/javascript');
print $s;
