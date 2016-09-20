<?php namespace O876\Symbol\HTML;

/** @brief Symbole ligne de table
 * 
 * Le TableRow est un symbole de tag TR pour générer des lignes de cellules de tableau HTML.
 * Utilisée par TableSection. 
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;


class TableRow extends Segment {
  protected $_sSubItemClass;

  public function __construct() {
    parent::__construct('tr');
    $this->_sSubItemClass = __NAMESPACE__ . '\\TableCell';
  }

  public function setHeader($b = true) {
    foreach ($this as $oCell) {
      $oCell->setHeader($b);
    }
  }

  public function setCellCount($n) {
    $this->setItemCount($n);
  }
}
?>
