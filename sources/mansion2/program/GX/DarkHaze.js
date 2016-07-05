/** 
 * Halo sombre de survival horror
 */
O2.extendClass('MANSION.GX.DarkHaze', O876_Raycaster.GXEffect, {
	sClass: 'DarkHaze',
	oCanvas: null,
	oContext: null,
	bOver: false,
	oGradient: null,
	fDarkIndex: 0.5,
	fDarkFinal: 0.5,
	oEasing: null,
	nTimeFinal: 10,
	nTimeIndex: 0,
	bPulse: false,
	bPulseLoop: false,
	
	fMin: 0.5,
	fMax: 1,
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		var c = oRaycaster.oCanvas;
		var ctx = c.getContext('2d'); 
		this.oCanvas = c;
		this.oContext = ctx;
		this.oEasing = new O876.Easing();
		this.oEasing.use('smoothstep');
		this.nTimeIndex = this.nTimeFinal;
		this.processDark(this.fMin);
	},
	
	setDark: function(f) {
		this.fDarkFinal = f;
		this.oEasing.from(this.fDarkIndex).to(f).during(this.nTimeFinal);
		this.nTimeIndex = 0;
		this.bPulse = true;
	},
	
	startPulse: function(bLoop) {
		if (!this.bPulse) {
			this.setDark(this.fMax);
		}
		if (this.bPulse) {
			this.bPulseLoop = !!bLoop;
		}
	},

	/**
	 * Arrete la pulsation en boucle
	 */
	stopPulse: function() {
		this.bPulseLoop = false;
	},
	
	processDark: function(f) {
		var c = this.oCanvas;
		var ctx = this.oContext;
		var w = c.width;
		var h = c.height;
		var w2 = w >> 1;
		var h2 = h >> 1;
		var g = ctx.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		g.addColorStop(0, 'rgba(0, 0, 0, 0)');
		g.addColorStop(1 - f, 'rgba(0, 0, 0, 0)');
		var red = ((f - this.fMin) * 255 | 0).toString();
		var green = ((f - this.fMin) * 32 | 0).toString();
		var blue = ((f - this.fMin) * 0 | 0).toString();
		g.addColorStop(1, 'rgba('+ red + ', ' + green + ', ' + blue + ', ' + f.toString() + ')');
		this.oGradient = g;
	},
	
	isOver: function() {
		return this.bOver;
	},

	process: function() {
		if (this.bPulse && this.nTimeIndex <= this.nTimeFinal) {
			this.oEasing.f(this.nTimeIndex);
			++this.nTimeIndex;
			this.processDark(this.oEasing.x);
			if (this.nTimeIndex === this.nTimeFinal) {
				if (this.fDarkFinal != this.fMin) {
					this.fDarkIndex = this.fDarkFinal;
					this.setDark(this.fMin);
				} else {
					this.fDarkIndex = this.fDarkFinal;
					this.bPulse = false;
					if (this.bPulseLoop) {
						this.startPulse(true);
					}
				}
			}
		}
	},

	render: function() {
		var c = this.oCanvas;
		this.oContext.fillStyle = this.oGradient;
		this.oContext.fillRect(0, 0, c.width, c.height);
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	}
});
