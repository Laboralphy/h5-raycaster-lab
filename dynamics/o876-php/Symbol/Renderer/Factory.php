<?php namespace O876\Symbol\Renderer;


class Factory {
  protected $aRenderers;
  protected static $oInstance = null;

  protected function __construct() {
    $this->aRenderers = array();
  }

  public static function getInstance() {
    if (is_null(self::$oInstance)) {
      self::$oInstance = new self();
    }
    return self::$oInstance;
  }

  /** Fournis l'instance instance d'un Rendererer
   * Chaque classe est instanciée une seule fois.
   * @param string $sRenderer Nom du renderer
   * @return Intf
   */
  public function getRenderer($sRenderer) {
    if (!$this->isRendererLoaded($sRenderer)) {
      $sClassName = $sRenderer;
      $sClassNSName = __NAMESPACE__ . '\\' . $sClassName;
      require_once $sClassName . '.php';
      $this->aRenderers[$sRenderer] = new $sClassNSName();
    }
    return $this->aRenderers[$sRenderer];
  }

  /** Indique si un renderer a déjà été chargé.
   * @param string $sRenderer Nom du renderer
   * @return boolean
   */
  public function isRendererLoaded($sRenderer) {
    return isset($this->aRenderers[$sRenderer]);
  }
}
