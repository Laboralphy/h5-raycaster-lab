<?php

require_once 'dm.php';
require_once 'dt.php';


function extractColumn($aData, $nCol) {
	$aResult = array();
	foreach ($aData as $aRow) {
		$aResult[] = $aRow[$nCol];
	}
	return $aResult;
}

function getClosestString($sString, $aArray) {
	$nClosest = 1000;
	$sClosest = '';
	foreach ($aArray as $s) {
		$n = levenshtein($sString, $s);
		if ($n < $nClosest) {
			$sClosest = $s;
			$nClosest = $n;
		}
	}
	return $sClosest;
}


function readProjectTables($sProject) {
	return array(
		'potions' => readTable(file($sProject . '/potions.txt')),
		'ccc' => readTable(file($sProject . '/ccc.txt')),
		'misc' => readTable(file($sProject . '/misc.txt')),
		'amulets' => readTable(file($sProject . '/amulets.txt')),
		'rings' => readTable(file($sProject . '/rings.txt')),
		'earings' => readTable(file($sProject . '/earings.txt')),
		'spells' => readTable(file($sProject . '/spells.txt')),
		'daggers' => readTable(file($sProject . '/daggers.txt')),
		'wands' => readTable(file($sProject . '/wands.txt')),
		'monsters' => readTable(file($sProject . '/monsters.txt')),
		'craft' => readTable(file($sProject . '/craft.txt')),
	);
}

function checkSpellReference($aTable, $aSpellList, $nSpellCol, $sRefLabel) {
	$aLog = array();
	foreach ($aTable as $aItem) {
		if (is_array($aItem[$nSpellCol])) {
			foreach ($aItem[$nSpellCol] as $sSpell) {
				if (!in_array($sSpell, $aSpellList)) {
					$sLog = 'reference ' . $sRefLabel . ' not found: item "' . $aItem[0] . '" has an unknown ' . $sRefLabel . ': "' . $sSpell . '"'; 
					$sClosest = getClosestString($sSpell, $aSpellList);
					if ($sClosest) {
						$sLog .= ' - (did you mean "' . $sClosest . '" ?)';
					}
					$aLog[] = $sLog;
				}
			}
		} else {
			if (!in_array($aItem[$nSpellCol], $aSpellList)) {
				$sLog = 'reference ' . $sRefLabel . ' not found: item "' . $aItem[0] . '" has an unknown ' . $sRefLabel . ': "' . $aItem[$nSpellCol] . '"'; 
				$sClosest = getClosestString($aItem[$nSpellCol], $aSpellList);
				if ($sClosest) {
					$sLog .= ' - (did you mean "' . $sClosest . '" ?)';
				}
				$aLog[] = $sLog;
			}
		}
	}
	return $aLog;
}

function checkTablesReferences($aTables, $sProject) {
	// vérifier si les dagues font référence à des sorts valides
	$aSpellList = extractColumn($aTables['spells'], 0);
	$aDaggerList = extractColumn($aTables['daggers'], 0);
	$aWandList = extractColumn($aTables['wands'], 0);
	$aWeaponList = array_merge($aDaggerList, $aWandList);
	$aLog = array_merge(
		checkSpellReference($aTables['daggers'], $aSpellList, 3, 'spell'),
		checkSpellReference($aTables['wands'], $aSpellList, 4, 'spell'),
		checkSpellReference($aTables['monsters'], $aWeaponList, 7, 'weapon')
	);
	return $aLog;
}

function processProject($sProject) {
	$aTables = readProjectTables($sProject);
	$aLog = checkTablesReferences($aTables, $sProject);
	if (count($aLog)) {
		print implode("\n", $aLog);
		return;
	}
	$aData = array(
		'items' => array_merge(
			filterData('createPotion', $aTables['potions']),
			filterData('createCcc', $aTables['ccc']),
			filterData('createMisc', $aTables['misc']),
			filterData('createAmulet', $aTables['amulets']),
			filterData('createRing', $aTables['rings']),
			filterData('createEarings', $aTables['earings']),
			filterData('createDagger', $aTables['daggers']),
			filterData('createWand', $aTables['wands'])
		),
		'spells' => filterData('createSpell', $aTables['spells']),
		'monsters' => filterData('createMonster', $aTables['monsters']),
		'craft' => filterData('createCraft', $aTables['craft'])
	);
	print "writing: items.js\n";
	file_put_contents('items.js', 
		"var ITEMS_DATA = {\n".
		implode(",\n", $aData['items']) . "\n" .
		"};\n"
	);
	print "writing: spells.js\n";
	file_put_contents('spells.js', 
		"var SPELLS_DATA = {\n".
		implode(",\n", $aData['spells']) . "\n" .
		"};\n"
	);
	print "writing: monsters.js\n";
	file_put_contents('monsters.js', 
		"var MONSTERS_BLUEPRINTS = {\n".
		implode(",\n", $aData['monsters']) . "\n" .
		"};\n"
	);
	print "writing: craft.js\n";
	file_put_contents('craft.js', 
		"var CRAFT_DATA = {\n".
		implode(",\n", $aData['craft']) . "\n" .
		"};\n"
	);
}

if ($argc > 1) {
	processProject($argv[1]);
} else {
	print "usage : php -f {$argv[0]} -- project_name\n";
	exit(1);
}
print "\n";
exit(0);
