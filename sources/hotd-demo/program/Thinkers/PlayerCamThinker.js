/**
 * Thinker de missile
 */
O2.extendClass('HOTD.PlayerCamThinker', O876_Raycaster.NonLinearThinker, {

	_movements: null,

	thinkInit: function() {
		this._movements = [
			[64 * 3, 0, null, 2000],
			[64 * 3, 0, null, 2000],
			[64 * 2, -64 * 1, -PI/2, 1000],
			[0, -64 * 2, null, 1000],
			[0, -64 * 4, null, 4000],
		];
		this.setMove(null, null, null, 0, 0, 0, 1500);
		__inherited();
	},

	thinkStop: function() {
		var m = this._movements.shift();
		if (m) {
			this.setMove(null, null, null, m[0], m[1], m[2], m[3]);
			this.think = this.thinkMove;
		} else {
			this.think = this.thinkIdle;
		}
	}
});
