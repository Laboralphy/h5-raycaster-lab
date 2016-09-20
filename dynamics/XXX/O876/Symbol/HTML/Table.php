<?php namespace O876\Symbol\HTML;

/** @brief Symbole de table
 * 
 * La Table est un tableau
 * Contient des instance TableSection.
 * Utilisée par Table. 
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;


class Table extends Symbol {
	protected $_aSections;
	public function __construct() {
		parent::__construct('table');
	}

	public function setSections($aSections = array()) {
		foreach ($aSections as $sSection => $aSectionData) {
			if (is_numeric($aSectionData[0])) {
				$oSection = new TableSection($sSection, $aSectionData);
				$oSection->setSize($aSectionData[0], $aSectionData[1]);
				$this->_aSections[$sSection] = $this->append($oSection);
			} else {
				$this->_aSections[$sSection] = $this->append(
					new TableSection($sSection, $aSectionData)
				);
			}
		}
	}

	public function getSection($sSection) {
		return $this->_aSections[$sSection];
	}
}
?>
