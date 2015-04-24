/* H5UI: Bibliothèque de composants visuels basé sur la technologie HTML 5
   2012 Raphaël Marandet
   ver 1.0 01.06.2012
 */

/*
 H5UI est un système de gestion de controles fenêtrés basé sur HTML 5, plus particulièrement son objet de rendu graphique Canvas.
 Ce système gère : 
 1) l'affichage d'une interface graphique (ensemble de fenêtres, boutons, texte, tableau, images, barres de défilement....).
 2) le traitement des évènements souris (déplacement, clic, drag and drop...)
 3) Le rafraichissement optimisé des composants graphiques dont l'état a changé.

 Principe
 --------

 Le système s'apparentant à un Document Object Model (DOM) est articulé autour d'une classe Composite : 
 Les instances de contrôles fenêtrés entretiennent chacune une collection d'instances de même classe.
 Ces contrôles sont organisé en arborescence. Chaque contrôle fenêtré possède un seul parent et 0-n enfants.

 Lorsqu'un contrôle s'invalide (sous l'effet d'une action externe comme une action utilisateur ou un timer écoulé), 
 il doit être redessiné. Sa chaîne hierarchique est invalidée à son tour,
 et lors du rafraichissement d'écran seul les composants invalides font appel à leur méthode de rendu graphique 
 et sont effectivement redessinés. 
 Les autres contrôles ne sont que replaqués sur la surface de leur parent en utilisant leur état graphique actuel inchangé.
 Les composants dont les parents n'ont pas été invalidés ne sont pas atteints par la procédure de rafraîchissement.


 +--------------------------------------------------+
 | Controle A                                       |
 |            +-----------------------------+       |
 |            | Controle B                  |       |
 |            |                             |       |
 |            |                             |       |
 |            +-----------------------------+       |
 |                                                  |
 |    +-----------------------------+               |
 |    | Controle C                  |               |
 |    |    +-----------------+      |               |
 |    |    | Controle D      |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    +-----------------+      |               |
 |    +-----------------------------+               |
 |                                                  |
 +--------------------------------------------------+

 Dans ce schémas le Controle A contient B et C, le Contrôle C contient quand à lui le Controle D
 Autrement l'arborescence se représente ainsi

 A
 |
 +--- B
 |
 +--- C
 |
 +--- D




 Vocabulaire
 -----------

 Contrôle fenêtré
 Elément de base d'une interface graphique.
 Le contrôle fenêtré est un objet visuel qui possède plusieurs propriétés de base et 
 Les propriété fondamentales pour tout objet graphique sont : 
 - la position (en pixels).
 - la taille (longueur et hauteur en pixels).
 - un indicateur d'invalidation (booléen) lorsque celui ci est a VRAI le contrôle doit être redessiné.
 - un contrôle fenêtré parent.
 - une collection de contrôles fenêtrés enfants.

 Composite
 Design pattern permettant de traiter un groupe d'objet de même instance de la même manière qu'un seul objet.
 Les objets sont organisés hierarchiquement.
 En pratique : chaque controle fenêtré comporte une collection d'autres controles fenetrés.
 Le rendu graphique d'un controle fenêtré fait intervenir la fonction qui gère le rendu graphique des sous-contrôles fenêtrés

 Etat graphique
 C'est l'ensemble des propriétés d'un contrôle fenêtré qui concourent à son aspect visuel.
 Si l'une de ces propriétés changent, c'est l'aspect visuel du contrôle fenêtré qui en est modifié, il doit donc être redessiné.
 La collection de contrôles fenêtrés font partit de l'état graphique de fait que la modification de l'état graphique d'un contrôle fenêtré
 provoque le changement de l'état graphique du contrôle parent.

 */

O2.createObject('H5UI', {
	data : {
		renderCount : 0,
		cdiCount : 0,
		pixelCount : 0,
		renderedList : {},
		buildCanvases : 0,
		destroyedCanvases : 0
	},
	canvasDispenser: [],
	handle : 0,
	
	
	root: null,

	initRoot: function() {
		UI.root = document.getElementsByTagName('body')[0];
	},

	setRoot: function(oDomElement) { H5UI.root = oDomElement; },

	getCanvas: function () {
		var oCanvas = H5UI.canvasDispenser.pop();
		if (oCanvas) {
			return oCanvas;
		} else {
			return O876.CanvasFactory.getCanvas();
		}
	},

	recycleCanvas: function (oCanvas) {
		H5UI.canvasDispenser.push(oCanvas);
	}
});
