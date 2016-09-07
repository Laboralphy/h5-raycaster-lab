<?php namespace O876\Symbol\HTML;

/** @brief Symbole Code
 * 
 * Le CODE permet de contenir du texte préformatté type machine à écrire.
 * Conçu pour présenter des extraits de code source.
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 * 
 * @remark refonte mai 2015 : garder
 * utilise la coloration syntaxique PHP.
 */

use O876\Symbol\Symbol as Symbol;

class Code extends Div {
  protected $oCode;
  public function __construct() {
    parent::__construct('pre');
    $this->oCode = $this->append(new Symbol('code'));
  }
  
  /** Colorise un chaine représentant du code php
   * Le code php fournit doit respecter le spécification de la fonction highlight_string
   * Le code colorisé est analysé et transformé en composants Symbol
   * @param $sSource code source
   */
  public function setPHPSource($sSource) {
    $sCode = highlight_string($sSource, true);
    $this->oCode->parse($sCode);
  }
}
