/**
 * Classe de script de debug
 */
O2.createClass('MANSION.Script.Debug', {

    /**
     * Apparition d'un fantôme en face du joueur
     * data[0] = spell
     */
    cast: function() {
        /** <cast> : will cast a spell, type "spells" to get a list of available spells. **/
        var oEvent = this._event;
        oEvent.game.castSpell(oEvent.data[0]);
    },

    /**
     * Apparition d'un fantôme en face du joueur
     */
    spells: function() {
        /** <spells> : will print a list of available spells **/
		var oEvent = this._event;
        oEvent.game.console().clear().print(Object.keys(MANSION.SPELLS).join('\n'));
    },

    /**
     * Apparition d'un fantôme en face du joueur
     * data[0] = type de fantôme
     */
    spawn: function() {
        /** <ghost> : will spawn a ghost. Type "ghosts" to get a list of spawned ghosts. Type "bp" to get a list of available ghost blueprints **/
		var oEvent = this._event;
        var g = oEvent.game;
        var sGhost = oEvent.data[0];
        g.spawnGhost(sGhost);
    },

	/**
	 * Renvoie la liste des fantomes
	 */
	bp: function() {
		/** : displays a list of available ghosts. Use "spawn" to spawn a ghosts. **/
		var oEvent = this._event;
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
	
	ghosts: function() {
		/** : lists all active ghosts **/
		var oEvent = this._event;
		console.log(oEvent);
		var g = oEvent.game;
		var horde = g.oRaycaster.oHorde.aMobiles;
		var aList = horde.map(ghost => ghost.getBlueprint() && ghost.getBlueprint('subtype') == 'ghost' ? horde.indexOf(ghost) + ' : ' + ghost.getBlueprint('name') : null);
		g.console().clear().print(aList.join('\n'));
	},
	
	follow: function() {
		/** <ghost_id> : follows a ghost AI progression **/
		var oEvent = this._event;
		var g = oEvent.game;
		var id = oEvent.data[0] | 0;
		g.oRaycaster.oHorde.aMobiles.forEach(function(ghost, iGhost) {
			if (ghost.getThinker()) {
				ghost.getThinker()._bDebug = iGhost === id;
			}
		});
	},

	die: function() {
		/** : kills the player character **/
		var oEvent = this._event;
        oEvent.game.getPlayer().data('soul').setAttribute('hp', 0);
		oEvent.game.getPlayer().getThinker().die();
	},

	help: function() {
		/** [command] : displays a list of available commands. When a parameter is specified, the command will display a small description of the command **/
		var oEvent = this._event;
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
	print: function() {
		/** <text> : prints a line of text. **/
		var oEvent = this._event;
		var g = oEvent.game;
		g.console().print(oEvent.data.join(' '));
	}
});
