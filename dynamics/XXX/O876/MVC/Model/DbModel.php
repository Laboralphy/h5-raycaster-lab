<?php
namespace O876\MVC\Models;

/**
 * Classe de modèle spécialisée dans l'interrogation d'une base de données
 * Cette classe se configure automatiquement grace à l'objet Config déclaré dans l'application
 * @author raphael.marandet
 *
 */
class DbModel {
	/**
	 * Objet adapter
	 * @var O876\MVC\Adapter\Intf
	 */
	protected $_oAdapter;
	
	/**
	 * Dernière requête exécutée
	 * @var string
	 */
	protected $_sLastQuery;
	
	/**
	 * Chemin dans lequel se trouve les requêtes externe
	 * @var string
	 */
	protected $_sQueryPath;
	
	/**
	 * constructeur
	 */
	public function __construct() {
		$oApp = Application::getInstance ();
		$this->_oAdapter = $oApp->openDbConnection ();
		$aDbConfig = $oApp->getConfig ()->getDatabaseConfig ();
		$this->setQueryPath ( $oApp->getApplicationPath () . '/' . $aDbConfig ['queries'] );
	}
	
	/**
	 * Setter d'objet adapter
	 * @return O876\MVC\Adapter\Intf
	 */
	public function getAdapter() {
		return $this->_oAdapter;
	}
	
	/**
	 * Défini un nouveau chemin contenant les requête exxterne
	 * (requêtes SQL contenu dans un fichier) 
	 * @param string $s nouveau chemin
	 */
	public function setQueryPath($s) {
		$this->_sQueryPath = $s;
	}
	
	/**
	 * Si une méthode invoquée n'est pas connu, on tente de chercher le fichier de requete extern correspondant
	 * et de lancer la requête.
	 * @param string $sMethod
	 * @param array $aParams
	 * @return array résultat de requète
	 */
	public function __call($sMethod, $aParams) {
		if (count ( $aParams ) > 0) {
			$aReplace = $aParams [0];
		} else {
			$aReplace = array ();
		}
		$aQuery = file ( $this->_sQueryPath . '/' . $sMethod . '.sql' );
		$sQuery = '';
		foreach ( $aQuery as $sQLine ) {
			$sQuery .= trim ( $sQLine ) . ' ';
		}
		$this->_sLastQuery = strtr ( $sQuery, $aReplace );
		return $this->_oAdapter->query ( $this->_sLastQuery );
	}
}
