<?php


namespace O876\Symbol\HTML;

/**
 * @brief Elément de Formulaire
 * 
 * Un élément de formulaire comporte un label, un objet (input)
 * et un info text (pour afficher d'éventuel message d'information ou d'erreur) 
 */
use O876\Symbol\Symbol as Symbol;

class FormElement extends Symbol {
	protected $oLabel = null;
	protected $oObject = null;
	protected $oInfoText = null;

	/**
	 * Le constructeur permet de définit d'un coup, le label et l'objet
	 * @param string $sLabel
	 * @param Symbol $oObject
	 */
	public function __construct($sLabel = "", $oObject = null) {
		parent::__construct ( 'div' );
		$this->oLabel = $this->link ( new Symbol('label') );
		$this->oLabel->setData ( $sLabel );
		$this->link(new Symbol('br'));
		if ($oObject) {
			$this->oLabel->for = $oObject->name;
			$this->oObject = $this->link ( $oObject );
			$this->link(new Symbol('br'));
			$this->oInfoText = $this->link (new Symbol('span'));
			$this->oInfoText->setData('&nbsp;');
		}
	}
	
	public function getInfoText() {
		return $this->oInfoText;
	}
	
	/**
	 * Définition de l'objet de ce FormElement
	 * @param Symbol $oObject
	 */
	public function setObject($oObject) {
		if ($this->oObject === null) {
			$this->oObject = $this->link ( $oObject );
			$this->link(new Symbol('br'));
			$this->oInfoText = $this->link (new Symbol('span'));
			$this->oInfoText->setData('&nbsp;');
		} else {
			for($i = 0; $i < count ( $this ); $i ++) {
				if ($this [$i] === $this->oObject) {
					$this [$i] = $oObject;
					$this->oObject = $oObject;
					break;
				}
			}
		}
		$this->linkLabelToObject ();
	}

	/**
	 * Création d'un symbol label
	 * @param string $sLabel cvaption du label à afficher
	 */
	public function setLabel($sLabel) {
		if ($this->oLabel === null) {
			$this->oLabel = $this->link ( 'label' );
		}
		$this->oLabel->setData ( $sLabel );
		$this->linkLabelToObject ();
	}

	/**
	 * Liaison du label à l'objet de manière à donner le focus à l'objet quand on clique sur le label
	 */
	protected function linkLabelToObject() {
		if ($this->oLabel != null && $this->oObject != null) {
			$this->oLabel->for = $this->oObject->name;
		}
	}
}
