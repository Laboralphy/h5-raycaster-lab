<?php namespace O876\MVC\Model;
use O876\MVC as M;

/**
 * Factory de models
 * C'est un singleton et une factory
 */
class Factory {
	/**
	 * Instance du singleton
	 * @var O876\MVC\Model\Factory
	 */
	protected static $_oInstance = null;
	
	/**
	 * Liste des models déja instanciés
	 * @var array
	 */
	protected $_aModels;

	/**
	 * Constructeur
	 */
	protected function __construct() {
		$this->_aModels = array();
	}

	/**
	 * Renvoie l'instance du singleton
	 * @return \O876\MVC\Model\Factory
	 */
	public function getInstance() {
		if (self::$_oInstance === null) {
			self::$_oInstance = new self();
		}
		return self::$_oInstance;
	}

	/**
	 * Renvoie l'instance d'un modele
	 * @param string $sModel
	 * @return multitype:
	 */
	public function getModel($sModel) {
		if (!in_array($sModel, $this->_aModels)) {
			$this->_aModels[$sModel] = new $sModel();
		}
		return $this->_aModels[$sModel];
	}
}
