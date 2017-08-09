/**
 * Thinker de missile
 */
O2.extendClass('HOTD.PlayerCamThinker', O876_Raycaster.NonLinearThinker, {

	_movements: null,

	thinkInit: function() {
		var SQ = 64;
		this._movements = [
			[3 * SQ, 0, null, 2000],
			[3 * SQ, 0, null, 2000],
			[2 * SQ, -SQ, -PI/2, 1000],
			null,
			[0, -2 * SQ, null, 1000],
			[0, -4 * SQ, null, 4000],
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
	},

	resume: function() {
		this.thinkStop();
	}
});
