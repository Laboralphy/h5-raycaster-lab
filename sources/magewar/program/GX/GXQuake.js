/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
O2.extendClass('MW.GXQuake', O876_Raycaster.GXEffect, {
	sClass: 'Quake',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	fAmp: 10,
	
	oQuakeCanvas: null,
	oQuakeContext: null,
	
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.getScreenCanvas();
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oQuakeCanvas = O876.CanvasFactory.getCanvas();
		this.oQuakeCanvas.width = this.oCanvas.width;
		this.oQuakeCanvas.height = this.oCanvas.height;
		this.oQuakeContext = this.oQuakeCanvas.getContext('2d');
		this.oQuakeContext.fillStyle = 'rgb(0, 0, 0)';
		this.oQuakeContext.fillRect(0, 0, this.oQuakeCanvas.width, this.oQuakeCanvas.height);
		this.nTime = 0;
		this.bOver = false;
	},

	isOver: function() {
		return this.nTime > 10;
	},

	process: function() {
		this.fAmp = this.fAmp * 0.8;
		++this.nTime;
	},

	render: function() {
		this.buildQuake();
		this.oContext.drawImage(this.oQuakeCanvas, 0, 0);
	},

	done: function() {
		this.oQuakeCanvas = null;
	},
	
	terminate: function() {
		this.nTime = 11;
	},
	
	buildQuake: function() {
		var fx = this.fAmp * Math.sin(MathTools.toRad(this.nTime * 100));
		this.oQuakeContext.drawImage(
			this.oCanvas,
			0, 
			fx 
		);
	}
});
