<?php
use O876\Symbol\Symbol as Symbol;

class SymbolHelper extends O876\MVC\View\Helper {
	public function Symbol($aArgs) {
		return new Symbol($aArgs);
	}
}
