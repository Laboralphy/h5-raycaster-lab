<?php


namespace O876\Symbol\HTML;

use O876\Symbol\Symbol as Symbol;

/**
 * @brief Bouton cliquable.
 * 
 * @author Raphaël Marandet
 * @version 100
 * @date 2010-09-23
 * @details Bouton cliquable. Cette classe possède des fonctionnalités de confirmation.
 */
class Button extends Symbol {
	/**
	 * @brief Action.
	 * @details Str, Code javascript à exécuter lorsq'uon clique sur le bouton.
	 */
	protected $sAction = '';
	/**
	 * @brief Message de confirmation.
	 * @details Str, Chaîne de caractère affichée pour demander confirmation à l'utilisateur.
	 */
	protected $sConfirm = '';
	/**
	 * @brief Constructeur.
	 * @details Créé un bouton
	 */
	public function __construct() {
		parent::__construct ( 'button' );
		$this->type = 'button';
	}
	
	/**
	 * @brief Définition du libellé.
	 * @details Définit ou modifie le libellé (texte visible dans le bouton).
	 * 
	 * @param $sCaption Str,
	 *        	Nouveau libellé
	 */
	public function setCaption($sCaption) {
		$this->setData ( $sCaption );
	}
	
	/**
	 * @brief Libellé du bouton
	 * @details renvoie le libellé du bouton définit via setCaption().
	 * 
	 * @return Str
	 */
	public function getCaption() {
		return $this->getData ();
	}
	
	/**
	 * @brief Définition de l'action.
	 * @details Affecte ou change l'action à mener quand on clique sur le bouton.
	 * 
	 * @param $sAction Str,
	 *        	Code javascript
	 */
	public function setAction($sAction) {
		$this->sAction = $sAction;
		$this->buildOnClick ();
	}
	
	/**
	 * @brief Définition de l'url.
	 * @details Affecte ou change l'url à laquelle ira le navigateur si on clique sur le bouton.
	 * 
	 * @param $sAction Str,
	 *        	URL
	 */
	public function setDestinationURL($sUrl) {
		$this->setAction ( "parent.location = '$sUrl'" );
		$this->buildOnClick ();
	}
	
	/**
	 * @brief Définition d'un message de confirmation.
	 * @details Permet de définir une demande de confirmation. L'action définie par setAction()
	 * ne sera effectuée que si l'utilisateur le confirme.
	 * 
	 * @param $sConfirm Str,
	 *        	message de confirmation
	 */
	public function setConfirmation($sConfirm) {
		$this->sConfirm = $sConfirm;
		$this->buildOnClick ();
	}
	
	/**
	 * @brief Construit l'attribut onClick.
	 * @details A l'aide des paramètre action et confirm, cette fonction construit un
	 * code javascript permettant d'exécuter l'action, éventuellement précédée d'un message
	 * de confirmation.
	 */
	protected function buildOnClick() {
		if ($this->sConfirm) {
			$sConf = strtr ( $this->sConfirm, array (
					'"' => '\\"' 
			) );
			$this->onclick = "if (confirm('$this->sConfirm')) { $this->sAction; }";
		} else {
			$this->onclick = $this->sAction;
		}
	}
}
