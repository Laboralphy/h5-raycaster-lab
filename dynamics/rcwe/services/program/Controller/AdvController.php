<?php
use O876\MVC as M;
class AdvController extends M\Controller\Action {
	public function indexAction() {
	}
	
	public function gameAction() {
		$oOptions = array(
			'gamename' => $this->getRequest()->getParam('gn'),
			'fullscreen' => !!$this->getRequest()->getParam('fs'),
			'fpscontrol' => !!$this->getRequest()->getParam('fc'),
			'smoothtextures' => !!$this->getRequest()->getParam('st')
		);
		$oMF = M\Model\Factory::getInstance();
		$oGame = $oMF->getModel('ServiceGame');
		$sKeyName = $oGame->buildGameArchive($this->getRequest()->getPostData(), $oOptions);
		$this->setViewData('name', $sKeyName);
	}
}
