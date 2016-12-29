O2.createClass('O876.Snail', {
	/**
	 * Renvoie la largeur d'un carré de snail selon le niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément sur le coté
	 */
	getLevelSquareWidth: function(nLevel) {
		return nLevel * 2 + 1;
	},
	
	/**
	 * Renvoie le nombre d'élément qu'il y a dans un niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément
	 */
	getLevelItemCount: function(nLevel) {
		var w = this.getLevelSquareWidth(nLevel);
		return 4 * w - 4;
	},
	
	/**
	 * Renvoie le niveau auquel appartient ce secteur
	 * le niveau 0 correspond au point 0, 0
	 */
	getLevel: function(x, y) {
		x = Math.abs(x);
		y = Math.abs(y);
		return Math.max(x, y);
	},
	
	/**
	 * Renvoie tous les secteur de niveau spécifié
	 */
	crawl: function(nLevelMin, nLevelMax) {
		if (nLevelMax === undefined) {
			nLevelMax = nLevelMin;
		}
		if (nLevelMin > nLevelMax) {
			throw new Error('levelMin must be lower or equal levelMax');
		}
		if (nLevelMin < 0) {
			return [];
		}
		var aSectors = [];
		var n, x, y;
		for (y = -nLevelMax; y <= nLevelMax; ++y) {
			for (x = -nLevelMax; x <= nLevelMax; ++x) {
				n = this.getLevel(x, y);
				if (n >= nLevelMin && n <= nLevelMax) {
					aSectors.push({x: x, y: y});
				}
			}
		}
		return aSectors;
	}

});
