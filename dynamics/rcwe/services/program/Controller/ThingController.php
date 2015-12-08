<?php
use O876\MVC as M;
class ThingController extends M\Controller\Action {
	public function postAction() {
		$oData = json_decode($this->getRequest()->getPostData());
		$sName = $oData->name;
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->storeTemplate('thing', $oData);
		$this->setViewData('name', $sName);
	}
	
	public function deleteAction() {
		$sName = $this->getRequest()->getParam('name');
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->deleteTemplate('thing', $sName);
		$this->setViewData('name', $sName);
	}
	
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$aList = $oTemp->listTemplates('thing');
		$this->setViewData('list', $aList);
	}
}
