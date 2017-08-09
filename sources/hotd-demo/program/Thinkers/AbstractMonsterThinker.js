O2.createClass('HOTD.AbstractStalkerThinker', {
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
	}
});