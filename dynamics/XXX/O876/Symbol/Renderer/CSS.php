<?php namespace O876\Symbol\Renderer;
require_once('Intf.php');

use O876\Symbol\Symbol as Symbol;
use O876\Symbol\Renderer\Intf as Intf;

class CSS implements Intf {
  protected function renderAttribute($sAttr, $sVal) {
    return '  ' . strtr($sAttr, '_', '-') . ': ' . $sVal . ';' . "\n";
  }

  protected function renderAttributes($aAttr) {
    $s = '';
    foreach ($aAttr as $k => $v) {
      $s .= $this->renderAttribute($k, $v);
    }
    return $s;
  }

  public function preRender(Symbol $oSymbol) {
    return $oSymbol->getTag() . ' {' . "\n" . $this->renderAttributes($oSymbol->getAttributes()) . '}' . "\n\n";
  }

  public function postRender(Symbol $oSymbol) {
    return '';
  }
}
