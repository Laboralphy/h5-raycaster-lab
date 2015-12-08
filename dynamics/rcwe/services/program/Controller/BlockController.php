<?php
use O876\MVC as M;
class BlockController extends M\Controller\Action {
	public function postAction() {
		$oData = json_decode($this->getRequest()->getPostData());
		$sName = $oData->name;
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->storeTemplate('block', $oData);
		$this->setViewData('name', $sName);
	}
	
	public function deleteAction() {
		$sName = $this->getRequest()->getParam('name');
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->deleteTemplate('block', $sName);
		$this->setViewData('name', $sName);
	}
	
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$aList = $oTemp->listTemplates('block');
		$this->setViewData('list', $aList);
	}
}
