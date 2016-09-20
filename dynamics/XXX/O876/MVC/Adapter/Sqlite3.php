<?php
namespace O876\MVC\Adapter;

class Sqlite3 implements Intf {
	/**
	 * ressource de connexion à la base de données
	 * 
	 * @var unknown
	 */
	protected $oCnx;
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Adapter\Intf::setConfiguration()
	 */
	public function setConfiguration(Array $aConf) {
		$this->oCnx = new Sqlite3 ( $aConf ['file'] );
	}
	
	/**
	 * Envoie d'une requete SELECT
	 * @param string $sQuery requête
	 * @return array
	 */
	public function querySelect($sQuery) {
		return $this->oCnx->query ( $sQuery );
	}
	
	/**
	 * Envoie d'une requête INSERT DELETE UPDATE...
	 * @param string $sQuery
	 * @return boolean succès de l'opération
	 */
	public function queryExec($sQuery) {
		return $this->oCnx->exec ( $sQuery );
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Adapter\Intf::query()
	 */
	public function query($sQuery) {
		if (preg_match ( '/^\\s*select/i', $sQuery )) {
			$oResult = $this->querySelect ( $sQuery );
			$aData = array ();
			while ( $aLine = $oResult->fetchArray ( SQLITE3_ASSOC ) ) {
				$aData [] = $aLine;
			}
			$oResult->finalize ();
			return $aData;
		} else {
			return $this->queryExec ( $sQuery );
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Adapter\Intf::getLastInsertId()
	 */
	public function getLastInsertId() {
		return $this->oCnx->lastInsertRowID ();
	}
}
