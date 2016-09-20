<?php
namespace O876\MVC\Validator;

/**
 * Interface permettant de définir des validateurs de formulaire
 * @author raphael.marandet
 *
 */
interface Intf {
	/**
	 * Défini la valeur à valider
	 * @param string $sValue
	 */
	public function setValue($sValue);
	
	/**
	 * Revoie true si la valeur du champ du formulaire est valide
	 * @return bool
	 */
	public function isValid();
	
	/**
	 * Renvoie le status du validateur, ou une chaine vide si le status est OK
	 * @return string
	 */
	public function getStatus();
}