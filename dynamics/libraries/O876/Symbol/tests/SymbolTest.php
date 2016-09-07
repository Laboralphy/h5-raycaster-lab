<?php
require_once('Symbol.php');

use O876\Symbol\Symbol as Symbol;
use O876\Symbol\Searcher\CSSSearcher as CSSSearcher;

class SymbolTest extends PHPUnit_Framework_TestCase {
	public function testInstanciable() {
		$a = new Symbol('tag');
		$this->assertTrue(!!$a);
	}
	
	public function testBasicLinking() {
		$a = new Symbol('a');
		$b = new Symbol('b');
		$c = new Symbol('c');
		$d = new Symbol('d');
		$a->append($b);
		$this->assertEquals(1, count($a));
		$this->assertEquals($b, $a[0]);
		$this->assertNull($a->getParent());
		$this->assertEquals($a, $b->getParent());
		$this->assertEquals($b, $a[0]);
		$this->assertNotNull($b->getParent());
		$a[0] = null;
		$this->assertNull($b->getParent());
		
		$a->append($b);
		$a->append($c);
		$a->append($d);
		$this->assertEquals(3, count($a));

		$this->assertEquals($b, $a[0]);
		$this->assertEquals($c, $a[1]);
		$this->assertEquals($d, $a[2]);

		$a[1] = null;
		$this->assertEquals($b, $a[0]);
		$this->assertEquals($d, $a[1]);

		$a[] = $c;
		$this->assertEquals($b, $a[0]);
		$this->assertEquals($d, $a[1]);
		$this->assertEquals($c, $a[2]);
	}
	
	public function testIteration() {
		$a = new Symbol('a');
		$b = new Symbol('b');
		$c = new Symbol('c');
		$d = new Symbol('d');

		$a[] = $b;
		$a[] = $c;
		$a[] = $d;
		
		$s = '';
		
		foreach ($a as $symb) {
			$s .= $symb->getTag();
		}
		
		$this->assertEquals('bcd', $s);
	}
	
	public function testIndex() {
		$a = new Symbol('a');
		$b = new Symbol('b');
		$c = new Symbol('c');
		$d = new Symbol('d');

		$a[] = $b;
		$a[] = $c;
		$a[] = $d;
		
		$this->assertEquals(0, $b->getIndex());
		$this->assertEquals(1, $c->getIndex());
		$this->assertEquals(2, $d->getIndex());
	}
	
	public function testSibling() {
		$a = new Symbol('a');
		$b = new Symbol('b');
		$c = new Symbol('c');
		$d = new Symbol('d');

		$a[] = $b;
		$a[] = $c;
		$a[] = $d;
		
		$this->assertEquals($b, $c->getPrev());
		$this->assertEquals($d, $c->getNext());
	}
	
	public function testCSSSearch() {
		$html = '<div class="id1">
			<table id="it1">
				<tbody>
					<tr class="c11 row">
						<td>
							<div class="cd00">
								<input name="smth1" />
								<input name="smth2" />
								<input name="smth3" />
							</div>
						</td>
						<td>
							<div class="cd00">
								<textarea cols="80">text...</textarea>
							</div>
						</td>
					</tr>
					<tr class="c22 row">
						<td id="x1">
							<div class="cd01">
								<input id="ii0" type="text" name="smth10" value="flic-flac-floc"/>
								<input id="ii1" type="text" name="smth20" value="tip-tap-top"/>
								<input id="ii2" type="checkbox" name="smth30" value="flic-tip-tap-top"/>
								<input id="ii3" type="submit" />
							</div>
						</td>
						<td id="x2">
							<div class="cd00">
								<textarea cols="80">text...</textarea>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>';
		$s = new Symbol();
		$s->parse($html);

		// recherche des td
		$a = $s->search(new CSSSearcher('td'));
		$this->assertEquals(4, count($a));
		$this->assertEquals('td', $a[0]->getTag());
		$this->assertEquals('td', $a[1]->getTag());

		
		$c = new CSSSearcher('tr.c22 td');
		$w = $c->getWords();
		$this->assertEquals('tr', $w[0]['word']);
		$this->assertEquals('T_TAG', $w[0]['token']);
		$this->assertEquals('c22', $w[1]['word']);
		$this->assertEquals('T_CLASS', $w[1]['token']);
		$this->assertEquals('', $w[2]['word']);
		$this->assertEquals('T_OPERATOR', $w[2]['token']);
		$this->assertEquals('td', $w[3]['word']);
		$this->assertEquals('T_TAG', $w[3]['token']);
		$this->assertEquals(4, count($w));


		$c = new CSSSearcher('tr.c22 td');
		$oSymb = $s[0][0][1][0];
		$this->assertEquals('x1', $oSymb->id);
		$this->assertEquals('td', $oSymb->getTag());
		$this->assertTrue($c->isSymbolOk($c->getWords(), $oSymb));
		
		$a = $s->search(new CSSSearcher('tr.c22 td'));
		$this->assertEquals(2, count($a));

		$a = $s->search(new CSSSearcher('tr.c22                 td'));
		$this->assertEquals(2, count($a));
		
		$a = $s->search(new CSSSearcher('tr.c22 td > div>textarea'));
		$this->assertEquals(1, count($a));
		
		$a = $s->search(new CSSSearcher('#x1 input'));
		$this->assertEquals(4, count($a));
		$this->assertEquals('ii0', $a[0]->id);
		$this->assertEquals('ii1', $a[1]->id);
		$this->assertEquals('ii2', $a[2]->id);
		$this->assertEquals('ii3', $a[3]->id);
		
		$c = new CSSSearcher('#x1 input[name]');
		$a = $s->search($c);
		$this->assertEquals(3, count($a));
		$this->assertEquals('ii0', $a[0]->id);
		$this->assertEquals('ii1', $a[1]->id);
		$this->assertEquals('ii2', $a[2]->id);
		
		$c = new CSSSearcher('#x1 input[type="text"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));
		$this->assertEquals('ii0', $a[0]->id);
		$this->assertEquals('ii1', $a[1]->id);
		
		$c = new CSSSearcher('#x1 input[type="select"]');
		$a = $s->search($c);
		$this->assertEquals(0, count($a));

		$c = new CSSSearcher('div.cd00 *');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));
		
