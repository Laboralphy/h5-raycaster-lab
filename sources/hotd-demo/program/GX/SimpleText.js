/** 
 * Intro Effect
 * Display flash photo and text
 */
O2.extendClass('HOTD.GX.SimpleText', O876_Raycaster.GXEffect, {
	sClass: 'SimpleText',
	oCanvas: null,
	bOver: false,
	
	FONT_SIZE: 16,
	FONT_ALPHA_TIME: 10,
	
	aText: null,
	oEasingAlpha: null,
	nTime: 0,
	nPhase: 0,
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		var rcc = oRaycaster.getRenderCanvas();
		var oCanvas = O876.CanvasFactory.getCanvas();
		oCanvas.width = rcc.width;
		oCanvas.height = rcc.height;
		this.oCanvas = oCanvas;
		this.oEasingAlpha = new O876.Easing();
	},

	text: function(aText, x, y) {
		this.oEasingAlpha.from(0).to(1).during(this.FONT_ALPHA_TIME).use('smoothstep');
		var cvs = this.oCanvas;
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		ctx.font = 'bold ' + this.FONT_SIZE + 'px monospace';
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseLine = 'middle';
		this.nTime = 6;
		var yText = y;
		var xText = x;
		aText.forEach(function(t, i) {
			ctx.strokeText(t, xText, yText);
			ctx.fillText(t, xText, yText);
			this.nTime += t.length << 1;
			yText += this.FONT_SIZE * 1.2 | 0;
		}, this);
	},
	

	/** 
	* Cette fonction doit renvoyer TRUE si l'effet est fini
	* @return bool
	*/
	isOver: function() {
		return this.nPhase > 2;
	},


	/** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
	*/
	process: function() {
		switch (this.nPhase) {
			case 0:
				if (this.oEasingAlpha.next().over()) {
					++this.nPhase;
				}
			break;
			
			case 1:
				if (--this.nTime <= 0) {
					this.oEasingAlpha.from(1).to(0).during(this.FONT_ALPHA_TIME).use('smoothstep');
					++this.nPhase;
				}
			break;
			
			case 2: 
				if (this.oEasingAlpha.next().over()) {
					++this.nPhase;
				}
			break;
		}
	},

	/** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
	*/
	render: function() {
		var cvs = this.oCanvas;
		var ctx = this.oRaycaster.getRenderContext();
		var fAlpha = ctx.globalAlpha;
		ctx.globalAlpha = this.oEasingAlpha.val();
		ctx.drawImage(cvs, 0, 0);
		ctx.globalAlpha = fAlpha;
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
		this.nPhase = 3;
	}
});

