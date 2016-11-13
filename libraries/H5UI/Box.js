/* globals O2, H5UI */

O2.extendClass('H5UI.Box', H5UI.WinControl, {
	_sClass : 'Box',
	_sColor : '#FFFFFF',
	_sColorOutside : '#FF6666',
	_sColorInside : '#FFBBBB',
	_sColorBorder : '#000000',
	_sColorBorderOutside : '#000000',
	_sColorBorderInside : '#000000',
	_nBorderWidth : 8,

	_xGradStart : 0,
	_yGradStart : 0,
	_xGradEnd : 0,
	_yGradEnd : 0,
	_nGradOrientation : 0,
	
	__construct: function() {
		__inherited();
		this.on('mousein', this.onMouseIn.bind(this));
		this.on('mouseout', this.onMouseOut.bind(this));
	},

	setColor : function(sNormal, sHighlight) {
		if (sHighlight === undefined) {
			sHighlight = sNormal;
		}
		this._sColorInside = sHighlight;
		this._set('_sColor', this._sColorOutside = sNormal);
	},

	setBorder : function(n, sOut, sIn) {
		if (sOut === undefined) {
			sOut = '#000000';
		}
		if (sIn === undefined) {
			sIn = sOut;
		}
		if (n) {
			this._set('_sColorBorderOutside', sOut);
			this._set('_sColorBorderInside', sIn);
			this._set('_sColorBorder', sOut);
		}
		this._set('_nBorderWidth', n);
	},

	/**
	 * Triggered when the mouse overlaps the control
	 * @param x mouse position x (pixels)
	 * @param y mouse position y (pixels)
	 * @param b clicked button mask
	 */
	onMouseIn : function(x, y, b) {
		this._set('_sColorBorder', this._sColorBorderInside);
		this._set('_sColor', this._sColorInside);
	},

	/**
	 * Triggered when the mouse exits the control's bounding rect
	 * @param x mouse position x (pixels)
	 * @param y mouse position y (pixels)
	 * @param b clicked button mask
	 */
	onMouseOut : function(x, y, b) {
		this._set('_sColorBorder', this._sColorBorderOutside);
		this._set('_sColor', this._sColorOutside);
	},

	computeGradientOrientation : function() {
		switch (this._nGradOrientation) {
		case 1: // Vertical
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.getHeight() - 1;
			break;

		case 2: // Horiz
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.getWidth() - 1;
			this._yGradEnd = 0;
			break;
	
		case 3: // Diag 1
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.getWidth() - 1;
			this._yGradEnd = this.getHeight() - 1;
			break;
	
		case 4: // Diag 2
			this._xGradStart = this.getWidth() - 1;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.getHeight() - 1;
			break;
		}
	},

	getFillStyle : function() {
		var s = this.getSurface();
		var aGrad = this._sColor.split(' ');
		var xFillStyle;
		if (aGrad.length === 1) {
			xFillStyle = this._sColor;
		} else {
			// Le gradient contient il un mot clé permettant d'influencer le
			// type de gradient ?
			switch (aGrad[0]) {
				case 'hgrad':
					this._nGradOrientation = 2;
					break;
	
				case 'vgrad':
					this._nGradOrientation = 1;
					break;
	
				case 'd1grad':
					this._nGradOrientation = 3;
					break;
	
				case 'd2grad':
					this._nGradOrientation = 4;
					break;
	
				default:
					this._nGradOrientation = 0;
					break;
			}
			if (this._nGradOrientation) {
				aGrad.shift();
			}
			this.computeGradientOrientation();
			var oGrad = s.createLinearGradient(this._xGradStart, this._yGradStart,
					this._xGradEnd, this._yGradEnd);
			for ( var iGrad = 0; iGrad < aGrad.length; iGrad++) {
				oGrad.addColorStop(iGrad / (aGrad.length - 1), aGrad[iGrad]);
			}
			xFillStyle = oGrad;
		}
		return xFillStyle;
	},

	renderSelf : function() {
		this._oContext.fillStyle = this.getFillStyle();
		this._oContext.fillRect(0, 0, this.getWidth(), this.getHeight());
		if (this._nBorderWidth) {
			this._oContext.strokeStyle = this._sColorBorder;
			this._oContext.lineWidth = this._nBorderWidth;
			this._oContext.strokeRect(0, 0, this.getWidth(), this.getHeight());
		}
	}
});
