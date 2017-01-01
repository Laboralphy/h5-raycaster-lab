<?php
namespace O876\MVC;

use O876\Loader as Loader;

/**
 * Classe gérant l'ensemble du fonction MVC de l'application
 * @author raphael.marandet
 *
 */
class Application {
	const PARAM_ACTION = 'action';
	const ACTION_DEFAULT_VALUE = 'index';
	const CONTROLLER_ACTION_REQUEST_SEPARATOR = '.';
	const CONTROLLER_DEFAULT_VALUE = 'index';
	const CONTROLLER_SUFFIX = 'Controller';
	const ACTION_SUFFIX = 'Action';
	
	/**
	 * Objet Request
	 * Cet objet est instancié par le boostrap (en fonction du nom de classe donnée par le runApplication)
	 * Dans le cas d'une application batch en ligne de commande, il conviendrait d'ajouter un fichier batch.php (à coté du index.php)
	 * et de faire "runApplication(......., new CliRequest....)" bon bref
	 * @var Request
	 */
	protected $_oRequest;
	
	/**
	 * Objet controlleur actuellement soliscité
	 * @var O876\MVC\Controller\Intf
	 */
	protected $_oController;
	
	/**
	 * Objet vue
	 * @var O876\MVC\View\Data
	 */
	protected $_oView;
	
	/**
	 * Nom du controlleur
	 * @var string
	 */
	protected $_sController;
	
	/**
	 * Nom de l'action
	 * @var string
	 */
	protected $_sAction;
	
	/**
	 * Nom de l'application
	 * @var string
	 */
	protected $_sName;
	
	/**
	 * Emplacement de l'application
	 * @var string
	 */
	protected $_sLocation;
	
	/**
	 * liste des adapteurs ?
	 * @var array
	 */
	protected $_aAdapters = array ();
	
	/**
	 * @brief Objet de configuration
	 * @details Instance de l'objet de configuration de type IConfig
	 */
	protected $_oConfig;
	
	/**
	 * @brief Liste des plugins
	 * @details Array, Les plugins chargés sont stockés dans cette structure.
	 */
	protected $_aPlugins = array ();
	
	/**
	 * @brief Instance du singleton.
	 * @detail Instance d'Application. Variable statique.
	 */
	protected static $_oInstance = null;
	
	/**
	 * Contructeur
	 */
	protected function __construct() {
	}
	
	/**
	 * Définit les paramètre de configurations
	 * Il s'agit généralement de la configuration de la base de donnée
	 * @param array $oConfig
	 */
	public function setConfig($oConfig = null) {
		$this->_oConfig = $oConfig;
	}
	
	/**
	 * Renvoie le tableau de configuration
	 * @return string
	 */
	public function getConfig() {
		return $this->_oConfig;
	}
	
	/**
	 * Défini l'objet requête
	 * @param O876\MVC\Request\Intf $r Objet requête
	 */
	public function setRequest(Request\Intf $r) {
		$this->_oRequest = $r;
	}
	
	/**
	 * Renvoie l'objet request
	 * @return \O876\MVC\Request
	 */
	public function getRequest() {
		return $this->_oRequest;
	}
	
	/**
	 * Renvoie le controlleur
	 * @return \O876\MVC\O876\MVC\Controller\Intf
	 */
	public function getController() {
		return $this->_oController;
	}
	
	/**
	 * Ajoute un plugin de controleur
	 * @param Controller\Plugin\Intf $oPlugin
	 */
	public function addPlugin(Controller\Plugin\Intf $oPlugin) {
		$this->_aPlugins [] = $oPlugin;
	}
	
	/**
	 * Ouverture de la connexion à la base de données
	 * Dans le cas ou la config contiendrai des données de connexion
	 * L'application centralise les adapteur afin d'éviter les doublons de connexion
	 * @return NULL|multitype:|unknown
	 */
	public function openDbConnection() {
		$aDbConfig = $this->_oConfig->getDatabaseConfig ();
		if (! array_key_exists ( 'adapter', $aDbConfig )) {
			return null;
		}
		$sAdapter = $aDbConfig ['adapter'];
		if (array_key_exists ( $sAdapter, $this->_aAdapters )) {
			return $this->_aAdapters [$sAdapter];
		}
		$sClass = 'Adapter\\' . $sAdapter;
		$oAdapter = new $sClass ( $aDbConfig );
		return $this->_aAdapters [$sAdapter] = $oAdapter;
	}
	
