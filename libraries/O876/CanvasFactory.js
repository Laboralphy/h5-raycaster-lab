/**
 * Canvas factory
 * good to GIT
 */
O2.createObject('O876.CanvasFactory', {
	
	/**
	 * Create a new canvas
	 */
	getCanvas: function() {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext('2d');
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
	}
});
