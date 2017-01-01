<?php namespace O876\Symbol\HTML;

/** 
 * CSSCollection permet de contenir plusier fichiers CSS.
 * C'est un singleton.
 */

use O876\Symbol\Symbol as Symbol;

class CSSCollection extends Symbol {
  static protected $oInstance = null;
  protected $oLinkRenderer;

  public function __construct() {
    parent::__construct('');
    $this->setRenderer('Null');
  }

  public static function getInstance() {
    if (is_null(self::$oInstance)) {
      self::$oInstance = new self();
    }
    return self::$oInstance;
  }

  public function appendStyleSheet($sFile, $sMedia = 'screen') {
    $oLink = $this->append(new Symbol('link'));
    $oLink->rel = "stylesheet";
    $oLink->type = "text/css";
    $oLink->href = $sFile;
    $oLink->media = $sMedia ;
    $oLink->setRenderer('HTML');
  }
}