		$c = new CSSSearcher('div.cd00 > *');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));
		
		$c = new CSSSearcher('div.cd00 >*');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));
		
		$c = new CSSSearcher('div.cd00>input');
		$a = $s->search($c);
		$this->assertEquals(3, count($a));
		
		$c = new CSSSearcher('input, div');
		$a = $s->search($c);
		$this->assertEquals(12, count($a));

		$c = new CSSSearcher('div, input');
		$a = $s->search($c);
		$this->assertEquals(12, count($a));

		$c = new CSSSearcher('div.cd00,#x1 input[type="text"]');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));

		$c = new CSSSearcher('#x1 input[type="text"],div.cd00');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));

		$c = new CSSSearcher('#x1 input[type="text"]    , div.cd00');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));

		$c = new CSSSearcher('div    , div.cd00');
		$a = $s->search($c);
		$this->assertEquals(5, count($a));
		
		$c = new CSSSearcher('*');
		$a = $s->search($c);
		$this->assertEquals(22, count($a));

		$c = new CSSSearcher('*[name]');
		$a = $s->search($c);
		$this->assertEquals(6, count($a));

		$c = new CSSSearcher('*[class~="row"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));

		$c = new CSSSearcher('*[class~="raw"]');
		$a = $s->search($c);
		$this->assertEquals(0, count($a));

		$c = new CSSSearcher('*[value|="flic"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));

		$c = new CSSSearcher('*[value|="flac"]');
		$a = $s->search($c);
		$this->assertEquals(1, count($a));

		$c = new CSSSearcher('*[value|="flac"], *[value|="flic"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));
		$this->assertEquals('ii0', $a[0]->id);
		$this->assertEquals('ii2', $a[1]->id);

		$c = new CSSSearcher('*[value|="flac"], *[value|="flic"], *[value|="top"], *[value|="tap"]');
		$a = $s->search($c);
		$this->assertEquals(3, count($a));
		$this->assertEquals('ii0', $a[0]->id);
		$this->assertEquals('ii1', $a[1]->id);
		$this->assertEquals('ii2', $a[2]->id);
		
		$c = new CSSSearcher('*[name^="smth1"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));

		$c = new CSSSearcher('*[name$="0"]');
		$a = $s->search($c);
		$this->assertEquals(3, count($a));
		
		$c = new CSSSearcher('*[value*="-tap-"]');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));
		
		$c = new CSSSearcher('input:first-child');
		$a = $s->search($c);
		$this->assertEquals(2, count($a));
	}
	
	public function testAppending() {
		$s1 = new Symbol(
		'<div class="body">
			<div id="i1">
				<span id="s1">abcdef</span>
			</div>
		</div>');
		$oFound = $s1->query('#i1')[0];
		$oFound->append('<span id="newspan">toto</span>');
		$oFound->insert('<span id="newspan2">toto22</span>', 0);
		$oNewSpan = $s1->query('#newspan')[0];
		$this->assertEquals('toto', $oNewSpan->getData());
	}
	
	public function testCData() {
		$s = new Symbol('<div>test1</div>');
		$this->assertEquals('test1', $s->getData());
		$s->append('test2');
		$this->assertEquals('test1test2', $s->getData());
		$this->assertEquals(2, count($s));
		$this->assertEquals('', $s[0]->getTag());
		$this->assertEquals('', $s[1]->getTag());
		$this->assertEquals('test1', $s[0]->getData());
		$this->assertEquals('test2', $s[1]->getData());
		$s->append('<div>test3</div>');
		$this->assertEquals(3, count($s));
		$this->assertEquals('test1test2', $s->getData());
		$this->assertEquals('test3', $s[2]->getData());
		$this->assertEquals('div', $s[2]->getTag());
	}
	
	public function testBug1() {
		$sCont = '<page>
	<meta>
		<title>Welcome</title>
		<description></description>
	</meta>
	<p>On this site, I write about things I make (mostly games and softwares).</p>
</page>
';
		$s = new Symbol($sCont);
		$this->assertEquals('Welcome', $s[0][0]->getData());
		
	}
}


