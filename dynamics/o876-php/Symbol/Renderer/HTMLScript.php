<?php namespace O876\Symbol\Renderer;

require_once('HTMLCompact.php');
use O876\Symbol\Symbol as Symbol;

class HTMLScript extends HTMLCompact {
  public function isBlock(Symbol $oSymbol) {
    return false;
  }

  public function preRender(Symbol $oSymbol) {
    return '    '.parent::preRender($oSymbol);
  }

  public function postRender(Symbol $oSymbol) {
    return parent::postRender($oSymbol) . "\n";
  }
}
