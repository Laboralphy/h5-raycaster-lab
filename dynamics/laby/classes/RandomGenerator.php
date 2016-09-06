<?php
/**
 * Classe de génération de nombre pseudo-aléatoire
 * avec gestion de la graine
 * @author ralphy
 *
 */
class RandomGenerator {
	private static $oInstance = null;
	protected $nSeed;
	protected $aSeedXor128;
	
	protected function __construct() {
	}

	public static function getInstance() {
		if (self::$oInstance == null) {
			self::$oInstance = new self();
		}
		return self::$oInstance;
	}
	
	protected function _mod15_seed($n) {
		$this->nSeed = $n & 0x7FFF;
	}
	
	protected function _mod15() {
		return $this->nSeed = ($this->nSeed * 214013 + 2531011) & 0x7FFF;
	}
	
	/** 
	 * Renvoie un nombre aléatoire entier compris entre deux bornes
	 * @param int $n1 borne inf
	 * @param int $n2 borne sup
	 * @return int
	 */
	public function getRandom($n1, $n2) {
		if ($n1 > $n2) {
			throw new Exception("getRandom min $n1 is > max $n2"); 
		}
		if ($n1 == $n2) {
			return $n2;
		}
		

		return $this->_mod15() % ($n2 - $n1 + 1) + $n1;
		
		/** mt_rand
		return mt_rand($n1, $n2);
		*/
	}

	/**
	 * Défini la graine aléatoire 
	 * @param int $n
	 */
	public function setRandomSeed($n) {
		if ($n !== null) {
			$this->_mod15_seed($n);
			/** mt_rand
			mt_srand($n);
			*/
		}
	}

	/**
	 * Décide si un évènement qui a une chance de se produire s'est réellement produit.
	 * Ainsi roll100(40) à 40% de chance de renvoyer TRUE et 60% de chance de renvoyer FALSE
	 * @param int $nPercent
	 * @return bool
	 */
	public function roll100($nPercent) {
		return $this->getRandom(0, 99) < $nPercent;
	}

	/** Choisi un élément du tableau
	 * @param $aChoices Array, liste des éléments à choisir
	 * @return un élément
	 */
	public function choose($aChoices) {
		if (count($aChoices)) {
			return $aChoices[$this->getRandom(0, count($aChoices) - 1)];
		} else {
			return null;
		}
	}

	/**
	 * Mélange les éléments d'un tableau
	 * @param array tableau à mélanger
	 * @return array nouveau tableau mélangé
	 */
	public function shuffle($a) {
		for ($i = count($a) - 1; $i > 0; $i--) {
			$j = $this->getRandom(0, count($a) - 1);
			list ($a[$i], $a[$j]) = array($a[$j], $a[$i]);
		}
		return $a;
	}

}
