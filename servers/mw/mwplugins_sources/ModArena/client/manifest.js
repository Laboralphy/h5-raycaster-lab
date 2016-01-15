O2.createObject('MW.PLUGINS_DATA.ModArena', { 
	// ici "accuracy" est l'identifiant HUD utilisé par le plugin server pour donner des ordres au Widget
	className: 'MW.ModArena', // classe HUDElement qui doit être utilisée 
	hud: { // position et dimension du widget
		x: -4,
		y: 4,
		width: 128, // taille de la surface de dessin
		height: 128
	},
	tiles: {}
});

STRINGS.en.dlg_endgame_title = 'Game over';
STRINGS.en.dlg_endgame_message = 'The server has ended the game. Are you ready for another game ?';
STRINGS.en.dlg_button_scores = 'See scores';
STRINGS.en.pop_player_joined = '$0 has joined the game.';
STRINGS.en.pop_player_left = '$0 has left the game.';
