<?php namespace O876;

class Loader {
  private static $oInstance = null;
  private $aRoutes;
  protected $aPath;
  protected $aCache;

  public function __construct() {
    spl_autoload_register(__NAMESPACE__ . '\Loader::autoload');
    $this->aRoutes = array();
    $this->aPath = array();
    $this->aCache = array();
    $this->setRoute(__NAMESPACE__, realpath(dirname(__FILE__)));
  }

  /** Retourne l'instance du singleton
   * @return Loader
   */
  public static function getInstance() {
    if (is_null(self::$oInstance)) {
      self::$oInstance = new self();
    }
    return self::$oInstance;    
  }

  /** Associe un namespace à un chemin sur le disque du serveur
   * @param $sNamespace string nom du namespace à router
   * @param $sDir chemin où sont les fichier du namespace
   */
  public function setRoute($sNamespace, $sDir) {
    $this->aRoutes[$sNamespace] = $sDir;
  }

  /** Renvoie les routes définies par setRoute
   * @return array
   */
  public function getRoutes() {
    return $this->aRoutes;
  }

  /** Ajoute un chemin de recherche
   *
   * @param $sPath nouveau chemin à rajouter à l'include path
   */
  public function addPath($xPath) {
    if (is_array($xPath)) {
      $this->aPath = array_merge($this->aPath, $xPath);
    } else {
      $this->aPath[] = $xPath;
    }
  }

  /** Méthode d'autochargement des classes
   */
  public static function autoload($sClass) {
    $oThis = self::getInstance();
    if (isset($oThis->aCache[$sClass])) {
      require_once $oThis->aCache[$sClass];
      return true;
    }
    $aRoutes = $oThis->getRoutes();
    $aRoutes['\\'] = '/';
    $sFile = strtr($sClass, $aRoutes) . '.php';
    if (file_exists($sFile)) {
      require_once $sFile;
      return true;
    }
    foreach ($oThis->aPath as $sPath) {
      $sFile = $sPath . '/' . ucfirst($sClass) . '.php';
      if (file_exists($sFile)) {
        $oThis->aCache[$sClass] = $sFile;
        require_once $sFile;
        return true;
      }
    }
    throw new \Exception('Class not found: ' . $sClass);
  }
}

