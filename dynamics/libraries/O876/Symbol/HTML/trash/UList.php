<?php namespace O876\Symbol\HTML;

require_once('ListItem.php');

/** @brief Symbole de liste.
 * @author Ralphy
 * @version 100
 * @date 2010-09-23
 * @details Gestion des listes ordonnées (ol) et non ordonnées (ul)
 * La classe ne peut pas s'appeler List car c'est un mot-clé PHP
 * On a choisi UList pour coller avec le tag correspondant "UL"
 */

use O876\Symbol\Symbol as Symbol;
 
class UList extends Symbol {
  /** @brief Liste ordonnée.
   * @details Utilisée avec setListType pour définir une liste ordonnée.
   */
  const LISTTYPE_ORDERED = 1;

  /** @brief Liste non-ordonnée.
   * @details Utilisée avec setListType pour définir une liste non-ordonnée.
   */
  const LISTTYPE_NOTORDERED = 2;
  
  /** @brief Constructeur
   * @details le constructeur initialise le tag de l'élément.
   */
  public function __construct() {
    parent::__construct('ul');
  }

  /** @brief Définition du type de liste.
   * @details Définit le type de liste (ordonnée ou non-ordonnée)
   * @param $n Int, valeur possible : self::LISTTYPE_NOTORDERED ou self::LISTTYPE_ORDERED
   */
  public function setListType($n) {
    switch ($n) {
      case self::LISTTYPE_NOTORDERED:
        $this->setTag('ul');
      break;

      case self::LISTTYPE_ORDERED:
        $this->setTag('ol');
      break;
    }
  }

  /** @brief Ajout d'un élément.
   * @details Ajoute un nouvel élément à la liste, renvoie la référence de cet élément.
   * @param $oLinkee Symbol, optionnel par defaut null, Symbol à inclure dans l'élément de liste.
   * @return SymbolListItem
   */
  public function addItem($oLinkee = null) {
    $oItem = $this->link(new ListItem());
    if ($oLinkee) {
      $oItem->link($oLinkee);
    }
    return $oItem;
  }
}
