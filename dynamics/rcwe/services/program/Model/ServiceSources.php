<?php

require_once 'ServiceFs.php';

class ServiceSource {
	PATH_SOURCE = '../../sources';
	
	/**
	 * Récupère la liste de tous les niveaux
	 */
	public function getAllLevels: function() {
		$fs = new ServiceFs();
		$fs->findFiles(self
	}
}
