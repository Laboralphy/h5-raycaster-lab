<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class ColHelper extends O876\MVC\View\Helper {
	public function Col($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Col(func_get_args());
		}
		$col = new Symbol('<div></div>');
		$a = explode(' ', array_shift($aArgs));
		foreach ($a as $a2) {
			$col->addClass("col-$a2");
		}
		foreach ($aArgs as $c) {
			$col->append($c);
		}
		return $col;
	}
}
