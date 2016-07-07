<?php
abstract class LabyRoomHelper {

  protected $oRnd;
  protected $sPath = '';

  public function __construct($oRnd = null) {
    if ($oRnd) {
      $this->oRnd = $oRnd;
    } else {
      $this->oRnd = RandomGenerator::getInstance();
    }
  }

  public static function run($sHelper, $oRoom, $oRnd) {
    $sHelperClass = 'LabyRoom' . basename($sHelper);
    $sDir = dirname($sHelper);
    if ($sDir != '') {
      $sDir .= '/';
    }
    $sDir = 'generators/' . $sDir;
    if (!class_exists($sHelperClass)) {
    	require_once $sDir . $sHelperClass . '.php';
    }
    $oHelper = new $sHelperClass($oRnd);
    $xData = $oHelper->generate($oRoom);
    return $xData;
  }
  
  public abstract function generate($oRoom);
}
