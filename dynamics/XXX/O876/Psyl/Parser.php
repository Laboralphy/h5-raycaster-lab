<?php namespace O876\Psyl;

/** @brief Analyseur syntaxique de listes au format PSYL
 * 
 * Permet d'analyser des liste au format PSYL
 * Ces listes sont des suite de caractères qui respectent le formats suivants
 * - une liste est délimité par les signes { et }
 * - une liste contient des éléments séparé par un caractère non affichable (un ESPACE " " une tabluation ou un retour à la ligne...)
 * - chaque élément peut être une liste ou un atome (toute chaine de caractère qui n'est pas une liste)
 * La classe analyse une chaine de caractère PSYL et la transforme en une structure de données (array imbriqué).
 * 
 * @author Raphaël Marandet
 * @version 100 - 2012.07.02
 */

class Parser {

  const TOKEN_OP = '(';
  const TOKEN_CL = ')';
  const TOKEN_QU = '"';
  const TOKEN_ESC = '\\';

  protected $sData;
  protected $nIndex;
  protected $nDataLen;
  protected $nCurse;
 
  /** Renvoie TRUE si la fin des données à été atteinte
   * @return Bool
   */
  protected function eod() {
    return $this->nIndex >= $this->nDataLen;
  }

  /** Lecture de caractères suivants dans la chaine de donnée
   * @param $n int nombre de caractère dont il faut avancer
   * @return int renvoie l'index en cours
   */
  protected function advance($n = 1) {
    return $this->nIndex += $n;
  }

  /** Renvoi TRUE si le caractère courant est un caractère non affichable (code ASCII <= 32)
   * @return Bool
   */
  protected function peekIsWhiteChar() {
    return trim($this->peek()) == '';
  }
  
  protected function peekIsQuote() {
    return $this->peek() == self::TOKEN_QU;
  }

  protected function peekIsEscape() {
    return $this->peek() == self::TOKEN_ESC;
  }

  /** avance la lecture jusqu'au prochaine caractère affichable
   */
  protected function advanceNextChar() {
    while (!$this->eod() && $this->peekIsWhiteChar()) {
      $this->advance();
    }
  }

  /** Jette un oeil sur le caractère courant sans avance l'index de lecture
   * @return char, caractère courant
   */
  protected function peek() {
    return $this->sData[$this->nIndex];
  }

  public function getCurse() {
    return $this->nCurse;
  }

  /** Lance l'analyse d'un chaine et construit la structure de donnée
   * @param $sData string, chaine de donnée représentant des listes au format PSYL
   */
  public function parse($sData) {
    $this->sData = $sData;
    $this->nIndex = 0;
    $this->nDataLen = strlen($this->sData);
    while (!$this->eod()) {
      switch ($this->peek()) {
        case self::TOKEN_OP: // début new list
          $this->nCurse = 0;
          return $this->parseList();
        break;
      }
      $this->advance();
    }
    return array();
  }

  /** Analyse une liste. Cette fonction est utilisée par parse()
   * @return array liste
   */
  protected function parseList() {
    $this->nCurse++;
    $this->advance();
    $this->advanceNextChar();
    $oList = array();
    while (!$this->eod()) {
      switch ($this->peek()) {
        case self::TOKEN_OP: // liste imbriquée
          $oList[] = $this->parseList();
          $this->advance();
        break;

        case self::TOKEN_CL: // liste nulle
          $this->nCurse--;
          return $oList;
        break;

        default: // donnée dans la liste
          $oList[] = $this->parseAtom();
        break;
      }
      $this->advanceNextChar();
    }
    throw new Exception('parse: unexpected end of data'); 
    $this->nCurse--;
    return $oList;
  }

  /** Analyse un atome. Cette fonction est utilisée par parse()
   * @return string atome
   */
  protected function parseAtom() {
    $this->nCurse++;
    $sWord = '';
    $bEscape = false;
    if ($this->peekIsQuote()) {
		$bQuoted = true;
	    $this->advance();
	} else {
		$bQuoted = false;
	}
    while (!$this->eod()) {
		$bEscape = false;
		if ($this->peekIsEscape()) {
			$bEscape = true;
			$this->advance();
		}
		if (!$bEscape && $this->peekIsQuote() && $bQuoted) {
			$this->advance();
			$this->nCurse--;
			return $sWord;
		}
		if (!$bEscape && !$bQuoted && ($this->peekIsWhiteChar() || $this->peek() == self::TOKEN_CL || $this->peek() == self::TOKEN_OP)) {
			$this->nCurse--;
			return $sWord;
		}
      $sWord .= $this->peek();
      $this->advance();
    }
    $this->nCurse--;
    return $sWord;
  }
}

