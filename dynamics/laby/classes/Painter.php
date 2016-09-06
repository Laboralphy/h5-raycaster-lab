<?php
class Painter extends Grid {
	protected $_nCode = null;
	
	/**
	 * Remplissage de la zone
	 * @param $x, $y coordonnée du point à remplir
	 * @param $nCode code à utiliser pour remplir
	 */
	public function paint($x, $y, $nCodeCible, $nCodeRep) {
		$p = array();
		try {
			$n = $this->getCell($x, $y);
			if ($n != $nCodeCible) {
				return;
			}
			$p[] = array($x, $y);
			while (count($p)) {
				list ($x0, $y0) = array_pop($p);
				$this->setCell($x0, $y0, $nCodeRep);
				try {
					if ($this->getCell($x0, $y0 - 1) == $nCodeCible) {
						$p[] = array($x0, $y0 - 1);
					}
				} catch (Exception $e) { }
				try {
					if ($this->getCell($x0, $y0 + 1) == $nCodeCible) {
						$p[] = array($x0, $y0 + 1);
					}
				} catch (Exception $e) { }
				try {
					if ($this->getCell($x0 + 1, $y0) == $nCodeCible) {
						$p[] = array($x0 + 1, $y0);
					}
				} catch (Exception $e) { }
				try {
					if ($this->getCell($x0 - 1, $y0) == $nCodeCible) {
						$p[] = array($x0 - 1, $y0);
					}
				} catch (Exception $e) { }
			}
		} catch (Exception $e) { }
	}
}