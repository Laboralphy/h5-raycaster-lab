<?php

class PageLoader {
	public function load($s) {
		if (!$s) {
			throw new Exception('unspecified file name');
		}
		$f = 'pages/' . $s . '.psyl';
		if (!file_exists($f)) {
			throw new Exception('file not found : ' . $s);
		}
		return file_get_contents($f);
	}
}
