<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class UlistHelper extends O876\MVC\View\Helper {
	public function Ulist($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Ulist(func_get_args());
		}
		$ul = new Symbol('<ul></ul>');
		foreach($aArgs as $l) {
			$li = new Symbol('<li></li>');
			$li->append($l);
			$ul->append($li);
		}
		return $ul;
	}
}
