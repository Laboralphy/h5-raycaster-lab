<?php namespace O876\Psyl\Module;

/** @brief Module d'évaluation d'expressions mathematiques
 * 
 * Composant de la bibliothèque PSYL d'évaluation de liste.
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

class Core extends Abst {
  protected $aStack = array(array());
  protected $aStackIndex = 0;

  public function hasOpcode($sOpcode) {
    if ($this->isVariableExists($sOpcode)) {
      return true;
    }
    return parent::hasOpcode($sOpcode);
  }

  public function getOpcodeFunction($sOpcode) {
    if ($this->isVariableExists($sOpcode)) {
      return 'evaluateFunction';
    } else {
      return parent::getOpcodeFunction($sOpcode);
    }
  }

  public function isFunction($aList) {
    return is_array($aList) && count($aList) == 2 && is_array($aList[0]) && is_array($aList[1]);
  }

  public function evaluateFunction($aList) {
    $sFunction = $aList[0];
    $aFunction = $this->getVariable($sFunction);
    if (!$this->isFunction($aFunction)) {
      return $aFunction;
    }
    $aParameters = $aFunction[0];
    $oLet = array('let');
    for ($i = 1; $i < count($aList); $i++) {
      $sParameter = $aParameters[$i - 1];
      $sValue = $this->evaluate($aList[$i]);
      $oLet[] = array($sParameter, $sValue);
    }
    $oLet[] = $aFunction[1];
    return $this->evaluate($oLet);
  }

  public function pushStack() {
    $this->aStack[] = $this->aStack[$this->aStackIndex];
    $this->aStackIndex++;
  }

  public function popStack() {
    array_pop($this->aStack);
    $this->aStackIndex--;
  }

  public function isVariableExists($s) {
    return array_key_exists($s, $this->aStack[$this->aStackIndex]);
  }

  public function getVariable($s) {
    if ($this->isVariableExists($s)) {
      return $this->aStack[$this->aStackIndex][$s];
    } else {
      return null;
    }
  }

  public function setVariable($s, $v) {
    return $this->aStack[$this->aStackIndex][$s] = $v;
  }


  public function opcode_set($a) {
    return $this->setVariable($this->evaluate($a[1]), $this->evaluate($a[2]));
  }

  public function opcode_list($a) {
    $aList = array();
    for ($i = 1; $i < count($a); $i++) {
      $aList[] = $this->evaluate($a[$i]);     
    }
    return $aList;
  }

  public function opcode_last($a) {
    if (count($a) > 1 && count($a[1])) {
      return $this->evaluate($a[1][count($a) - 1]);     
    } else {
      return null;
    }
  }

  public function opcode_prog($a) {
    $x = null;
    for ($i = 1; $i < count($a); $i++) {
      $x = $this->evaluate($a[$i]);     
    }
    return $x;
  }

  public function opcode_first($a) {
    if (count($a) > 1 && count($a[1])) {
      return $this->evaluate($a[1][0]);     
    } else {
      return null;
    }
  }

  public function opcode_quote($a) {
    array_shift($a);
    return $a;
  }

  public function opcode_function($a) {
    return array($a[1], $a[2]);
  }

  public function opcode_let($a) {
    $i = 0;
    $nCount = count($a) - 1;
    foreach ($a as $aCode) {
      if ($i == 0 && $i != $nCount) { // init
        $this->pushStack();
      } elseif ($i == $nCount) { // code
        $xReturn = $this->evaluate($aCode);
        $this->popStack();
        return $xReturn;
      } else { // variable
        $this->setVariable($this->evaluate($aCode[0]), $this->evaluate($aCode[1]));
      }
      $i++;
    }
  }
}
