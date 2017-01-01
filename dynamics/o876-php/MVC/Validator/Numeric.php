<?php
namespace O876\MVC\Validator;

/**
 * Validateur de formulaire : numeric
 * @author raphael.marandet
 *
 */
class Numeric implements Intf {
	public function getStatus() {
		if (is_numeric($this->_sValue)) {
			return '';
		} else {
			return 'Value must be numeric';
		}
	}
}