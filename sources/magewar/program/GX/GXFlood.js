O2.extendClass('MW.GXFlood', O876_Raycaster.GXEffect, {
	sClass: 'Flood',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	aAmp: null,
	aPls: null,
	BUBBLES: 40,
	TIME_AMP: 16,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.nTime = 0;
		this.aAmp = [];
		this.aPls = [];
		for (var i = 0; i < this.BUBBLES * 2; ++i) {
			this.aAmp.push(MathTools.rnd(4, 32));
			this.aPls.push(MathTools.rnd(1, 1));
		}
	},
	
	isOver: function() {
		return (this.nTime * this.TIME_AMP) >= (this.oCanvas.height + 128);
	},

	process: function() {
		++this.nTime;
	},

	render: function() {
		var c = this.oContext;
		var t = this.nTime * this.TIME_AMP;
		var y = this.oCanvas.height - t;
		var w = this.oCanvas.width;
		c.fillStyle = '#002020';
		c.fillRect(0, y, w, t);
		c.fillStyle = 'rgba(0, 32, 32, 0.75)';
		c.strokeStyle = 'rgb(128, 128, 192)';
		for (var i = 0; i < this.BUBBLES; ++i) {
			c.beginPath();
			c.arc(this.aAmp[i] + i * w / this.BUBBLES | 0, y + 16 * Math.sin(i * 3 + this.nTime / 4) | 0, this.aAmp[i], 0, 2 * PI);
			c.lineWidth = this.aAmp[i] >> 3;
			c.fill();
			c.stroke();
		}
		for (i = 0; i < this.BUBBLES; ++i) {
			c.beginPath();
			c.arc(this.aAmp[i + this.BUBBLES] + i * w / this.BUBBLES | 0, y + 32 * Math.sin(i * 3 + this.nTime / 4) | 0, this.aAmp[i + this.BUBBLES], 0, 2 * PI);
			c.lineWidth = this.aAmp[i + this.BUBBLES] >> 3;
			c.fill();
			c.stroke();
		}
	
	},

	done: function() {
		var nPower = 100;
		var nSpeed = 2;
		var rc = this.oRaycaster;
		var oGXFlash = new O876_Raycaster.GXFlash(rc);
		var nColor = 0x002020;
		var r = (nColor & 0xFF0000) >> 16;
		var g = (nColor & 0xFF00) >> 8;
		var b = nColor & 0xFF;
		oGXFlash.fAlpha = nPower / 100;
		oGXFlash.fAlphaFade = rc.TIME_FACTOR * nSpeed / 5000;
		oGXFlash.oColor = {r: r, g: g, b: b, a: nPower / 100};
		rc.oEffects.addEffect(oGXFlash);
		rc.oEffects.addEffect(new GXUnderwater(rc));
		rc.oVisual.light >>= 1;
		rc.oVisual.fogDistance *= 0.75;
		var w = rc.oWall.image;
		var wc = w.getContext('2d');
		wc.drawImage(w, w.width >> 1, 0, w.width >> 1, w.height, 0, 0, w.width >> 1, w.height);
		rc.buildGradient();
	},
	
	terminate: function() {
		this.nTime = this.oCanvas.height + 128;
	}
});
