O2.extendClass('MW.HUDPing', UI.HUDElement, {

	aPings: null,

	redraw: function() {
		var aPings = this.aPings;
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var nValue;
		c.clearRect(0, 0, w, h);
		var nMax = Math.max.apply(null, aPings);
		var yMax = 2;
		var nRed = 0;
		var nGreen = 255;
		if (nMax > 64) {
			++yMax;
			nRed = 192;
		}
		if (nMax > 128) {
			++yMax;
			nRed = 255;
		}
		if (nMax > 256) {
			++yMax;
			nGreen = 128; 
		}
		if (nMax > 512) {
			++yMax;
			nGreen = 0; 
		}
		c.strokeStyle = 'rgb(' + nRed + ', ' + nGreen + ', 0)';
		c.fillStyle = '#FFF';
		c.textBaseLine = 'top';
		c.font = '9px monospace';
		var nSum = 0;
		for (var i = 0; i < aPings.length && i < w; ++i) {
			nValue = Math.min(16, aPings[i] >> yMax);
			nSum += aPings[i];
			c.beginPath();
			c.moveTo(i, 15);
			c.lineTo(i, 15 - nValue);
			c.stroke();
		}
		nSum /= aPings.length;
		nSum |= 0;
		c.strokeStyle = '#000';
		c.strokeText(nSum, 0, 10);
		c.fillText(nSum, 0, 10);
	},
	
	update: function(aPings) {
		this.aPings = aPings;
		this.redraw();
	}
});
