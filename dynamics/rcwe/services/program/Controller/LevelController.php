<?php
use O876\MVC as M;
class LevelController extends M\Controller\Action {
	public function postAction() {
		$oData = json_decode($this->getRequest()->getPostData());
		$sName = $oData->name;
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->storeTemplate('level', $oData);
		$this->setViewData('name', $sName);
	}

	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$aList = $oTemp->listTemplates('level');
		$this->setViewData('list', $aList);
	}

	public function deleteAction() {
		$oData = json_decode($this->getRequest()->getPostData());
		$sName = $oData->name;
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->deleteTemplate('level', $sName);
		$this->setViewData('name', $sName);
	}
}
