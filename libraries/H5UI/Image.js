O2.extendClass('H5UI.Image', H5UI.WinControl, {
	_oTexture: null,
	_bAutosize: true,
	_sColorBorder : '#000000',
	_nBorderWidth : 0,
	
	_loadEvent: function(oEvent) {
		this.invalidate();
	},
	
	setSource: function(sSrc) {
		if (sSrc instanceof HTMLImageElement) {
			this._oTexture = sSrc;
		} else {
			if (!this._oTexture) {
				this._oTexture = new Image();
			}
			this._oTexture.src = sSrc;
		}
		if (this._oTexture.complete) {
			this.invalidate();
		} else {
			this._oTexture.addEventListener('load', this._loadEvent.bind(this), true);
		}
	},
	
	renderSelf: function() {
		var s = this.getSurface();
		if (this._oTexture && this._oTexture.complete) {
			if (this._bAutosize) {
				this.setSize(this._oTexture.width, this._oTexture.height);
				s.drawImage(this._oTexture,	0, 0);						
			} else {
				s.clearRect(0, 0, this.width(), this.height());
				s.drawImage(
					this._oTexture,
					0, 
					0, 
					this._oTexture.width, 
					this._oTexture.height,
					0, 
					0, 
					this.width(),
					this.height()
				);
			}
		}
		if (this._nBorderWidth) {
			this._oContext.strokeStyle = this._sColorBorder;
			this._oContext.lineWidth = this._nBorderWidth;
			this._oContext.strokeRect(0, 0, this.width(), this.height());
		}
	}
});
