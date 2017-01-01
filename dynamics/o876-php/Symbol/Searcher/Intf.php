<?php namespace O876\Symbol\Searcher;

use O876\Symbol\Symbol as Symbol;

interface Intf {
  public function submit(Symbol $oSymbol, $nDepth);
  public function resetResult();
  public function getResult();
}
