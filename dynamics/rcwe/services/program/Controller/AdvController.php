<?php
use O876\MVC as M;
class AdvController extends M\Controller\Action {
	/**
	 * Build a game archive with the given parameters
	 * - gn : game name
	 * - fs : boolean 1 / 0 fullscreen flag : if true, the game will be full screen
	 * - fc : boolean 1 / 0 fps control flag : if true, the standard FPS control (keyboard + mouse) will apply
	 * - st : boolean 1 / 0 smooth textures : if true, the textures will be smooth, else the textures will be pixelated
	 */
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
