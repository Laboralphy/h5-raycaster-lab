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
		$oHTML->append(
'<body>
	<div class="container">
		<div class="row ph-bandeau">
			<div class="col-lg-12">
				<h1>O876 Raycaster</h1>
				<h4>A Raycasting Framework for HTML 5 Games</h4>
			</div>
		</div>
	</div>
</body>'
);
		$container = $oHTML->query('.container');
		$oMenu = $this->getView()->Menu(
			'./?p=index',		'home',		'Home',
			'./?p=about',		'info',		'About',
			'./?p=feats',		'list',		'Features',
			'./?p=demos', 		'pacman',	'Demos',
			'../rcwe/', 		'table2',	'Level editor',
			'./?p=github',		'github',	'GitHub',
			'./?p=youtube',		'youtube',	'YouTube'
		);
		$oMenu->addClass('ph-mainmenu');
		$container->append($oMenu);
		$container->append('<div class="row">
			<section class="body col-lg-12">
			</section>
		</div>');

		$md = $container->query('section.body');
		foreach ($aArgs as $sArg) {
			$md->append($sArg);
		}
		return $oHTML;
	}
}
