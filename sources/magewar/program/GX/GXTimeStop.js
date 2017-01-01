/** Effet graphique temporisé
 * Simule un effet du time stop
 */
O2.extendClass('MW.GXTimeStop', O876_Raycaster.GXEffect, {
	sClass: 'TimeStop',
	oCanvas: null,
	oContext: null,
	bOver: false,
	nTime: 0,
	
	oPixBuff:null,
	oPixBuff8: null,
	oPixBuff32: null,
	
	wBuff: 0,
	hBuff: 0,
	nPixelCount: 0,
	
	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.getScreenCanvas();
		this.oContext = this.oCanvas.getContext('2d');
		this.bOver = false;
		var oData = this.oContext.getImageData(0, 0, this.wBuff = this.oCanvas.width, this.hBuff = this.oCanvas.height);
		this.nPixelCount = this.hBuff * this.wBuff;
		this.oPixBuff = new ArrayBuffer(oData.data.length);
		this.oPixBuff8 = new Uint8ClampedArray(this.oPixBuff); 
		this.oPixBuff32 = new Uint32Array(this.oPixBuff);
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildTimeStop();
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	buildTimeStop: function() {
		var oImageData = this.oContext.getImageData(0, 0, this.wBuff, this.hBuff);
		var pc = this.nPixelCount;
		this.oPixBuff8.set(oImageData.data);
		var p32 = this.oPixBuff32;
		var p, r, g, b, v;
		for (var i = 0; i < pc; i += 1) {
			p = p32[i];
			b = (p >> 16) & 0xFF;
			g = (p >> 8) & 0xFF;
			r = p & 0xFF;
			v = (r * 19 + g * 38 + b * 7) >> 6;
			p32[i] = (p & 0xFF000000) | (v << 16) | (v << 8) | v;
		}
		oImageData.data.set(this.oPixBuff8);
		this.oContext.putImageData(oImageData, 0, 0);
	}
});
