<?php
namespace O876\Symbol\Searcher;
require_once('Intf.php');

class CSSSearcher implements Intf {

	const CHAR_SPACE = ' ';
	const CHAR_BRACKET_OP = '[';
	const CHAR_BRACKET_CL = ']';
	const CHAR_QUOTE = '"';
	const CHAR_COMMA = ',';
	const CHAR_PERIOD = '.';
	const CHAR_SHARP = '#';
	const CHAR_PLUS = '+';
	const CHAR_GT = '>';
	const CHAR_COLON = ':';
	
	const CHAR_STAR = '*';
	const CHAR_TILDE = '~';
	const CHAR_PIPE = '|';
	const CHAR_EQUAL = '=';
	const CHAR_HAT = '^';
	const CHAR_DOLL = '$';
	
	const CHAR_NL = "\n";
	
	protected $_aResult;
	protected $_sPattern;
	
	protected $_sStateFunc;
	protected $_sWord;
	protected $_aWords = array();
	
	protected $_bComma = false;

	public function __construct($sPattern) {
		$this->_sPattern = $sPattern;
		$this->_sStateFunc = 'Init';
		$this->tokenize($sPattern);
		$this->commaProcess();
	}
	
	public function commaProcess() {
		$aMulti = array();
		$aOne = array();
		$b = false;
		foreach ($this->_aWords as $w) {
			if ($w['token'] == 'T_COMMA') {
				$aMulti[] = $aOne;
				$b = true;
				$aOne = array();
			} else {
				$aOne[] = $w;
			}
		}
		$aMulti[] = $aOne;
		if ($b) {
			$this->_aWords = $aMulti;
		}
		$this->_bComma = $b;
	}
	
	public function getWords() {
		return $this->_aWords;
	}
	
	public function getWordStr() {
		$a = array();
		foreach ($this->_aWords as $word) {
			$w = $word['word'];
			$t = $word['token'];
			$a[] = $t . ':' . $w;
		}
		return implode(';', $a);
	}
	
	protected function setState($s) {
		$this->_sStateFunc = $s;
	}

	protected function runState($c) {
		$this->{'state' . $this->_sStateFunc}($c);
	}

	protected function tokenize($sString) {
		for ($i = 0; $i < strlen($sString); ++$i) {
			$c = substr($sString, $i, 1);
			$this->runState($c);
		}
		$this->runState("\n");
	}
	
	protected function typeWord($c) {
		$this->_sWord .= $c;
	}
	
	protected function resetWord() {
		$this->_sWord = '';
	}
	
	protected function pushWord($sToken) {
		$this->_aWords[] = array('word' => trim($this->_sWord), 'token' => $sToken);
	}
	
	protected function stateInit($c) {
		switch ($c) {
			case self::CHAR_SPACE: 
			case self::CHAR_NL:
				break;

			default:
				$this->setState('Start');
				$this->runState($c);
				break;
		}
	}
	
	/**
	 * Initial state, waiting for a non-white block
	 */
	protected function stateStart($c) {
		switch ($c) {
			case self::CHAR_SPACE: 
				$this->setState('Op');
				$this->runState($c);
				break;
				
			case self::CHAR_NL:
				break;
				
			case self::CHAR_BRACKET_OP:
				$this->setState('Attr');
				break;
				
			case self::CHAR_PERIOD:
				$this->setState('Class');
				break;
				
			case self::CHAR_SHARP:
				$this->setState('Id');
				break;
				
			case self::CHAR_COLON:
				$this->setState('Pseudo');
				break;
				
			case self::CHAR_COMMA:
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;
			
				
			default: 
				$this->setState('Tag');
				$this->runState($c);
				break;
		}
	}

	protected function stateOp($c) {
		switch ($c) {
			case self::CHAR_NL:
				break;
				
 			case self::CHAR_COMMA:
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;

				
			case self::CHAR_SPACE: 
			case self::CHAR_PLUS:
			case self::CHAR_GT:
			case self::CHAR_TILDE:
				$this->typeWord($c);
				break;

			default:
				$this->pushWord('T_OPERATOR');
				$this->resetWord();
				$this->setState('Start');
				$this->runState($c);
				break;
		}
	}

	
	/**
	 * Analyse du debut de ce nouveau mot
	 */
	protected function stateTag($c) {
		switch ($c) {
			case self::CHAR_BRACKET_OP:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Attr');
				break;
				
			case self::CHAR_PERIOD:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Class');
				break;
				
			case self::CHAR_SHARP:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Id');
				break;
				
			case self::CHAR_COLON:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Pseudo');
				break;
				
			case self::CHAR_NL:
			case self::CHAR_SPACE:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Op');
				break;
				
			case self::CHAR_PLUS:
			case self::CHAR_GT:
			case self::CHAR_TILDE:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->setState('Op');
				$this->runState($c);
				break;
				
			case self::CHAR_COMMA:
				$this->pushWord('T_TAG');
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;

			default: 
				$this->typeWord($c);
				break;
		}
	}
	
