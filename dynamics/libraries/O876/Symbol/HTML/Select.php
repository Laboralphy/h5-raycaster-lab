<?php namespace O876\Symbol\HTML;

/** @brief Symbole Select
 * 
 * Le SELECT génère une combo box. Boite de sélection déroulante.
 * Généralement utilisé pour permettre à l'utilisateur de choisir une option.
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;

class Select extends Symbol {
  protected $sSelected = ''; // Stocke la valeur de l'option sélectionnée par défaut	

  /** Le constructeur initialise le tag
   * 
   */
  public function __construct() {
    parent::__construct('select');
  }

  /** Ajoute une option au select
   * 
   * @param $sLabel Texte affiché dans l'option
   * @param $sKey Clé d'identification du choix
   * @return Objet Symbol créé
   */
  public function addOption($sLabel, $sKey) {
    $aOptions[$sKey] = $oOption = $this->link(new Symbol('option'));
    $oOption->value = $sKey;
    $oOption->setData($sLabel);
    return $oOption;
  }

  /** Ajoute plusieur option d'un coup
   * Les labels et les identifiant de clé sont stocké dans un tableau associatif
   * clé => label
   * 
   * @param $aOpt Tableau associatif clé => label
   */
  public function addOptions($aOpt) {
    foreach ($aOpt as $sKey => $sLabel) {
      $this->addOption($sLabel, $sKey);
    }
  }
  
  /** Renvoie l'option (objet symbol) en fonction de la clé fournie
   * 
   * @param $sKey clé d'identification
   * @return Object symbol correspondant à la clé, ou null si non trouvé
   */
  public function getOption($sKey) {
  	$n = $this->getOptionIndex($sKey);
  	if ($n >= 0) {
  	  return $this[$n];
  	} else {
  		return null;
  	}
  }

  /** Renvoie l'index de option dont la clé est spécifiée
   * 
   * @param $sKey clé d'identification
   * @return Index (entier numérique) de l'option recherchée
   */ 
  public function getOptionIndex($sKey) {
  	foreach ($this as $n => $o) {
      if ($o->value == $sKey) {
      	return $n;
      }
  	}
  	return -1;
  }

  /** Défini l'option sélectionnée par défaut
   * 
   * @param $sKey Clé d'identification de la clé par défaut
   */
  public function setSelected($sKey) {
  	foreach ($this as $o) {
  	  unset ($o->selected);
  	  $this->sSelected = ''; 
      if ($o->value == $sKey) {
      	$this->sSelected = $sKey;
      	$o->selected = 'selected';
      }
  	}
  }

  /** Renvoie la clé de l'option sélectionnée par défaut, initialisée avec
   * setSelected()
   * @return chaine de caractère : clé d'identification de l'option par défaut
   */
  public function getSelected() {
  	return $this->sSelected;
  }
}
