<?php

/* types de pièce dans un donjon
- *couloir : simple couloir avec ou sans bifurcation, coude, ou impasse
- hall : grande pièce sans fonction précise
- *cellule : pièce contenant un compartiment fermé par des barreau
- *bibliothèque : pièce contenant de nombreux rayonnages de livres
- bureau: pièce de travail contenant des meubles, des 
- laboratoire : pièce de travail
- entrepot : petite pièce contenant des objets
- cuisine : pièce de travail
- salle de garde
- salle de trésor
*/

require_once 'classes/RandomGenerator.php';

function getSeed() {
  global $argv, $argc;
  if (isset($_GET['s'])) {
    return (int) $_GET['s'];
  } elseif ($argc > 2) {
    return (int) $argv[2];
  } else {
    return 0;
  }
}

function getOptions() {
  if (isset($_GET['o'])) {
    return $_GET['o'];
  } else {
    return '';
  }
}

function isHTML() {
  if (isset($_GET['h'])) {
    return (int) $_GET['h'];
  } else {
    return 0;
  }
}

function getGenerator() {
  global $argv, $argc;
  if (isset($_GET['g'])) {
    return $_GET['g'];
  } elseif ($argc > 1) {
    return $argv[1];
  } else {
    throw new Exception('missing generator (g) parameter');
  }
}

function getGeneratorClass() {
  $g = getGenerator();
  return ucfirst($g) . 'LevelGenerator';
}

try {
  require_once 'generators/' . getGenerator() . '/' . getGeneratorClass() . '.php';
} catch (Exception $e) {
  print 'use options : g=generator - h=html mode - s=seed - o=options- ';
  print 'available generators : ';
  foreach (scandir('generators') as $sGenerator) {
    if ($sGenerator[0] != '.') {
      print $sGenerator . ' - ';
    }
  }
  print '<br />options are usually used this way : o=-rs2-ls1';
}


/** Affiche une version HTML du labyrynthe transmis en paramètre
 * @param $oLaby LevelGenerator
 * @return chaine HTML
 */
function renderHTML($oLaby) {
  $nNext = intval(getSeed()) + 1;
  $nPrev = intval(getSeed()) - 1;
  $aBlocks = array();
  $aConsts = get_defined_constants(true);
  $aConsts = $aConsts['user'];
  foreach ($aConsts as $sConst => $nValue) {
  	if (substr($sConst, 0, 6) === 'BLOCK_') {
  		$aBlocks[] = $sConst . ': ' . $nValue;
  	}
  }
  $sJSConsts = "var LABY = {\n" . implode(",\n", $aBlocks) . "\n};";
  
  print '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>RoomGenerator</title>
    <script src="../../libraries/O876/o2.js" type="text/javascript"></script>
    <script src="../../libraries/O876/XHR.js" type="text/javascript"></script>
  	<script src="../../libraries/Raycaster/Tools/MathTools.js" type="text/javascript"></script>
    <script src="../../libraries/O876/Astar.js" type="text/javascript"></script>
  	<script type="text/javascript">
' . $sJSConsts . ' 
var MAP = ' . $oLaby->renderJSON() . ';
    </script>
    <script src="checker/labychecker.js" type="text/javascript"></script>
    <style type="text/css">' .
$oLaby->renderCSS() .
'
    </style>
    
  </head>
  <body>
    <button type="button" onclick="parent.location=\'?s=' . $nPrev . '&h=1&g=' . getGenerator() . '&o='.$_GET['o'].'\'">Laby #' . $nPrev . '</button>
    <big> - '.getSeed().' - </big>
    <button type="button" onclick="parent.location=\'?s=' . $nNext . '&h=1&g=' . getGenerator() . '&o='.$_GET['o'].'\'">Laby #' . $nNext . '</button>';
  print $oLaby->render();
  print '<br /><button type="button" onclick="checkThisLaby()">Check laby</button><button type="button" onclick="checkAllLaby(\''.getGenerator().'\', \''.$_GET['o'].'\', '.getSeed().', '.strval(getSeed() + 100).')">Check all labyrinths</button><br /><code id="checklaby_info"></code>';
  if (isset($oLaby->oChrono)) {
    print '<code>' . implode('<br />', $oLaby->oChrono->render()) . '</code>';
  }

  print '  </body></html>';
}


function generateLaby($sGenerator, $nSeed) {
  $sClass = getGeneratorClass();
  $oLG = new $sClass();
  $oLG->oRnd = RandomGenerator::getInstance();
  $oLG->setOptions(getOptions());
  $oLG->generate($nSeed);
  return $oLG;
}
