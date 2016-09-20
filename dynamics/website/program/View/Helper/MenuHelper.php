<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class MenuHelper extends O876\MVC\View\Helper {
	public function Menu($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Menu(func_get_args());
		}
		$oMenu = new Symbol(
'<div class="row">
	<nav class="col-lg-12">
		<ul>
		</ul>
	</nav>
</div>');
		$ul = $oMenu->query('ul');
		while (count($aArgs) >= 3) {
			$href = array_shift($aArgs);
			$icon = array_shift($aArgs);
			$label = array_shift($aArgs);
			$ul->append('<li><a class="btn" href="' . $href . '"><span class="icon-' . $icon . '"></span> ' . $label . '</a></li>');
		}
		return $oMenu;
	}
}
