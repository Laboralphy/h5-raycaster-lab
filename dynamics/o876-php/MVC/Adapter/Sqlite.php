<?php
namespace O876\MVC\Adapter;

class Sqlite implements Intf {
	/**
	 * ressource de connexion à la base de données
	 * 
	 * @var unknown
	 */
	protected $oCnx;

	/**
	 * Permet de définir les paramètre de connexion à une base de données
	 * serveur, identifiant, mot de passe, encodage...
	 * @param array $aConf
	 */
	public function setConfiguration(Array $aConf) {
		$this->oCnx = sqlite_factory ( $aConf ( 'file' ) );
	}
	
	/**
	 * Envoie une requête non bufferisée
	 * Optimisée pour une lecture "d'un coup"
	 * @param string $sQuery requête
	 * @return array résultat de la requête
	 */
	protected function querySelect($sQuery) {
		return $this->oCnx->unbufferedQuery ( $sQuery );
	}
	
	/**
	 * Envoie une requête dédiée INSERT UPDATE DELETE etc...
	 * Renvoie un booleen traduisant le success de l'opération
	 * @param string $sQuery requête
	 * @return boolean succès de l'opération
	 */
	protected function queryExec($sQuery) {
		return $this->oCnx->queryExec ( $sQuery );
	}
	
	/**
	 * Envoie une requête à la base de donnée.
	 * @param string $sQuery requête
	 * @return array résultat de requête
	 */
	public function query($sQuery) {
		if (preg_match ( '/^\\s*select/i', $sQuery )) {
			return $this->querySelect ( $sQuery )->fetchAll ( SQLITE_ASSOC );
		} else {
			return $this->queryExec ( $sQuery );
		}
	}
	
	/**
	 * Renvoie le dernier identifiant auto incrément généré par un insert
	 * @return int
	 */
	public function getLastInsertId() {
		return sqlite_last_insert_rowid ();
	}
}
