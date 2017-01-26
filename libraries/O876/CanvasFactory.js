/**
 * Canvas factory
 * @class O876.CanvasFactory
 */
O2.createObject('O876.CanvasFactory', {

	/**
	 * Create a new canvas
     * @param w {int} width of the new canvas
     * @param h {int} height of the new canvas
	 * @param bImageSmoothing {boolean} default : true. if true, the new canvas will be smooth when resized
	 * @return {*}
	 */
	getCanvas: function(w, h, bImageSmoothing) {
		let oCanvas = document.createElement('canvas');
		let oContext = oCanvas.getContext('2d');
		if (w && h) {
			oCanvas.width = w;
			oCanvas.height = h;
		}
		if (bImageSmoothing === undefined) {
			bImageSmoothing = false;
		}
		O876.CanvasFactory.setImageSmoothing(oContext, bImageSmoothing);
		return oCanvas;
	},
	
	/**
	 * Set canvas image smoothing flag on or off
	 * @param oContext HTMLContext2D
	 * @param b {boolean} on = smoothing on // false = smoothing off
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
	 * @param oCanvas {HTMLCanvasElement} to be cloned
	 * @return  HTMLCanvasElement
	 */
	cloneCanvas: function(oCanvas) {
		let c = O876.CanvasFactory.getCanvas(
			oCanvas.width, 
			oCanvas.height, 
			O876.CanvasFactory.getImageSmoothing(oCanvas.getContext('2d'))
		);
		c.getContext('2d').drawImage(oCanvas, 0, 0);
		return c;
	}
});
