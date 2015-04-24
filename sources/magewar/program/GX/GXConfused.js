/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
O2.extendClass('MW.GXConfused', O876_Raycaster.GXEffect, {
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
		var fx = Math.sin(MathTools.toRad(this.nTime * 9.8)) + Math.sin(MathTools.toRad(this.nTime * 4.77)) + 2;
		var fy = Math.sin(MathTools.toRad(this.nTime * 4.1)) + Math.sin(MathTools.toRad(this.nTime * 2.25)) + 2;
		var fx2 = Math.sin(MathTools.toRad(this.nTime * 7.8)) + Math.sin(MathTools.toRad(this.nTime * 5.77)) + 2;
		var fy2 = Math.sin(MathTools.toRad(this.nTime * 3.1)) + Math.sin(MathTools.toRad(this.nTime * 3.25)) + 2;
		var nx = fx * 16 | 0;
		var ny = fy * 8 | 0;
		var nx2 = fx2 * 16 | 0;
		var ny2 = fy2 * 8 | 0;
		
		this.oConfContext.drawImage(
			this.oCanvas, 
			nx, 
			ny, 
			this.oCanvas.width - nx - nx2, 
			this.oCanvas.height - ny - ny2, 
			0,
			0,
			this.oConfCanvas.width,
			this.oConfCanvas.height
		);
	}
});
