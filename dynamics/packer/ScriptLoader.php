<?php
class ScriptLoader {

	protected $_aFiles = null;
	protected $_aFolders = null;
	protected $_aTops = null;
	protected $_aBottoms = null;
	protected $_aOptions = null;
	protected $_aExcludes = null;

	/**
	 * Modifier la valeur d'une option
	 * @param string $sOption nom de l'option
	 * @param string $sValue nouvelle valeur
	 */
	public function setOption($sOption, $sValue = true) {
		if ($this->_aOptions === null) {
			$this->_aOptions = array();
		}
		$this->_aOptions[$sOption] = $sValue;
	}

	/**
	 * Récupérer la valeur d'une option
	 * @param string $sOption nom de l'option
	 * @return string : valeur de l'option ou null si option non défini
	 */
	public function getOption($sOption) {
		if (isset($this->_aOptions[$sOption])) {
			return $this->_aOptions[$sOption];		
		} else {
			return null;
		}
	}

	/**
	 * Analyse un fichier de classe pour extraire le nom de la classe et
	 * éventuellement le nom de la classe parents dans le cas d'un extend.
	 * Cette fonction ne marche que sur des classe définies avec la
	 * librairie O2
	 * @param string $sFile contenu du fichier source (JS O2)
	 * @return array : tableau contenant les clés : class, parent / ou null si ce
	 * n'est pas un fichier de définition de classe O2
	 */
	public function getO2Classes($sFile) {
		if (preg_match('/O2.(create|extend)Class *\(([^{]*)\{/m', $sFile, $aRegs)) {
			$sClasses = trim($aRegs[2], "\n\r\t ',");
			$aClasses = explode(',', $sClasses);
			for ($i = 0; $i < count($aClasses); $i++) {
				$aClasses[$i] = trim($aClasses[$i], "\n\r\t ',");
			}
			$aReturn = array('class' => $aClasses[0]);
			if (count($aClasses) > 1) {
				$aReturn['parent'] = $aClasses[1];
			}
			return $aReturn;
		} else {
			return null;
		}
	}

	/**
	 * Construit la liste des fichiers .js du répertoire spécifié
	 * @param string $sDirectory Répertoire concerné
	 * @return array tableau à indice numérique : liste des fichiers JS du répertoire
	 */
	public function listScripts($sDirectory) {
		$aFiles = array();
		$aScripts = scandir($sDirectory);
		foreach ($aScripts as $sScript) {
			if ($sScript[0] != '.') {
				$sFile = $sDirectory . '/' . $sScript;
				if (strlen($sScript) > 3 && substr($sScript, -3) == '.js') {
					$aFiles[] = $sFile;
				} elseif (is_dir($sFile)) {
					foreach ($this->listScripts($sFile) as $sSubFile) {
						$aFiles[] = $sSubFile;
					}
				} 
			}
		}
		return $aFiles;
	}

	/** 
	 * Construit la liste des scripts contenu dans un répertoire
	 * Ajoute une clé 'file' au tableau généré par listScript()
	 * @param $sDirectory répertoire concerné
	 */
	public function buildScriptList($sDirectory) {
		$aFiles = $this->listScripts($sDirectory);
		$aClasses = array();
		foreach ($aFiles as $sFile) {
			$aO2 = $this->getO2Classes(file_get_contents($sFile));
			$aO2['file'] = $sFile;
			$aClasses[] = $aO2;
		}
		return $aClasses;
	}

	/** Détecteur d'éléments mal ordonnés
	 * Un élément mal ordonné est un élément dont le parent n'est pas encore 
	 * chargé (il se trouve plus bas dans la liste)
	 * Il faut donc rétrograder l'élément en dernier dans l'ordre de chargement
	 */
	public function getIllOrderedItem($aList) {
		$aClasses = array();
		foreach ($aList as $n => $aItem) {
			if (isset($aItem['parent']) && !in_array($aItem['parent'], $aClasses)) {
				return $n;
			}
			if (isset($aItem['class'])) {
				$aClasses[] = $aItem['class'];
			}
		}
		return -1;
	}

	/**
	 * Réorganise la liste : tous les élements mal ordonnés sont rétrogradés en bas
	 * de la liste. Le processus est répété tant qu'il y a des éléments mal ordonnés
	 * Si un élément fait référence à une classe parente inexistante, l'itération
	 * s'arrête par sécurité et déclenche une exception.
	 * @param array $aList liste à ordonner
	 * @return array liste rangée
	 * @throws Exception 
	 */
	public function reorder($aList) {
		$nSecurity = count($aList);		
		while (($n = $this->getIllOrderedItem($aList)) >= 0) {
			if (--$nSecurity < 0) {
				print_r($aList);
				throw new Exception('security exception : could not reorder script list - may be bad class names. ' . print_r($aList[$n], true));
			}
			// $n : ill ordered item
			// rétrograder l'élément $n
			$aList = $this->setOnBottom($aList, $n);
		}
		return $aList;
	}