	protected function stateAttr($c) {
		switch ($c) {
			case self::CHAR_STAR:
			case self::CHAR_TILDE:
			case self::CHAR_PIPE:
			case self::CHAR_EQUAL:
			case self::CHAR_HAT:
			case self::CHAR_DOLL:
				$this->pushWord('T_ATTRIBUTE');
				$this->resetWord();
				$this->typeWord($c);
				$this->setState('AttrOperator');
				break;
				
			case self::CHAR_BRACKET_CL:
				$this->pushWord('T_ATTRIBUTE');
				$this->resetWord();
				$this->setState('Op');
				break;
				
			default:
				$this->typeWord($c);
				break;
		}
	}
	
	
	protected function stateClass($c) {
		switch ($c) {
			case self::CHAR_BRACKET_OP:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Attr');
				break;
				
			case self::CHAR_PERIOD:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Class');
				break;
				
			case self::CHAR_SHARP:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Id');
				break;

			case self::CHAR_COLON:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Pseudo');
				break;
				
			case self::CHAR_NL:
			case self::CHAR_SPACE:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Op');
				break;
				
			case self::CHAR_PLUS:
			case self::CHAR_GT:
			case self::CHAR_TILDE:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->setState('Op');
				$this->runState($c);
				break;
				
			case self::CHAR_COMMA:
				$this->pushWord('T_CLASS');
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;

			default: 
				$this->typeWord($c);
				break;
		}
	}
	
	protected function stateId($c) {
		switch ($c) {
			case self::CHAR_BRACKET_OP:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Attr');
				break;
				
			case self::CHAR_PERIOD:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Class');
				break;
				
			case self::CHAR_SHARP:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Id');
				break;
				
			case self::CHAR_COLON:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Pseudo');
				break;
				
			case self::CHAR_NL:
			case self::CHAR_SPACE:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Op');
				break;
				
			case self::CHAR_PLUS:
			case self::CHAR_GT:
			case self::CHAR_TILDE:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->setState('Op');
				$this->runState($c);
				break;
				
			case self::CHAR_COMMA:
				$this->pushWord('T_ID');
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;

			default: 
				$this->typeWord($c);
				break;
		}
	}	
	
	protected function statePseudo($c) {
		switch ($c) {
			case self::CHAR_BRACKET_OP:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Attr');
				break;
				
			case self::CHAR_PERIOD:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Class');
				break;
				
			case self::CHAR_SHARP:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Id');
				break;
				
			case self::CHAR_COLON:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Pseudo');
				break;
				
			case self::CHAR_NL:
			case self::CHAR_SPACE:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Op');
				break;
				
			case self::CHAR_PLUS:
			case self::CHAR_GT:
			case self::CHAR_TILDE:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->setState('Op');
				$this->runState($c);
				break;
				
			case self::CHAR_COMMA:
				$this->pushWord('T_PSEUDO');
				$this->resetWord();
				$this->pushWord('T_COMMA');
				$this->setState('Init');
				break;

			default: 
				$this->typeWord($c);
				break;
		}		
	}
	
	protected function stateAttrOperator($c) {
		switch ($c) {
			case self::CHAR_DOLL:
			case self::CHAR_EQUAL:
			case self::CHAR_HAT:
			case self::CHAR_PIPE:
			case self::CHAR_STAR:
			case self::CHAR_TILDE:
				$this->typeWord($c);
				break;
				
			default:
				$this->pushWord('T_ATTR_OPERATOR');
				$this->resetWord();
				$this->setState('AttrValue');
				$this->runState($c);
				break;
		}
	}
	
	protected function stateAttrValue($c) {
		switch ($c) {
			case self::CHAR_QUOTE:
				$this->setState('AttrValueInQuote');
				break;

			case self::CHAR_BRACKET_CL:
				$this->pushWord('T_ATTR_VALUE');
				$this->resetWord();
				$this->setState('Start');
				break;
		}
	}


