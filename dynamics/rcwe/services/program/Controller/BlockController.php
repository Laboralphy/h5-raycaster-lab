<?php
use O876\MVC as M;
class BlockController extends M\Controller\Action {
	/**
	 * Posts a block template
	 * The post data are used to determine the template name
	 * and all block data.
	 */
	public function postAction() {
		$oData = json_decode($this->getRequest()->getPostData());
		$sName = $oData->name;
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->storeTemplate('block', $oData);
		$this->setViewData('name', $sName);
	}
	
	/**
	 * deletes a block template of the given name
	 * - name : name of the template to be deleted
	 */
	public function deleteAction() {
		$sName = $this->getRequest()->getParam('name');
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$oTemp->deleteTemplate('block', $sName);
		$this->setViewData('name', $sName);
	}
	
	/**
	 * lists all block templates
	 */
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oTemp = $oMF->getModel('ServiceTemplate');
		$aList = $oTemp->listTemplates('block');
		$this->setViewData('list', $aList);
	}
}
