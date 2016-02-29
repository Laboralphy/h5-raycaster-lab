<?php


namespace O876\Symbol\HTML;

/**
 * @brief Symbole Div
 *
 * Le Div est un symbole qui sert à structurer les document
 *
 * @remark Composant de la librairie Symbol
 * 
 * @author Raphaël Marandet
 * @version 100 - 2014.12.22
 */
use O876\Symbol\Symbol as Symbol;

class Hr extends Symbol {
	public function __construct() {
		parent::__construct('hr');
		//$this->setRenderer('HTMLBlock');
	}
}
