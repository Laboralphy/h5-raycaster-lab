<?php

function packScript($s, $sComp = 'Normal') {
	$oPacker = new JavaScriptPacker($s, $sComp, true, false);
	return $oPacker->pack();
}


function compileScript($f) {
	if (is_array($f)) {
		$aConfigFile = $f;
	} else {
		$aConfigFile = file($f);
	}
	$oLoader = new ScriptLoader();
	$oLoader->execute($aConfigFile);
	if ($oLoader->getOption('list') !== null) {
		$aList = array();
		foreach ($oLoader->getScriptList() as $sScript) {
			$aList[] = '<script type="text/javascript" src="' . $sScript . '"></script>';				
		}
		return implode("\n", $aList);
	}

	$s = $oLoader->loadScripts();
	$nUSize = strlen($s);

	if ($oLoader->getOption('pack') !== null) {
		$s = packScript($s, 'Normal');
	}
	if ($oLoader->getOption('verbose') !== null) {
		$nSize = strlen($s);
		if ($nSize == $nUSize) {
			$nSize = 'no compression';
		} else {
			$nSize = strval($nSize) . ' (' . strval(round($nSize * 100/ $nUSize)) . '%)';
		}
		$nCount = count($oLoader->getScriptList());
		$sFiles = implode("\n", $oLoader->getScriptList());
		$sInfo = "/*

information
-----------
file count: $nCount
uncompressed size: $nUSize
compressed size: $nSize

file list
---------
$sFiles
			
*/\n";
	} else {
		$sInfo = '';
	}
	return $sInfo . $s;

}
