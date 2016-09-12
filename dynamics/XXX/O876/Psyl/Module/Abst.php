<?php namespace O876\Psyl\Module;

/** @brief Module d'évaluation Classe abstraite
 * 
 * Composant de la bibliothèque PSYL d'évaluation de liste.
 * Implementation de l'interface.
 * Correspond à un module de base avec les caractéristiques suivantes :
 * - Les fonction opcode sont des methode de cette instance
 * - Les fonction opcode commence par "opcode_" suivit de l'opcode en minuscule
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

abstract class Abst implements Intf {
  protected $oEvaluator;

  /** Retourne le nom de la fonction associée à l'opcode transmis en paramètre
   * @param $sOpcode string, Opcode à résoudre
   * @return string : nom de la fonction de cette instance
   */
  public function getOpcodeFunction($sOpcode) {
    return 'opcode_' . strtolower($sOpcode);
  }

  /** Renvoie TRUE si l'opcode est géré par ce module.
   * Si l'opcode est géré par ce module on peut utiliser evaluate() avec la liste de cet opcode
   * @param $sOpcode string, Opcode à résoudre
   * @return boolean TRUE: l'ocode est géré, FALSE l'opcode n'est pas géré
   */
  public function hasOpcode($sOpcode) {
    $sCommand = $this->getOpcodeFunction($sOpcode);
    return method_exists($this, $sCommand);
  }

  /** Défini l'évaluateur à utiliser pour évaluer les liste transmises à evaluate()
   * @param $oEvaluator O876\Psyl\Evaluator Instance de l'évaluator à utiliser
   */
  public function setEvaluator(\O876\Psyl\Evaluator $oEvaluator) {
    $this->oEvaluator = $oEvaluator;
  }

  /** Evaluation d'une liste
   * @param $aList array, structure de liste
   * @return Retour de l'évaluation (chaine ou liste)
   */
  public function evaluate($aList) {
    return $this->oEvaluator->evaluate($aList);
  }
}
