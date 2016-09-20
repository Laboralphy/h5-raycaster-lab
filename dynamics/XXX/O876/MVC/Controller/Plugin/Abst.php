<?php
namespace O876\MVC\Controller\Plugin;

/**
 * Classe abstraite de plugin de controleur
 */
abstract class Abst implements Intf {
	/**
	 * Objet request
	 * C'est généralement une requete HTTP
	 * Voir la classe \O876\MVC\Request\Http
	 * Contient les paramètre de la requete
	 * @var \O876\MVC\Request\Intf
	 */
	protected $_oRequest;
	
	/**
	 * Objet view défini dans le controleur et disponnible lors du postControl
	 * @var \O876\MVC\View\Data
	 */
	protected $_oView;
	
	/**
	 * Défini l'objet request.
	 * @param \O876\MVC\Request\Intf $o
	 */
	public function setRequest(\O876\MVC\Request\Intf $o) {
		$this->_oRequest = $o;
	}
	
	/**
	 * Récupère l'objet request
	 * @return \O876\MVC\Request\Intf
	 */
	public function getRequest() {
		return $this->_oRequest;
	}
	
	/**
	 * Défini l'objet View Data
	 * @param \O876\MVC\View\Data $o
	 */
	public function setView(\O876\MVC\View\Data $o) {
		$this->_oView = $o;
	}
	
	/**
	 * Récupère l'objet View Data
	 * @return \O876\MVC\View\Data
	 */
	public function getView() {
		return $this->_oView;
	}
}
