O2.createClass('UI.HUDElement', {
	oCanvas: null,
	oContext: null,
	oClientCanvas: null,
	oClientContext: null,
	x: 0,
	y: 0,
	fAlpha: 1,
	oGame: null,
	
	getTile: function(sTile) {
		return this.oGame.oRaycaster.oHorde.oTiles[sTile].oImage;
	},
	
	setSize: function(w, h) {
		this.oCanvas = O876.CanvasFactory.getCanvas();
		this.oCanvas.width = w;
		this.oCanvas.height = h;
		this.oContext = this.oCanvas.getContext('2d');
	},
	
	setCanvas: function(c) {
		this.oClientCanvas = c;
		this.oClientContext = c.getContext('2d');
	},
	
	moveTo: function(x, y) {
		if (x < 0) {
			x = this.oClientCanvas.width - this.oCanvas.width + x;
		}
		if (y < 0) {
			y = this.oClientCanvas.height - this.oCanvas.height + y;
		}
		this.x = x;
		this.y = y;
	},
	
	getContext: function() {
		return this.oContext;
	},
	
	init: function() {
		
	},
	
	redraw: function() {
	},
	
	update: function() {
	},
	
	render: function() {
		if (this.fAlpha > 0) {
			if (this.fAlpha >= 1) {
				this.oClientContext.drawImage(this.oCanvas, this.x, this.y);
			} else {
				var g = this.oClientContext.globalAlpha;
				this.oClientContext.globalAlpha = this.fAlpha;
				this.oClientContext.drawImage(this.oCanvas, this.x, this.y);
				this.oClientContext.globalAlpha = g;
			}
		}
	},
});
