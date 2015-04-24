<?php

function createEffect($sType, $sEffect, $nLevel, $nDuration) {
	$s64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	return $sType . $sEffect . $s64[$nLevel] . $s64[$nDuration];
}


function createProperties($aTypes, $aEffects, $aLevels, $aDurations) {
	if (!is_array($aTypes)) {
		$aTypes = array($aTypes);
	}
	if (!is_array($aEffects)) {
		$aEffects = array($aEffects);
	}
	if (!is_array($aLevels)) {
		$aLevels = array($aLevels);
	}
	if (!is_array($aDurations)) {
		$aDurations = array($aDurations);
	}
	$aProperties = array();
	foreach ($aEffects as $n => $sEffect) {
		$aProperties[] = "\"" . createEffect($aTypes[$n % count($aTypes)], $sEffect, $aLevels[$n % count($aLevels)], $aDurations[$n % count($aDurations)]) ."\"";
	}
	return '[' . implode(', ', $aProperties) . ']';
}


/** 
 * Création d'une potion 
 * @param $sId identifiant
 * @param $sIcon suffixe
 */
function createPotion($sId, $sIcon, $aEffects, $aLevels, $aDurations) {
	$sProp = createProperties('b', $aEffects, $aLevels, $aDurations);
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"potion\", \"icon\": ICONS.itm_pot_$sIcon, \"stack\": 10, \"properties\": $sProp }";
}

function createRing($sId, $sIcon, $aEffects, $aLevels) {
	$sProp = createProperties('i', $aEffects, $aLevels, 63);
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"ring\", \"slot\": \"finger\", \"icon\": ICONS.itm_rng_$sIcon, \"properties\": $sProp }";
}

function createAmulet($sId, $sIcon, $aEffects, $aLevels) {
	$sProp = createProperties('i', $aEffects, $aLevels, 63);
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"ring\", \"slot\": \"neck\", \"icon\": ICONS.itm_amu_$sIcon, \"properties\": $sProp }";
}

function createEarings($sId, $sIcon, $aEffects, $aLevels) {
	$sProp = createProperties('i', $aEffects, $aLevels, 63);
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"earings\", \"slot\": \"ears\", \"icon\": ICONS.itm_ear_$sIcon, \"properties\": $sProp }";
}

function createCcc($sId, $sIcon, $aEffects, $aLevels, $aDurations) {
	$sProp = createProperties('b', $aEffects, $aLevels, $aDurations);
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"ccc\", \"icon\": ICONS.itm_ccc_$sIcon, \"stack\": 10, \"properties\": $sProp }";
}

function createMisc($sId, $sIcon, $nStack) {
	return "\"$sId\": { \"name\": \"~item_$sId\", \"type\": \"misc\", \"icon\": ICONS.itm_$sIcon, \"stack\": $nStack }";
}

function createCraft($sId, $sType, $nLevel, $aReagents, $aQuantities) {
	$a = array();
	foreach ($aReagents as $n => $sReagent) {
		$q = $aQuantities[$n];
		$a[] = "[\"$sReagent\", $q]";
	}
	$s = implode(', ', $a);
	return "\"$sId\": { \"type\": \"$sType\", \"level\": $nLevel, \"reagents\": [ $s ] }";
}




function createSpell($sId, $sBlueprint, $nCost, $sOptions, $aTypes, $aEffects, $aLevels, $aDurations, $aChances) {
	$sProp = createProperties($aTypes, $aEffects, $aLevels, $aDurations);
	if (is_array($aChances)) {
		$sChances = implode(', ', $aChances);
	} else {
		$sChances = $aChances;
	}
	return "\"$sId\": { \"blueprint\": \"$sBlueprint\", \"cost\": $nCost, \"options\": \"$sOptions\", \"effects\": $sProp, \"chances\": [ $sChances ] }";
}


function createDagger($sId, $sModel, $sIcon, $sSpell) {
	return "\"$sId\": { \"name\": \"~item_$sId\", \"slot\": \"hand\", \"type\": \"dagger\", \"model\": \"$sModel\", \"icon\": ICONS.itm_dag_$sIcon, \"speed\": 700, \"spells\": [{ \"ref\": \"$sSpell\", \"time\": 0 }] }";
}

function createWand($sId, $nSpeed, $sModel, $sIcon, $aSpells, $aTimes) {
	$aWandSpells = array();
	if (!is_array($aSpells)) {
		$aSpells = array($aSpells);
	}
	if (!is_array($aTimes)) {
		$aTimes = array($aTimes);
	}
	foreach ($aSpells as $n => $sSpell) {
		$nTime = $aTimes[$n % count($aTimes)];
		$aWandSpells[] = "{ \"ref\": \"$sSpell\", \"time\": $nTime }";
	}
	$sWandSpells = '[' . implode(', ', $aWandSpells) . ']';
	return "\"$sId\": { \"name\": \"~item_$sId\", \"slot\": \"hand\", \"type\": \"wand\", \"model\": \"$sModel\", \"icon\": ICONS.itm_wnd_$sIcon, \"speed\": $nSpeed, \"spells\": $sWandSpells }";
}


function createMonster($sId, $sTile, $w, $sThinker, $nFx, $nVitality, $nSpeed, $sWeapon, $sFlags, $aProperties, $nScore) {
	if (is_array($aProperties)) {
		$sProp = "[\"" . implode("\", \"", $aProperties) . "\"]";
	} elseif ($aProperties) {
		$sProp = "[\"$aProperties\"]";
	} else {
		$sProp = 'null';
	}
	return "\"$sId\": { \"type\": RC.OBJECT_TYPE_MOB, \"tile\": \"$sTile\", \"width\": $w, \"height\": 64, \"thinker\": \"$sThinker\", \"fx\": $nFx, \"data\": { \"vitality\": $nVitality, \"speed\": $nSpeed, \"weapon\": \"$sWeapon\", \"flags\": \"$sFlags\", \"properties\": $sProp, \"score\": $nScore } }";
}