	protected function stateAttrValueInQuote($c) {
		switch ($c) {
			case self::CHAR_QUOTE:
				$this->setState('AttrValue');
				break;

			default:
				$this->typeWord($c);
				break;
		}
	}

	
	
	
	public function isSymbolOk($aWords, $oTestSymbol, $nTestIndex = null) {
		if (is_null($nTestIndex)) {
			$nTestIndex = count($aWords) - 1;
		}
		$aSymbols = array(array($oTestSymbol, $nTestIndex));
		while (count($aSymbols) > 0) {
			$aTest = array_shift($aSymbols);
			$oSymbol = $aTest[0];
			$nIndex = $aTest[1];
			if ($nIndex < 0) {
				continue;
			}
			$w = $aWords[$nIndex];
			switch ($w['token']) {
				case 'T_COMMA':
					return true;
					
				case 'T_TAG':
					if ($w['word'] == '*' || strtolower($oSymbol->getTag()) == strtolower($w['word'])) {
						$aSymbols[] = array($oSymbol, $nIndex - 1);
					} else {
						return false;
					}
					break;
					
				case 'T_CLASS': 
					if (in_array($w['word'], explode(' ', $oSymbol->class))) {
						$aSymbols[] = array($oSymbol, $nIndex - 1);
					} else {
						return false;
					}
					break;
					
				case 'T_ID': 
					if ($oSymbol->id == $w['word']) {
						$aSymbols[] = array($oSymbol, $nIndex - 1);
					} else {
						return false;
					}
					break;
					
				case 'T_PSEUDO':
					if ($this->testSymbolPseudoClass($oSymbol, $w['word'])) {
						$aSymbols[] = array($oSymbol, $nIndex - 1);
					} else {
						return false;
					}
					break;
				
				case 'T_ATTRIBUTE': 
					if (isset($oSymbol->{$w['word']})) {
						$aSymbols[] = array($oSymbol, $nIndex - 1);
					} else {
						return false;
					}
					break;

				case 'T_ATTR_VALUE': 
					$w1 = $aWords[$nIndex - 1];
					$w2 = $aWords[$nIndex - 2];
					if ($this->testSymbolAttribute($oSymbol, $w['word'], $w1['word'], $w2['word'])) {
						$aSymbols[] = array($oSymbol, $nIndex - 3);
					} else {
						return false;
					}
					break;
					
				case 'T_OPERATOR': 
					if ($w['word'] === '') {
						// ajouter tous les parents pour qu'ils fassent les tests à partir d'ici
						$p = $oSymbol->getParent();
						while ($p) {
							if ($this->isSymbolOk($aWords, $p, $nIndex - 1)) {
								return true;
							}
							$p = $p->getParent();
						}
						return false;
					} elseif ($w['word'] === self::CHAR_GT) {
						$p = $oSymbol->getParent();
						return $p && $this->isSymbolOk($aWords, $p, $nIndex - 1);
					} elseif ($w['word'] === self::CHAR_PLUS) {
						$p = $oSymbol->getPrev();
						return $p && $this->isSymbolOk($aWords, $p, $nIndex - 1);
					} elseif ($w['word'] === self::CHAR_TILDE) {
						$p = $oSymbol->getNext();
						return $p && $this->isSymbolOk($aWords, $p, $nIndex - 1);
					} else {
						throw new \Exception('unknow css operator \'' . $w['word'] . '\'');
					}
					break;
			}
		}
		return true;
	}
	
	protected function testSymbolAttribute($oSymbol, $sValue, $op, $sAttribute) {
		switch ($op) {
			case '=': return $sValue == $oSymbol->{$sAttribute};
			case '~=': return in_array($sValue, explode(' ', $oSymbol->{$sAttribute}));
			case '|=': return in_array($sValue, explode('-', $oSymbol->{$sAttribute}));
			case '^=': return substr($oSymbol->{$sAttribute}, 0, strlen($sValue)) === $sValue;
			case '$=': return substr($oSymbol->{$sAttribute}, -strlen($sValue)) === $sValue;
			case '*=': return strpos($oSymbol->{$sAttribute}, $sValue) !== false;
		}
		return false;
	}
	
	protected function testSymbolPseudoClass($oSymbol, $sClass) {
		$p = $oSymbol->getParent();
		switch (strtolower($sClass)) {
			case 'first-child': return $p && $oSymbol->getIndex() === 0;
			case 'last-child': return $p && $oSymbol->getIndex() === count($p);
		}
		return false;
	}
	
	public function submit(\O876\Symbol\Symbol $oSymbol, $nDepth) {
		if ($this->_bComma) {
			foreach ($this->_aWords as $w) {
				if ($this->isSymbolOk($w, $oSymbol)) {
					$this->_aResult[] = $oSymbol;
					return;
				}
			}
		} else {
			if ($this->isSymbolOk($this->_aWords, $oSymbol)) {
				$this->_aResult[] = $oSymbol;
			}
		}
	}

	public function resetResult() {
		$this->_aResult = array();
	}

	public function getResult() {
		return $this->_aResult;
	}
}
