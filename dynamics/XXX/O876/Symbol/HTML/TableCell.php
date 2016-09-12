<?php namespace O876\Symbol\HTML;

/** @brief Symbole cellule de table
 * 
 * Le TableCell est un symbole de tag TD pour générer des cellule de tableau HTML.
 * Utilisée par TableRow. 
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;

class TableCell extends Symbol {
  /** Initialisation du tag (TD)
   */
  public function __construct() {
    parent::__construct('td');
  }

  /** Ajoute ou supprime la propriété Header de la cellule.
   * 
   * @param $b Bool, true=la cellule est un TH, false=la cellule est un TD.
   */
  public function setHeader($b = true) {
    $this->setTag($b ? 'th' : 'td');
  }
}