/**
 * Classe de script de debug
 */
O2.createClass('MANSION.Script.Debug', {

	/**
	 * Apparition d'un fantôme en face du joueur
	 * data[0] = type de fantôme
	 */
	spawn: function(oEvent) {
		/** <ghost> : will spawn a ghost. Type "ghosts" to get a list of available ghosts. **/
		var g = oEvent.game;
		var sGhost = oEvent.data[0];
		var pos = g.getPlayer().getFrontCellXY();
		g.spawnGhost(sGhost, pos.x, pos.y);
	},

	/**
	 * Renvoie la liste des fantomes
	 */
	ghosts: function(oEvent) {
		/** : displays a list of available ghosts. Use "spawn" to spawn a ghosts. **/
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

	help: function(oEvent) {
		/** [command] : displays a list of available commands. When a parameter is specified, the command will display a small description of the command **/
		var g = oEvent.game;
		if (oEvent.data && Array.isArray(oEvent.data) && oEvent.data[0]) {
			var z = oEvent.data[0];
			if ((z in this) && typeof this[z] === 'function') {
				var r = this[z].toString().match(/\/\*\*(.*)\*\*\//);
				if (r) {
					g.console().clear().print(z, r[1]);
				}
			} else {
				g.console().clear().print('command not found : ' + oEvent.data[0]);
			}
		} else {
			var aList = [];
			for (var x in this) {
				if (typeof this[x] === 'function') {
					aList.push(x);
				}
			}
			g.console().clear().print(aList.join(', '));
		}
	},

	/**
	 * Affiche une ligne de texte
	 */
	print: function(oEvent) {
		/** <text> : prints a line of text. **/
		var g = oEvent.game;
		g.console().print(oEvent.data.join(' '));
	}
});
