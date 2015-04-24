O2.createClass('UI.HUD', {
	oClientCanvas: null,	// canvas final
	oClientContext: null,
	
	oElements: null,
	
	setCanvas: function(c) {
		this.oClientCanvas = c;
		this.oClientContext = c.getContext('2d');
	},
	
	getCanvas: function() {
		return this.oClientCanvas;
	},
	
	addNewElement: function(e, sId, x, y, w, h) {
		if (!this.oElements) {
			this.oElements = {};
		}
		e.setCanvas(this.oClientCanvas);
		var r;
		if (typeof w == 'string') {
			r = w.match(/^(-?[0-9]+)%$/);
			if (r) {
				w = this.oClientCanvas.width * (r[1] | 0) / 100 | 0; 
			}
		}
		if (typeof h == 'string') {
			r = h.match(/^(-?[0-9]+)%$/);
			if (r) {
				h = this.oClientCanvas.width * (r[1] | 0) / 100 | 0; 
			}
		}
		e.setSize(w, h);
		e.moveTo(x, y);
		this.oElements[sId] = e;
		return e;
	},
	
	getElement: function(sId) {
		return this.oElements[sId];
	},
	
	render: function() {
		var sId = '';
		for (sId in this.oElements) {
			this.oElements[sId].render();
		}
	}
});
