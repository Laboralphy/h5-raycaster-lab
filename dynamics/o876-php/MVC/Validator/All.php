<?php
namespace O876\MVC\Validator;

/**
 * Validateur de formulaire : required
 * @author raphael.marandet
 *
 */
class All implements Intf {
	protected $_aValidators;
	
	public function __construct() {
		$this->_aValidators = func_get_args();
	}
	
	/**
	 * Défini la valeur à valider
	 * @param string $sValue
	 */
	public function setValue($sValue) {
		parent::setValue($sValue);
		foreach ($this->_aValidators as $v) {
			$v->setValue($sValue);
		}
	}
	
	public function getStatus() {
		$a = array();
		$s = '';
		foreach ($this->_aValidators as $v) {
			$s = $v->getStatus();
			if ($s) {
				$a[] = $s;
			}
		}
		if (count($a)) {
			return implode(', ', $a);
		} else {
			return '';
		}
	}
}