/**
 * A data structure storing all the properties needed to manage blocks
 */
O2.createClass('RCWE.Block', {
	oData: null,
	
	/**
	 * Initializing allowed keys
	 */
	__construct: function(d) {
		if (d === undefined) {
			this.oData = {
				'id': 0,
				'type': 0,
				'floor': '',
				'ceil': '',
				'left': '',
				'right': '',
				'left2': '',
				'right2': '',
				'doortype': 0,
				'offset': 0,
				'frames': 1,
				'delay': 160,
				'yoyo': false
			};
		} else {
			this.unserialize(d);
		}
	},
	
	getTileById: function(sId) {
		if (!!sId) {
			var $tile = $('#' + sId);
			if ($tile.length) {
				return $tile;
			}
		}
		return null;
	},
	
	isEmpty: function() {
		var d = this.oData;
		return d.type == 0 && d.floor == '' && d.ceil == '';
	},
	
	setData: function(sKey, value) {
		if (sKey in this.oData) {
			this.oData[sKey] = value;
		} else {
			throw new Error('unknow block property ' + sKey);
		}
	},
	
	getData: function(sKey) {
		if (sKey in this.oData) {
			return this.oData[sKey];
		} else {
			throw new Error('unknow block property ' + sKey);
		}
	},
	
	
	/**
	 * Render a floor tile with a streching factor
	 * @param oCanvas canvas to be rendered on
	 * @param fStretch streatch factor value between 0 and 1 (0.25 or 1 usually)
	 */
	renderFloor: function(oCanvas, fStretch) {
		this.renderTile(oCanvas, 'floor', 1, fStretch, 0, 1 - fStretch);
	},

	/**
	 * Render a ceil tile with a streching factor
	 * @param oCanvas canvas to be rendered on
	 * @param fStretch streatch factor value between 0 and 1 (0.25 or 1 usually)
	 */
	renderCeil: function(oCanvas, fStretch) {
		this.renderTile(oCanvas, 'ceil', 1, fStretch, 0, 0);
	},

	/**
	 * Render a wall tile with a streching factor
	 * @param oCanvas canvas to be rendered on
	 * @param xStretch stretch factor value between 0 and 1 (0.25 or 1 usually)
	 */
	renderTile: function(oCanvas, sTile, xStretch, yStretch, xOffset, yOffset) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var c = oCanvas.getContext('2d');
		var wFinal = w * xStretch | 0;
		var hFinal = h * yStretch | 0;
		var xFinal = w * xOffset | 0;
		var yFinal = h * yOffset | 0;
		var $src = this.getTileById(this.getData(sTile));
		if ($src) {
			var oSrc = $src.get(0);
			if (oSrc) {
				c.drawImage(oSrc, 
					0, 0, oSrc.width, oSrc.height,
					xFinal, yFinal, wFinal, hFinal
				);
			}
		}
		c.strokeStyle = '#000000';
		c.strokeRect(xFinal, yFinal, wFinal, hFinal);
	},
	
	/**
	 * render a flat view of the block
	 * in order to be display in the grid
	 */ 
	renderFlat: function(oCanvas) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var c = oCanvas.getContext('2d');
		c.clearRect(0, 0, w, h);
		var oCvs = {};
		var bt = RCWE.CONST.BLOCK_TYPE;
		var dt = RCWE.CONST.DOOR_TYPE;
		
		// drawing textures
		switch (this.getData('type')) {
			case bt.WALKABLE:
			case bt.BLOCKING:
				if (this.getData('ceil')) {
					this.renderCeil(oCanvas, 0.5);
					this.renderFloor(oCanvas, 0.5);
				} else {
					this.renderFloor(oCanvas, 1);
				}
				break;
				
			case bt.SOLID:
				this.renderTile(oCanvas, 'left', 0.5, 1, 0, 0);
				this.renderTile(oCanvas, 'right', 0.5, 1, 0.5, 0);
				break;
			
			case bt.TRANSPARENT:
			case bt.DOOR:
			case bt.SECRET:
			case bt.ALCOVE:
				if (this.getData('ceil')) {
					this.renderCeil(oCanvas, 0.25);
					this.renderFloor(oCanvas, 0.25);
					this.renderTile(oCanvas, 'left', 0.5, 0.5, 0, 0.25);
					this.renderTile(oCanvas, 'right', 0.5, 0.5, 0.5, 0.25);
				} else {
					this.renderFloor(oCanvas, 0.25);
					this.renderTile(oCanvas, 'left', 0.5, 0.75, 0, 0);
					this.renderTile(oCanvas, 'right', 0.5, 0.75, 0.5, 0);
				}
				break;
		}
		
		// drawing the color indications
		switch (this.getData('type')) {
			case bt.WALKABLE:
				break;
				
			case bt.BLOCKING:
			case bt.SOLID:
				c.strokeStyle = 'rgb(255, 128, 0)';
				c.strokeRect(1, 1, w - 2, h - 2);
				break;
				
			case bt.TRANSPARENT:
				c.strokeStyle = 'rgb(255, 0, 255)';
				c.strokeRect(1, 1, w - 2, h - 2);
				c.beginPath();
				c.moveTo(1, 1);
				c.lineTo(w - 2, h - 2);
				c.stroke();
				break;
				
			case bt.DOOR:
				var wLeft = 1;
				var wCenter = w >> 1;
				var wRight = w - wLeft;
				var hTop = h >> 2;
				var hCenter = h >> 1;
				var hBottom = h - hTop;

				c.strokeStyle = 'rgb(0, 255, 96)';
				c.strokeRect(1, 1, w - 2, h - 2);
				c.beginPath();
				
				switch (this.getData('doortype')) {
					case dt.CURTAIN:
					case dt.SLIDE_UP:
						c.moveTo(wCenter, hTop);
						c.lineTo(wRight, hBottom);
						c.lineTo(wLeft, hBottom);
						c.lineTo(wCenter, hTop);
						break;

					case dt.SLIDE_DOWN:
						c.moveTo(wCenter, hBottom);
						c.lineTo(wLeft, hTop);
						c.lineTo(wRight, hTop);
						c.lineTo(wCenter, hBottom);
						break;

					case dt.SLIDE_LEFT:
						c.moveTo(wLeft, hCenter);
						c.lineTo(wRight, hTop);
						c.lineTo(wRight, hBottom);
						c.lineTo(wLeft, hCenter);
						break;

					case dt.SLIDE_RIGHT:
						c.moveTo(wRight, hCenter);
						c.lineTo(wLeft, hTop);
						c.lineTo(wLeft, hBottom);
						c.lineTo(wRight, hCenter);
						break;
						
					case dt.SLIDE_DOUBLE:
						c.moveTo(wCenter, hBottom);
						c.lineTo(wRight, hCenter);
						c.lineTo(wCenter, hTop);
						c.lineTo(wCenter, hBottom);
						c.lineTo(wLeft, hCenter);
						c.lineTo(wCenter, hTop);
						break;
						
				}
				c.stroke();
				break;
				
			case bt.SECRET:
				c.strokeStyle = 'rgb(255, 255, 0)';
				c.strokeRect(1, 1, w - 2, h - 2);
				c.beginPath();
				c.moveTo(w >> 2, h >> 2);
				c.bezierCurveTo(w >> 2, 1, w - 1, 1, w >> 1, h >> 1);
				c.lineTo(w >> 1, (h >> 1) + (h >> 2));
				var nRadius = w / 24 | 0;
				c.moveTo((w >> 1) + nRadius, h - (h >> 3));
				c.arc(w >> 1, h - (h >> 3), nRadius, 0, Math.PI * 2);
				c.stroke();
				break;
				
			case bt.ALCOVE:
				c.strokeStyle = 'rgb(255, 128, 0)';
				c.strokeRect(1, 1, w - 2, h - 2);
				c.beginPath();
				c.moveTo(1, 1);
				c.lineTo(w - 2, h - 2);
				c.stroke();
				break;
		}
	},
	
	serialize: function() {
		return this.oData;
	},

	unserialize: function(oData) {
		for (var s in oData) {
			this.setData(s, oData[s]);
		}
	},
});
