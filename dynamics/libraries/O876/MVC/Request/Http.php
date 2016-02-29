<?php
namespace O876\MVC\Request;

/**
 * Classe de gestion de requête HTTP
 * @author raphael.marandet
 *
 */
class Http implements Intf {
	/**
	 * liste des paramètre de la requête
	 * @var array
	 */
	protected $_aParams;
	
	/**
	 * Données post brutes
	 * @var string
	 */
	protected $_sPostData = null;
	
	/**
	 * Liste des variables de session
	 * @var array
	 */
	protected $_aSessionVars = null;
	
	/**
	 * Constructeur
	 */
	public function __construct() {
		session_start ();
		$this->_aParams = array_merge ( $_GET, $_POST, $_SERVER );
		$this->_aSessionVars = $_SESSION;
		foreach ( $this->_aSessionVars as $sVariable => $xValue ) {
			$this->_aParams [$sVariable] = $xValue;
		}
		$this->getPostData ();
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Request\Intf::getParam()
	 */
	public function getParam($sName) {
		if (isset ( $this->_aParams [$sName] )) {
			return $this->_aParams [$sName];
		} else {
			return null;
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Request\Intf::getParams()
	 */
	public function getParams() {
		return $this->_aParams;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \O876\MVC\Request\Intf::setParam()
	 */
	public function setParam($sName, $xValue) {
		$this->_aParams [$sName] = $xValue;
		if (array_key_exists ( $sName, $this->_aSessionVars )) {
			$_SESSION [$sName] = $xValue;
		}
	}
	
	public function setSessionParam($sName, $xValue) {
		$_SESSION [$sName] = $xValue;
	}
	
	/**
	 * Permet de récupérer les données post
	 * @return string
	 */
	public function getPostData() {
		if (is_null ( $this->_sPostData )) {
			if ($this->getParam ( 'REQUEST_METHOD' ) === 'POST') {
				$this->setPostData(trim(file_get_contents('php://input')));
			}
		}
		return $this->_sPostData;
	}
	
	/**
	 * Permet de modifier les donnée post brute
	 * @param string $s nouvelle données
	 */	
	 public function setPostData($s) {
	 	$this->_sPostData = $s;
	 }
}
