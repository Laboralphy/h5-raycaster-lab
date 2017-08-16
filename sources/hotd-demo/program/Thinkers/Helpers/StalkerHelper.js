/**
 * Not a thinker but a Helper
 * Helps you designing thinker for stalking entities (monster, follower...)
 */
O2.createClass('HOTD.StalkerHelper', {
	_oBresenham: null, // bresenham resolver to determine if an entity is visible

	__construct: function() {
		__inherited();
		this._oBresenham = new O876.Bresenham();
	},

	/**
	 * compute the angle the stalker must follow to see the prey
	 * and return the result
	 * @param oStalker {O876_Raycaster.Mobile}
	 * @param oPrey {O876_Raycaster.Mobile}
	 * @return {number}
	 */
	getDirection: function(oStalker, oPrey) {
		if (oPrey !== null) {
			return Math.atan2(oPrey.y - oStalker.y, oPrey.x - oStalker.x);
		} else {
			return false;
		}
	},


	/**
	 * return the distance between the stalker and the prey.
	 * @param oStalker {O876_Raycaster.Mobile}
	 * @param oPrey {O876_Raycaster.Mobile}
	 * @return Number
	 */
	getDistance: function(oStalker, oPrey) {
		if (oPrey) {
			return MathTools.distance(oStalker.x - oPrey.x, oStalker.y - oPrey.y);
		} else {
			return false;
		}
	},

	/**
	 * Renvoie true si le Stalker peut voir la Proie.
	 * @param oStalker {O876_Raycaster.Mobile}
	 * @param oPrey {O876_Raycaster.Mobile}
	 * @param pVisibilityTest {function} fonction(x, y) renvoyant true si le secteur (x, y) laisse passer les entity mobiles
	 * @return Boolean
	 */
	canStalkerSeePrey : function(oStalker, oPrey, pVisibilityTest) {
		return this.areSectorsVisible(oStalker.xSector, oStalker.ySector, oPrey.xSector, oPrey.ySector, pVisibilityTest);
	},

	/**
	 * Renvoie true si on peut aller du secteur (x1, y1) au secteur (x2, y2) en ligne droite
	 * @param x1 {number}
	 * @param y1 {number} coordonnée du secteur 1
	 * @param x2 {number}
	 * @param y2 {number} coordonnée du secteur 2
	 * @param pVisibilityTest {function} fonction(x, y) renvoyant true si le secteur (x, y) laisse passer les entity mobiles
	 * @return Boolean
	 */
	areSectorsVisible : function(x1, y1, x2, y2, pVisibilityTest) {
		if (!pVisibilityTest(x1, y1)) {
			return false;
		}
		return !!this._oBresenham.line(x1, y1, x2, y2, pVisibilityTest);
	},
});