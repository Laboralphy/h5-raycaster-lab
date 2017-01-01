/** Effet graphique temporisé
 * Simule un effet d'éblouissement à la Mass Effect 3
 */
O2.extendClass('MW.GXBlind', O876_Raycaster.GXEffect, {
	sClass: 'Blind',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oFlashCanvas: null,
	oFlashContext: null,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.getScreenCanvas();
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oFlashCanvas = O876.CanvasFactory.getCanvas();
		this.oFlashCanvas.width = this.oCanvas.width;
		this.oFlashCanvas.height = this.oCanvas.height;
		this.oFlashContext = this.oFlashCanvas.getContext('2d');
		this.oFlashContext.fillStyle = 'rgb(0, 0, 0)';
		this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
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
		this.buildBlindness();
		this.oContext.drawImage(this.oFlashCanvas, 0, 0);
	},

	done: function() {
		this.oFlashCanvas = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	
	buildBlindness: function() {
		var xGA = this.oFlashContext.globalAlpha;
		var f = Math.sin(MathTools.toRad(this.nTime << 3));
		if (f < 0) {
			this.oFlashContext.globalAlpha = 0; 
		} else {
			this.oFlashContext.globalAlpha = f;
		}
		this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
		this.oFlashContext.globalAlpha = xGA;
		
		xGA = this.oFlashContext.globalCompositeOperation;
		this.oFlashContext.globalCompositeOperation = 'lighter';
		this.oFlashContext.drawImage(this.oCanvas, 0, 0);
		this.oFlashContext.globalCompositeOperation = xGA;
	}
});
