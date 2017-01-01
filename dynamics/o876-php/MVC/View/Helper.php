<?php
namespace O876\MVC\View;

/**
 * Un helper de vue permet de rationnaliser l'affichage de la vue
 * Les helpers sont utilisés pour générer des portion de documents composant les vues
 * 
 * @author raphael.marandet
 *        
 */
class Helper {
	/**
	 * Objet vue
	 * @var Data
	 */
	protected $_oView;
	
	/**
	 * Défini l'objet vue
	 * @param Data $oView
	 */
	public function setView(Data $oView) {
		$this->_oView = $oView;
	}
	
	/**
	 * Récupère l'objet vue
	 * @return Data
	 */
	public function getView() {
		return $this->_oView;
	}

	public function __call($name, $args) {
		return call_user_method_array($name, $this->getView(), $args);
	}
}
