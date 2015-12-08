/**
 * This Factory produces Image which are visual representation of Items
 */
O2.createClass('RCWE.Factory', {

	_oCanvases: null,
	_oNullCanvas: null,
	ITEM_WIDTH: 32,
	ITEM_HEIGHT: 32,
	
	__construct: function() {
		this.reset();
	},
	
	/**
	 * Reset the factory
	 */
	reset: function() {
		this._oCanvases = {};
		this._oNullCanvas = null;
	},
	
	/**
	 * Change the size of items being factorized
	 * @param int w width
	 * @param int h height
	 */
	setItemSize: function(w, h) {
		this.ITEM_HEIGHT = h;
		this.ITEM_WIDTH = w;
		this.reset();
	},

	/**
	 * This fonction creates a factory key, a string corresponding to the
	 * specified Item properties.
	 * @param RCWE.Item oItem 
	 * @return string
	 */
	_getItemKey: function(oItem) {
		return null;
	},
	
	_createCanvas: function() {
		var oCanvas = document.createElement('canvas');
		oCanvas.width = this.ITEM_WIDTH;
		oCanvas.height = this.ITEM_HEIGHT;
		return oCanvas;
	},
	
	_drawNewCanvas: function(oItem) {
		var oCanvas = this._createCanvas();
		this._draw(oCanvas, oItem);
		return oCanvas;		
	},
	
	/**
	 * Returns a canvas.
	 * This canvas is drawn using the visual properties of the specified Item
	 * Two Items with the same visual properties produce the same image
	 * So the image is only drawn once.
	 * @param RCWE.Item oItem 
	 * @return Canvas
	 */
	getFactorizedItem: function(oItem) {
		var sKey = this._getItemKey(oItem);
		if (sKey === null) { // null key
			if (this._oNullCanvas) {
				return this._oNullCanvas;
			} else {
				return this._oNullCanvas = this._drawNewCanvas(oItem);
			}			
		} else {
			if (sKey in this._oCanvases) {
				return this._oCanvases[sKey];
			} else {
				return this._oCanvases[sKey] = this._drawNewCanvas(oItem);
			}
		}
	},

	/**
	 * Render a Item, using its visual properties.
	 * Returns the corresponding canvas.
	 * @param RCWE.Item oItem 
	 * @return Canvas
	 */
	_draw: function(oCanvas, oItem) {
	}
});
