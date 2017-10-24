/** Effet graphique temporisé
 * Simule un effet de vision sous-marine
 */
O2.extendClass('MW.GXUnderwater', O876_Raycaster.GXEffect, {
	sClass: 'Underwater',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oDistCanvas: null,
	oDistContext: null,

	oDistCanvas2: null,
	oDistContext2: null,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.getScreenCanvas();
		this.oContext = this.oCanvas.getContext('2d'); 

		this.oDistCanvas = O876.CanvasFactory.getCanvas();
		this.oDistCanvas.width = this.oCanvas.width;
		this.oDistCanvas.height = this.oCanvas.height;
		this.oDistContext = this.oDistCanvas.getContext('2d');
		this.oDistContext.fillStyle = 'rgb(0, 0, 0)';
		this.oDistContext.fillRect(0, 0, this.oDistCanvas.width, this.oDistCanvas.height);

		this.oDistCanvas2 = O876.CanvasFactory.getCanvas();
		this.oDistCanvas2.width = this.oCanvas.width;
		this.oDistCanvas2.height = this.oCanvas.height;
		this.oDistContext2 = this.oDistCanvas2.getContext('2d');
		this.oDistContext2.fillStyle = 'rgb(0, 0, 0)';
		this.oDistContext2.fillRect(0, 0, this.oDistCanvas2.width, this.oDistCanvas2.height);

		this.nTime = 0;
		this.bOver = false;
		this.y = [0, 0, 0];
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildDistortion();
		this.oContext.drawImage(this.oDistCanvas2, 0, 0);
	},

	done: function() {
		this.oDistCanvas = null;
		this.oDistCanvas2 = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},

	buildDistortion: function() {
		//this.oDistContext.drawImage(this.oCanvas, 0, 0);
		//this.oDistContext.fillStyle = 'red';
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		var h2 = h >> 1;
		var h4 = h >> 2;
		var h16 = h >> 5;
		var y = [
			h16 * Math.sin(MathTools.toRad(this.nTime * 8)) + h4 - h16 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 10)) + h2 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 6)) + h2 + h4 + h16 | 0
		];
		this.oDistContext.drawImage(this.oCanvas, 0, 0, w, h4, 0, 0, w, y[0]);
		this.oDistContext.drawImage(this.oCanvas, 0, h4, w, h4, 0, y[0], w, y[1] - y[0]);
		this.oDistContext.drawImage(this.oCanvas, 0, h2, w, h4, 0, y[1], w, y[2] - y[1]);
		this.oDistContext.drawImage(this.oCanvas, 0, h2 + h4, w, h4, 0, y[2], w, h - y[2]);
		
		h2 = w >> 1;
		h4 = w >> 2;
		h16 = w >> 5;
		y = [
			h16 * Math.sin(MathTools.toRad(this.nTime * 7)) + h4 - h16 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 9)) + h2 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 5)) + h2 + h4 + h16 | 0
		];
		this.oDistContext2.drawImage(this.oDistCanvas, 0, 0, h4, h, 0, 0, y[0], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h4, 0, h4, h, y[0], 0, y[1] - y[0], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h2, 0, h4, h, y[1], 0, y[2] - y[1], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h2 + h4, 0, h4, h, y[2], 0, w - y[2], h);
	}
});
