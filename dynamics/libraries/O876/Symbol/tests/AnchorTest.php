<?php
require_once('Symbol.php');
require_once('HTML/Anchor.php');

use O876\Symbol\Symbol as Symbol;

class AnchorTest extends PHPUnit_Framework_TestCase {
	public function testInstanciable() {
		$a = new O876\Symbol\HTML\Anchor('http://127.0.0.1/index.html', 'localhost index', '__blank');
		$this->assertTrue(!!$a);
		$this->assertEquals('http://127.0.0.1/index.html', $a->href);
		$this->assertEquals('localhost index', $a[0]->getData()); // a text node
		$this->assertEquals('__blank', $a->target);
	}
}
