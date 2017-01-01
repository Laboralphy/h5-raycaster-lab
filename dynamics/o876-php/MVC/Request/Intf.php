<?php
namespace O876\MVC\Request;

interface Intf {
	/**
	 * Récupère un paramètre de requete
	 * 
	 * @param string $sName Nom du paramètre
	 * @return string Valeur du paramètre
	 */
	public function getParam($sName);
	
	/**
	 * Récupère la liste de tous les paramètres de la requète
	 * @return array Tableau associatif paramètre => valeur
	 */
	public function getParams();
	
	/**
	 * Défini un paramètre
	 * @param string $sName nom du paramètre
	 * @param string $xValue valeur du paramètre
	 */
	public function setParam($sName, $xValue);
}

