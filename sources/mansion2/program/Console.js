O2.createClass('MANSION.Console', {

	_aLines: null,
	_oText: null,
	_bRedraw: false,
	_nTime: 0,


	MAX_LINES: 25,

	__construct: function() {
		this.clear();
		var t = new H5UI.Text();
		t.setFontColor('#FFF', '#000');
		t.setAutosize(false);
		t.setWordWrap(true);
		this._oText = t;
	},

	clear: function() {
		this._aLines = [];
		return this;
	},

	render: function(oContext, x, y) {
		if (this._bRedraw) {
			this._bRedraw = false;
			var cvs = oContext.canvas;
			var w = cvs.width;
			var h = cvs.height;
			var t = this._oText;

			t.setSize(w, h);
			var sCaption = this._aLines.join('\n');
			if (sCaption !== t._sCaption) {
				t.setCaption(sCaption);
			}
		}
		var fGlobalAlpha = oContext.globalAlpha;
		if (this._nTime > 0) {
			if (this._nTime < 10) {
				oContext.globalAlpha = this._nTime / 10;
			}
			oContext.drawImage(this._oText._oCanvas, x, y);
			oContext.globalAlpha = fGlobalAlpha;
			--this._nTime;
		}
		return this;
	},

	print: function() {
		this._nTime = 200;
		this._bRedraw = true;
		this._aLines.push(Array.prototype.slice.call(arguments, 0).join(' '));
		while (this._aLines.length > this.MAX_LINES) {
			this._aLines.shift();
		}
		return this;
	}

});