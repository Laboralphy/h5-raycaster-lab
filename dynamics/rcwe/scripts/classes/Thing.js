/**
 * A data structure storing all the properties needed to manage things
 */
O2.createClass('RCWE.Thing', {
	oData: null,
	
	/**
	 * Initializing allowed keys
	 */
	__construct: function(d) {
		this.oData = {
			'id': 0,
			'image': null,
			'frames': 1,
			'delay': 80,
			'width': 0,
			'height': 0,
			'loop': 'none',
			'transl': false,
			'noshad': false,
			'alpha50': false
		};
	},
	
	isEmpty: function() {
		var d = this.oData;
		return !d.image;
	},
	
	setData: function(sKey, value) {
		if (sKey == 'yoyo') return;
		if (sKey in this.oData) {
			this.oData[sKey] = value;
		} else {
			throw new Error('unknow thing property ' + sKey);
		}
	},
	
	getData: function(sKey) {
		if (sKey === undefined) {
			return this.oData;
		} else if (sKey in this.oData) {
			return this.oData[sKey];
		} else {
			throw new Error('unknow thing property ' + sKey);
		}
	},
	
	/**
	 * render a flat view of the block
	 * in order to be display in the grid
	 */ 
	render: function(oCanvas) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var c = oCanvas.getContext('2d');
		c.clearRect(0, 0, w, h);
		var nFrames = this.getData('frames');
		if (nFrames == 0) {
			return;
		}
		var oImg = this.getData('image');
		var wFrame = oImg.width / this.getData('frames') | 0;
		var hFrame = oImg.height;
		var w100 = 1;
		if (wFrame > w) {
			// source width too large to fit canvas
			w100 = w / wFrame;
		}
		if ((hFrame * w100) > h) {
			// source height too large to fit canvas
			w100 = h / (hFrame * w100);
		}
		var wDst = wFrame * w100 | 0, hDst = hFrame * w100 | 0;
		c.drawImage(oImg, 0, 0, wFrame, hFrame, (w - wDst) >> 1, (h - hDst) >> 1, wDst, hDst);
	},

	serialize: function() {
		return this.getData();
	},

	unserialize: function(oData) {
		for (var s in oData) {
			this.setData(s, oData[s]);
		}
	},
});
