<?php

require_once('Symbol.php');

use O876\Symbol\Symbol;


$oSymbol1 = new Symbol('<totos>

<toto id="1">
	<attr1>val1</attr1>
	<attr2>val2</attr2>
	<attr3>val3</attr3>
	<attr4>val4</attr4>
	<balise_vide/>
</toto>

<toto id="2">
	<attr1>val1x</attr1>
	<attr2>val2x</attr2>
	<attr3>val3y</attr3>
	<attr4>val4x</attr4>
	<balise_vide/>
</toto>

</totos>



');


$oSymbol2 = new Symbol('<totos>

	<toto id="1">
		<attr1>val1</attr1>
		
		<attr2>val2</attr2><attr3>val3</attr3>
		<attr4>val4</attr4>	
		<balise_vide/>
	</toto>

	<toto id="2">
		<attr0>val1x</attr0>
		
		<attr2>val2x</attr2>
		<attr3>val3z</attr3>
		<attr4>val4x</attr4>
		
		<balise_vide/>
	</toto>

</totos>
');


function compareSymbol($s1, $s2) {
	$t1 = $s1->getTag();
	$t2 = $s2->getTag();
	$l1 = $s1->getLine();
	$l2 = $s2->getLine();
	$c1 = $s1->getColumn();
	$c2 = $s2->getColumn();
	$d1 = $s1->getData();
	$d2 = $s2->getData();
	if ($t1 == '') {
		if ($s1->getParent()) {
			$l1 = $s1->getParent()->getLine();
			$c1 = $s1->getParent()->getColumn();
		}
	}
	if ($t2 == '') {
		if ($s2->getParent()) {
			$l2 = $s2->getParent()->getLine();
			$c2 = $s2->getParent()->getColumn();
		}
	}
	$sLines = "[$l1:$c1] -> [$l2:$c2]";
	
	// cdata
	if ($t1 == '' && $t2 == '') {
		if ($d1 != $d2) {
			print "xml cdata difference $d1 != $d2 at $sLines\n";
		}
	}
	
	// tags
	if ($t1 != $t2) {
		print "xml tag difference $t1 != $t2 at $sLines\n";
	}
	
	// attributes
	foreach ($s1->getAttributes() as $sAttr => $sVal) {
		if ($s2->$sAttr != $sVal) {
			print "xml attribute '$sAttr' difference at $sLines\n";
		}
	}
	if (count($s1) != count($s2)) {
		print "xml child count difference at $sLines\n";
	} else {
		if (count($s1) > 0) {
			foreach ($s1 as $n => $sub) {
				compareSymbol($sub, $s2[$n]);
			}
		}
	}
}


compareSymbol($oSymbol1, $oSymbol2);
