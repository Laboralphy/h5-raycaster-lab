<?php
namespace O876\MVC\Adapter;

/**
 * Adapteur
 * Interface permettant la création d'une classe gérant la connexion à une base de données 
 * @author raphael.marandet
 *
 */
interface Intf {
	/**
	 * Permet de définir les paramètre de connexion à une base de données
	 * serveur, identifiant, mot de passe, encodage...
	 * @param array $aConf
	 */
	public function setConfiguration(array $aConf);
	
	/**
	 * Envoie une requête à la base de donnée.
	 * @param string $sQuery requête
	 * @return array résultat de requête
	 */
	public function query($sQuery);
	
	/**
	 * Renvoie le dernier identifiant auto incrément généré par un insert
	 * @return int
	 */
	public function getLastInsertId();
}