	/**
	 * Déplace un élément en bas de liste.
	 * @param $aList liste concenrné
	 * @param $n indice de élément (ou élément lui même)
	 * @return liste modifiée
	 */
	public function setOnBottom($aList, $n) {
		if (!is_numeric($n)) {
			$n = array_search($n, $aList);
		}
		$a = $aList[$n];
		unset($aList[$n]);
		$aList = array_values($aList);
		$aList[] = $a;
		return $aList;
	}

	/**
	 * Déplace un élément en haut de liste.
	 * @param $aList liste concenrnée
	 * @param $n indice de élément (ou élément lui même)
	 * @return liste modifiée
	 */
	public function setOnTop($aList, $n) {
		if (!is_numeric($n)) {
			$n = array_search($n, $aList);
		}
		$a = $aList[$n];
		array_splice($aList, $n, 1);
		array_unshift($aList, $a);
		return $aList;
	}

	/**
	 * Ajoute un dossier à traiter
	 * @param $sFolder nom du dossier
	 */
	public function addFolder($sFolder) {
		if ($this->_aFolders === null) {
			$this->_aFolders = array();
		}
		$this->_aFolders[] = $sFolder;
	}

	/**
	 * Effectue le travail
	 * Construit la liste des fichiers, réorganise la liste, place la librairie O2 au top
	 */
	public function process() {
		if ($this->_aFiles === null) {
			$this->_aFiles = array();
		}
		$aList = array();
		foreach ($this->_aFolders as $sFolder) {
			$aList = array_merge($aList, $this->buildScriptList($sFolder));
		}
		foreach ($this->reorder($aList) as $aEntry) {
			$this->_aFiles[] = $aEntry['file'];
		}
		if ($this->_aTops) {
			foreach ($this->_aTops as $sFile) {
				$this->_aFiles = $this->setOnTop($this->_aFiles, $sFile);
			}
		}
		if ($this->_aBottoms) {
			foreach ($this->_aBottoms as $sFile) {
				$this->_aFiles = $this->setOnBottom($this->_aFiles, $sFile);
			}
		}
		$aExcludes = $this->_aExcludes;
		$this->_aFiles = array_filter($this->_aFiles, function($f) use ($aExcludes) {
			foreach ($aExcludes as $x) {
				if (trim($x) && preg_match('/' . strtr($x, array('/' => '\\/')) . '/', $f)) {
					return false;
				}
			}
			return true;
		});
	}

	/** 
	 * Défini un fichier à mettre au top
	 * @param $sFile ficheir concerné
	 */
	public function setTopFile($sFile) {
		if (!$this->_aTops) {
			$this->_aTops = array();
		}
		$this->_aTops[] = $sFile;
	}

	/** 
	 * Défini un fichier à mettre en bas de liste
	 * @param $sFile ficheir concerné
	 */
	public function setBottomFile($sFile) {
		if (!$this->_aBottoms) {
			$this->_aBottoms = array();
		}
		$this->_aBottoms[] = $sFile;
	}

	/**
	 * Renvoie la liste de fichier.
	 * Cette focntion s'emploi à la fin du traitement.
	 * @return tableau a indice numérique
	 */
	public function getScriptList() {
		return $this->_aFiles;
	}

	/**
	 * Effectue le chargement de tous les fichiers
	 */
	public function loadScripts($bSplit = false) {
		$aScriptList = array();
		foreach ($this->getScriptList() as $sFile) {
			if (!file_exists($sFile)) {
				throw new Exception('file not found: ' .$sFile);
			}
			$aScriptList[$sFile] = file_get_contents($sFile);
		}
		return $bSplit ? $aScriptList : implode("\n", $aScriptList);
	}

/**
 * COMMAND syntax
 * 
 * the given parameter is an array of string , containing packing directives
 * 
 * load <path> -- loads the js file located in <path>
 * top <file> -- move <file> on top of the js file list (it will be load prior to the other, for dependancy purpose)
 */
	public function execute($aCommands) {
		$this->_aExcludes = array();
		foreach ($aCommands as $sCommand) {
			$aCommand = explode(' ', trim($sCommand));
			$sOpcode = array_shift($aCommand);
			$sParam = implode(' ', $aCommand);
			switch (strtolower($sOpcode)) {
				case 'load':
					$this->addFolder($sParam);
					break;

				case 'top':
					$this->setTopFile($sParam);
					break;
					
				case 'exclude':
					$this->_aExcludes[] = $sParam;
					break;
					
				default:
					if ($sOpcode) {
						$this->setOption($sOpcode, $sParam);
					}
			}
		}
		$this->process();
	}
}
