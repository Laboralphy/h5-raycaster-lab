O2.createObject('O876.CanvasFactory', {
	getCanvas: function() {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext('2d');
		oContext.webkitImageSmoothingEnabled = false;
		oContext.mozImageSmoothingEnabled = false;
		oContext.imageSmoothingEnabled = false;
		return oCanvas;
	}
});