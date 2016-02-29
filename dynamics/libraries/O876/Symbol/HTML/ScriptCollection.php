<?php namespace O876\Symbol\HTML;

use O876\Symbol\Symbol as Symbol;

class ScriptCollection extends Symbol {
  protected $_aScripts = array();

  public function __construct() {
    parent::__construct('');
    $this->setRenderer('Null');
  }

  public function linkScript($sFile) {
    if (!in_array($sFile, $this->_aScripts)) {
      $this->_aScripts[] = $sFile;
      $oLink = $this->link(new Symbol('script'));
      $oLink->src = $sFile;
      $oLink->type = 'application/javascript';
      $oLink->setRenderer('HTMLScript');
    }
  }

  public function linkScriptFolder($sFolder) {
    foreach (scandir($sFolder) as $sFile) {
      if (preg_match('/\\.js/i', $sFile)) {
        $this->linkScript($sFolder . '/' . $sFile);
      }
    }
  }
}
