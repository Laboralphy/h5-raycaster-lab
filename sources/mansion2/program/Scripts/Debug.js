/**
 * Classe de script de debug
 */
O2.createClass('MANSION.Script.Debug', {

	/**
	 * Apparition d'un fantôme en face du joueur
	 * data[0] = type de fantôme
	 */
	spawn: function(oEvent) {
		var g = oEvent.game;
		var sGhost = oEvent.data[0];
		var pos = g.getPlayer().getFrontCellXY();
		g.spawnGhost(sGhost, pos.x, pos.y);
	},

	/**
	 * Renvoie la liste des fantomes
	 */
	ghosts: function(oEvent) {
		var g = oEvent.game;
		var aList = [];
		var e;
		for (var gh in MANSION.BLUEPRINTS_DATA) {
			e = MANSION.BLUEPRINTS_DATA[gh];
			if ('data' in e && 'subtype' in e.data && e.data.subtype === 'ghost') {
				aList.push(gh);
			}
		}
		g.console().clear().print(aList.join(', '));
	},

	/**
	 * Affiche une ligne de texte
	 */
	print: function(oEvent) {
		var g = oEvent.game;
		g.console().print(oEvent.data.join(' '));
	}
});
