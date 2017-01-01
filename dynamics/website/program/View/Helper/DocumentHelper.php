<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class DocumentHelper extends O876\MVC\View\Helper {
	public function Document($aArgs) {
		if (!(func_num_args() === 1 && is_array(func_get_arg(0)))) {
			return $this->Document(func_get_args());
		}
		$oHTML = new H\HTML();
		$oHTML->appendStyleSheet(array(
			"styles/normalize.css",
			"../../externals/icomoon/icomoon.css",
			"styles/starter.css",
			"styles/custom.css"
		));
		$oHTML->setMetaValue('viewport', 'width=device-width, initial-scale=1.0, shrink-to-fit=no');
		$oHTML->appendScript(array(
			"../../libraries/O876/o2.js",
			"../../libraries/O876/Rainbow.js",
			"../../libraries/O876/ThemeGenerator.js",
			"scripts/buildTheme.js",
			"scripts/main.js"
		));
		$oHTML->append('<div class="container"></div>');

		$oBandeau = $this->getView()->Lysp($this->getView()->head);
		$oBandeau->addClass('ph-bandeau');
		$oMenu = $this->getView()->Lysp($this->getView()->menu);
		$oMenu->addClass('ph-mainmenu');
		$container = $oHTML->query('.container');
		$container->append($oBandeau);
		$container->append($oMenu);
		$container->append(
			'<div class="row">
				<section class="body col-lg-12">
				</section>
			</div>');

		$oHTML->setTitle(array_shift($aArgs));
		$md = $container->query('section.body');
		foreach ($aArgs as $sArg) {
			$md->append($sArg);
		}
		return $oHTML;
	}
}
