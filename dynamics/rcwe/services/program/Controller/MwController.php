<?php
use O876\MVC as M;
class MwController extends M\Controller\Action {
	public function postAction() {
		$oMF = M\Model\Factory::getInstance();
		$oMW = $oMF->getModel('ServiceMWDataBuilder');
		$a = $oMW->exportLevel($this->getRequest()->getPostData(), $this->getRequest()->getParam('n'));
		$this->setViewData('data', $a);
	}
}
