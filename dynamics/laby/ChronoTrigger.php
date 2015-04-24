<?php
class ChronoTrigger {
	private $aChrono;
	
	public function start() {
		$this->aChrono = array(array('start', microtime(true)));
	}
	
	public function trigger($sLap) {
		$this->aChrono[] = array($sLap, microtime(true));
	}
	
	public function render() {
		$a = array();
		$f = 0;
		foreach ($this->aChrono as $aChrono) {
			$a[] = $aChrono[0] . ': ' . strval(floor(($aChrono[1] - $f) * 1000));
			$f = $aChrono[1];
		}
		$a[] = 'TOTAL: ' . strval(floor(($f - $this->aChrono[0][1]) * 1000));
		return $a;
	}
}
