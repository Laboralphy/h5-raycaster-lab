O2.createObject('MW.PLUGINS_DATA.ModAlchemy', { 
	// ici "accuracy" est l'identifiant HUD utilisé par le plugin server pour donner des ordres au Widget
	className: 'MW.ModAlchemy', // classe HUDElement qui doit être utilisée 
	hud: { // position et dimension du widget
		x: 150,
		y: 0,
		width: 64, // taille de la surface de dessin
		height: 24
	},
	tiles: { // liste des ressources graphique (images, icones) utilisée par le widget
		alchemy_icons: {
			src: 'resources/tiles/icons/alchemy_icons.png',	// fichier image
			width: 32,	// taille de l'image
			height: 32,
			frames: 6,	// nombre de frames
			noshading: true // pas d'ombrage : économise la mémoire
		}
	}
});
