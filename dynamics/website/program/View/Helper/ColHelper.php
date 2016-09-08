<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class ColHelper extends O876\MVC\View\Helper {
	public function Col($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Col(func_get_args());
		}
		$col = new Symbol('<div></div>');
		foreach ($aArgs as $c) {
			$a = explode(' ', $c);
			foreach ($a as $a2) {
				$col->addClass("col-$a2");
			}
		}
		return $col;
	}
}
