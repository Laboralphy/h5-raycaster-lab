<?php
namespace O876\MVC\Controller;

use O876\MVC as M;

/**
 * Classe de controle de formulaire
 * @author raphael.marandet
 *
 */
class Form {
	protected $_aFields;
	
	public function __construct() {
		$this->_aFields = array();
	}
	
	public function addField($sName, O876\MVC\Validator\Intf $oValidator = null) {
		$this->_aFields[$sName] = array(
			'validator' => $oValidator,
			'value' => ''
		);
	}
}