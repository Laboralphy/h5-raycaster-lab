<?php namespace O876\Symbol\Renderer;

require_once('Intf.php');

use O876\Symbol\Symbol as Symbol;
use O876\Symbol\Renderer\Intf as Intf;

class Text implements Intf {
  public function preRender(Symbol $oSymbol) {
    return $oSymbol->getData();
  }

  public function postRender(Symbol $oSymbol) {
    return "";
  }
}
