/**
 * Les plugin sont des objet géré par un médiateur
 * Chaque plugin peut s'abonner à divers évènements déclenché par
 * l'application (le jeu)
 * 
 * startgame : déclenché au début du jeu une fois que le client s'est
 * 		connecté
 * 
 * render : déclenché à chaque frame affichée
 * 
 * 
 * ui_dialog : le jeu réclame l'affichage d'un dialogue, ce message dispose
 * 		de param_tre comme le titre, le message et la liste des bouttons
 * 		et les fonction callback associé a leur dé"clenchement
 */
O2.extendClass('MW.Plugin', O876.Mediator.Plugin, {
	oGame: null,
	
	setMediator: function(m) {
		__inherited(m);
		this.oGame = m.getApplication();
	}
});
