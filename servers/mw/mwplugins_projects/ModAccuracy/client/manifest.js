O2.createObject('MW.PLUGINS_DATA.ModAccuracy', { 
	// ici "accuracy" est l'identifiant HUD utilisé par le plugin server pour donner des ordres au Widget
	className: 'MW.ModAccuracy', // classe HUDElement qui doit être utilisée 
	hud: { // position et dimension du widget
		x: 150,
		y: 0,
		width: 64, // taille de la surface de dessin
		height: 24
	},
	tiles: { // liste des ressources graphique (images, icones) utilisée par le widget
		accuracy_icon: {
			src: 'resources/gfx/icons/accuracy_icon.png',	// fichier image
			width: 32,	// taille de l'image
			height: 32,
			frames: 1,	// nombre de frames
			noshading: true // pas d'ombrage : économise la mémoire
		}
	}
});
