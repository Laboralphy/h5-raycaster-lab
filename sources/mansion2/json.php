<?php

/**
 * renvoie la liste des clés du json spécifié
 */
function jsonListKeys($data) {
	$a = array();
	if (!is_array($data)) {
		throw new Exception('invalid data');
	}
	foreach($data as $k => $v) {
		$a[] = $k;
	}
	return $a;
}


function getJSONFromFile($s) {
	if (!file_exists($s)) {
		throw new Exception('file not found : ' . $s);
	}
	return json_decode(file_get_contents($s));
}


function printList($a) {
	foreach($a as $s) {
		print $s . "\n";
	}
}

function printObj($a) {
	print json_encode($a, JSON_PRETTY_PRINT) . "\n";
}


function main($aParams) {
	switch ($aParams[1]) {
		case 'list':
			printList(jsonListKeys(getJSONFromFile($aParams[2])));
		break;

		case 'show':
			if (count($aParams) > 3) {
				printObj(getJSONFromFile($aParams[2])->{$aParams[3]});
			} else {
				printObj(getJSONFromFile($aParams[2]));
			}
		break;
		
		case 'extract':
			$a = getJSONFromFile($aParams[2])->{$aParams[3]};
			file_put_contents($aParams[4], json_encode($a));
		break;
	}
}



main($argv);
