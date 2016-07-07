<?php
require_once 'laby.inc.php';

if (!is_null($nSeed = getSeed())) {
  if (isHTML()) {
    renderHTML(generateLaby(getGenerator(), $nSeed));
  } else {
    print generateLaby(getGenerator(), $nSeed)->renderJSON();
  }
}
