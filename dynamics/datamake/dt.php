<?php



/** 
 * créer un tableau avec les élément contenu dans une chaine de caractère
 * séparé par des espace ou des tab
 * @param $sLine string
 * @return array
 */
function convertLineToArray($sLine) {
	$s = trim($sLine);
	$s = strtr($s, "\t", ' ');
	while (strpos($s, '  ') !== false) {
		$s = strtr($s, array('  ' => ' '));
	}
	if ($s) {
		return explode(' ', $s);
	} else {
		return false;
	}
}

/**
 * lecture des lignes d'une table
 * @param $aLine tableau de ligne
 */
function readTable($aLines) {
	$aTable = array();
	foreach ($aLines as $sLine) {
		$aParams = convertLineToArray($sLine);
		if ($aParams > 0 && $aParams[0] != ';') {
			$aTable[] = $aParams;
		}
	}
	$aPreviousRow = array();
	$aTable2 = array();
	$aRow2 = null;
	$nLastRow = -1;
	foreach ($aTable as $n => $aRow) {
		switch ($aRow[0]) {
			case '*':
				foreach ($aRow as $nCell => $sCell) {
					if ($aRow[$nCell] != '*') {
						if (!is_array($aTable2[$nLastRow][$nCell])) {
							$aTable2[$nLastRow][$nCell] = array($aTable2[$nLastRow][$nCell]);
						}
						$aTable2[$nLastRow][$nCell][] = $sCell;
					}
				}
				break;

			default:
				$aThisRow = array();
				foreach ($aRow as $nCell => $sCell) {
					if ($sCell == '*') {
						$aThisRow[$nCell] = $aTable2[$nLastRow][$nCell];
					} else {
						$aThisRow[$nCell] = $sCell;
					}
				}
				$aTable2[] = $aThisRow;
				$nLastRow++;
				break;	
		}
	}
	return $aTable2;
}


function filterData($sFunction, $aTable) {
	$aTable3 = array();
	foreach ($aTable as $aRow) {
		$aTable3[] = call_user_func_array($sFunction, $aRow);
	}
	return $aTable3;
}

