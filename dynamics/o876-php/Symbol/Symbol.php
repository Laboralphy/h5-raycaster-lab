<?php
namespace O876\Symbol;

require_once 'Exception.php';
require_once 'Plugin/Collection.php';
require_once 'Renderer/Factory.php';
require_once 'Searcher/Intf.php';
require_once 'Searcher/CSSSearcher.php';
require_once 'QuerySet.php';
require_once 'XMLParser.php';

/** @brief Symbole de base
 * 
 * La classe Symbol permet de générer un tag composite avec ses attributs.
 * Le tag est affichage sous une forme qui dépendra du Renderer choisi (par défaut HTML)
 * Symbol est un design pattern composite pouvant contenir d'autre instances de la même classe.
 * Symbol est un modèle DOM, des fonction de rechercher permet de sélectionner des branches selon des
 * critères fournir par l'utilisateur. 
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 * @version 101 - 2015.05.04 // total remaniement
 */

class Symbol implements \Countable, \ArrayAccess, \RecursiveIterator {

	const PARAM_TAG = 'tag';               // Tag du symbole
	const PARAM_DATA = 'data';             // chaine CDATA du symbole
	const PARAM_RENDERER = 'renderer';     // Instance du renderer
	const PARAM_ROOT = 'root';             // Root du link
	const PARAM_PARENT = 'parent';         // Parent du symbol
	const PARAM_LINE = 'line';				// ligne source dans le XML
	const PARAM_COLUMN = 'column';			// colone source dans le XML
  
	const PUSH       = -2;
	const UNSHIFT    = -1;
  
	protected $_aAttributes;
	protected $_aSymbols;
	public $_aParameters;

	private $_oRendererFactory;

	private static $_aPlugins;

	/** Constructeur du symbole
	 * 
	 * @param $sTag Nom du tag
	 */
	public function __construct($sTag = '') {
		$this->_aSymbols = array();
		$this->_aAttributes = array();
		self::$_aPlugins = Plugin\Collection::getInstance();
		if (substr(trim($sTag), 0, 1) == '<') {
			$sXMLData = trim($sTag);
			$sTag = null;
		} else {
			$sXMLData = '';
		}
		$this->_oRendererFactory = Renderer\Factory::getInstance();

		$this->_aParameters = array(
			self::PARAM_TAG => $sTag,
			self::PARAM_DATA => '',
			self::PARAM_RENDERER => 0,
			self::PARAM_ROOT => $this,
			self::PARAM_PARENT => null,
			self::PARAM_LINE => 0,
			self::PARAM_COLUMN => 0
		);
		if ($sXMLData) {
			$this->parse($sXMLData, array('textnodes' => true, 'encoding' => 'UTF-8'));
		}
	}

  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/
  /**** ITERATOR *****/

	public function current() {
		return current($this->_aSymbols);
	}

	public function key() {
		return key($this->_aSymbols);
	}

	public function next() {
		next($this->_aSymbols);
	}

	public function rewind() {
		reset($this->_aSymbols);
	}

	public function valid() {
		return isset($this->_aSymbols[key($this->_aSymbols)]);
	}

  /******* RECURSIVE ITERRATOR *********/
  /******* RECURSIVE ITERRATOR *********/
  /******* RECURSIVE ITERRATOR *********/
  /******* RECURSIVE ITERRATOR *********/
  /******* RECURSIVE ITERRATOR *********/
  /******* RECURSIVE ITERRATOR *********/

	public function hasChildren() {
		return count($this->current()) > 0;
	}

	public function getChildren() {
		return $this->current();
	}

  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/
  /******* COUNTABLE *******/

	public function count() {
		return count($this->_aSymbols);
	}

  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/
  /******* ARRAYACCESS *******/

	public function offsetExists($sOffset) {
		return isset($this->_aSymbols[$sOffset]);
	}

	public function offsetGet($sOffset) {
		if (isset($this->_aSymbols[$sOffset])) {
			return $this->_aSymbols[$sOffset];
		}
		return null;
	}

  /**
   * $oSymbol[0] = $oNew : Affecte (remplace) le nIeme enfant
   */
	public function offsetSet($sOffset, $xValue) {
		if (is_null($sOffset)) {
			$this->insert($xValue);
		} elseif (is_numeric($sOffset)) { // Si l'offset est numérique, il désigne le nième enfant
			$this->insert($xValue, (int) $sOffset);
		} else {
			throw new Exception('string key access [' . $sOffset . ']. numeric value required');
		}
	}

	public function offsetUnset($sOffset) {
		if (is_numeric($sOffset)) {
			$this->_removeSymbol($sOffset);
		}
	}
	
	

