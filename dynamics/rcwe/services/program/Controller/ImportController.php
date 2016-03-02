<?php
use O876\MVC as M;
class ImportController extends M\Controller\Action {
	/**
	 * lists all levels
	 * the result is a JS object with project names as keys and arrays
	 * of level names as values
	 */
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$aList = $oImp->listLevels();
		$this->setViewData('list', $aList);
	}

	/**
	 * Imports a level from the source directory
	 * - l : level name
	 * - p : project name
	 */
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

	/**
	 * Exports a level to the source directory of a project
	 * the post data will be like this :
	 * {
	 * 		project: project name
	 * 		name: level name
	 * 		data: level data
	 * }
	 */
	public function exportAction() {
		$d = json_decode($this->getRequest()->getPostData());
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$oImp->export($d->project, $d->name, $d->data);
		$this->setViewData('name', $d->name);
	}
	
	public function resourcelistAction() {
		$p = $this->getRequest()->getParam('p');
		if (!$p) {
			throw new Exception('no project specified');
		}
		$oMF = M\Model\Factory::getInstance();
		$oImp = $oMF->getModel('ServiceImport');
		$a = $oImp->getHashedResourceStatus($p);
		$this->setViewData('list', $a);
		$this->render('import/list');
	}
}
