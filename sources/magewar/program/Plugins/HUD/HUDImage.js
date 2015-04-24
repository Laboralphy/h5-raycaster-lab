O2.extendClass('MW.HUDImage', UI.HUDElement, {
	
	oImage: null,
	
	draw: function() {
		if (this.oImage) {
			var c = this.oContext;
			var w = this.oCanvas.width;
			var h = this.oCanvas.height;
			c.drawImage(this.oImage, 0, 0, this.oImage.width, this.oImage.height, 0, 0, w, h);
		}
	},
	
	update: function(oImage) {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		if (!oImage) {
			this.oImage = null;
			c.clearRect(0, 0, w, h);
			return;
		}
		this.oImage = oImage;
		if (this.oImage.complete) {
			this.draw();
		} else {
			this.oImage.addEventListener('load', this.draw.bind(this));
		}
	}
});