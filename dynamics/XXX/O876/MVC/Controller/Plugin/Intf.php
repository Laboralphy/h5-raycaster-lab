<?php
namespace O876\MVC\Controller\Plugin;

/**
 * Interface permettant la création de classe Plugin de controleur
 * @author raphael.marandet
 *        
 */
interface Intf {
	/**
	 * Fonction exécutée juste avant le controleur.
	 * Il est possible d'obtenir l'objet request avec getRequest()
	 * Cette objet request contient les info concernant la requete (http)
	 */
	public function preControl();
	
	/**
	 * Fonction exécutée juste après le controleur.
	 * L'objet view est disponible avec getView()
	 * On peut agir en fonction des variables DATA définies par le controleur.
	 */
	public function postControl();
}