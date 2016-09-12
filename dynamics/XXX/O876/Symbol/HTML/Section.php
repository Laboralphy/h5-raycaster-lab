<?php namespace O876\Symbol\HTML;

/** @brief Symbol Section
 *
 * Utilisé pour diviser l'écran en sections identifiée horizontale ou verticale
 * permet d'acceder aux section grace à une table d'identifiant
 */

use O876\Symbol\Symbol as Symbol;

class Section extends TableSection {
  const ORIENTATION_VERTICAL = 0;
  const ORIENTATION_HORIZONTAL = 1;

  protected $_aSections = array();

  /** Xonstructeur
   *
   * @param $aSection Tableau d'identifiant, le nombre d'élément indique le nombre de sections créées
   * @param $nOrientation ORIENTATION_VERTICAL ou ORIENTATION_HORIZONTAL
   */
  function defineSections($aSections, $nOrientation) {
    switch ($nOrientation) {
      case self::ORIENTATION_HORIZONTAL:
      $this->setSection('table', count($aSections), 1);
      for ($i = 0; $i < count($aSections); $i++) {
        $this->_aSections[$aSections[$i]] = $this[0][$i];
        $this[0][$i]->id = $aSections[$i];
      }
      break;

      case self::ORIENTATION_VERTICAL:
      $this->setSection('table', 1, count($aSections));
      for ($i = 0; $i < count($aSections); $i++) {
        $this->_aSections[$aSections[$i]] = $this[$i][0];
        $this[$i][0]->id = $aSections[$i];
      }
      break;
    }
  }

  function getSection($sId) {
    if (isset($this->_aSections[$sId])) {
      return $this->_aSections[$sId];
    } else {
      foreach ($this->_aSections as $oSection) {
        if (count($oSection)) {
          if ($oSection[0] instanceof self) {
            if (!is_null($s = $oSection[0]->getSection($sId))) {
              return $s;
            }
          }
        }
      }
    }
    return null;
  }

  function split($sSection, $aSections, $nOrientation) {
    $oSection = $this->getSection($sSection)->append(new self());
    $oSection->defineSections($aSections, $nOrientation);
    return $oSection;
  }
}
