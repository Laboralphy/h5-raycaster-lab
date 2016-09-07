<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class UListHelper extends O876\MVC\View\Helper {
	public function UList($aList) {
		$ul = new Symbol('<ul></ul>');
		foreach($aList as $l) {
			$li = new Symbol('<li></li>');
			$li->append($l);
			$ul->append($li);
		}
		return $ul;
	}
}
