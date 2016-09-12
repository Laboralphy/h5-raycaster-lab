<?php namespace O876\Psyl\Module;

/** @brief Interface de Module d'évaluation
 * 
 * Composant de la bibliothqèe PSYL d'évaluation de liste.
 * Un module d'évaluation dispose d'une série de fonction qui permettront de résoudre l'évaluation de liste à opcode
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

interface Intf {
  /** Renvoie le nom de la fonction associé à l'opcode.
   * @param $sOpcode string, opcode
   * @return string nom de fonction
   */
  public function getOpcodeFunction($sOpcode);

  /** Renvoie TRUE si l'opcode est géré par ce module.
   * Si l'opcode est géré par ce module on peut utiliser evaluate() avec la liste de cet opcode
   * @param $sOpcode string, Opcode à résoudre
   * @return boolean TRUE: l'ocode est géré, FALSE l'opcode n'est pas géré
   */
  public function hasOpcode($sOpcode);

  /** Défini l'évaluateur à utiliser pour évaluer les liste transmises à evaluate()
   * @param $oEvaluator O876\Psyl\Evaluator Instance de l'évaluator à utiliser
   */
  public function setEvaluator(\O876\Psyl\Evaluator $oEvaluator);

  /** Evaluation d'une liste
   * @param $aList array, structure de liste
   * @return Retour de l'évaluation (chaine ou liste)
   */
  public function evaluate($aList);
}
