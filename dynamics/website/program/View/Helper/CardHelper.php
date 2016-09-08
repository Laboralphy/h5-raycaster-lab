<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class CardHelper extends O876\MVC\View\Helper {
	public function Card($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Card(func_get_args());
		}
		$card = new Symbol('<div class="card"></div>');
		if (count($aArgs) > 1) {
			$title = array_shift($aArgs);
			$card->append('<h2>' . $title . '</h2>');
		}
		foreach ($aArgs as $s) {
			$card->append($s);
		}
		return $card;
	}
}
