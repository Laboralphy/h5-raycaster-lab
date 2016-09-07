<?php namespace O876\Symbol\HTML;

use O876\Symbol\Symbol as Symbol;

class ScriptCollection extends Symbol {
  protected $_aScripts = array();

  public function __construct() {
    parent::__construct('');
    $this->setRenderer('Null');
  }

  public function appendScript($sFile) {
    if (!in_array($sFile, $this->_aScripts)) {
      $this->_aScripts[] = $sFile;
      $oLink = $this->append(new Symbol('script'));
      $oLink->src = $sFile;
      $oLink->type = 'application/javascript';
      $oLink->setRenderer('HTMLScript');
    }
  }
}
