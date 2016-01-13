<?php
use O876\MVC as M;
class MwController extends M\Controller\Action {
	public function postAction() {
		$oMF = M\Model\Factory::getInstance();
		$oMW = $oMF->getModel('ServiceMWDataBuilder');
		$a = $oMW->exportLevel($this->getRequest()->getPostData(), $this->getRequest()->getParam('n'));
		$this->setViewData('data', $a);
	}

	public function importAction() {
		$oMF = M\Model\Factory::getInstance();
		$oMW = $oMF->getModel('ServiceMWDataBuilder');
		$l = $this->getRequest()->getParam('l');
		$a = $oMW->importLevel($l);
		$this->setViewData('data', $a);
	}

	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oMW = $oMF->getModel('ServiceMWDataBuilder');
		$a = $oMW->getList();
		$this->setViewData('data', $a);
	}
}
