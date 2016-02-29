<?php


namespace O876\Symbol\HTML;

/**
 * @brief Symbole Images
 *
 * Une image
 *
 * @remark Composant de la librairie Symbol
 *
 * @author Raphaël Marandet
 * @version 100 - 2014.12.22
 */
use O876\Symbol\Symbol as Symbol;

class Image extends Symbol {
	public function __construct($sLink, $sCaption = '') {
		if ($sCaption) {
			parent::__construct('figure');
			$oImg = $this->link(new Image($sLink));
			$oImg->alt = $sCaption;
			$oFigCap = $this->link(new Symbol('figcaption'));
			$oFigCap->setData($sCaption);
		} else {
			parent::__construct('img');
			$this->src = $sLink;
		}
	}
}
