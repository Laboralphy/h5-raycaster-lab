<?php
namespace O876\MVC\Validator;

/**
 * Interface permettant de définir des validateurs de formulaire
 * @author raphael.marandet
 *
 */
class Abst implements Intf {
	
	protected $_sValue;
	protected $_sStatus;
	
	/**
	 * Défini la valeur à valider
	 * @param string $sValue
	 */
	public function setValue($sValue) {
		$this->_sValue = $sValue;
	}
	
	/**
	 * Revoie true si la valeur du champ du formulaire est valide
	 * @return bool
	 */
	public function isValid() {
		return $this->getStatus() == '';
	}
}