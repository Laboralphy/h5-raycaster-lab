<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class CardHelper extends O876\MVC\View\Helper {
	public function Card($title, $content) {
		$a = func_get_args();
		$title = array_shift($a);
		$card = new Symbol(
'<div class="card">
<h2></h2>
</div>');
		$card->query('h2')->append($title);
		foreach ($a as $s) {
			$card->append($s);
		}
		return $card;
	}
}