	/**
	 * Fonction principale du framework
	 */
	public function main() {
		// Obtenir l'objet requête
		if (is_null ( $this->_oRequest )) {
			throw new Exception ( 'no request object specified' );
		}
		try {
			$oLoader = Loader::getInstance ();
			$this->_oConfig->configLoader ( $oLoader );
			$this->_aPlugins = $this->_oConfig->getPluginList ();
			if (is_array($this->_aPlugins)) {
				foreach ( $this->_aPlugins as $p ) {
					if (is_string($p)) {
						$p = new $p();
					}
					$p->setRequest ( $this->_oRequest );
					$p->preControl ();
				}
			}
			// Déterminer le controleur et l'action
			$this->getControllerAction ();
			// Instancier le controlleur lancer l'action
			$this->runController ( $this->_sController, $this->_sAction );
			if (is_array($this->_aPlugins)) {
				foreach ( $this->_aPlugins as $p ) {
					$p->setView ( $this->_oView );
					$p->postControl ();
				}
			}
			$this->_oView->includeView ();
		} catch ( \Exception $e ) {
			$this->_oView = new View\Data ();
			$this->_oView->setAppName ( $this->_sName );
			$this->_oView->setScriptLocation ( $this->_sLocation );
			$this->_oView->setScript ( 'error/error' );
			$this->_oView->setData ( 'error', $e );
			$this->_oView->includeView ();
		}
	}
	
	/**
	 * Lancement d'une action de controlleur
	 * @param string $sController
	 * @param string $sAction
	 */
	protected function runController($sController, $sAction) {
		$sController = $sController . self::CONTROLLER_SUFFIX;
		$this->_oController = new $sController ();
		$this->checkController ( $this->_oController );
		$this->runAction ( $this->_oController, $this->_sAction );
	}
	
	/**
	 * Quelques réglage sur un controlleur fraichement instancié
	 * @param Controller\Action $oController
	 */
	protected function checkController(Controller\Action $oController) {
		$oController->setApplication ( $this );
		$oController->setRequest ( $this->_oRequest );
	}
	
	/**
	 * Lance l'action spécifiée
	 * @param Controller\Action $oController
	 * @param string $sAction
	 * @throws Exception
	 */
	protected function runAction(Controller\Action $oController, $sAction) {
		$sActionFunc = $sAction . self::ACTION_SUFFIX;
		if (method_exists ( $oController, $sActionFunc )) {
			$oController->getView ()->setScript ( strtolower ( $this->_sController ) . '/' . $sAction );
			$oController->$sActionFunc ();
			$this->_oView = $oController->getView ();
			$this->_oView->setAppName ( $this->_sName );
			$this->_oView->setScriptLocation ( $this->_sLocation );
		} else {
			throw new Exception ( 'action not found: ' . $this->_sController . '/' . $sActionFunc );
		}
	}
	
	/**
	 * Récupération des noms du controleur et de l'action
	 * les propriétés _sController et _sAction sont mises à jour par cette méthode
	 * en focntion des paramètre de requete
	 */
	protected function getControllerAction() {
		$sController = $this->_oRequest->getParam ( self::PARAM_ACTION );
		if ($sController) {
			$aController = explode ( self::CONTROLLER_ACTION_REQUEST_SEPARATOR, $sController );
			$sController = $aController [0];
			if (count ( $aController ) > 1) {
				$sAction = $aController [1];
			} else {
				$sAction = self::ACTION_DEFAULT_VALUE;
			}
		} else {
			$sController = self::CONTROLLER_DEFAULT_VALUE;
			$sAction = self::ACTION_DEFAULT_VALUE;
		}
		$this->_sController = ucfirst ( strtolower ( $sController ) );
		$this->_sAction = strtolower ( $sAction );
	}
	
	/**
	 * @brief Renvoie l'instance du singleton
	 * @details Renvoie la première instance de l'application.
	 * Si la classe Application n'a jamais été instanciée, alors la fonction en instancie une au préalable.
	 * 
	 * @return Instance d'Application
	 */
	public static function getInstance() {
		if (is_null ( self::$_oInstance )) {
			self::$_oInstance = new self ();
		}
		return self::$_oInstance;
	}
	
	/**
	 * @brief défini le chemin de l'application
	 */
	public function setApplicationName($sName, $sLocation = '') {
		$oLoader = Loader::getInstance ();
		$oLoader->addPath ( array (
				$sName . '/' . $sLocation . '/Config',
				$sName . '/' . $sLocation . '/Controller',
				$sName . '/' . $sLocation . '/Controller/Plugin',
				$sName . '/' . $sLocation . '/Model',
				$sName . '/' . $sLocation . '/View',
				$sName . '/' . $sLocation . '/View/Helper' 
		) );
		$this->_sName = $sName;
		$this->_sLocation = $sLocation;
	}
	
	/**
	 * Getter de l'emplacement de l'application  
	 * @return string
	 */
	public function getApplicationPath() {
		return $this->_sName . '/' . $this->_sLocation;
	}
}
