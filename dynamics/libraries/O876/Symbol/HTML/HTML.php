<?php namespace O876\Symbol\HTML;

use O876\Symbol\Symbol as Symbol;


class HTML extends Symbol {
  protected $_oBody;
  protected $_oHead;
  protected $_oCSSCollection;
  protected $_oTitle;
  protected $_oScriptCollection;
  protected $_oMetaCollection = null;
  public $sDocType = '<!DOCTYPE html>';
  
  public function __construct() {
    parent::__construct('html');
    $this->_oHead = $this->append(new Symbol('head'));
    $this->getMeta()->setMeta('charset', 'UTF-8');
    $this->_oTitle = $this->_oHead->append(new Symbol('title'));
    $this->_oCSSCollection = $this->_oHead->append(CSSCollection::getInstance());
    $this->_oBody = $this->append(new Symbol('body'));
    $this->setRoot($this->_oBody);
    $this->_oScriptCollection = $this->_oHead->append(new ScriptCollection());
  }
  
	public function setTitle($sTitle) {
		$this->_oTitle->removeAllSymbols();
		$this->_oTitle->append($sTitle);
	}

	public function appendStyleSheet($sFile) {
		if (is_array($sFile)) {
			foreach ($sFile as $f) {
				$this->appendStyleSheet($f);
			}
			return;
		} else {
			$this->_oCSSCollection->appendStyleSheet($sFile);
		}
	}

	public function appendScript($sFile) {
		if (is_array($sFile)) {
			foreach ($sFile as $f) {
				$this->appendScript($f);
			}
			return;
		} else {
			$this->_oScriptCollection->appendScript($sFile);
		}
	}

  public function getBody() {
    return $this->_oBody;
  }
  
  public function getHead() {
    return $this->_oHead;
  }
  
  public function getMeta() {
    if (is_null($this->_oMetaCollection)) {
      $this->_oMetaCollection = $this->_oHead->append(new MetaCollection());
    }
    return $this->_oMetaCollection;
  }
  
  public function setMetaValue($sVar, $sVal) {
    $this->getMeta()->setValue($sVar, $sVal);
  }

  public function setHttpEquiv($sVar, $sVal) {
    $this->getMeta()->setHttpEquiv($sVar, $sVal);
  }
  
  protected function _render($oRenderer = null) {
    return $this->sDocType . "\n" . parent::_render($oRenderer);
  }
}
?>
