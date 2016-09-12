<?php namespace O876\Symbol\HTML;

use O876\Symbol\Symbol as Symbol;

class MetaCollection extends Symbol {
  protected $aVariables = array();
  protected $aHttpEquiv = array();
  protected $aMeta = array();

  public function __construct() {
    parent::__construct('');
    $this->setRenderer('Null');
  }


  public function setValue($sVar, $xVal) {
    $this->aVariables[$sVar] = $xVal;
  }

  public function setMeta($sVar, $xVal) {
    $this->aMeta[$sVar] = $xVal;
  }

  public function setHttpEquiv($sVar, $xVal) {
    $this->aHttpEquiv[$sVar] = $xVal;
  }

  protected function _render($oRenderer = null) {
    foreach ($this->aMeta as $sVar => $xVal) {
      $oLink = $this->append(new Symbol('meta'));
      $oLink->$sVar = $xVal;
      $oLink->setRenderer('HTML');
    }
    foreach ($this->aVariables as $sVar => $xVal) {
      $oLink = $this->append(new Symbol('meta'));
      $oLink->name = $sVar;
      $oLink->content = $xVal;
      $oLink->setRenderer('HTML');
    }
    foreach ($this->aHttpEquiv as $sVar => $xVal) {
      $oLink = $this->append(new Symbol('meta'));
      $oLink->__set('http-equiv', $sVar);
      $oLink->content = $xVal;
      $oLink->setRenderer('HTML');
    }
    return parent::_render($oRenderer);
  }
}
