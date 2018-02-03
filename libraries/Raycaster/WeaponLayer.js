O2.createClass('O876_Raycaster.WeaponLayer', {
	// x, y
	x: 0,
	y: 0,
	canvas: null,
	context: null,
	running: false,
	xBase: 0,
	yBase: 0,
	xDown: 0,
	yDown: 100, // position du layer lorsque l'arme est baissée
	tile: null,
	time: 0,
	firetime: 0,
	animation: 0,
	easing: null,
	changing: 0,  // 0 = up, 1 = going down, 2 = down, change, 3 = going up
	onSheated: null,

	RADIUS: 20,

	base: function(x, y, yDown) {
		this.x = x;
		this.y = y;
		this.xBase = x;
		this.yBase = y;
		this.xDown = x;
		this.yDown = yDown;
	},


	/**
	 * Baisse l'arme
	 * Change le Tile, et remonte l'arme
	 */
	sheat: function(cb) {
		this.changing = 1;
		this.easing = new O876.Easing();
		this.easing.from(this.yBase).to(this.yDown).during(10).use('squareAccel');
		this.onSheated = cb;
	},

	unsheat: function() {
		this.x = this.xDown;
		this.y = this.yDown;
		this.changing = 2;
		this.easing = new O876.Easing();
		this.easing.from(this.yDown).to(this.yBase).during(10).use('squareDeccel');
	},

	isReady: function() {
		return this.changing === 0;
	},

	processChanging() {
		switch (this.changing) {
			case 1:
				if (this.easing.next().over()) {
					if (this.onSheated) {
						this.onSheated();
					}
				}
				break;

			case 2:
				if (this.easing.next().over()) {
					this.changing = 0;
					this.easing = null;
				}
				break;
		}
		return this.easing ? this.easing.val() : this.yBase;
	},

	fire: function() {
		this.firetime = this.time + 700;
		this.playAnimation(1);
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
			if (this.animation.bOver) {
				this.playAnimation(0);
			}
		}
		this.x = x + this.xBase;
		if (this.changing) {
			this.y = this.processChanging();
		} else {
			this.y = y + this.yBase;
		}
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