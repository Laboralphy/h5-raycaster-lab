<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class RowHelper extends O876\MVC\View\Helper {
	public function Row($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Row(func_get_args());
		}
		$row = new Symbol('<div class="row"></div>');
		foreach ($aArgs as $c) {
			$row->append($c);
		}
		return $row;
	}
}
