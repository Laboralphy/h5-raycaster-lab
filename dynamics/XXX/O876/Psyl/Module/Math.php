<?php namespace O876\Psyl\Module;

/** @brief Module d'évaluation d'expressions mathematiques
 * 
 * Composant de la bibliothèque PSYL d'évaluation de liste.
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

class Math extends Abst {
  // addition : somme de toutes les composantes
  // {add a b c} -> a + b + c
  function opcode_add($a) {
    $nRes = 0;
    for ($i = 1; $i < count($a); $i++) {
      $nRes += $this->evaluate($a[$i]);
    }
    return $nRes;
  }

  // soustraction
  // {sub a b} -> a - b
  function opcode_sub($a) {
    return $this->evaluate($a[1]) - $this->evaluate($a[2]);
  }

  // produit
  // {mul a b c} -> a * b * c
  function opcode_mul($a) {
    $nRes = 1;
    for ($i = 1; $i < count($a); $i++) {
      $nRes *= $this->evaluate($a[$i]);
    }
    return $nRes;
  }

  // division
  // {div a b} -> a / b
  function opcode_div($a) {
    return $this->evaluate($a[1]) / $this->evaluate($a[2]);
  }

  // modulo reste de la division
  // {mod a b} -> a mod b
  function opcode_mod($a) {
    return $this->evaluate($a[1]) % $this->evaluate($a[2]);
  }

  // valeur entière tronquée à l'entier inférieur
  // {floor a} 
  function opcode_floor($a) {
    return floor($this->evaluate($a[1]));
  }

  // valeur entière tronquée à l'entier superieur
  // {ceil a} 
  function opcode_ceil($a) {
    return ceil($this->evaluate($a[1]));
  }

  // valeur aléatoire
  // {rnd a b}  -> nombre entier aléatoire compris entre a et b inclus
  function opcode_rnd($a) {
    return mt_rand($this->evaluate($a[1]), $this->evaluate($a[2]));
  }

  // Valeur de la constante pi
  // {pi}
  function opcode_pi($a) {
    return M_PI;
  }
}
