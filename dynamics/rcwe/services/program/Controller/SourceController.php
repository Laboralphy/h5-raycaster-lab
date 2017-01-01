<?php
use O876\MVC as M;
class SourceController extends M\Controller\Action {
	/**
	 * Etabli la liste des niveaux de toutes les sources
	 */
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oSrc = $oMF->getModel('ServiceImport');
		$aList = array();
		foreach ($oSrc->listLevels() as $sProject => $aLevels) {
			$aList[] = $sProject;
		}
		$this->setViewData('list', $aList);
	}

	public function createAction() {
		$oMF = M\Model\Factory::getInstance();
		$oSrc = $oMF->getModel('ServiceSources');
		$oSrc->create($this->getRequest()->getParam('n'));
	}
}
