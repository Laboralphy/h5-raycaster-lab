/*
 * Exemple de systeme de versionning
 * MAJOR.MINOR.PATCH
 * 
 * 1) MAJOR++ quand les modifications entrainent une incompatibilité d'API (changement de bibliothèque)
 * 2) MINOR++ quand on ajoute des fonctionnalités
 * 3) PATCH++ quand on ne fait que corriger des bugs
 */

O2.createObject('VERSION_DATA', {
	date: '2014-09-30',
	major: 0,
	minor: 8,
	patch: 2
});


/*

v0.0.0

Chaque section de ce descriptif évoluera au fil des versions.

DESCRIPTION JEU
C'est jeu de tir à la première personne. Votre personnage évolue dans un monde labyrinthique divisé en plusieurs niveaux. Chaque niveau contient une porte d'entrée, une porte de sortie, et éventuellement un portail permettant d'accéder à une autre partie du monde (une nouvelle branche de niveaux). Le joueur doit traverser les niveaux et trouver les portes de sorties pour atteindre le dernier niveau et réaliser l'objectif.


COMPOSITION DU MONDE
Actuellement le monde se compose de 10 niveaux.
	- un niveau forêt : qui représente l'entrée du donjon dans la forêt. il n'y a pas de monstres à vaincre, et la taille du niveau est réduite.
	- un donjon "Tower of Troubles" composé de 6 niveaux avec des monstres de plus en plus coriace à mesure que le joueur progresse dans les niveaux
inférieurs (plus profonds sous terre).
	- un donjon "The Mines" composé de 3 niveaux. Ce donjon est accessible en empruntant le portail situé dans "Tower of Troubles". Ce donjon représente une section optionnelle de l'aventure. Il n'est pas nécessaire de le faire mais il contient potentiellement des objet précieux qui permette d'augmenter le score.
	- Au dernier niveau de Tower of Troubles il y a un boss, de même qu'au dernier niveau des mines. 


BUT DU JEU
Le joueur doit atteindre le dernier niveau de Tower of Troubles, vaincre le boss et acceder au niveau suivant "Treasure Room" pour récolter les Anciennes Reliques. Ainsi il peut voir son score s'afficher et entrer au classement. Le score est composé du nombre de pièces d'or glanées ainsi que la somme des niveaux de tous les objets rammassés.


CONTENU DU JEU
Il y a une douzaine de type de monstres différents dans le jeu, il ne sont pas tous utilisés actuellement.


FONCTIONNALITES
	- Le jeu propose une sauvegarde : en appuyant sur F5 on peut sauvegarder le jeu et retourner à l'écran titre. On peut ensuite choisir "continue" pour reprendre la sauvegarde.
Si le joueur perd tous ses points de vie il est redirigé vers l'écran titre ou il pourra choisir de continuer.
	- Si le joueur gagne la partie (il trouve l'objet final) son score est sauvegardé dans le tableau des meilleurs scores.



v 0.0.1

GRAPHISMES
	- Les textures ne sont plus interpolées afin de donner un look retro au jeu.


v 0.1.0
INTERFACE
	- Systeme de description sommaier des objets : permet de connaitre les propriétés d'un objet de l'inventaire
	- Coupure du son et pause du jeu quand le navigateur n'est plus la fenetre active

v 0.1.1
CODE MANAGEMENT
	- Amélioration de la gestion des plugins

BUG
	- Correction d'un bug qui bloquait le jeu lors de la lecture de certain livres sans images.

v 0.2.0
	- Ajout de la feuille de personnage
	- Amélioration de la description des objets
	- Ajout d'une nouvelle catégorie de monstre : les myconides
	- Modification : la foret s'étand sur 2 niveaux

v 0.3.0
	- Système de pointer lock
	- Refonte de l'interface


v 0.3.1
	- Correction d'un bug qui coinçait le joueur dans une porte qui se refermait derrière lui.
	- Ajout de torche animées accrochée au murs.
	- Optimisation de vitesse, léger gain.
	- Correction d'un bug qui figeait le jeu lorsqu'on maintenait le bouton d'attaque enfoncé en étant équipé d'une dague.
	- Ajout de recettes de craft
	- Ajout de livres d'alchimies qui permettent d'apprendre de nouvelles recettes.
	- Modification de génération de labyrinthe. Davantage de corridors.
	- Correction d'un bug de calcul du score
	- Correction d'un bug pour l'IA stealer (corbeaux). Les corbeaux peuvent dérober des pièces d'or !

v 0.4.0
	- Ajout d'un moteur de cinématique
	- Cinématique d'intro

v 0.4.1
	- Optimization de vitesse de rendu sur les texture transparente
	- Ajout de sons pour la cinématique d'intro
	- Ajout d'une cinématique de fin
	- Correction d'un bug empechant le chargement du niveau 3 des mines (avec le boss)

v 0.4.2
	- Nouvelle optimisation de vitesse pour les textures transparentes
	- Correction d'un bug d'affichage apparaissant parfois sur les portes en cours d'ouverture dans les prisons

v 0.5.0
	- Ajout d'un système de magasin : les magasins apparaissent aléatoirement à certains niveau. Il y a plusieurs type de magasins. 
Certains magasin propose des armes, d'autres des bijoux, d'autre des potions, ou de la nourriture etc...
	- Equilibrage du jeu
	
v 0.5.1
	- on peut frapper au contact avec les baguette pour se défendre lorsque l'energie magique est épuisée.
	- Les messages de notification de ramassage d'objet sont enrichis d'une icône réprésentant l'objet ramassé.
	- Les messages de notification n'envahissent plus l'écran, ils sont affichés l'un après l'autre.  
	- Amélioration de la génération des portes verrouillées
	
v 0.6.0b
	- Ajout d'un système de sortilège et codage du premier sort : DrainLife
	- Codage de 9 sorts
	
v 0.6.1
	- livres : le bouton prev page est masqué à la première page, le bouton next page est masqué à la dernière page.
	- l'inventaire peut être trié.

v 0.7.0
	- Ajout du niveau "Medusa"

v 0.7.1
	- Ajout d'une console de cheat codes

v 0.7.2￼


v 0.8.0
	- Ajout d'un système de score

v 0.8.1
 	- modification du générateur de laby	
 	- modification du monde de la foret
 	* 
v 0.8.2
    - correction Pointerlock API
*/
