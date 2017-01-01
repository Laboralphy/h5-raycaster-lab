/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * Icon : icone munie d'un compteur de stack.
 */

O2.extendClass('UI.Icon', H5UI.WinControl, {
	_sClass: 'UI.Icon',
	
	oImage: null,
	xStart: 0,
	yStart: 0,
	fZoom: 1,
	_bSelected: false,
	_bRedCross: false,
	
	setImage: function(oImage) {
		this.oImage = oImage;
		this.invalidate();
	},
	
	selected: function(b) {
		this._set('_bSelected', b);
	},
	
	drawImage: function() {
		this._oContext.drawImage(
			this.oImage, 
			this.xStart, 
			this.yStart, 
			this._nWidth, 
			this._nHeight, 
			0, 
			0, 
			this._nWidth * this.fZoom | 0, 
			this._nHeight * this.fZoom | 0
		);
	},
	
	
	setStackCounter: function(n) {
		var bStackable = n >= 1;
		var bHasCounter = this.getControlCount() > 0;
		var nMask = (bStackable ? 2 : 0) | (bHasCounter ? 1 : 0);
		var oBoxStackCounter;
		switch (nMask) {
			case 0: 
				break;
				
			case 1:
				this.clear();
				break;
				
			case 2:
				oBoxStackCounter = this.linkControl(new H5UI.Text());
				oBoxStackCounter.font.setFont('monospace');
				oBoxStackCounter.font.setSize(16);
				oBoxStackCounter.font.setStyle('bold');
				oBoxStackCounter.font.setColor('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
				oBoxStackCounter.moveTo(4, 30); /* no break here */
				// pas de break pour pouvoir modifier le compteur
				
			case 3:			
				oBoxStackCounter = this.getControl(0);
				oBoxStackCounter.setCaption(n);
				oBoxStackCounter.render();
				break;
		}
	},

	
	
	renderSelf: function() {
		var c = this._oContext; 
		var w = this.width();
		var h = this.height();
		c.clearRect(0, 0, w, h);
		this.drawImage();
		if (this._bSelected) {
			var sGCO = c.globalCompositeOperation;
			var fGA = c.globalAlpha;
			c.globalCompositeOperation = 'lighter';
			c.globalAlpha = 0.5;
			this.drawImage();
			c.globalCompositeOperation = sGCO;
			c.globalAlpha = fGA;
			c.strokeStyle = UI.clSELECT_BORDER;
			c.lineWidth = 4;
			c.strokeRect(0, 0, w, h);
		}
		if (this._bRedCross) {
			var w4 = w >> 3;
			var h4 = h >> 3;
			var w3 = w - w4;
			var h3 = h - h4;
			c.strokeStyle = '#FF0000',
			c.lineWidth = 4;
			c.beginPath();
			c.moveTo(w4, h4);
			c.lineTo(w3, h3);
			c.stroke();
			c.beginPath();
			c.moveTo(w3, h4);
			c.lineTo(w4, h3);
			c.stroke();
		}
	}
});

