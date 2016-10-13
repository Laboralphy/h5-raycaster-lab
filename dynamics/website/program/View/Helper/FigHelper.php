<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class FigHelper extends O876\MVC\View\Helper {
	public function Fig($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Fig(func_get_args());
		}
		$fig = new Symbol('<figure></figure>');
		$img = new Symbol('<img src="' . array_shift($aArgs) . '"/>');
		$cap = new Symbol('<figcaption>' . array_shift($aArgs) . '</figcaption>');
		$fig->append($img);
		$fig->append($cap);
		return $fig;
	}
}
