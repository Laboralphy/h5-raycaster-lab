<?php namespace O876\Symbol\Renderer;

require_once('HTML.php');

class HTMLCompact extends HTML {
  public function __construct() {
    parent::__construct();
    $this->sLineBreaker = '';
    $this->sIndenter = '';
  }
}
