<?php namespace O876\Symbol\Renderer;

use O876\Symbol\Symbol;

class Null implements Intf {
  public function preRender(Symbol $oSymbol) {
    return '';
  }

  public function postRender(Symbol $oSymbol) {
    return '';
  }
}