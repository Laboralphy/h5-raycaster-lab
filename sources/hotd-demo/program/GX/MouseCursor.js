/** 
 * Intro Effect
 * Display flash photo and text
 */
O2.extendClass('HOTD.GX.MouseCursor', O876_Raycaster.GXEffect, {
	sClass: 'MouseCursor',
	bOver: false,
	oCursorCvs: null,
	x: 0,
	y: 0,
	WIDTH: 15,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		var rcc = oRaycaster.getRenderCanvas();
		var w = this.WIDTH;
		var w2 = w >> 1;
		var cvs = O876.CanvasFactory.getCanvas(w, w, true);
		var ctx = cvs.getContext('2d');
		ctx.fillStyle = 'rgba(255, 0, 0, 0.777)';
		ctx.fillRect(w2, 0, 1, w);
		ctx.fillRect(0, w2, w, 1);
		this.oCursorCvs = cvs;
	},

	/**
	* Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return boolean
	*/
	isOver: function() {
		return this.bOver;
	},

	moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	},

	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {

	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
		var ctx = this.oRaycaster.getRenderContext();
		var w = this.WIDTH >> 1;
		ctx.drawImage(this.oCursorCvs, this.x - w, this.y - w);
	},

	/** Fonction appelée lorsque l'effet se termine de lui même
	* ou stoppé par un clear() du manager
	*/
	done: function() {
		this.terminate();
	},

	/** Permet d'avorter l'effet
	* Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	* (restauration de l'état du laby par exemple)
	*/
	terminate: function() {
		this.bOver = true;
	}
});

