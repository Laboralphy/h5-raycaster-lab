<?php
use O876\Psyl as Psyl;

class LyspHelper extends O876\MVC\View\Helper {
	public function Lysp($sCode) {
		$lysp = new Psyl\Parser();
		return $this->evaluate($lysp->parse($sCode));
	}
	
	public function evaluate($a) {
		if (is_array($a)) {
			$cmd = array_shift($a);
			$aEval = array();
			foreach ($a as $p) {
				$aEval[] = $this->evaluate($p);
			}
			return $this->$cmd($aEval);
		} else {
			return $a;
		}
	}
}
