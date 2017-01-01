<?php
namespace O876\MVC\Adapter;

/**
 * Classe de connexion à une base de donnée mysql
 * @author raphael.marandet
 *
 */
class Mysql implements Intf {
	/**
	 * ressource de connexion à la base de données 
	 * @var unknown
	 */
	protected $oCnx;

	/**
	 * Permet de définir les paramètre de connexion à une base de données
	 * serveur, identifiant, mot de passe, encodage...
	 * @param array $aConf
	 */
	public function setConfiguration(Array $aConf) {
		$sServer = $aConf ['server'];
		$sUser = $aConf ['user'];
		$sPass = $aConf ['password'];
		$sDB = $aConf ['database'];
		$this->oCnx = mysql_connect ( $sServer, $sUser, $sPass );
		if ($this->oCnx) {
			mysql_select_db ( $sDB );
		}
	}
	
	/**
	 * Le destructeur gère la fermeture à la base de données
	 */
	public function __destruct() {
		if (is_resource ( $this->oCnx )) {
			mysql_close ( $this->oCnx );
		}
	}
	
	/**
	 * Envoie une requête à la base de donnée.
	 * @param string $sQuery requête
	 * @return array résultat de requête
	 */
	public function query($sQuery) {
		$oResult = mysql_query ( $sQuery, $this->oCnx );
		if (is_resource ( $oResult )) {
			$aData = array ();
			while ( $aLine = mysql_fetch_assoc ( $oResult ) ) {
				$a = array ();
				foreach ( $aLine as $key => $value ) {
					$a [$key] = $value;
				}
				$aData [] = $a;
			}
			return $aData;
		} else {
			return $oResult;
		}
	}

	/**
	 * Renvoie le dernier identifiant auto incrément généré par un insert
	 * @return int
	 */
	public function getLastInsertId() {
		return mysql_insert_id ( $this->oCnx );
	}
}
