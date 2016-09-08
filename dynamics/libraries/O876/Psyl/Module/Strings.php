<?php namespace O876\Psyl\Module;

/** @brief Module d'évaluation d'expressions mathematiques
 * 
 * Composant de la bibliothèque PSYL d'évaluation de liste.
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

class Strings extends Abst {
  // créé une chaine a partir des item de la liste, par concaténation (en intercalant un espace entre chaque atome)
  // {str a b c} -> "a b c"
  public function opcode_str($a) {
    $aRes = array();
    for ($i = 1; $i < count($a); $i++) {
      $aRes[] = $this->evaluate($a[$i]);
    }
    return implode(' ', $aRes);
  }

  // concaténation de chaine
  // {cat a b c} -> "abc"
  public function opcode_cat($a) {
    $sRes = '';
    for ($i = 1; $i < count($a); $i++) {
      $sRes .= $this->evaluate($a[$i]);
    }
    return $sRes;
  }

  // caractère : à partir du code ascii fourni
  // {chr x} -> caractère
  public function opcode_chr($a) {
    $sRes = '';
    for ($i = 1; $i < count($a); $i++) {
      $sRes .= chr($this->evaluate($a[$i]));
    }
    return $sRes;
  }
}
