<?php
/**
 * Classe de gestion d'une grille.
 * @author ralphy
 *
 */
class Grid {
	protected $_aGrid;
	protected $sClass;
	protected $_nHeight;
	protected $_nWidth;
	
	public function assign(Grid $g) {
		$this->_nWidth = $g->_nWidth;
		$this->_nHeight = $g->_nHeight;
		$this->_aGrid = $g->_aGrid;
		$this->sClass = $g->sClass; 
	}

	/**
	 * Défini la taille de la grille
	 * @param int $x largeur 
	 * @param int $y hauteur
	 */
	public function setSize($x, $y) {
		$this->_nHeight = $y;
		$this->_nWidth = $x;
		$this->_aGrid = array();
		for ($iy = 0; $iy < $y; $iy++) {
			$this->_aGrid[] = array();
			for ($ix = 0; $ix < $x; $ix++) {
				$this->_aGrid[$iy][] = 0;
			}
		}
	}

	/**
	 * Renvoie la largeur de la grille
	 * @return int
	 */
	public function getWidth() {
		return $this->_nWidth;
	}

	/**
	 * Renvoie la hauteur de la grille
	 * @return int
	 */
	public function getHeight() {
		return $this->_nHeight;
	}

	/**
	 * Modifie le contenu d'une cellule
	 * @param int $x absice de la cellule
	 * @param int $y ordonnée de la cellule
	 * @param $n nouvelle valeur
	 * @throws Exception Out of range en cas de modification d'une cellule hors limite
	 */
	public function setCell($x, $y, $n) {
		if ($x < 0 || $x >= $this->_nWidth) {
			throw new Exception("out of range x: $x ; range is 0-" . strval($this->_nWidth - 1));
		}
		if ($y < 0 || $y >= $this->_nHeight) {
			throw new Exception("out of range y: $y ; range is 0-" . strval($this->_nHeight - 1));
		}
		$this->_aGrid[$y][$x] = $n;
	}

	/**
	 * Lecture de la valeur d'une cellule
	 * @param int $x absice de la cellule
	 * @param int $y ordonnée de la cellule
	 * @return any
	 * @throws Exception Out of range en cas de modification d'une cellule hors limite
	 */
		public function getCell($x, $y) {
		if ($x < 0 || $y < 0 || $x >= $this->_nWidth || $y >= $this->_nHeight) {
			throw new Exception("out of range: $x, $y : range is [0, 0, " . $this->_nWidth .', '. $this->_nHeight . ']');
		}
		return $this->_aGrid[$y][$x];
	}

	/**
	 * Rendu d'une cellule. Cette fonction est destinée à être surchargée
	 * @param int $x absice de la cellule
	 * @param int $y ordonnée de la cellule
	 * @return array
	 *
	 */
	public function renderCell($x, $y) {
		return array();
	}
	
	/**
	 * Rendu de la grille complete
	 * @return string HTML
	 */
	public function render(array $aRender) {
		$sRender = '<table class="' . $this->sClass . '" cellpadding="0" cellspacing="0">' . "\n";
		foreach ($this->_aGrid as $y => $aRow) {
			$sRender .= '<tr>';
			foreach ($aRow as $x => $nCell) {
				$nCell &= 0xFF;
				if (is_array($aRender)) {
					if (isset($aRender[$nCell]['class'])) {
						$sRCClass = $aRender[$nCell]['class'];
					}
					if (isset($aRender[$nCell]['text'])) {
						$sRCText = $aRender[$nCell]['text'];
					}
				}
				$aRenderCell = $this->renderCell($x, $y);
				if (is_array($aRenderCell)) {
					if (isset($aRenderCell['class'])) {
						$sRCClass = $aRenderCell['class'];
					}
					if (isset($aRenderCell['text'])) {
						$sRCText = $aRenderCell['text'];
					}
				}
				$sTitle = isset($aRender[$nCell]['legend']) ? ' title="' . $aRender[$nCell]['legend'] . '"' : '';
				$sRender .= '<td' . $sTitle . ' class="' . $sRCClass . '">' . $sRCText . '</td>';
			}
			$sRender .= '</tr>' . "\n";
		}
		$sRender .= '</table>' . "\n";
		return $sRender;
	}
}
