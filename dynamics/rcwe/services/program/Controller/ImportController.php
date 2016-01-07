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
		$sProject = trim($this->getRequest()->getParam('p'));
		if (substr($sLevel, 0, 1) == '.') {
			throw new Exception('file name error');
		}
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$oLevel = $oImp->import($sProject, $sLevel);
		$this->setViewData('data', $oLevel);
	}

	public function exportAction() {
		$d = json_decode($this->getRequest()->getPostData());
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$oImp->export($d->project, $d->name, json_encode($d->data));
		$this->setViewData('name', $d->name);
	}
}
