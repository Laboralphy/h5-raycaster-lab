<?php
use O876\Symbol\Symbol as Symbol;

class BtnHelper extends O876\MVC\View\Helper {
	public function Btn($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Ulist(func_get_args());
		}
		$href = array_shift($aArgs);
		$data = array_shift($aArgs);
		$btn = new Symbol('<a href="' . $href . '" class="btn">' . $data . '</a>');
		return $btn;
	}
}
