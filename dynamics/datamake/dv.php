<?php
/*
 * MONSTER DPS VIEWER
 */


class TinySQL {
	
	protected $_oCnx;
	
	/**
	 * Constructeur
	 */
	public function __construct() {
		$this->_oCnx = new SQLite3(':memory:', 0666, $sError);
		if (!$this->_oCnx) {
			throw new Exception('SQLite Error : ' . $sError);
		}
	}
	
	public function query($sQuery) {
		$xRes = $this->_oCnx->query($sQuery);
		if (is_bool($xRes)) {
			return $xRes;
		} else {
			$aResult = array();
			while($aRow = $xRes->fetchArray()) {
				$aResult[] = $aRow;
			}
			return $aResult;
		}
	}

	public function exec($sQuery) {
		$xRes = $this->_oCnx->exec($sQuery);
		if (is_bool($xRes)) {
			return $xRes;
		}
		return false;
	}
}


class CrawlerDB extends TinySQL {
	
	const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	public function __construct() {
		parent::__construct();
		$this->createDB();
		$this->loadMonsters();
		$this->loadWeapons();
		$this->loadSpells();
	}
	
	public function createDB() {
		$this->exec('create table monsters (id, width, height, thinker, vitality, speed, id_weapon)');
		$this->exec('create table weapons (id, type, speed)');
		$this->exec('create table spells (id, options)');
		$this->exec('create table weaponspells (id_weapon, id_spell, casttime)');
		$this->exec('create table spelleffects (id_spell, effect, chance)');
	}
	
	
	
	public function analysis($sFile) {
		$aData = file($sFile);
		array_shift($aData);
		$sData = '';
		$i = 0;
		foreach ($aData as $sLine) {
			$sLine = preg_replace('/(RC\.OBJECT_TYPE_[A-Z]+)/', '"$1"', $sLine);
			$sLine = preg_replace('/(ICONS\.[_A-Za-z0-9]+)/', '"$1"', $sLine);
			$sData .= trim($sLine);
		}
		$sData = '{' . trim($sData, ',;');
		$o = json_decode($sData);
		if (json_last_error() != JSON_ERROR_NONE) {
			die('json error for ' . $sData . ' in ' . $sFile);
		}
		return $o;
	}
	
	public function createMonster($sId, $w, $h, $sThinker, $nVitality, $nSpeed, $sWeapon) {
		$this->exec("insert into monsters values ('$sId', $w, $h, '$sThinker', $nVitality, $nSpeed, '$sWeapon')");
	}
	
	public function createWeapon($sId, $sType, $nSpeed, $aSpells) {
		$this->exec("insert into weapons values ('$sId', '$sType', $nSpeed)");
		foreach ($aSpells as $oSpell) {
			$sIdSpell = $oSpell->ref;
			$nCastTime = $oSpell->time;
			$this->exec("insert into weaponspells values ('$sId', '$sIdSpell', $nCastTime)");
		}
	}
	
	public function createSpell($sId, $sOptions, $aEffects, $aChances) {
		$this->exec("insert into spells values ('$sId', '$sOptions')");
		foreach ($aEffects as $i => $sEffect) {
			$nChance = $aChances[$i];
			$this->exec("insert into spelleffects values ('$sId', '$sEffect', $nChance)");
		}
	}
	
	public function loadMonsters() {
		$aMonsters = $this->analysis('../../sources/crawler/data/monsters.js');
		foreach ($aMonsters as $sMonster => $m) {
			$this->createMonster($sMonster, $m->width, $m->height, $m->thinker, $m->data->vitality, $m->data->speed, $m->data->weapon);
		}		
	}

	public function loadWeapons() {
		$aItems = $this->analysis('../../sources/crawler/data/items.js');
		foreach ($aItems as $sId => $oItem) {
			if ($oItem->type == 'wand' || $oItem->type == 'dagger') {
				$this->createWeapon($sId, $oItem->type, $oItem->speed, $oItem->spells);
			}
		}		
	}
	
	public function loadSpells() {
		$aSpells = $this->analysis('../../sources/crawler/data/spells.js');
		foreach ($aSpells as $sId => $oSpell) {
			$this->createSpell($sId, $oSpell->options, $oSpell->effects, $oSpell->chances);
		}		
	}

	
	
	public function listMonsterDPS() {
		$aList = $this->query(
		'select 
			m.id as mid, 
			w.id as wid,
			w.speed as spd,
			se.effect as f,
			se.chance as c
		from 
			monsters as m 
			inner join weapons as w on m.id_weapon = w.id
			inner join weaponspells as ws on ws.id_weapon = w.id
			inner join spelleffects as se on ws.id_spell = se.id_spell
		');
		$oList = array();
		foreach ($aList as $m) {
			$sEffect = $m['f'];
			$sEffectType = substr($sEffect, 1, 1);
			$sEffectSubType = substr($sEffect, 2, 3);
			$nEffectLevel = strpos(self::BASE64, substr($sEffect, 5, 1));
			$nEffectDur = strpos(self::BASE64, substr($sEffect, 6, 1));
			if ($sEffectType === 'x') {
				$mid = $m['mid'];
				if (!isset($oList[$mid])) {
					$oList[$mid] = array();
				}
				if (!isset($oList[$mid][$sEffectSubType])) {
					$oList[$mid][$sEffectSubType] = 0;
				}
				if ($nEffectDur === 0) {
					$oList[$mid][$sEffectSubType] += 3.5 * $nEffectLevel * (1000 / $m['spd']) * $m['c'];
				} else {
					$oList[$mid][$sEffectSubType] += $nEffectLevel * (1000 / $m['spd']) * $m['c'];
				}
			}
		}
		return $oList;
	}
	
	public function listMonsterScores() {
		$aList = $this->query(
		'select 
			m.id as mid,
			m.width as mw,
			m.vitality as mv,
			m.speed as ms,
			m.thinker as mt,
			w.speed as ws,
			(100 - m.width) * 1 +
			m.vitality * 7 +
			m.speed * 2 +
			(1000 / w.speed) * 100 as score
		from 
			monsters as m 
			inner join weapons as w on m.id_weapon = w.id
		order by
			score desc
		');
		$oList = array();
		foreach ($aList as $m) {
			$mid = $m['mid'];
			$oList[$mid] = array('score' => $m['score']);
		}
		return $oList;
	}
}

function arrayToTable($a, $sTitle = '') {
	if ($sTitle) {
		echo $sTitle . "\n" . str_pad('', strlen($sTitle), '-', STR_PAD_LEFT) . "\n";
	}
	foreach ($a as $k => $v) {
		print str_pad($k, 30, '.', STR_PAD_RIGHT);
		foreach ($v as $d => $x) {
			$x = str_pad(round($x, 2), 4, " ", STR_PAD_LEFT);
			print " $d: $x";
		}
		echo "\n";
	}
}

header('content-type: text/plain');
$oDB = new CrawlerDB();
//print_r($oDB->query('select w.id,  from weapons as w inner join spell'));
// pour un monstre : trouver les effet qu'il délivre en attaquant

// arme des mobs
arrayToTable($oDB->listMonsterDPS(), 'monsters dps');
arrayToTable($oDB->listMonsterScores(), 'monsters scores');
