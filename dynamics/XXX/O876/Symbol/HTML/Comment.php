<?php namespace O876\Symbol\HTML;

/** @brief Symbole Span
 * 
 * Le Comment est un symbole qui sert de commentaire à un flux de donnée HTML
 * Généralement utilisé pour contenir du texte de documentation qui sera ignore lors de 
 * toute analyse.
 * 
 * @remark Composant de la librairie Symbol 
 * @author Raphaël Marandet
 * @version 100 - 2009.12.21
 * 
 * @remark refonte mai 2015 : garder
 * utilise un renderer spécial pour les commentaires
 */


use O876\Symbol\Symbol as Symbol;

class Comment extends Symbol {
  public function __construct() {
    parent::__construct('');
    $this->setRenderer('Comment');
  }
}
