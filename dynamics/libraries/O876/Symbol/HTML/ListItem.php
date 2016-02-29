<?php namespace O876\Symbol\HTML;
/** @brief Elément de liste
 * @author Ralphy
 * @version 100
 * @date 2010-09-23
 * @details Elément de liste. Instancié et utilisé par SymbolList
 */

use O876\Symbol\symbol as Symbol;

class ListItem extends Symbol {
  /** @brief Constructeur
   * @details le constructeur initialise le tag de l'élément.
   */
  public function __construct() {
    parent::__construct('li');
  }
}