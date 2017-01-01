<?php
namespace O876\MVC\View;

use O876\MVC as M;

/**
 * @brief Objet de gestion de vue.
 * 
 * @author Ralphy
 * @version 100
 *          @date 2010-09-23
 *          @details Cette classe générée par l'Application permet d'aller chercher le script de vue adéquat et de le completer avec
 *          les valeurs fournies par le contrôleur.
 */
class Data {
	const VIEWS_PATH = 'View';
	const VIEWS_SCRIPTS_PATH = 'View/scripts';
	
	/**
	 * liste des données de vue
	 * Ces données seront accessible en tant que propriété de l'objet View Data.
	 * Dans la vue, l'objet $this est l'objet View Data ; on accède donc aux donnée via $this->....
	 * @var array
	 */
	protected $_aData = array ();
	
	/**
	 * Nom du script de vue
	 * @var string
	 */
	protected $_sScript = '';
	
	/**
	 * Emplacement du script de vue
	 * @var string
	 */
	protected $_sScriptLocation = '';
	
	/**
	 * Dans le cas ou on opte pour une fonction callback plutot qu'un script de vue
	 * cette variable contiendra la fonction lambda
	 * @var function
	 */
	protected $_oFunction = '';
	
	/**
	 * Nom de l'application
	 * 
	 * @var string
	 */
	protected $_sAppName = '';
	
	/**
	 * @brief Définition du nom du script de vue.
	 * @details Définit le nom du script de vue. Ce nom correspond au fichier se trouvant dans le repertoire de vues.
	 * On ne spécifie que le nom de base sans l'extension
	 * 
	 * @example $view->setScript('vwIndex'); // Pas besoin de spécifier l'extension '.php'
	 * @param string $s Str, nom du script de vue
	 */
	public function setScript($s) {
		$this->_sScript = $s;
	}
	
	/**
	 * Défini l'emplacement du script de vue
	 * @param string $s
	 */
	public function setScriptLocation($s) {
		$this->_sScriptLocation = $s;
	}
	
	/**
	 * Défini le nom de l'application
	 * @param string $s
	 */
	public function setAppName($s) {
		$this->_sAppName = $s;
	}
	
	/**
	 * Défini la fonction de callback dans le cas où on opte une vue callback
	 * plutôt qu'un script de vue.
	 * 
	 * @param function $s fonction lambda
	 */
	public function setFunction($s) {
		$this->_oFunction = $s;
	}
	
	/**
	 * @brief Renvoie le nom du script de vue.
	 * @details Renvoie le nom du script de vue tel qu'il a été défini à l'aide de la méthode setScript.
	 * 
	 * @return string nom du script de vue.
	 */
	public function getScript() {
		return $this->_sScript;
	}
	
	/**
	 * nom du script de vue
	 * @return string
	 */
	public function getScriptName() {
		return self::VIEWS_PATH . $this->_sScript . '.php';
	}
	
	/**
	 * Gestion de l'affectation des données de vue
	 * @param string $sVariable
	 * @param string $sValue
	 */
	public function __set($sVariable, $sValue) {
		$this->setData ( $sVariable, $sValue );
	}
	
	/**
	 * Gestion de l'affectation des données de vue
	 * @param string $sVariable
	 * @return multitype:
	 */
	public function __get($sVariable) {
		return $this->getData ( $sVariable );
	}
	
	/**
	 * Gestion de l'affectation des données de vue
	 * @param string $sVariable
	 * @return boolean
	 */
	public function __isset($sVariable) {
		return array_key_exists ( $sVariable, $this->_aData );
	}
	
	/**
	 * Gestion des helpers.
	 * @param string $sMethod
	 * @param array $aParams
	 * @return mixed
	 */
	public function __call($sMethod, $aParams) {
		$sHelper = $sMethod . 'Helper';
		$oHelper = new $sHelper ();
		$oHelper->setView ( $this );
		return call_user_func_array ( array (
				$oHelper,
				$sMethod 
		), $aParams );
	}
	
	/**
	 * Modifie une donnée de vue 
	 * @param string $s nom de la donnée de vue
	 * @param string $v valeur de la donnée de vue
	 */
	public function setData($s, $v) {
		$this->_aData [$s] = $v;
	}
	
	/**
	 * Récupère la valeur d'une donnée de vue
	 * @param string $s
	 * @return multitype:
	 */
	public function getData($s) {
		return $this->_aData [$s];
	}
	
	/**
	 * Récupère un tableau associatif contenant toutes les données de vue
	 * pratique quand on ne connais pas à l'avance les données
	 * @return multitype:
	 */
	public function getDataArray() {
		return $this->_aData;
	}
	
	/**
	 * @brief Tester l'existence d'une donnée.
	 * @details Teste l'existence d'une donnée précédemment définie par setData().
	 * 
	 * @param string $s nom de la donnée
	 * @return Bool, résultat du test. True = la donnée existe.
	 */
	public function hasData($s) {
		return array_key_exists ( $s, $this->_aData );
	}
	
	/**
	 * Procède à l'inclusion du script de vue dans contexte
	 * @throws M\Exception
	 */
	public function includeView() {
		$sView = $this->getScript ();
		if (is_null ( $sView )) {
			if ($this->_oFunction) {
				$oFunction = $this->_oFunction;
				return $oFunction ( $this );
			}
			return;
		}
		$sFile = $this->_sAppName . '/' . $this->_sScriptLocation . '/' . self::VIEWS_SCRIPTS_PATH . '/' . $sView . '.php';
		if (file_exists ( $sFile )) {
			try {
				require_once $sFile;
			} catch ( \Exception $e ) {
				$this->setScript ( 'error/error' );
				$this->setData ( 'error', $e );
				$this->includeView ();
			}
		} else {
			throw new M\Exception ( 'view not found : ' . $sFile );
		}
	}
}