  /******** MAGIC FUNCTIONS *********/
  /******** MAGIC FUNCTIONS *********/
  /******** MAGIC FUNCTIONS *********/
  /******** MAGIC FUNCTIONS *********/
  /******** MAGIC FUNCTIONS *********/
  /******** MAGIC FUNCTIONS *********/

	public function __set($sName, $sValue) {
		$sName = strtolower($sName);
		$this->_aAttributes[$sName] = $sValue;
	}

	public function __get($sName) {
		$sName = strtolower($sName);
		if (isset($this->_aAttributes[$sName])) {
			return $this->_aAttributes[$sName];
		} else {
			return null;
		}
	}

	public function __isset($sName) {
		return isset($this->_aAttributes[$sName]);
	}

	public function __unset($sName) {
		unset($this->_aAttributes[$sName]);
	}

	public function __toString() {
		return $this->_render();
	}

	public function __clone() {
		$aNew = array();
		foreach ($this->_aSymbols as $k => $oSymbol) {
			$aNew[$k] = clone $oSymbol;
		}
		// PARENT
		$this->_aSymbols = $aNew;
	}

  /** La fonction catch les appels suivants :
   * - Les fonctions set_* 
   * - Les fonctions get_* 
   * Les autre appels sont envoyés aux plugins
   */
	public function  __call($name,  $arguments) {
		$sOp3 = substr($name, 0, 3);
		switch ($sOp3) {
			case 'get': return $this->_aParameters[strtolower(substr($name, 3))];
			case 'set': return $this->_aParameters[strtolower(substr($name, 3))] = $arguments[0];
		}
		array_unshift($arguments, $this);
		call_user_func_array(array(self::$_aPlugins, $name), $arguments);
	}

 
  /******* PROTECTED *********/
  /******* PROTECTED *********/
  /******* PROTECTED *********/
  /******* PROTECTED *********/
  /******* PROTECTED *********/
  /******* PROTECTED *********/

	protected function _getRendererInstance($sRenderer) {
		return $this->_oRendererFactory->getRenderer($sRenderer);
	}

	protected function _render($oRenderer = null) {
		$xRenderer = $this->getRenderer();
		if ($xRenderer instanceof Renderer\Intf) {
			$oRenderer = $xRenderer;
		} elseif (is_string($xRenderer)) {
			$oRenderer = $this->_getRendererInstance($xRenderer);
		}
		if (is_null($oRenderer)) {
			$oRenderer = $this->_getRendererInstance('HTMLCompact');
		}
		$a = $oRenderer->preRender($this);
		foreach ($this as $oSymbol) {
			$a .= $oSymbol->_render($oRenderer);
		}
		$a .= $oRenderer->postRender($this);
		return $a;
	}

  /** Construction et ajout d'un TextNode
   * @param $sText String contenue du texte 
   * @return Symbol de type TextNode
   */
	protected function _buildTextNode($sText) {
		$oTextNode = new self('');
		$oTextNode->setRenderer('Text');
		$oTextNode->setData($sText);
		return $oTextNode;
	}

	/**
	 * Suppression du symbol spécifié (par son offset)
	 * @param $sOffset du Symbol 
	 */
	protected function _removeSymbol($sOffset) {
		if (isset($this->_aSymbols[$sOffset])) {
			$nOffset = (int) $sOffset;
			$oSymbol = $this->_aSymbols[$sOffset];
			$oSymbol->setParent(null);
			array_splice($this->_aSymbols, $nOffset, 1);
			$this->_aSymbols = array_values($this->_aSymbols);
		}
	}

  /******* SYMBOL API ****/
  /******* SYMBOL API ****/
  /******* SYMBOL API ****/
  /******* SYMBOL API ****/
  /******* SYMBOL API ****/
  /******* SYMBOL API ****/

	public function remove() {
		$p = $this->getParent();
		if ($p) {
			$p->_removeSymbol($this->getIndex());
		} else {
			throw new Exception('could not remove a symbol with no parent');
		}
	}
	
	public function clear() {
		foreach ($this->_aSymbols as $s) {
			$oSymbol = $this->_aSymbols[$sOffset];
			$oSymbol->setParent(null);
		}
		$this->_aSymbols = array();
	}
	
	public function append($xSymbol) {
		return $this->insert($xSymbol);
	}

	public function prepend($xSymbol) {
		return $this->insert($xSymbol, 0);
	}
  
