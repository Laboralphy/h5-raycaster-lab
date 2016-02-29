<?php


namespace O876\Symbol\HTML;

/**
 * @brief Formulaire
 *
 * Le formulaire permet d'organiser les élément qu'il contient.
 */
use O876\Symbol\Symbol as Symbol;
use O876\Symbol\Searcher as Searcher;

class Form extends Symbol {
	public function __construct() {
		parent::__construct ( 'form' );
		$this->method = 'post';
	}
	
	
	public function getFormElement($sName) {
		$aResults = $this->search(new Searcher\NameSearcher($sName));
		if (count($aResults) == 1) {
			return $aResults[0];
		} else {
			return $aResults;
		}
	}
	
	
	/** 
	 * Récupération de l'infotext du formelement spécifié
	 * @param string $sName
	 */
	public function getInfoText($sName) {
		
	}
	/* input-text input-hidden input-checkbox input-radio select-list select-combo textarea */
	/* L'élément est généralement entouré de label et de texte d'information */
}
