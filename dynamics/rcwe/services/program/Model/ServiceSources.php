<?php

require_once 'ServiceFs.php';

class ServiceSources {
	const BASE_PATH = '../../../sources';
	
	
	public function __construct() {
		$this->_checkWritingPermissions();
		$this->_checkReadingPermissions();
	}
	
	protected function _checkWritingPermissions() {
		if (!is_writable(self::BASE_PATH)) {
			throw new Exception('writing permission denied');
		}
	}
	
	protected function _checkReadingPermissions() {
		if (!is_readable(self::BASE_PATH)) {
			throw new Exception('reading permission denied');
		}
	}

	// creation d'un nouveau projet
	public function create($sName) {
		// vérifier validité du nom
		if (!preg_match('/[-a-z0-9]/', $sName)) {
			throw new Exception('the submitted project name is invalid');
		}
		// vérifier la déja existance
		if (file_exists(self::BASE_PATH . '/' . $sName)) {
			throw new Exception('project name already exists');
		}
		mkdir(self::BASE_PATH . '/' . $sName);
	}
	
	// - création d'un stub
	
	// suppression d'un projet
	
	// renommage de projet
	
	// 
}
