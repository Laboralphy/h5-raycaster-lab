<?php namespace O876\Symbol\Renderer;
/** Interface de Renderer
 * Basée sur un système de décoration.
 */

use O876\Symbol\Symbol as Symbol;

interface Intf {
  public function preRender(Symbol $oSymbol);
  public function postRender(Symbol $oSymbol);
}