<?php namespace O876\Symbol\HTML;

/** @brief Symbole ligne de table
 * 
 * Le TableSection est une section de tableau
 * THead, TBody ou TFoot.
 * Contient des instance TableRow.
 * Utilisée par Table. 
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 */

use O876\Symbol\Symbol as Symbol;


class TableSection extends Segment {
  protected $_sSubItemClass;

  public function __construct($sSection, $xCols, $nRows = null) {
    parent::__construct('');
	$this->setSection($sSection, $xCols, $nRows);

  }

  public function setSection($sSection, $xCols, $nRows = null) {
  	$aData = null;
  	if (is_array($xCols)) {
  		$aData = $xCols;
  		$nRows = count($aData);
  		if ($nRows) {
  			$nCols = count($aData[0]);
  		}
  	} else {
  		$nCols = $xCols;
  	}
    $this->setTag($sSection);
    $this->_sSubItemClass = __NAMESPACE__ . '\\TableRow';
    $this->setSize($nCols, $nRows);
    if ($aData) {
    	foreach ($aData as $nRow => $aRow) {
    		foreach ($aRow as $nCell => $sCell) {
    			$this[$nRow][$nCell]->setData($sCell);
    		}
    	}
    }
  }
  
  public function setSize($nCols, $nRows) {
    $this->setRowCount($nRows);
    foreach ($this as $oRow) {
      $oRow->setCellCount($nCols);
    }
  }

  public function setRowCount($n) {
    $this->setItemCount($n);
  }
  
  public function getRowCount() {
    return count($this);
  }

  public function getColCount() {
    return count($this[0]);
  }

  public function setRowHeader($nRow, $b = true) {
    $oRow = $this[$nRow];
    $oRow->setHeader($b);
  }

  public function setColHeader($nCol, $b = true) {
    foreach ($this as $oRow) {
      $oCell = $oRow[$nCol];
      $oCell->setHeader($b);
    }
  }
  
  public function setColAttribute($nCol, $sAttribute, $sValue) {
  	foreach ($this as $oRow) {
  		$oCell = $oRow[$nCol];
  		$oCell->$sAttribute = $sValue;
  	}
  }
  
}
