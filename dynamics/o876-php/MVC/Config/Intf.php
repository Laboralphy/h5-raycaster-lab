<?php 
namespace O876\MVC\Config;
use O876\Loader as Loader;

/** 
 * Interface de la classe de configuration
 * Cette interface permet d'écrire une classe de configuration
 * Ce genre de classe propose différente fonction pour configurer les composant du MVC
 * les fonction renvoie généralement un tableau de chaines de caractère pour configurer chaque composant
 */
interface Intf {
  /**
   * Permet de configurer le Loader. La fonction peut utiliser addRoute, et addPath du loader
   * pour déclarer ses propres besoins en chargement automatique de classes.
   * @param Loader $oLoader loader
   */
  public function configLoader(Loader $oLoader);

  /** 
   * Renvoie un tableau à indices numériques, chaque élément du tableau est un plugin d'action à charger.
   * Ce tableau permet de spécifier l'ordre dans lequel seront chargés les plugins
   * @return Array (null ou array vide s'il n'y a pas de plugin à charger)
   */
  public function getPluginList();


  /** 
   * Renvoie un tableau associatif permettant de configurer l'accès a base de donnée
   * Le tableau renvoyer doit contenuir une entrée 'adapter' pour indiquer quel adapter est utilisé dans l'application
   * @return Array (vide ou null si on n'a pas besoin de base de donnée)
   */
  public function getDatabaseConfig();
}
