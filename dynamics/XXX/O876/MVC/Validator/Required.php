<?php
namespace O876\MVC\Validator;

/**
 * Validateur de formulaire : required
 * @author raphael.marandet
 *
 */
class Required implements Intf {
	public function getStatus() {
		if ($this->_sValue !== '') {
			return '';
		} else {
			return 'Value is required';
		}
	}
}