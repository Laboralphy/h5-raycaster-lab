<?php namespace O876\Symbol\HTML;

/** @brief Symbole Abstrait Segment
 * 
 * Le SEGMENT (qui devrait être un trait) est une fonctionnalité
 * qui gère une liste de sous-symbole de même tag.
 * Il est possible de spécifier un nombre total de sous-symbole, l'objet
 * se charge alors de créer ou détruire les symboles en défaut ou en excés.
 * 
 * Cette classe est étendue par la classe TableSection pour gérer son nombre
 * de lignes TR.
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;

abstract class Segment extends Symbol {
  protected $_sSubItemClass;

  /** Défini le nombre de sous-symboles en supprimant ou en créant les symboles en 
   * excés ou en défaut.
   * @param $n int, nombre final de sous-symbole.
   */
  public function setItemCount($n) {
    if ($n > count($this)) {
      for ($i = count($this); $i < $n; $i++) {
        $this->append(new $this->_sSubItemClass());
      }
    } elseif ($n < count($this)) {
      for ($i = count($this) - 1; $i >= $n; $i--) {
        unset($this[$i]);
      }
    }
  }
}
?>
