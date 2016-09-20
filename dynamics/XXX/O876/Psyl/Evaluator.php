<?php namespace O876\Psyl;

/** @brief Evaluateur de listes au format PSYL
 * 
 * Permet d'évaluer les listes analysée sous forme de structure (par PsylParser)
 * Lance l'exécution des fonctions associées aux opcodes.
 * Les opcode sont codés dans des module qui seront chargeé dans l'évaluateur avant runtime
 *
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

class Evaluator {
  protected $aModules;
  protected $aOpcodes;

  protected $aDebugLog = array();
  protected $aDebugLogLine = array();

  /** Constructeur
   * Initialisation des tableaux
   */  
  public function __construct() {
    $this->aModules = array();
    $this->aOpcodes = array();
  }

  public function debugPrint($s) {
    if (is_array($s)) {
      foreach ($s as $x) {
        $this->debugPrint($x);
      }
    } else {
      $this->aDebugLogLine[] = $s;
    }
  }

  public function debugCr() {
    $this->aDebugLog[] = implode(' ', $this->aDebugLogLine);
    $this->aDebugLogLine = array();
  }

  public function loadModule(Module\Intf $oModule) {
    $this->aModules[] = $oModule;
    $oModule->setEvaluator($this);
  }

  /** Renvoie l'instance du module prenant en charge l'opcode spécifé
   * @param $sOpcode string, opcode
   * @return instance du module trouvé prenant l'opcode ne charge, ou NULL si aucun module ne correspond
   */
  public function seekOpcodeModule($sOpcode) {
    if (array_key_exists($sOpcode, $this->aOpcodes)) {
      return $this->aOpcodes[$sOpcode];
    }
    foreach ($this->aModules as $oModule) {
      if ($oModule->hasOpcode($sOpcode)) {
        return $this->aOpcodes[$sOpcode] = $oModule;
      }
    }
    return null;
  }

  /** Execute l'opcode transmis avec sa liste.
   * Permet aux opcode de rediriger leur exec vers un autre opcode
   * @param $sOpcode Opcode à exécuter
   * @param $aList liste
   * @return retour de l'opcode
   */
  public function runOpcode($sOpcode, $aList) {
    $oModule = $this->seekOpcodeModule($sOpcode);
    if ($oModule) {
      $sCommand = $oModule->getOpcodeFunction($sOpcode);
      return $oModule->$sCommand($aList);
    } else {
      throw new Exception('invalid opcode {' . $sOpcode . '}');
    } 
  }

  /** Evalue la structure
   * @param $a structure parsée
   * @return Atom ou Liste
   */  
  public function evaluate($a) {
    if (is_array($a)) {
      if (count($a)) {
        return $this->runOpcode($a[0], $a);
      } else {
        return null;
      }
    } else {
      return $a;
    }
  }
}

