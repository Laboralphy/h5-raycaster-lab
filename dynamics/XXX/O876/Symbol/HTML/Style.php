<?php
namespace O876\Symbol\HTML;

/**
 * @brief Symbole Style
 *
 * @remark Composant de la librairie Symbol
 * 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */
use O876\Symbol\Symbol as Symbol;

class Style extends Symbol {
	
	protected $_css;
	
	public function __construct() {
		parent::__construct ( 'style' );
		$this->_css = $this->append(new Comment());
		$this->type = 'text/css';
	}
	
	public function setStyle($s) {
		$this->_css->setData($s);
	}

	public function appendStyle($s) {
		$this->_css->setData($this->_css->getData() . "\n" . $s);
	}
}
