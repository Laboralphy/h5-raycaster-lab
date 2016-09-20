<?php
use O876\MVC as M;
class IndexController extends M\Controller\Action {
	public function indexAction() {
		$p = $this->getRequest()->getParam('p');
		if (!$p) {
			$p = 'index';
		}
		$mf = M\Model\Factory::getInstance();
		$m = $mf->getModel('PageLoader');
		$this->setViewData('code', $m->load($p));
		$this->setViewData('menu', $m->load('_menu'));
		$this->setViewData('head', $m->load('_head'));
	}
}
