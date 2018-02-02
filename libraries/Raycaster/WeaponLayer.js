O2.createClass('O876_Raycaster.WeaponLayer', {
	// x, y
	x: 0,
	y: 0,
	canvas: null,
	context: null,
	running: false,
	xBase: 0,
	yBase: 0,
	tile: null,
	time: 0,
	firetime: 0,
	animation: 0,

	RADIUS: 20,

	base: function(x, y) {
		this.xBase = x;
		this.yBase = y;
	},

	fire: function() {
		this.firetime = this.time + 700;
	},

	playAnimation: function(n) {
		if (this.tile.aAnimations[n]) {
			this.animation = new O876_Raycaster.Animation();
            this.animation.assign(this.tile.aAnimations[n]);
		}
	},

	process: function(nTime, oMobile) {
        var x = 0, y = 0;
		this.time += nTime;
        var t = this.time;
		this.running = oMobile.isMoving();
		if (this.running && this.firetime < t) {
            x = this.RADIUS * Math.sin(t / 170) | 0;
            y = Math.abs(this.RADIUS * Math.cos(t / 170)) | 0;
		}
		if (this.animation) {
			this.animation.animate(nTime);
		}
        this.x = x + this.xBase;
        this.y = y + this.yBase;
	},

	render: function(ctx) {
		var t = this.tile;
		var x = 0;
		if (this.animation) {
			x = this.animation.nFrame * this.tile.nWidth;
		}
		ctx.drawImage(t.oImage,
			x,
			0,
			t.nWidth,
			t.nHeight,
			this.x,
			this.y,
        	t.nWidth,
            t.nHeight,
		);
	}
});