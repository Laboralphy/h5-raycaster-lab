/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
O2.extendClass('GXConfused', O876_Raycaster.GXEffect, {
	sClass: 'Confused',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oConfCanvas: null,
	oConfContext: null,
	
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oConfCanvas = O876.CanvasFactory.getCanvas();
		this.oConfCanvas.width = this.oCanvas.width;
		this.oConfCanvas.height = this.oCanvas.height;
		this.oConfContext = this.oConfCanvas.getContext('2d');
		this.oConfContext.fillStyle = 'rgb(0, 0, 0)';
		this.oConfContext.fillRect(0, 0, this.oConfCanvas.width, this.oConfCanvas.height);
		this.nTime = 0;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildConfusion();
		this.oContext.drawImage(this.oConfCanvas, 0, 0);
	},

	done: function() {
		this.oConfCanvas = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	buildConfusion: function() {
		var fx = Math.sin(MathTools.toRad(this.nTime << 3)) + 1;
		var fy = 2 - fx;
		var nx = fx * 32 | 0;
		var ny = fy * 32 | 0;
		this.oConfContext.drawImage(this.oCanvas, nx, ny, this.oCanvas.width - nx - nx, this.oCanvas.height - ny - ny, 0, 0, this.oConfCanvas.width, this.oConfCanvas.height);
	}
});
