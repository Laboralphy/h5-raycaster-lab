<?php
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\HTML as H;

class DocumentHelper extends O876\MVC\View\Helper {
	public function Document() {
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
		$container->append($this->getView()->Menu(array(
			array('href' => './', 'icon' => 'home', 'label' => 'Home'),
			array('href' => './', 'icon' => 'info', 'label' => 'About'),
			array('href' => './', 'icon' => 'list', 'label' => 'Features'),
			array('href' => './', 'icon' => 'pacman', 'label' => 'Demos'),
			array('href' => './', 'icon' => 'table2', 'label' => 'Level editor'),
			array('href' => './', 'icon' => 'github', 'label' => 'GitHub'),
			array('href' => './', 'icon' => 'youtube', 'label' => 'YouTube')
		)));
		$container->append('<div class="row">
			<section class="body col-lg-12">
			</section>
		</div>');
		return $oHTML;
	}
}
