<?php
use O876\MVC as M;
class IndexController extends M\Controller\Action {
	public function indexAction() {
		$p = $this->getRequest()->getParam('p');
		$mf = M\Model\Factory::getInstance();
		$m = $mf->getModel('PageLoader');
		$sCode = $m->load($p);
		$this->setViewData('code', $m->load($p));
	}
}
