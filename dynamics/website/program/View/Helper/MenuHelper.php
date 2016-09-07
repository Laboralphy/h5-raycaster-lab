<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class MenuHelper extends O876\MVC\View\Helper {
	public function Menu($aOptions) {
		$oMenu = new Symbol(
'<div class="row">
	<nav class="col-lg-12">
		<ul>
		</ul>
	</nav>
</div>');
		$oMenu->addClass('ph-mainmenu');
		$ul = $oMenu->query('ul');
		foreach($aOptions as $v) {
			$ul->append('<li><a class="btn" href="' . $v['href'] . '"><span class="icon-' . $v['icon'] . '"></span> ' . $v['label'] . '</a></li>');
		}
		return $oMenu;
	}
}
