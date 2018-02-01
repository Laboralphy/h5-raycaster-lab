O2.createClass('O876_Raycaster.WeaponLayer', {
	// x, y
	x: 0,
	y: 0,
	time: 0,
	canvas: null,
	context: null,
	running: false,
	xBase: 0,
	yBase: 0,

	PERIOD: 1300,
	RADIUS: 20,


	process: function(nTime) {
		if (this.running) {
			// PERIOD -> 2*PI
			//
			var t = this.time;
			var x, y;
			x = Math.sin(t)
		}
	},

	render: function(ctx) {
		var bRunning = this.running;
		ctx.drawImage(this.canvas, bRunning ? this.x : this.xBase, bRunning ? this.y : this.yBase);
	}
});