<?php
namespace O876\Symbol\HTML;

/**
 * @brief Symbole Anchor
 *
 * Le Anchor est un symbole qui sert à définir un lien hypertext.
 *
 * @remark Composant de la librairie Symbol
 *
 * @author Raphaël Marandet
 * @version 100 - 2014.12.22
 * 
 * @remark refonte mai 2015 : garder, symbole simple, permet de
 * remplir automatiquement le contenu texte.
 */
use O876\Symbol\Symbol as Symbol;

class Anchor extends Symbol {
	public function __construct($sLink, $sLabel = '', $sTarget = '') {
		parent::__construct('a');
		if ($sLabel === '') {
			$sLabel = $sLink;
		}
		if ($sTarget) {
			$this->target = $sTarget;
		}
		$this->href = $sLink;
		$this->link($sLabel);
	}
}
