/** 
 * Halo sombre de survival horror
 */
O2.extendClass('HOTD.GX.GunFlash', O876_Raycaster.GXEffect, {
	sClass: 'DarkHaze',
	oCanvas: null,
	bOver: false,
	nTime: 3,


	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = O876.CanvasFactory.cloneCanvas(oRaycaster.getRenderCanvas());
	},
	
	isOver: function() {
		return this.bOver;
	},

	process: function() {
		if (this.nTime-- < 0) {
			this.terminate();
		}
	},

	render: function() {
		var c = this.oCanvas;
		var ctx = c.getContext('2d');
		ctx.drawImage(this.oRaycaster.getRenderCanvas(), 0, 0);
		ctx = this.oRaycaster.getRenderContext();
		var fGCO = ctx.globalCompositeOperation;
		ctx.globalCompositeOperation = 'lighter';
		ctx.drawImage(c, 0, 0);
		ctx.globalCompositeOperation = fGCO;
	},

	done: function() {
		this.terminate();
	},
	
	terminate: function() {
		this.bOver = true;
	}
});
