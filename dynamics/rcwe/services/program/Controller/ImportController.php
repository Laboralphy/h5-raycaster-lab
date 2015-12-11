<?php
use O876\MVC as M;
class ImportController extends M\Controller\Action {
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$aList = $oImp->listLevels();
		$this->setViewData('list', $aList);
	}

	public function importAction() {
		$sLevel = trim($this->getRequest()->getParam('l'));
		if (substr($sLevel, 0, 1) == '.') {
			throw new Exception('file name error');
		}
		$sFile = strtr($this->getRequest()->getParam('l'), '.', '/') . '.lvl.js';
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$oLevel = $oImp->import($sFile);
		$this->setViewData('data', $oLevel);
	}
}
