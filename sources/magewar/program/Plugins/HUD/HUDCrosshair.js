O2.extendClass('MW.HUDCrosshair', UI.HUDElement, {
	
	redraw: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		c.beginPath();
		c.moveTo(0, h >> 1);
		c.lineTo(w, h >> 1);
		c.stroke();
		c.moveTo(w >> 1, 0);
		c.lineTo(w >> 1, h);
		c.stroke();
	},
	
	update: function() {
		this.redraw();
	}
});
