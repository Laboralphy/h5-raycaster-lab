<?php namespace O876\Symbol;

require_once 'Exception.php';

/** Fabrique de symbole à partir de données XML
 * 
 * @author raphael.marandet
 *
 */
class XMLParser {
  private $oXml;
  private $oCursor;
  private $aCursors = array();
  private $nCursor;
  private $bLoaded;
  protected $aItems = array();
  private $oFirstSymbol;
  
  protected $aParams;
  
  
  
  /** Renvoi le tableau associatif attribut_id => symbol, créé lors de
   * la précédente analyse de données XML.
   * 
   * @return array of Symbol
   */
  function getItems() {
    return $this->aItems;
  }
  
  protected function getParamValue($s) {
  	if (array_key_exists($s, $this->aParams)) {
  	  return $this->aParams[$s];
  	} else {
  	  return false;
  	}
  }

  public function buildSymbolFromXML($oSymbol, $sXml, $aParams=array()) {
    if (is_null($oSymbol)) {
      $this->oFirstSymbol = new Symbol();
    } else {
      $this->oFirstSymbol = $oSymbol;
    }
    $this->parseData($sXml, $aParams);
    return $this->oFirstSymbol;
  }

  public function parseData($aXMLData='', $aParams=array()) {
  	$this->aItems = array();
  	$this->aParams = $aParams;
  	if ($this->getParamValue('encoding')) {
      $this->oXml = xml_parser_create($this->getParamValue('encoding'));
  	} else {
      $this->oXml = xml_parser_create('UTF-8');
  	}
  	xml_parser_set_option($this->oXml, XML_OPTION_SKIP_WHITE, true);
    xml_set_object($this->oXml, $this);
    xml_set_element_handler($this->oXml, 'xh_tag_open', 'xh_tag_close');
    xml_set_character_data_handler($this->oXml, "xh_cdata");
    $this->oCursor = null;
    $this->nCursor = 0;
    $this->aCursors[$this->nCursor++] = $this;
    if (is_array($aXMLData)) {
	  $nLines = count($aXMLData);
      for ($i = 0; $i < $nLines; ++$i) {
		$v = strtr(trim($aXMLData[$i]), array('&' => '&amp;'));
      	$nError = xml_parse($this->oXml, $v, $i === ($nLines - 1));
      	if ($nError === 0) {
			throw new Exception('xml parse error : ' . xml_error_string(xml_get_error_code($this->oXml)) . ' at line ' . xml_get_current_line_number($this->oXml) . ' column ' . xml_get_current_column_number($this->oXml));
		}
      }
    } else {
      $v = strtr(trim($aXMLData), array('&' => '&amp;'));
      $nError = xml_parse($this->oXml, $v, true);
      if ($nError === 0) {
        throw new Exception('xml parse error : ' . xml_error_string(xml_get_error_code($this->oXml)) . ' at line ' . xml_get_current_line_number($this->oXml) . ' column ' . xml_get_current_column_number($this->oXml));
      }
    }
    xml_parser_free($this->oXml);
  }

  public function xh_PushCursor($oCursor) {
    $this->aCursors[$this->nCursor++] = $oCursor;
  }

  public function xh_PopCursor() {
    return $this->aCursors[--$this->nCursor];
  }

  public function xh_tag_open($oParser, $sTag, $aAttributes) {
  	$sTag = strtolower($sTag);
  	$aAttributes = array_change_key_case($aAttributes, CASE_LOWER);
    if (is_null($this->oCursor)) {
      $this->oCursor = $this->oFirstSymbol;
      $this->oCursor->setTag($sTag);
    }
    else {
      $this->xh_PushCursor($this->oCursor);
      $oSymbol = $this->oCursor->append(new Symbol($sTag));
      $oSymbol->setLine(xml_get_current_line_number($this->oXml));
      $oSymbol->setColumn(xml_get_current_column_number($this->oXml));
      $this->oCursor = $oSymbol;
    }
    $this->oCursor->setAttributes($aAttributes);
    if ($sId = $this->oCursor->id) {
      $this->aItems[$sId] = $this->oCursor;
    }
  }

  public function xh_cdata($oParser, $sCData) {
    if ($this->getParamValue('textnodes')) {
      if (trim($sCData)) {
      	$this->oCursor->append($sCData);
      }
    }
  }

  public function xh_tag_close($oParser, $sTag) {
    $this->oCursor = $this->xh_PopCursor();
  }
}