  /** Insertion d'un symbol à la position spécifiée parmis les enfants
   * Le nouveau symbole inséré sera de rang $n et poussera l'ancien $n un rang après.
   * @param $xSymbol Nouveau Symbol à insérer
   * @param $n Rang auquel on veut inserer le symbol
   */
	public function insert($xSymbol, $n = null) {
		if (is_null($xSymbol)) {
			$this->_removeSymbol($n);
			return;
		}
		if (is_string($xSymbol)) {
			if (substr(trim($xSymbol), 0, 1) == '<') {
				$sXMLData = trim($xSymbol);
				$xSymbol = new self();
				$xSymbol->parse($sXMLData, array('textnodes' => true, 'encoding' => 'UTF-8'));
			} else {
				$xSymbol = $this->_buildTextNode($xSymbol);
			}
		}
		$oRoot = $this->getRoot();
		if ($oRoot !== $this) {
			return $oRoot->insert($xSymbol, $n);
		}
		$xSymbol->setParent($this);
		if ($n === null || $n >= count($this->_aSymbols)) {
			$this->_aSymbols[] = $xSymbol;
			return $xSymbol;
		}
		array_splice($this->_aSymbols, $n, 0, array($xSymbol));
		return $xSymbol;
	}
	
	public function getData() {
		if ($this->getTag() === '') {
			return $this->_aParameters[self::PARAM_DATA];
		} else {
			$sData = '';
			for ($i = 0; $i < count($this->_aSymbols); ++$i) {
				$oSymb = $this->_aSymbols[$i];
				if ($oSymb->getTag() === '') {
					$sData .= $oSymb->getData();
				}
			}
			return $sData;
		}
	}
	
	public function setData($sData) {
		if ($this->getTag() === '') {
			$this->_aParameters[self::PARAM_DATA] = $sData;
		} else {
			$this->removeAllSymbols();
			$this->append($sData);
		}
	}
	
	public function getPrev() {
		$p = $this->getParent();
		if ($p) {
			$n = $this->getIndex();
			if ($n > 0) {
				return $p[$n - 1];
			}
		}
		return null;
	}
	
	public function getNext() {
		$p = $this->getParent();
		if ($p) {
			$n = $this->getIndex();
			if ($n < (count($p) - 1)) {
				return $p[$n + 1];
			}
		}
		return null;
	}
	
	public function getIndex() {
		$p = $this->getParent();
		if ($p) {
			return array_search($this, $p->_aSymbols);
		} else {
			return -1;
		}
	}

	public function setAttributes(array $aAttr) {
		foreach ($aAttr as $sAttr => $sValue) {
			$this->$sAttr = $sValue;
		}
	}

	public function getAttributes() {
		return $this->_aAttributes;
	}
	
	/**
	 * Gestion des classe CSS
	 */
	public function getClasses() {
		return explode(' ', $this->class);
	}
	
	public function hasClass($sClass) {
		return in_array($sClass, $this->getClasses());
	}
	
	protected function _normalizeClassAttribute() {
		$this->class = implode(' ', array_unique($this->getClasses()));
	} 
	
	public function addClass($sClass) {
		if ($this->class === null || $this->class === '') {
			$this->class = $sClass;
		} else {
			$this->class .= ' ' . $sClass;
		}
		$this->_normalizeClassAttribute();
	}
	
	public function removeClass($sClass) {
		$aRemove = explode(' ', $sClass);
		$aFiltered = array_filter($this->getClasses(), function($s) use ($aRemove) {
			return in_array($s, $aRemove);
		});
		$this->class = implode(' ', $aFiltered);
	}

  /** Analyse un fichier XML, construit le symbol correspondant au DOM complet du XML
   * @param $sXmlData Données XML
   * @param $aParams Paramètres de configurations
   * - encoding string defaut UTF-8 : encodage des données
   * - lowercase boolean : mettre les tags et les noms des attribut en lowercase
   * - textnodes boolean : dans le cas d'un HTML
   */
	public function parse($sXmlData, $aParams = array()) {
		$oXSymbol = new XMLParser();
		$oXSymbol->buildSymbolFromXML($this, $sXmlData, $aParams);
	}
	
	public function query($sQuery) {
		$aSet = $this->search(new Searcher\CSSSearcher($sQuery));
		$oSet = new QuerySet($aSet);
		return $oSet;
	}

	public function search(Searcher\Intf $oSearcher) {
		$oIterator = new \RecursiveIteratorIterator($this, \RecursiveIteratorIterator::SELF_FIRST);
		$oSearcher->resetResult();
		$oSearcher->submit($this, 0);
		foreach ($oIterator as $oSubIterator) {
			$oSearcher->submit($oSubIterator, $oIterator->getDepth());
		}
		return $oSearcher->getResult();
	}

	public static function addPlugin(Plugin\Intf $oPlugin) {
		$oPC = self::$_aPlugins;
		$oPC->addPlugin($oPlugin);
	}
	
	public function removeAllSymbols() {
		while (count($this)) {
			$this->_removeSymbol(0);
		}
	}
}
