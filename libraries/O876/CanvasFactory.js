/**
 * Canvas factory
 * good to GIT
 */
O2.createObject('O876.CanvasFactory', {
	
	/**
	 * Create a new canvas
	 */
	getCanvas: function(w, h, bImageSmoothing) {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext('2d');
		if (w && h) {
			oCanvas.width = w;
			oCanvas.height = h;
		}
		if (bImageSmoothing === undefined) {
			bImageSmoothing = false;
		}
		O876.CanvasFactory.setImageSmoothing(oContext, false);
		return oCanvas;
	},
	
	/**
	 * Set canvas image smoothing flag on or off
	 * @param Context2D oContext
	 * @param bool b on = smoothing on // false = smoothing off
	 */
	setImageSmoothing: function(oContext, b) {
		oContext.webkitImageSmoothingEnabled = b;
		oContext.mozImageSmoothingEnabled = b;
		oContext.msImageSmoothingEnabled = b;
		oContext.imageSmoothingEnabled = b;
	},
	
	getImageSmoothing: function(oContext) {
		return oContext.imageSmoothingEnabled;
	},

	/**
	 * Clones a canvas into a new one
	 * @param oCanvas to be cloned
	 * @return  Canvas
	 */
	cloneCanvas: function(oCanvas) {
		var c = O876.CanvasFactory.getCanvas(
			oCanvas.width, 
			oCanvas.height, 
			O876.CanvasFactory.getImageSmoothing(oCanvas.getContext('2d'))
		);
		c.getContext('2d').drawImage(oCanvas, 0, 0);
		return c;
	}
});
