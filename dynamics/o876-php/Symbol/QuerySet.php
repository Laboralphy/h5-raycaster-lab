<?php
namespace O876\Symbol;

/**
 * Classe regroupant les symboles trouvés lors d'une recherche
 */
class QuerySet implements \Countable, \ArrayAccess {
	protected $_aSet;
	
	public function __construct($aSet) {
		$this->_aSet = $aSet;
	}
	
	/**
	 * appelle la methode spécifiée pour chaque symbol dans le set
	 */
	public function __call($name, $arguments) {
		$bFirst = true;
		$xValue = null;
		foreach ($this->_aSet as $oSymbol) {
			$value = call_user_func_array(array($oSymbol, $name), $arguments);
			if ($bFirst) {
				$xValue = $value;
				$bFirst = false;
			}
		}
		return $xValue;
	}
	
	/**
	 * Renvoie la valeur de l'attribut du premier élément du set
	 */
	public function __get($sName) {
		if (count($this->_aSet)) {
			return $this->_aSet[0]->$sName;
		} else {
			return null;
		}
	}

	/**
	 * Modifie la valeur de l'attribut des éléments du set
	 */
	public function __set($sName, $sValue) {
		foreach ($this->_aSet as $oSymbol) {
			$oSymbol->$sName = $sValue;
		}
	}
	
	
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/

	public function current() {
		return current($this->_aSet);
	}

	public function key() {
		return key($this->_aSet);
	}

	public function next() {
		next($this->_aSet);
	}

	public function rewind() {
		reset($this->_aSet);
	}

	public function valid() {
		return isset($this->_aSet[key($this->_aSet)]);
	}

  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/

	public function count() {
		return count($this->_aSet);
	}

  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/

	public function offsetExists($sOffset) {
		return isset($this->_aSet[$sOffset]);
	}

	public function offsetGet($sOffset) {
		if (isset($this->_aSet[$sOffset])) {
			return $this->_aSet[$sOffset];
		}
		return null;
	}

  /**
   * $oSymbol[0] = $oNew : Affecte (remplace) le nIeme enfant
   */
	public function offsetSet($sOffset, $xValue) {
		if (is_null($sOffset)) {
			$this->_aSet[] = $xValue;
		} else { // Si l'offset est numérique, il désigne le nième enfant
			$this->_aSet[$sOffset] = $xValue;
		}
	}

	public function offsetUnset($sOffset) {
		unset($this->_aSet[$sOffset]);
	}
}
