<?php
use O876\MVC as M;
class SourceController extends M\Controller\Action {
	/**
	 * Etabli la liste des niveaux de toutes les sources
	 */
	public function listAction() {
		$oMF = M\Model\Factory::getInstance();
		$oSrc = $oMF->getModel('ServiceSources');
		$oSrc->getAllLevels()
		$this->setViewData('list', $aList);
	}
}
