<?php
namespace O876\MVC\Controller;

use O876\MVC as M;

/**
 * Classe Controleur d'actions
 * A étendre pour écrire des controlleur d'action
 * Les fonctions qui seront écrite et dont le nom se terminera par "Action" seront considérée comme des action
 * et seront invoquée par le MVC
 * @author raphael.marandet
 *
 */
class Action {
	/**
	 * Objet View Data
	 * @var \O876\MVC\View\Data
	 */
	protected $_oView;
	
	/**
	 * Objet request
	 * @var \O876\MVC\Request\Intf
	 */
	protected $_oRequest;
	
	/**
	 * Objet application
	 * @var \O876\MVC\Application
	 */
	protected $_oApplication;
	
	/**
	 * Constructeur
	 */
	public function __construct() {
		$this->_oView = new M\View\Data ();
	}
	
	/**
	 * Setter de l'objet d'application
	 * @param M\Application $oApplication
	 */
	public function setApplication(M\Application $oApplication) {
		$this->_oApplication = $oApplication;
	}
	
	/**
	 * Getter de l'objet d'application
	 * @return M\Application
	 */
	public function getApplication() {
		return $this->_oApplication;
	}
	
	/**
	 * Renvoie la view data
	 * @return \O876\MVC\View\Data
	 */
	public function getView() {
		return $this->_oView;
	}
	
	/**
	 * Défini le view data
	 * @param M\View\Data $oData
	 */
	public function setView(M\View\Data $oData) {
		$this->_oView = $oData;
	}
	
	/**
	 * Défini l'objet request
	 * @param M\Request\Intf $o
	 */
	public function setRequest(M\Request\Intf $o) {
		$this->_oRequest = $o;
	}
	
	/**
	 * Getter d'objet request
	 * @return M\Request\Intf
	 */
	public function getRequest() {
		return $this->_oRequest;
	}
	
	/**
	 * Permet de récupérer un plugin
	 * @param string $sPlugin nom du plugin
	 */
	public function getPlugin($sPlugin) {
		return $this->_oApplication->getPlugin ( $sPlugin );
	}
	
	/**
	 * Définition d'une donnée de vue.
	 * Ces données seront disponible dans la vue en tant que propriété de l'objet this
	 * @param string $s
	 * @param unknown $v
	 */
	public function setViewData($s, $v) {
		$this->_oView->setData ( $s, $v );
	}
	
	/**
	 * Récupère une donnée de vue
	 * @param string $s
	 */
	public function getViewData($s) {
		$this->_oView->getData ( $s );
	}
	
	/**
	 * Récupère un paramètre de l'objet request
	 * @param string $s
	 * @return \O876\MVC\Request\Valeur
	 */
	public function getParam($s) {
		return $this->_oRequest->getParam ( $s );
	}
	
	/**
	 * Défini le script de vue qui sera rendue
	 * @param string $sViewScript
	 */
	public function render($sViewScript) {
		$this->_oView->setScript ( $sViewScript );
	}
}
