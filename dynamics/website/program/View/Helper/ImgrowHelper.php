<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class ImgrowHelper extends O876\MVC\View\Helper {
	public function Imgrow($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Imgrow(func_get_args());
		}
		$row = new Symbol('<div class="row"></div>');
		if (count($aArgs) % 2) {
			$sClass = array_shift($aArgs);
		} else {
			$sClass = 'lg-3 md-6 xs-12';
		}
		while (count($aArgs) >= 2) {
			$col = $this->Col($sClass);
			$img = array_shift($aArgs);
			$cap = array_shift($aArgs);
			$col->append($this->Fig($img, $cap));
			$row->append($col);
		}
		return $row;
	}
}
