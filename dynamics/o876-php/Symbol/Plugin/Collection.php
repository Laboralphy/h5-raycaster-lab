<?php namespace O876\Symbol\Plugin;

use O876\Symbol\Symbol as Symbol;
use O876\Symbol\Exception as SymbolException;

class Collection {

  protected static $oInstance = null;

  protected $_aPlugins;
  
  protected function __construct() {
    $this->_aPlugins = array();
  }

  public static function getInstance() {
    if (is_null(self::$oInstance)) {
      self::$oInstance = new self();
    }
    return self::$oInstance;
  }

  public function addPlugin(Intf $oPlugin) {
  	$a = explode("\\", get_class($oPlugin));
  	$k = strtolower(array_pop($a));
    $this->_aPlugins[$k] = $oPlugin;
  }

  public function __call($name, $arguments) {
    if (isset($this->_aPlugins[$name])) {
      $oPlugin = $this->_aPlugins[$name];
      call_user_func_array(array($oPlugin, 'run'), $arguments);
    } else {
		throw new SymbolException('unknown symbol method : ' . $name);
	}
  }
}
